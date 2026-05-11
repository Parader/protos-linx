import {
    PointerSensor,
    useSensor,
    useSensors,
    type DragCancelEvent,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useVEDLocale } from "@/lib/ved-locale";
import type { VersionCStringBundle } from "@/lib/ved-app-strings/version-c-bundle";
import {
    comparePatientsByArrivalAsc,
    comparePatientsCompletedDesc,
    createId,
    defaultStatusForNewPatient,
    fullName,
    movePatientToStatus,
    statusToColumn,
    statusWhenDroppedOnColumn,
    type ActivityLogEntry,
    type BoardColumnId,
    type NotificationChannel,
    type NotificationDirection,
    type NotificationEntry,
    type Patient,
    type PatientCompletionCause,
    type CommunicationLanguage,
    type PatientPriority,
    type PatientStatus,
} from "@/pages/version-c/version-c-shared";

export type VersionCNewPatientForm = {
    firstName: string;
    lastName: string;
    fileNumber: string;
    phone: string;
    email: string;
    communicationLanguage: CommunicationLanguage;
    reason: string;
    priority: PatientPriority;
    notes: string;
    consentManagedManually: boolean;
};

export type VersionCContextValue = {
    query: string;
    setQuery: (q: string) => void;
    patients: Patient[];
    setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
    filteredPatients: Patient[];
    patientsByColumn: Record<BoardColumnId, Patient[]>;

    // DnD
    activeId: string | null;
    activePatient: Patient | null;
    sensors: ReturnType<typeof useSensors>;
    onDragStart: (event: DragStartEvent) => void;
    onDragCancel: (event: DragCancelEvent) => void;
    onDragEnd: (event: DragEndEvent) => void;

    // Add patient modal
    addPatientOpen: boolean;
    setAddPatientOpen: (open: boolean) => void;
    form: VersionCNewPatientForm;
    setForm: React.Dispatch<React.SetStateAction<VersionCNewPatientForm>>;
    addPatient: () => void;
    addDemoPatients: (count: number) => void;

    // Notifications
    selectedPatientId: string | null;
    setSelectedPatientId: (id: string | null) => void;
    notificationsByPatient: Record<string, NotificationEntry[]>;
    appendNotification: (patientId: string, entry: Omit<NotificationEntry, "id" | "sentAt"> & { sentAt?: number }) => void;
    sendStaffMessage: (patientId: string, channel: NotificationChannel, body: string, opts?: { actionUrl?: string }) => void;
    receivePatientMessage: (patientId: string, channel: NotificationChannel, body: string) => void;
    notifyForStatusChange: (patientId: string, next: PatientStatus) => void;
    acceptConsent: (patientId: string) => void;
    /** Retrait après acceptation (file d’attente). */
    withdrawConsent: (patientId: string) => void;
    /** Refus avant acceptation (consentement en attente). */
    refuseConsent: (patientId: string) => void;
    confirmReturn: (patientId: string) => void;
    /** Depuis la page « confirmer le retour » : annule la requête (rappel ou retour déjà confirmé). */
    cancelQueueRequestFromPatient: (patientId: string) => void;

    /** Édition (modale formulaire classique) — `null` si création seulement. */
    editingPatientId: string | null;
    setEditingPatientId: (id: string | null) => void;
    savePatientEdits: () => void;

    staffCancelPatient: (patientId: string, reason: string) => void;

    cancelModalPatientId: string | null;
    setCancelModalPatientId: (id: string | null) => void;
    singleMessagePatientId: string | null;
    setSingleMessagePatientId: (id: string | null) => void;

    activityLog: ActivityLogEntry[];
    appendActivityLog: (entry: Omit<ActivityLogEntry, "id" | "at"> & { at?: number }) => void;
};

const VersionCContext = createContext<VersionCContextValue | null>(null);

function buildNotification(
    direction: NotificationDirection,
    channel: NotificationChannel,
    body: string,
    sentAt?: number,
    consentUrl?: string,
    actionUrl?: string,
): NotificationEntry {
    return {
        id: createId(),
        direction,
        channel,
        body,
        sentAt: sentAt ?? Date.now(),
        consentUrl,
        actionUrl,
    };
}

function consentPagePath(patientId: string) {
    return `/version-c/patient-consent?patientId=${encodeURIComponent(patientId)}`;
}

function consentAbsoluteUrl(patientId: string) {
    if (typeof window === "undefined") return consentPagePath(patientId);
    return `${window.location.origin}${consentPagePath(patientId)}`;
}

