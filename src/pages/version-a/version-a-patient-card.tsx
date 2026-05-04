import { Clock, Folder, Mail01, MessageCircle01, Phone01 } from "@untitledui/icons";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";

export type PatientStatus = "consent" | "waiting" | "calledBack" | "confirmed" | "completed";
type PatientPriority = "P1" | "P2" | "P3" | "P4" | "P5";
type PreferredCommunication = "email" | "sms";

/** One segment of time spent in a given status (column step). */
export type PatientStatusSegment = { status: PatientStatus; enteredAt: number };

/** Simulated outbound message from staff to patient (prototype). */
export type StaffMessageEntry = { id: string; body: string; sentAt: number; templateId?: string };

export type Patient = {
    id: string;
    name: string;
    fileNumber: string;
    phone?: string;
    email?: string;
    preferredCommunication: PreferredCommunication;
    reason: string;
    priority: PatientPriority;
    notes?: string;
    consentGiven: boolean;
    status: PatientStatus;
    /** Visit cancelled; only meaningful when `status === "completed"`. */
    cancelled?: boolean;
    createdAt: number;
    /** Ordered timeline of entering each status; used for column time + hover breakdown. */
    statusHistory?: PatientStatusSegment[];
    /** Simulated staff → patient messages (quick or custom). */
    staffMessages?: StaffMessageEntry[];
};

const STATUS_ORDER: PatientStatus[] = ["waiting", "consent", "confirmed", "calledBack", "completed"];

const STATUS_LABELS: Record<PatientStatus, string> = {
    consent: "Consent",
    waiting: "Waiting",
    calledBack: "Called back",
    confirmed: "Confirmed",
    completed: "Completed",
};

/** Left border + light background tint per workflow step (Completed uses neutral grey). */
const STATUS_CARD_THEME: Record<PatientStatus, { bar: string; surface: string }> = {
    consent: {
        bar: "border-l-amber-500",
        surface: "bg-amber-50/90",
    },
    waiting: {
        bar: "border-l-blue-500",
        surface: "bg-blue-50/80",
    },
    calledBack: {
        bar: "border-l-violet-500",
        surface: "bg-violet-50/80",
    },
    confirmed: {
        bar: "border-l-teal-500",
        surface: "bg-teal-50/80",
    },
    completed: {
        bar: "border-l-slate-400",
        surface: "bg-slate-50/95",
    },
};

function cardThemeForPatient(patient: Patient) {
    if (patient.status === "completed") {
        if (patient.cancelled) {
            return {
                bar: "border-l-slate-500",
                surface: "bg-slate-100/90",
                nameClass: "text-slate-600 line-through decoration-slate-400",
                reasonClass: "text-slate-500",
            };
        }
        return {
            bar: "border-l-slate-400",
            surface: "bg-slate-50/95",
            nameClass: "text-slate-700",
            reasonClass: "text-slate-500",
        };
    }
    const t = STATUS_CARD_THEME[patient.status];
    return {
        bar: t.bar,
        surface: t.surface,
        nameClass: "text-[#172B4D]",
        reasonClass: "text-[#5E6C84]",
    };
}

/** Thresholds (minutes): green → amber → red for time waited emphasis. */
function waitTimeTone(minutes: number) {
    if (minutes < 15) {
        return { row: "text-emerald-900", clock: "text-emerald-700", value: "text-emerald-950" };
    }
    if (minutes < 45) {
        return { row: "text-amber-950", clock: "text-amber-800", value: "text-amber-950" };
    }
    return { row: "text-red-900", clock: "text-red-700", value: "text-red-950" };
}

const cardLayoutTransition = {
    type: "spring" as const,
    stiffness: 420,
    damping: 36,
    mass: 0.82,
};

function ensureStatusHistory(patient: Patient): PatientStatusSegment[] {
    if (patient.statusHistory && patient.statusHistory.length > 0) return patient.statusHistory;
    return [{ status: patient.status, enteredAt: patient.createdAt }];
}

function getCurrentColumnEnteredAt(patient: Patient): number {
    const h = ensureStatusHistory(patient);
    return h[h.length - 1]!.enteredAt;
}

