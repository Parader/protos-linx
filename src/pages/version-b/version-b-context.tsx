import {
    PointerSensor,
    useSensor,
    useSensors,
    type DragCancelEvent,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Patient, PatientStatus } from "@/pages/version-b/version-b-patient-card";
import { generateRandomPatients, randomPatientFormFields } from "@/pages/version-b/version-b-random-patients";
import {
    createId,
    movePatientToStatus,
    normalizeFormPriority,
    statusToColumn,
    statusWhenDroppedOnColumn,
    type BoardColumnId,
    type FormPatientPriority,
    type PreferredCommunication,
} from "@/pages/version-b/version-b-shared";

export type VersionBFormState = {
    name: string;
    fileNumber: string;
    phone: string;
    email: string;
    preferredCommunication: PreferredCommunication;
    reason: string;
    priority: FormPatientPriority;
    notes: string;
    consentGiven: boolean;
};

export type VersionBContextValue = {
    activeId: string | null;
    query: string;
    setQuery: (q: string) => void;
    patients: Patient[];
    setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
    filteredPatients: Patient[];
    /** Version B board: patients grouped into Queue / Prep / Done columns. */
    patientsByColumn: Record<BoardColumnId, Patient[]>;
    activePatient: Patient | null;
    sensors: ReturnType<typeof useSensors>;
    onDragStart: (event: DragStartEvent) => void;
    onDragCancel: (event: DragCancelEvent) => void;
    onDragEnd: (event: DragEndEvent) => void;
    collapsedLanes: Set<BoardColumnId>;
    toggleLaneCollapsed: (column: BoardColumnId) => void;
    addPatientOpen: boolean;
    setAddPatientOpen: (open: boolean) => void;
    form: VersionBFormState;
    setForm: React.Dispatch<React.SetStateAction<VersionBFormState>>;
    bulkCount: string;
    setBulkCount: (v: string) => void;
    addPatient: () => void;
    autofillFormRandom: () => void;
    addBulkRandomPatients: () => void;
    editingPatientId: string | null;
    setEditingPatientId: (id: string | null) => void;
    editForm: VersionBFormState;
    setEditForm: React.Dispatch<React.SetStateAction<VersionBFormState>>;
    openPatientEditor: (patientId: string) => void;
    saveEditedPatient: () => void;
    consentPatients: Patient[];
    acceptConsent: (patientId: string) => void;
    /** Append a simulated staff → patient message to one chart. */
    sendStaffMessage: (patientId: string, body: string, templateId?: string) => void;
    /** Same message appended to every patient currently in `waiting` (ignores search filter). */
    sendStaffMessageToAllWaiting: (body: string, templateId?: string) => void;
};

const VersionBContext = createContext<VersionBContextValue | null>(null);