function confirmReturnPagePath(patientId: string) {
    return `/version-c/confirm-return?patientId=${encodeURIComponent(patientId)}`;
}

function confirmReturnAbsoluteUrl(patientId: string) {
    if (typeof window === "undefined") return confirmReturnPagePath(patientId);
    return `${window.location.origin}${confirmReturnPagePath(patientId)}`;
}

function buildSmsConsentInvite(vc: VersionCStringBundle, patientId: string): { body: string; consentUrl: string } {
    const consentUrl = consentAbsoluteUrl(patientId);
    const prefix = vc.notifications.smsConsentInvitePrefix;
    let body = `${prefix} ${consentUrl}`;
    if (body.length > 160) {
        const maxUrl = 160 - prefix.length - 1;
        const clippedUrl = consentUrl.length > maxUrl ? `${consentUrl.slice(0, Math.max(0, maxUrl - 1))}…` : consentUrl;
        body = `${prefix} ${clippedUrl}`;
    }
    return { body, consentUrl };
}

function buildEmailConsentInvite(vc: VersionCStringBundle, p: Patient): { body: string; consentUrl: string } {
    const consentUrl = consentAbsoluteUrl(p.id);
    const name = fullName(p);
    const body = vc.notifications.emailConsentInviteBody({ patientName: name, consentUrl });
    return { body, consentUrl };
}

function sendConsentInvites(
    vc: VersionCStringBundle,
    append: (patientId: string, entry: Omit<NotificationEntry, "id" | "sentAt"> & { sentAt?: number }) => void,
    patient: Patient,
) {
    if (patient.consentManagedManually) return;
    if (patient.status !== "consentPending") return;

    if (patient.phone?.trim()) {
        const sms = buildSmsConsentInvite(vc, patient.id);
        append(patient.id, {
            direction: "outbound",
            channel: "sms",
            body: sms.body,
            consentUrl: sms.consentUrl,
        });
    }
    if (patient.email?.trim()) {
        const email = buildEmailConsentInvite(vc, patient);
        append(patient.id, {
            direction: "outbound",
            channel: "email",
            body: email.body,
            consentUrl: email.consentUrl,
        });
    }
}