/** Compact duration label from elapsed milliseconds. */
function formatDurationMs(ms: number): string {
    const msPos = Math.max(0, ms);
    const minutesTotal = Math.floor(msPos / 60_000);
    const days = Math.floor(msPos / 86_400_000);
    const hours = Math.floor((msPos % 86_400_000) / 3_600_000);
    const mins = Math.floor((msPos % 3_600_000) / 60_000);

    if (days >= 1) {
        return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    }
    if (hours >= 1) {
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    if (minutesTotal >= 1) {
        return `${minutesTotal}m`;
    }
    return "<1m";
}

/** Time shown on the card = since entering the current column. */
function formatColumnWait(enteredAt: number) {
    const ms = Math.max(0, Date.now() - enteredAt);
    const minutesTotal = Math.floor(ms / 60_000);
    return { short: formatDurationMs(ms), minutesTotal };
}

function buildJourneyTooltipText(patient: Patient): string {
    const h = ensureStatusHistory(patient);
    const now = Date.now();
    const lines: string[] = [];
    for (let i = 0; i < h.length; i++) {
        const seg = h[i]!;
        const end = i + 1 < h.length ? h[i + 1]!.enteredAt : now;
        const ms = Math.max(0, end - seg.enteredAt);
        lines.push(`${STATUS_LABELS[seg.status]} — ${formatDurationMs(ms)}`);
    }
    return lines.join("\n");
}

function stopDrag(e: React.SyntheticEvent) {
    e.stopPropagation();
}

type PatientCardBodyProps = {
    patient: Patient;
    onEdit: () => void;
    onMoveTo: (next: PatientStatus) => void;
    onCancel: () => void;
    /** Opens staff → patient message dialog for this chart. */
    onSendMessage?: () => void;
    className?: string;
};

function PatientCardBody({ patient, onEdit, onMoveTo, onCancel, onSendMessage, className }: PatientCardBodyProps) {
    const [callBackConfirmOpen, setCallBackConfirmOpen] = useState(false);

    useEffect(() => {
        if (patient.status !== "waiting") {
            setCallBackConfirmOpen(false);
        }
    }, [patient.status]);

    const columnEnteredAt = getCurrentColumnEnteredAt(patient);
    const wait = formatColumnWait(columnEnteredAt);
    const theme = cardThemeForPatient(patient);
    const waitTone = waitTimeTone(wait.minutesTotal);
    const journeyBreakdown = buildJourneyTooltipText(patient);
    const phone = patient.phone?.trim() ?? "";
    const email = patient.email?.trim() ?? "";

    const lastStaffMessage = useMemo(() => {
        const list = patient.staffMessages;
        if (!list?.length) return null;
        return [...list].sort((a, b) => b.sentAt - a.sentAt)[0] ?? null;
    }, [patient.staffMessages]);

    const primaryAction =
        patient.status === "consent"
            ? { label: "Patient gave consent" as const, next: "waiting" as const }
            : patient.status === "waiting"
              ? { label: "Call back" as const, next: "calledBack" as const }
              : patient.status === "calledBack" || patient.status === "confirmed"
                ? { label: "Arrived" as const, next: "completed" as const }
                : null;

    return (
        <div
            className={cx(
                "rounded border-y border-r border-[#DFE1E6] border-l-4 p-2.5 shadow-sm transition-colors hover:brightness-[1.01]",
                theme.bar,
                theme.surface,
                patient.status === "completed" && "opacity-[0.98]",
                className,
            )}
        >
            <div className="flex items-start justify-between gap-2">
                <p className={cx("min-w-0 flex-1 truncate pr-1 text-base font-semibold leading-snug sm:text-[17px]", theme.nameClass)}>
                    {patient.name}
                </p>
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-x-2 gap-y-1">
                    {patient.status === "completed" && patient.cancelled ? (
                        <Badge type="pill-color" color="error" size="md" className="text-sm font-semibold">
                            Cancelled
                        </Badge>
                    ) : null}
                    {patient.status === "consent" && (
                        <Badge type="pill-color" color="warning" size="md" className="text-xs font-semibold">
                            Pending consent
                        </Badge>
                    )}
                    <Badge type="pill-color" color="warning" size="md" className="text-sm font-semibold tabular-nums">
                        {patient.priority}
                    </Badge>
                    <Tooltip
                        title={`In this column: ${wait.short}`}
                        description={
                            <span className="block max-w-xs whitespace-pre-line text-left font-medium leading-relaxed">
                                {journeyBreakdown}
                            </span>
                        }
                        placement="top"
                    >
                        <TooltipTrigger
                            onPointerDown={stopDrag}
                            className={cx(
                                "inline-flex max-w-[min(100%,9rem)] cursor-default items-center gap-1 border-0 bg-transparent p-0 text-sm font-bold tabular-nums tracking-tight shadow-none outline-hidden",
                                waitTone.row,
                            )}
                        >
                            <Clock className={cx("size-4 shrink-0", waitTone.clock)} strokeWidth={2.25} aria-hidden />
                            <span className={cx("min-w-0 truncate leading-snug", waitTone.value)}>{wait.short}</span>
                        </TooltipTrigger>
                    </Tooltip>
                    <div onPointerDown={stopDrag} className="-mr-0.5 shrink-0">
                    <Dropdown.Root>
                        <Dropdown.DotsButton className="p-0.5 text-[#5E6C84]" aria-label="More options" />
                        <Dropdown.Popover className="w-48">
                            <Dropdown.Menu
                                onAction={(key) => {
                                    const k = key.toString();
                                    if (k === "cancel") onCancel();
                                    if (k === "edit") onEdit();
                                    if (k === "message") onSendMessage?.();
                                    if (k.startsWith("move:")) onMoveTo(k.replace("move:", "") as PatientStatus);
                                }}
                            >
                                <Dropdown.Section>
                                    <Dropdown.Item id="edit" label="Edit" />
                                    {onSendMessage ? (
                                        <Dropdown.Item
                                            id="message"
                                            label="Send message"
                                            icon={MessageCircle01}
                                            selectionIndicator="none"
                                        />
                                    ) : null}
                                </Dropdown.Section>
                                <Dropdown.Separator />
                                <Dropdown.Section>
                                    {STATUS_ORDER.map((s) => (
                                        <Dropdown.Item key={s} id={`move:${s}`} label={`Move to ${STATUS_LABELS[s]}`} />
                                    ))}
                                </Dropdown.Section>
                                <Dropdown.Separator />
                                <Dropdown.Section>
                                    <Dropdown.Item id="cancel" label="Cancel visit" />
                                </Dropdown.Section>
                            </Dropdown.Menu>
                        </Dropdown.Popover>
                    </Dropdown.Root>
                    </div>
                </div>
            </div>

            <div className="mt-1.5 min-w-0 space-y-1.5 leading-snug">
                <p className={cx("line-clamp-3 text-[15px] font-medium leading-snug sm:text-base", theme.reasonClass)}>
                    {patient.reason}
                </p>
                {patient.notes ? (
                    <p
                        className={cx(
                            "line-clamp-3 border-l-2 border-[#DFE1E6] pl-2 text-sm leading-relaxed",
                            theme.reasonClass,
                        )}
                    >
                        {patient.notes}
                    </p>
                ) : null}
                {lastStaffMessage ? (
                    <p className="line-clamp-2 border-l-2 border-[#2684FF]/45 pl-2 text-[11px] leading-snug text-[#5E6C84]">
                        <span className="font-semibold text-[#172B4D]">Last message · </span>
                        {lastStaffMessage.body}
                    </p>
                ) : null}
            </div>

            <div className="mt-5 flex w-full min-w-0 flex-wrap items-center justify-start gap-x-3 gap-y-1.5 text-xs">
                <div className="flex min-w-0 max-w-[min(100%,14rem)] shrink-0 items-center gap-1">
                    <Folder className="size-3.5 shrink-0 text-[#97A0AF]" aria-hidden />
                    <span
                        className={cx(
                            "min-w-0 truncate font-mono text-sm font-semibold tracking-tight",
                            patient.status === "completed" ? "text-slate-600" : "text-[#172B4D]",
                        )}
                    >
                        {patient.fileNumber}
                    </span>
                </div>
                <div className="flex shrink-0 items-center gap-0.5" onPointerDown={stopDrag}>
                    <Tooltip
                        title={phone ? phone : "No mobile on file"}
                        description={phone ? "Voice calls are not available — SMS or email only." : undefined}
                        placement="top"
                    >
                        <TooltipTrigger
                            className={cx(
                                "inline-flex rounded-md p-1.5 transition-colors outline-hidden",
                                phone ? "text-[#5E6C84] hover:bg-[#EBECF0]" : "cursor-default text-[#B3B9C4]",
                            )}
                            aria-label={phone ? `Mobile (SMS): ${phone}` : "No mobile on file"}
                        >
                            <Phone01 className="size-3.5 shrink-0" aria-hidden />
                        </TooltipTrigger>
                    </Tooltip>
                    <Tooltip
                        title={email ? email : "No email on file"}
                        description={
                            email ? (
                                <a
                                    href={`mailto:${email}`}
                                    className="font-medium text-white underline underline-offset-2"
                                    onClick={stopDrag}
                                >
                                    Send email
                                </a>
                            ) : undefined
                        }
                        placement="top"
                    >
                        <TooltipTrigger
                            className={cx(
                                "inline-flex rounded-md p-1.5 transition-colors outline-hidden",
                                email ? "text-[#5E6C84] hover:bg-[#EBECF0]" : "cursor-default text-[#B3B9C4]",
                            )}
                            aria-label={email ? `Email: ${email}` : "No email on file"}
                        >
                            <Mail01 className="size-3.5 shrink-0" aria-hidden />
                        </TooltipTrigger>
                    </Tooltip>
                </div>
            </div>

            {patient.status === "calledBack" && (
                <p className="mt-1.5 text-[10px] leading-relaxed text-[#5E6C84]">
                    Patient can confirm return (simulated below). Then <span className="font-medium text-[#172B4D]">Arrived</span> completes the
                    visit.
                </p>
            )}

            {patient.status === "confirmed" && (
                <p className="mt-1.5 text-[10px] leading-relaxed text-[#5E6C84]">
                    Patient confirmed return. Use <span className="font-medium text-[#172B4D]">Arrived</span> when they present.
                </p>
            )}

            <div className="mt-2 flex flex-col gap-1 border-t border-[#F1F2F4] pt-1.5" onPointerDown={stopDrag}>
                {patient.status === "waiting" && callBackConfirmOpen ? (
                    <div className="flex min-w-0 gap-2">
                        <Button
                            color="primary"
                            size="sm"
                            className="min-w-0 min-h-10 flex-1 px-2 text-xs font-medium"
                            onClick={() => {
                                onMoveTo("calledBack");
                                setCallBackConfirmOpen(false);
                            }}
                        >
                            Confirm call back
                        </Button>
                        <Button
                            color="secondary"
                            size="sm"
                            className="min-w-0 min-h-10 shrink-0 px-3 text-xs font-medium"
                            onClick={() => setCallBackConfirmOpen(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                ) : primaryAction ? (
                    <Button
                        color="secondary"
                        size="sm"
                        className="w-full text-xs font-medium"
                        onClick={() => {
                            if (patient.status === "waiting") {
                                setCallBackConfirmOpen(true);
                            } else {
                                onMoveTo(primaryAction.next);
                            }
                        }}
                    >
                        {primaryAction.label}
                    </Button>
                ) : (
                    <Button
                        color="tertiary"
                        size="sm"
                        type="button"
                        className="w-full text-xs"
                        onPointerDown={stopDrag}
                        onClick={onEdit}
                    >
                        Edit
                    </Button>
                )}

                {patient.status === "calledBack" && (
                    <Button color="tertiary" size="sm" className="w-full text-xs" onClick={() => onMoveTo("confirmed")}>
                        Simulate patient confirmed return
                    </Button>
                )}
            </div>
        </div>
    );
}

export function VersionAPatientCardOverlay({
    patient,
    onEdit,
    onMoveTo,
    onCancel,
    onSendMessage,
}: {
    patient: Patient;
    onEdit: () => void;
    onMoveTo: (next: PatientStatus) => void;
    onCancel: () => void;
    onSendMessage?: () => void;
}) {
    return (
        <PatientCardBody
            patient={patient}
            onEdit={onEdit}
            onMoveTo={onMoveTo}
            onCancel={onCancel}
            onSendMessage={onSendMessage}
            className="cursor-grabbing shadow-md ring-2 ring-[#2684FF]/40"
        />
    );
}

export function VersionAPatientCard({
    patient,
    onEdit,
    onMoveTo,
    onCancel,
    onSendMessage,
}: {
    patient: Patient;
    onEdit: () => void;
    onMoveTo: (next: PatientStatus) => void;
    onCancel: () => void;
    onSendMessage?: () => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: patient.id,
        transition: {
            duration: 280,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        },
    });

    const style = useMemo(
        () => ({
            transform: CSS.Transform.toString(transform),
            transition,
        }),
        [transform, transition],
    );

    return (
        <motion.article
            ref={setNodeRef}
            layoutId={`ved-patient-${patient.id}`}
            layout={!isDragging}
            initial={false}
            transition={cardLayoutTransition}
            style={style}
            {...attributes}
            {...listeners}
            className={cx(
                "touch-none rounded-md outline-hidden select-none",
                "cursor-grab active:cursor-grabbing",
                isDragging && "pointer-events-none opacity-0",
            )}
        >
            <PatientCardBody patient={patient} onEdit={onEdit} onMoveTo={onMoveTo} onCancel={onCancel} onSendMessage={onSendMessage} />
        </motion.article>
    );
}