export function VersionBProvider({ children }: { children: ReactNode }) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [patients, setPatients] = useState<Patient[]>(() => []);

    const [form, setForm] = useState<VersionBFormState>({
        name: "",
        fileNumber: "",
        phone: "",
        email: "",
        preferredCommunication: "sms",
        reason: "",
        priority: "P5",
        notes: "",
        consentGiven: false,
    });

    const [bulkCount, setBulkCount] = useState("48");
    const [collapsedLanes, setCollapsedLanes] = useState(() => new Set<BoardColumnId>());

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const toggleLaneCollapsed = useCallback((column: BoardColumnId) => {
        setCollapsedLanes((prev) => {
            const next = new Set(prev);
            if (next.has(column)) next.delete(column);
            else next.add(column);
            return next;
        });
    }, []);

    const filteredPatients = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return patients;
        return patients.filter((p) => `${p.name} ${p.fileNumber} ${p.reason}`.toLowerCase().includes(q));
    }, [patients, query]);

    const patientsByColumn = useMemo(() => {
        const map: Record<BoardColumnId, Patient[]> = { queue: [], prep: [], done: [] };
        for (const p of filteredPatients) {
            map[statusToColumn(p.status)].push(p);
        }
        return map;
    }, [filteredPatients]);

    const consentPatients = useMemo(
        () =>
            patients
                .filter((p) => p.status === "consent")
                .sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id)),
        [patients],
    );

    const activePatient = useMemo(
        () => (activeId ? (patients.find((p) => p.id === activeId) ?? null) : null),
        [activeId, patients],
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

            const colMatch = /^col:(queue|prep|done)$/.exec(overId);
            if (colMatch) {
                const column = colMatch[1] as BoardColumnId;
                const dragged = patients.find((p) => p.id === draggedId);
                const next = statusWhenDroppedOnColumn(column, dragged?.status);
                setPatients((prev) => movePatientToStatus(prev, draggedId, next));
                return;
            }

            const activeP = patients.find((p) => p.id === draggedId);
            const overPatient = patients.find((p) => p.id === overId);
            if (!activeP || !overPatient) return;
            const activeCol = statusToColumn(activeP.status);
            const overCol = statusToColumn(overPatient.status);

            // Version B: within a coarse column, ordering is list order only (time by default + manual reordering).
            if (activeCol === overCol) {
                setPatients((prev) => {
                    const fromIndex = prev.findIndex((p) => p.id === draggedId);
                    const toIndex = prev.findIndex((p) => p.id === overId);
                    if (fromIndex < 0 || toIndex < 0) return prev;

                    const col = statusToColumn(prev[fromIndex]!.status);
                    if (col !== statusToColumn(prev[toIndex]!.status)) return prev;

                    const colIndices: number[] = [];
                    for (let i = 0; i < prev.length; i++) {
                        if (statusToColumn(prev[i]!.status) === col) colIndices.push(i);
                    }

                    const fromPos = colIndices.indexOf(fromIndex);
                    const toPos = colIndices.indexOf(toIndex);
                    if (fromPos < 0 || toPos < 0 || fromPos === toPos) return prev;

                    const nextColIndices = [...colIndices];
                    const [moved] = nextColIndices.splice(fromPos, 1);
                    nextColIndices.splice(toPos, 0, moved!);

                    const next = [...prev];
                    for (let i = 0; i < colIndices.length; i++) {
                        next[colIndices[i]!] = prev[nextColIndices[i]!]!;
                    }
                    return next;
                });
                return;
            }

            // Otherwise, moving over a card in a different column moves steps.
            setPatients((prev) => movePatientToStatus(prev, draggedId, overPatient.status));
        },
        [patients],
    );

    const addPatient = useCallback(() => {
        const t = Date.now();
        const initialStatus: PatientStatus = form.consentGiven ? "waiting" : "consent";
        setPatients((prev) => [
            ...prev,
            {
                id: createId(),
                name: form.name.trim() || "Unnamed patient",
                fileNumber: form.fileNumber.trim() || "—",
                phone: form.phone.trim() || undefined,
                email: form.email.trim() || undefined,
                preferredCommunication: form.preferredCommunication,
                reason: form.reason.trim() || "—",
                priority: form.priority,
                notes: form.notes.trim() || undefined,
                consentGiven: form.consentGiven,
                status: initialStatus,
                cancelled: false,
                createdAt: t,
                statusHistory: [{ status: initialStatus, enteredAt: t }],
            },
        ]);
        setForm((f) => ({
            ...f,
            name: "",
            fileNumber: "",
            phone: "",
            email: "",
            reason: "",
            notes: "",
            consentGiven: false,
            priority: "P5",
        }));
    }, [form]);

    const autofillFormRandom = useCallback(() => {
        const r = randomPatientFormFields();
        setForm((f) => ({ ...f, ...r }));
    }, []);

    const addBulkRandomPatients = useCallback(() => {
        const n = Math.min(500, Math.max(0, Math.floor(Number.parseInt(bulkCount, 10) || 0)));
        if (n === 0) return;
        setPatients((prev) => [...prev, ...generateRandomPatients(n)]);
    }, [bulkCount]);

    const [addPatientOpen, setAddPatientOpen] = useState(false);

    const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<VersionBFormState>({
        name: "",
        fileNumber: "",
        phone: "",
        email: "",
        preferredCommunication: "sms",
        reason: "",
        priority: "P5",
        notes: "",
        consentGiven: false,
    });

    useEffect(() => {
        if (!editingPatientId) return;
        if (!patients.some((p) => p.id === editingPatientId)) {
            setEditingPatientId(null);
        }
    }, [patients, editingPatientId]);

    const openPatientEditor = useCallback((patientId: string) => {
        const p = patients.find((x) => x.id === patientId);
        if (!p) return;
        setEditForm({
            name: p.name,
            fileNumber: p.fileNumber,
            phone: p.phone ?? "",
            email: p.email ?? "",
            preferredCommunication: p.preferredCommunication,
            reason: p.reason,
            priority: normalizeFormPriority(p.priority),
            notes: p.notes ?? "",
            consentGiven: p.consentGiven,
        });
        setEditingPatientId(patientId);
    }, [patients]);

    const saveEditedPatient = useCallback(() => {
        if (!editingPatientId) return;
        setPatients((prev) =>
            prev.map((p) =>
                p.id === editingPatientId
                    ? {
                          ...p,
                          name: editForm.name.trim() || "Unnamed patient",
                          fileNumber: editForm.fileNumber.trim() || "—",
                          phone: editForm.phone.trim() || undefined,
                          email: editForm.email.trim() || undefined,
                          preferredCommunication: editForm.preferredCommunication,
                          reason: editForm.reason.trim() || "—",
                          priority: editForm.priority,
                          notes: editForm.notes.trim() || undefined,
                          consentGiven: editForm.consentGiven,
                      }
                    : p,
            ),
        );
        setEditingPatientId(null);
    }, [editingPatientId, editForm]);

    const acceptConsent = useCallback((patientId: string) => {
        setPatients((prev) => {
            const moved = movePatientToStatus(prev, patientId, "waiting");
            return moved.map((p) => (p.id === patientId ? { ...p, consentGiven: true } : p));
        });
    }, []);

    const sendStaffMessage = useCallback((patientId: string, body: string, templateId?: string) => {
        const trimmed = body.trim();
        if (!trimmed) return;
        const entry = { id: createId(), body: trimmed, sentAt: Date.now(), templateId };
        setPatients((prev) =>
            prev.map((p) => (p.id === patientId ? { ...p, staffMessages: [...(p.staffMessages ?? []), entry] } : p)),
        );
    }, []);

    const sendStaffMessageToAllWaiting = useCallback((body: string, templateId?: string) => {
        const trimmed = body.trim();
        if (!trimmed) return;
        setPatients((prev) =>
            prev.map((p) => {
                if (p.status !== "waiting" && p.status !== "consent") return p;
                const entry = { id: createId(), body: trimmed, sentAt: Date.now(), templateId };
                return { ...p, staffMessages: [...(p.staffMessages ?? []), entry] };
            }),
        );
    }, []);

    const value: VersionBContextValue = {
        activeId,
        query,
        setQuery,
        patients,
        setPatients,
        filteredPatients,
        patientsByColumn,
        activePatient,
        sensors,
        onDragStart,
        onDragCancel,
        onDragEnd,
        collapsedLanes,
        toggleLaneCollapsed,
        addPatientOpen,
        setAddPatientOpen,
        form,
        setForm,
        bulkCount,
        setBulkCount,
        addPatient,
        autofillFormRandom,
        addBulkRandomPatients,
        editingPatientId,
        setEditingPatientId,
        editForm,
        setEditForm,
        openPatientEditor,
        saveEditedPatient,
        consentPatients,
        acceptConsent,
        sendStaffMessage,
        sendStaffMessageToAllWaiting,
    };

    return <VersionBContext.Provider value={value}>{children}</VersionBContext.Provider>;
}

export function useVersionB() {
    const ctx = useContext(VersionBContext);
    if (!ctx) throw new Error("useVersionB must be used within VersionBProvider");
    return ctx;
}