export function VersionCProvider({ children }: { children: ReactNode }) {
    const { strings } = useVEDLocale();
    const vc = strings.versionC;
    const statusUiLabel = useCallback((s: PatientStatus) => vc.shared.patientStatus[s], [vc]);

    const [query, setQuery] = useState("");
    const [patients, setPatients] = useState<Patient[]>([]);
    const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [notificationsByPatient, setNotificationsByPatient] = useState<Record<string, NotificationEntry[]>>({});

    const patientsRef = useRef(patients);
    useEffect(() => {
        patientsRef.current = patients;
    }, [patients]);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const appendActivityLog = useCallback((entry: Omit<ActivityLogEntry, "id" | "at"> & { at?: number }) => {
        const row: ActivityLogEntry = {
            id: createId(),
            at: entry.at ?? Date.now(),
            kind: entry.kind,
            patientId: entry.patientId,
            patientLabel: entry.patientLabel,
            summary: entry.summary,
            detail: entry.detail,
            channel: entry.channel,
            direction: entry.direction,
        };
        setActivityLog((prev) => [...prev, row]);
    }, []);

    const filteredPatients = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return patients;
        return patients.filter((p) => `${fullName(p)} ${p.fileNumber} ${p.reason}`.toLowerCase().includes(q));
    }, [patients, query]);

    const patientsByColumn = useMemo(() => {
        const map: Record<BoardColumnId, Patient[]> = { waiting: [], recall: [], completed: [] };
        for (const p of filteredPatients) {
            map[statusToColumn(p.status)].push(p);
        }
        map.waiting.sort(comparePatientsByArrivalAsc);
        map.recall.sort(comparePatientsByArrivalAsc);
        map.completed.sort(comparePatientsCompletedDesc);
        return map;
    }, [filteredPatients]);

    const activePatient = useMemo(
        () => (activeId ? (patients.find((p) => p.id === activeId) ?? null) : null),
        [activeId, patients],
    );

    const appendNotification = useCallback(
        (patientId: string, entry: Omit<NotificationEntry, "id" | "sentAt"> & { sentAt?: number }) => {
            const built = buildNotification(
                entry.direction,
                entry.channel,
                entry.body,
                entry.sentAt,
                entry.consentUrl,
                entry.actionUrl,
            );
            setNotificationsByPatient((prev) => ({
                ...prev,
                [patientId]: [...(prev[patientId] ?? []), built].sort((a, b) => a.sentAt - b.sentAt),
            }));
            const p = patientsRef.current.find((x) => x.id === patientId);
            const patientLabel = p ? `${fullName(p)} — ${p.fileNumber}` : patientId;
            const chLabel = entry.channel === "sms" ? vc.activity.channelSms : vc.activity.channelEmail;
            const isOut = entry.direction === "outbound";
            appendActivityLog({
                at: built.sentAt,
                kind: isOut ? "message_outbound" : "message_inbound",
                patientId,
                patientLabel,
                summary: isOut ? vc.activity.messageOut(chLabel) : vc.activity.messageIn(chLabel),
                detail: entry.body.length > 220 ? `${entry.body.slice(0, 220)}…` : entry.body,
                channel: entry.channel,
                direction: entry.direction,
            });
        },
        [appendActivityLog, vc],
    );

    const sendStaffMessage = useCallback(
        (patientId: string, channel: NotificationChannel, body: string, opts?: { actionUrl?: string }) => {
            const trimmed = body.trim();
            if (!trimmed) return;
            appendNotification(patientId, { channel, direction: "outbound", body: trimmed, actionUrl: opts?.actionUrl });
        },
        [appendNotification],
    );

    const receivePatientMessage = useCallback(
        (patientId: string, channel: NotificationChannel, body: string) => {
            const trimmed = body.trim();
            if (!trimmed) return;
            appendNotification(patientId, { channel, direction: "inbound", body: trimmed });
        },
        [appendNotification],
    );

    const notifyForStatusChange = useCallback(
        (patientId: string, next: PatientStatus) => {
            const p = patients.find((x) => x.id === patientId);
            if (!p) return;

            const wantsSms = Boolean(p.phone?.trim());
            const wantsEmail = Boolean(p.email?.trim());
            const channels: NotificationChannel[] = [
                ...(wantsSms ? (["sms"] as const) : []),
                ...(wantsEmail ? (["email"] as const) : []),
            ];
            if (channels.length === 0) return;

            if (next !== "recall") return;

            const confirmUrl = confirmReturnAbsoluteUrl(patientId);
            const body = vc.notifications.recallPresentToErBody(confirmUrl);
            for (const ch of channels) {
                sendStaffMessage(patientId, ch, body, { actionUrl: confirmUrl });
            }
        },
        [patients, sendStaffMessage, vc],
    );

    const acceptConsent = useCallback(
        (patientId: string) => {
            const p = patientsRef.current.find((x) => x.id === patientId);
            const patientLabel = p ? `${fullName(p)} — ${p.fileNumber}` : patientId;
            appendActivityLog({
                kind: "consent_accepted",
                patientId,
                patientLabel,
                summary: vc.activity.consentAccepted,
                detail: vc.activity.acceptConsentDetail,
            });
            setPatients((prev) => movePatientToStatus(prev, patientId, "waiting"));
        },
        [appendActivityLog, vc],
    );

    const confirmReturn = useCallback(
        (patientId: string) => {
            const p = patientsRef.current.find((x) => x.id === patientId);
            const patientLabel = p ? `${fullName(p)} — ${p.fileNumber}` : patientId;
            appendActivityLog({
                kind: "return_confirmed",
                patientId,
                patientLabel,
                summary: vc.activity.returnConfirmed,
                detail: vc.activity.confirmReturnDetail,
            });
            setPatients((prev) => movePatientToStatus(prev, patientId, "arrived"));
        },
        [appendActivityLog, vc],
    );

    const finalizeDistanceServiceExit = useCallback(
        (
            patientId: string,
            p: Patient,
            completionCause: Extract<
                PatientCompletionCause,
                "consent_refused" | "consent_withdrawn" | "patient_cancelled_queue"
            >,
        ) => {
            const patientLabel = `${fullName(p)} — ${p.fileNumber}`;
            if (completionCause === "consent_refused") {
                appendActivityLog({
                    kind: "consent_refused",
                    patientId,
                    patientLabel,
                    summary: vc.activity.consentRefused,
                    detail: vc.activity.consentClosedRemoteDetail,
                });
            } else if (completionCause === "consent_withdrawn") {
                appendActivityLog({
                    kind: "consent_withdrawn",
                    patientId,
                    patientLabel,
                    summary: vc.activity.consentWithdrawn,
                    detail: vc.activity.consentClosedRemoteDetail,
                });
            } else {
                appendActivityLog({
                    kind: "patient_left_queue_via_link",
                    patientId,
                    patientLabel,
                    summary: vc.activity.patientLeftViaLink,
                    detail: vc.activity.patientCancelFromConfirmDetail,
                });
            }
            setPatients((prev) =>
                movePatientToStatus(prev, patientId, "completed", { cancelled: true, completionCause }),
            );
            const revokeMsg = vc.notifications.revokeRemoteService;
            if (p.phone?.trim()) sendStaffMessage(patientId, "sms", revokeMsg);
            if (p.email?.trim()) sendStaffMessage(patientId, "email", revokeMsg);
        },
        [appendActivityLog, setPatients, sendStaffMessage, vc],
    );

    const cancelQueueRequestFromPatient = useCallback(
        (patientId: string) => {
            const p = patients.find((x) => x.id === patientId);
            if (!p) return;
            if (p.status !== "recall" && p.status !== "arrived") return;
            finalizeDistanceServiceExit(patientId, p, "patient_cancelled_queue");
        },
        [patients, finalizeDistanceServiceExit],
    );

    const withdrawConsent = useCallback(
        (patientId: string) => {
            const p = patients.find((x) => x.id === patientId);
            if (!p || p.status !== "waiting" || p.consentManagedManually) return;
            finalizeDistanceServiceExit(patientId, p, "consent_withdrawn");
        },
        [patients, finalizeDistanceServiceExit],
    );

    const refuseConsent = useCallback(
        (patientId: string) => {
            const p = patients.find((x) => x.id === patientId);
            if (!p || p.status !== "consentPending" || p.consentManagedManually) return;
            finalizeDistanceServiceExit(patientId, p, "consent_refused");
        },
        [patients, finalizeDistanceServiceExit],
    );

    const onDragStart = useCallback((event: DragStartEvent) => {
        setActiveId(event.active.id?.toString() ?? null);
    }, []);

    const onDragCancel = useCallback((_event: DragCancelEvent) => {
        setActiveId(null);
    }, []);

    const onDragEnd = useCallback(
        (event: DragEndEvent) => {
            const draggedId = event.active.id?.toString();
            const overId = event.over?.id?.toString();
            setActiveId(null);
            if (!draggedId || !overId) return;

            const colMatch = /^col:(waiting|recall|completed)$/.exec(overId);
            if (colMatch) {
                const column = colMatch[1] as BoardColumnId;
                const dragged = patients.find((p) => p.id === draggedId);
                const next = statusWhenDroppedOnColumn(column, dragged?.status);
                if (dragged && dragged.status !== next) {
                    const patientLabel = `${fullName(dragged)} — ${dragged.fileNumber}`;
                    appendActivityLog({
                        kind: "status_drag",
                        patientId: draggedId,
                        patientLabel,
                        summary: vc.activity.dragMoveSummary,
                        detail: vc.activity.dragMoveDetail(statusUiLabel(dragged.status), statusUiLabel(next)),
                    });
                }
                setPatients((prev) => movePatientToStatus(prev, draggedId, next));
                notifyForStatusChange(draggedId, next);
                setSelectedPatientId((cur) => cur ?? draggedId);
                return;
            }

            // If dropped over another patient, move to that patient's column (coarse).
            const overPatient = patients.find((p) => p.id === overId);
            if (!overPatient) return;
            const draggedB = patients.find((p) => p.id === draggedId);
            const prevStatusB = draggedB?.status;
            const next = statusWhenDroppedOnColumn(statusToColumn(overPatient.status), patients.find((p) => p.id === draggedId)?.status);
            if (draggedB && prevStatusB !== undefined && prevStatusB !== next) {
                const patientLabel = `${fullName(draggedB)} — ${draggedB.fileNumber}`;
                appendActivityLog({
                    kind: "status_drag",
                    patientId: draggedId,
                    patientLabel,
                    summary: vc.activity.dragMoveSummary,
                    detail: vc.activity.dragMoveDetail(statusUiLabel(prevStatusB), statusUiLabel(next)),
                });
            }
            setPatients((prev) => movePatientToStatus(prev, draggedId, next));
            notifyForStatusChange(draggedId, next);
            setSelectedPatientId((cur) => cur ?? draggedId);
        },
        [appendActivityLog, patients, notifyForStatusChange, vc, statusUiLabel],
    );

    const [addPatientOpen, setAddPatientOpen] = useState(false);
    const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
    const [cancelModalPatientId, setCancelModalPatientId] = useState<string | null>(null);
    const [singleMessagePatientId, setSingleMessagePatientId] = useState<string | null>(null);

    useEffect(() => {
        if (addPatientOpen) setEditingPatientId(null);
    }, [addPatientOpen]);

    useEffect(() => {
        if (editingPatientId) setAddPatientOpen(false);
    }, [editingPatientId]);

    const [form, setForm] = useState<VersionCNewPatientForm>({
        firstName: "",
        lastName: "",
        fileNumber: "",
        phone: "",
        email: "",
        communicationLanguage: "fr",
        reason: "",
        priority: "P5",
        notes: "",
        consentManagedManually: false,
    });

    const addDemoPatients = useCallback((count: number) => {
        const safeCount = Math.min(200, Math.max(0, Math.floor(count)));
        if (safeCount === 0) return;

        const demo = vc.pages.demoPatientContent;
        const FIRST = demo.firstNames;
        const LAST = demo.lastNames;
        const REASONS = demo.reasons;
        const NOTES = demo.notes;
        const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)]!;
        const randInt = (min: number, max: number) => Math.floor(min + Math.random() * (max - min + 1));

        const now = Date.now();
        const created = Array.from({ length: safeCount }, (_, i) => {
            const first = pick(FIRST);
            const last = pick(LAST);
            const n = randInt(1, 9999);
            const fileNumber = String((now + i + n) % 1_000_000_000).padStart(9, "0");
            let phone = Math.random() > 0.25 ? `(${randInt(200, 999)}) ${randInt(200, 999)}-${randInt(1000, 9999)}` : undefined;
            let email =
                Math.random() > 0.25 ? `${first.toLowerCase()}.${last.toLowerCase()}.${n}@${demo.emailDomain}` : undefined;
            if (!phone?.trim() && !email?.trim()) {
                phone = `(${randInt(200, 999)}) ${randInt(200, 999)}-${randInt(1000, 9999)}`;
            }
            const priority = (Math.random() > 0.82 ? "P3" : Math.random() > 0.5 ? "P4" : "P5") as PatientPriority;
            const consentManagedManually = Math.random() > 0.6;
            const status: PatientStatus = consentManagedManually ? "waiting" : "consentPending";

            return {
                id: createId(),
                firstName: first,
                lastName: last,
                fileNumber,
                phone,
                email,
                communicationLanguage: "fr",
                reason: pick(REASONS),
                notes: pick(NOTES) || undefined,
                priority,
                status,
                createdAt: now + i,
                cancelled: false,
                consentManagedManually,
            } satisfies Patient;
        });

        setPatients((prev) => [...created, ...prev]);
        if (!selectedPatientId && created.length > 0) setSelectedPatientId(created[0]!.id);
        appendActivityLog({
            kind: "demo_patients_added",
            patientId: null,
            patientLabel: vc.shared.dash,
            summary: vc.activity.demoPatientsAdded(safeCount),
            detail: vc.activity.demoPatientsDetail,
        });
        for (const p of created) {
            sendConsentInvites(vc, appendNotification, p);
        }
    }, [appendActivityLog, selectedPatientId, appendNotification, vc]);

    const addPatient = useCallback(() => {
        const reason = form.reason.trim();
        if (!reason) return;
        if (!form.phone.trim() && !form.email.trim()) return;

        const t = Date.now();
        const id = createId();
        const status = defaultStatusForNewPatient(form.consentManagedManually);
        const patient: Patient = {
            id,
            firstName: form.firstName.trim() || vc.pages.wizard.fallbackFirstName,
            lastName: form.lastName.trim() || vc.pages.wizard.fallbackLastName,
            fileNumber: form.fileNumber.trim() || vc.shared.dash,
            phone: form.phone.trim() || undefined,
            email: form.email.trim() || undefined,
            communicationLanguage: form.communicationLanguage,
            reason,
            notes: form.notes.trim() || undefined,
            priority: form.priority,
            status,
            createdAt: t,
            cancelled: false,
            consentManagedManually: form.consentManagedManually,
        };
        setPatients((prev) => [patient, ...prev]);
        setSelectedPatientId(id);

        appendActivityLog({
            kind: "patient_added",
            patientId: id,
            patientLabel: `${fullName(patient)} — ${patient.fileNumber}`,
            summary: vc.activity.patientAdded,
            detail: patient.reason,
        });

        // Seed initial notifications for the demo.
        if (status === "consentPending") {
            sendConsentInvites(vc, appendNotification, patient);
        }

        setForm({
            firstName: "",
            lastName: "",
            fileNumber: "",
            phone: "",
            email: "",
            communicationLanguage: "fr",
            reason: "",
            priority: "P5",
            notes: "",
            consentManagedManually: false,
        });
    }, [appendActivityLog, form, appendNotification, vc]);

    const savePatientEdits = useCallback(() => {
        if (!editingPatientId) return;
        const reason = form.reason.trim();
        if (!reason) return;
        if (!form.phone.trim() && !form.email.trim()) return;

        const edited = patientsRef.current.find((x) => x.id === editingPatientId);
        const prevLabel = edited ? `${fullName(edited)} — ${edited.fileNumber}` : editingPatientId;

        setPatients((prev) =>
            prev.map((p) =>
                p.id !== editingPatientId
                    ? p
                    : {
                          ...p,
                          firstName: form.firstName.trim() || p.firstName,
                          lastName: form.lastName.trim() || p.lastName,
                          fileNumber: form.fileNumber.trim() || "—",
                          phone: form.phone.trim() || undefined,
                          email: form.email.trim() || undefined,
                          communicationLanguage: form.communicationLanguage,
                          reason,
                          notes: form.notes.trim() || undefined,
                          priority: form.priority,
                          consentManagedManually: form.consentManagedManually,
                      },
            ),
        );
        const nextName = `${form.firstName.trim() || edited?.firstName || ""} ${form.lastName.trim() || edited?.lastName || ""}`.trim();
        appendActivityLog({
            kind: "patient_edited",
            patientId: editingPatientId,
            patientLabel: `${nextName} — ${form.fileNumber.trim() || "—"}`,
            summary: vc.activity.patientEdited,
            detail:
                prevLabel !== `${nextName} — ${form.fileNumber.trim() || "—"}`
                    ? vc.activity.patientEditedOldLabel(prevLabel)
                    : undefined,
        });
        setEditingPatientId(null);
        setForm({
            firstName: "",
            lastName: "",
            fileNumber: "",
            phone: "",
            email: "",
            communicationLanguage: "fr",
            reason: "",
            priority: "P5",
            notes: "",
            consentManagedManually: false,
        });
    }, [appendActivityLog, editingPatientId, form, vc]);

    const staffCancelPatient = useCallback(
        (patientId: string, reason: string) => {
            const p = patientsRef.current.find((x) => x.id === patientId);
            const patientLabel = p ? `${fullName(p)} — ${p.fileNumber}` : patientId;
            const trimmed = reason.trim();
            appendActivityLog({
                kind: "staff_cancelled",
                patientId,
                patientLabel,
                summary: vc.activity.staffCancelled,
                detail: trimmed || vc.activity.staffCancelUnspecified,
            });
            setPatients((prev) =>
                movePatientToStatus(prev, patientId, "completed", {
                    cancelled: true,
                    completionCause: "staff_cancelled",
                    cancellationReason: reason,
                }),
            );
        },
        [appendActivityLog, vc],
    );

    const value: VersionCContextValue = {
        query,
        setQuery,
        patients,
        setPatients,
        filteredPatients,
        patientsByColumn,

        activeId,
        activePatient,
        sensors,
        onDragStart,
        onDragCancel,
        onDragEnd,

        addPatientOpen,
        setAddPatientOpen,
        form,
        setForm,
        addPatient,
        addDemoPatients,

        selectedPatientId,
        setSelectedPatientId,
        notificationsByPatient,
        appendNotification,
        sendStaffMessage,
        receivePatientMessage,
        notifyForStatusChange,
        acceptConsent,
        withdrawConsent,
        refuseConsent,
        confirmReturn,
        cancelQueueRequestFromPatient,

        editingPatientId,
        setEditingPatientId,
        savePatientEdits,

        staffCancelPatient,

        cancelModalPatientId,
        setCancelModalPatientId,
        singleMessagePatientId,
        setSingleMessagePatientId,

        activityLog,
        appendActivityLog,
    };

    return <VersionCContext.Provider value={value}>{children}</VersionCContext.Provider>;
}

export function useVersionC() {
    const ctx = useContext(VersionCContext);
    if (!ctx) throw new Error("useVersionC must be used within VersionCProvider");
    return ctx;
}

