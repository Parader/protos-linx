import { Check, Clock, DotsHorizontal, Edit03, Folder, Mail01, Phone01, Trash02 } from "@untitledui/icons";
import type { MouseEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";
import { useClipboard } from "@/hooks/use-clipboard";
import type { VersionCdPagesFlows } from "@/lib/ved-app-strings/version-cd-pages-flows";
import { useVEDLocale } from "@/lib/ved-locale";
import type { BoardColumnId, Patient, PatientCompletionCause, PatientStatus } from "@/pages/version-d/version-d-shared";
import { fullName, statusToColumn, statusWhenDroppedOnColumn } from "@/pages/version-d/version-d-shared";
import { useVersionD } from "@/pages/version-d/version-d-context";

function minutesSince(ts: number) {
    return Math.max(0, Math.floor((Date.now() - ts) / 60_000));
}

function waitTone(minutes: number) {
    if (minutes < 15) return { text: "text-[#344054]", icon: "text-[#344054]" };
    if (minutes < 45) return { text: "text-[#B54708]", icon: "text-[#B54708]" };
    return { text: "text-[#C01048]", icon: "text-[#C01048]" };
}

/** Même ressort que la version A pour l’animation de changement de colonne (LayoutGroup + layoutId). */
const cardLayoutTransition = {
    type: "spring" as const,
    stiffness: 420,
    damping: 36,
    mass: 0.82,
};

type PatientCardStrings = VersionCdPagesFlows["patientCardC"];

function statusLabel(patient: Patient, pc: PatientCardStrings) {
    if (patient.status === "consentPending") {
        return {
            label: pc.statusConsentPending,
            className: "border-[#FEF0C7] bg-[#FFFAEB] text-[#B54708]",
        };
    }
    if (patient.status === "arrived") {
        return {
            label: pc.statusArrived,
            className: "border-[#D1FADF] bg-[#ECFDF3] text-[#027A48]",
        };
    }
    if (patient.status === "completed" && patient.cancelled) {
        const cause: PatientCompletionCause = patient.completionCause ?? "no_show";
        if (cause === "consent_withdrawn") {
            return {
                label: pc.statusWithdrawn,
                className: "border-[#FFE4E8] bg-[#FFF1F3] text-[#C01048]",
            };
        }
        if (cause === "consent_refused") {
            return {
                label: pc.statusRefused,
                className: "border-[#FEF0C7] bg-[#FFFAEB] text-[#B54708]",
            };
        }
        if (cause === "patient_cancelled_queue") {
            return {
                label: pc.statusPatientCancelled,
                className: "border-[#E4E7EC] bg-[#F9FAFB] text-[#475467]",
            };
        }
        if (cause === "staff_cancelled") {
            const r = patient.cancellationReason?.trim() ?? "";
            const short = r.length > 52 ? `${r.slice(0, 52)}…` : r;
            return {
                label: short ? pc.statusStaffCancelled(short) : pc.statusStaffCancelledEmpty,
                className: "border-[#FFE4E8] bg-[#FFF1F3] text-[#C01048]",
            };
        }
        return {
            label: pc.statusNoShow,
            className: "border-[#FFE4E8] bg-[#FFF1F3] text-[#C01048]",
        };
    }
    return null;
}

function PriorityPill({ p }: { p: Patient["priority"] }) {
    const theme =
        p === "P5"
            ? { bg: "bg-[#ECFDF3]", border: "border-[#D1FADF]", text: "text-[#027A48]" }
            : p === "P4"
              ? { bg: "bg-[#FFFAEB]", border: "border-[#FEF0C7]", text: "text-[#B54708]" }
              : { bg: "bg-[#FFF1F3]", border: "border-[#FFE4E8]", text: "text-[#C01048]" };
    return (
        <span className={cx("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", theme.bg, theme.border, theme.text)}>
            {p}
        </span>
    );
}

type Props = {
    patient: Patient;
    onSelect: () => void;
    onMoveTo: (next: PatientStatus) => void;
};

function CopyableIcon({
    icon,
    value,
    copyId,
    unavailableTitle,
    copiedLabel,
    copiedDescription,
    clickToCopy,
}: {
    icon: React.ReactNode;
    value?: string;
    copyId: string;
    unavailableTitle: string;
    copiedLabel: string;
    copiedDescription: string;
    clickToCopy: string;
}) {
    const { copied, copy } = useClipboard();
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const hasValue = Boolean(value?.trim());
    const isCopied = copied === copyId;

    useEffect(() => {
        if (!hasValue) setTooltipOpen(false);
    }, [hasValue]);

    const title = !hasValue ? (
        unavailableTitle
    ) : isCopied ? (
        <span className="inline-flex items-center gap-1.5">
            <Check className="size-3.5 text-emerald-300" strokeWidth={2.5} aria-hidden />
            {copiedLabel}
        </span>
    ) : (
        value!
    );
    const description = !hasValue ? undefined : isCopied ? copiedDescription : clickToCopy;

    return (
        <Tooltip
            title={title}
            description={description}
            placement="top"
            isDisabled={!hasValue}
            isOpen={hasValue ? tooltipOpen : false}
            onOpenChange={setTooltipOpen}
            closeDelay={200}
        >
            <TooltipTrigger
                className={cx(
                    "cursor-pointer rounded-md outline-hidden transition-colors",
                    hasValue ? "text-[#344054] hover:bg-[#F2F4F7] focus:bg-[#F2F4F7]" : "cursor-default text-[#D0D5DD]",
                )}
                onPress={() => {
                    if (!hasValue) return;
                    void (async () => {
                        const { success } = await copy(value!.trim(), copyId);
                        if (success) {
                            // Le press ferme le tooltip par défaut (React Aria) — on le rouvre pour afficher « Copié ».
                            queueMicrotask(() => setTooltipOpen(true));
                        }
                    })();
                }}
            >
                <span className="inline-flex items-center justify-center">{icon}</span>
            </TooltipTrigger>
        </Tooltip>
    );
}

function CopyableFileNumber({
    fileNumber,
    patientId,
    pc,
    dash,
}: {
    fileNumber: string;
    patientId: string;
    pc: PatientCardStrings;
    dash: string;
}) {
    const { copied, copy } = useClipboard();
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const trimmed = fileNumber.trim();
    const hasValue = Boolean(trimmed);
    const copyId = `file:${patientId}`;
    const isCopied = copied === copyId;

    useEffect(() => {
        if (!hasValue) setTooltipOpen(false);
    }, [hasValue]);

    const title = !hasValue ? (
        pc.fileNumberUnavailable
    ) : isCopied ? (
        <span className="inline-flex items-center gap-1.5">
            <Check className="size-3.5 text-emerald-300" strokeWidth={2.5} aria-hidden />
            {pc.copied}
        </span>
    ) : (
        trimmed
    );
    const description = !hasValue ? undefined : isCopied ? pc.copiedDescription : pc.clickToCopy;

    return (
        <Tooltip
            title={title}
            description={description}
            placement="top"
            isDisabled={!hasValue}
            isOpen={hasValue ? tooltipOpen : false}
            onOpenChange={setTooltipOpen}
            closeDelay={200}
        >
            <TooltipTrigger
                className={cx(
                    "inline-flex max-w-full min-w-0 cursor-pointer items-center gap-2 rounded-md py-0.5 pr-1 outline-hidden transition-colors",
                    hasValue ? "text-[#1D2939] hover:bg-[#F2F4F7] focus:bg-[#F2F4F7]" : "cursor-default text-[#D0D5DD]",
                )}
                onPress={() => {
                    if (!hasValue) return;
                    void (async () => {
                        const { success } = await copy(trimmed, copyId);
                        if (success) {
                            queueMicrotask(() => setTooltipOpen(true));
                        }
                    })();
                }}
            >
                <Folder className="size-4 shrink-0 text-[#667085]" strokeWidth={1.75} aria-hidden />
                <span className="min-w-0 truncate font-medium">{hasValue ? trimmed : dash}</span>
            </TooltipTrigger>
        </Tooltip>
    );
}

export function VersionDPatientCard({ patient, onSelect, onMoveTo }: Props) {
    const { strings } = useVEDLocale();
    const pc = strings.versionD.pages.patientCardC;
    const dash = strings.versionD.shared.dash;
    const { setSelectedPatientId, notifyForStatusChange, setEditingPatientId, setCancelModalPatientId, openMoveToRecallModal } =
        useVersionD();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: patient.id,
        transition: {
            duration: 280,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        },
    });
    const [recallConfirmOpen, setRecallConfirmOpen] = useState(false);
    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const canCallBack = patient.status === "waiting";

    useEffect(() => {
        if (!canCallBack) setRecallConfirmOpen(false);
    }, [canCallBack]);

    const statusPill = statusLabel(patient, pc);
    const mins = useMemo(() => minutesSince(patient.createdAt), [patient.createdAt]);
    const tone = waitTone(mins);
    const showWaitTimer = patient.status !== "completed";
    const currentColumn = statusToColumn(patient.status);
    const showMoveMenuWaiting = currentColumn !== "waiting";
    const showMoveMenuRecall = currentColumn !== "recall";
    const showMoveMenuCompleted = patient.status !== "completed";
    const showMoveMenuSection = showMoveMenuWaiting || showMoveMenuRecall || showMoveMenuCompleted;

    const showArriveButton = patient.status === "recall" || patient.status === "arrived";

    const moveToColumn = (column: BoardColumnId) => {
        if (column === "recall") {
            openMoveToRecallModal(patient.id);
            return;
        }
        const next = statusWhenDroppedOnColumn(column, patient);
        if (next === patient.status) return;
        onMoveTo(next);
    };

    const onMenuAction = (key: string) => {
        switch (key) {
            case "edit":
                setEditingPatientId(patient.id);
                break;
            case "cancel":
                setCancelModalPatientId(patient.id);
                break;
            case "move-waiting":
                moveToColumn("waiting");
                break;
            case "move-recall":
                moveToColumn("recall");
                break;
            case "move-completed":
                moveToColumn("completed");
                break;
            default:
                break;
        }
    };

    return (
        <motion.div
            ref={setNodeRef}
            layoutId={`ved-patient-version-d-${patient.id}`}
            layout={!isDragging}
            initial={false}
            transition={cardLayoutTransition}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => {
                onSelect();
                setSelectedPatientId(patient.id);
            }}
            className={cx(
                "touch-none outline-hidden select-none",
                "cursor-grab active:cursor-grabbing",
                isDragging && "pointer-events-none opacity-0",
            )}
        >
            <div
                className={cx(
                    "rounded-lg border border-[#E2E5EB] px-[15px] shadow-[0px_1px_2.5px_rgba(16,24,40,0.05),0px_1px_1px_rgba(16,24,40,0.05)]",
                    "border-l-3",
                    patient.status === "consentPending"
                        ? "border-l-[#B54708] bg-[#FFFAEB]"
                        : patient.status === "completed"
                          ? "border-l-[#D0D5DD] bg-white"
                          : patient.status === "recall"
                            ? "border-l-[#923D98] bg-[#FEFBFE]"
                            : patient.status === "arrived"
                              ? "border-l-[#027A48] bg-[#F6FEF9]"
                              : "border-l-[#0064B5] bg-[#F2FAFF]",
                )}
            >
                <div className="flex items-center gap-4 py-2">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                            <div className="min-w-0 flex-1 truncate text-lg font-medium text-[#1D2939]">{fullName(patient)}</div>
                            <PriorityPill p={patient.priority} />
                            {showWaitTimer ? (
                                <div className={cx("flex items-center gap-1 text-xs font-medium", tone.text)}>
                                    <Clock className={cx("size-3", tone.icon)} strokeWidth={2} aria-hidden />
                                    {mins}
                                    {pc.minSuffix}
                                </div>
                            ) : null}
                            <div
                                className="shrink-0"
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Dropdown.Root>
                                    <Button
                                        color="tertiary"
                                        size="sm"
                                        iconLeading={DotsHorizontal}
                                        aria-label={pc.actionsAria}
                                        className="size-9 rounded-lg p-0 text-[#667085] hover:bg-[#F2F4F7]"
                                    />
                                    <Dropdown.Popover className="w-[min(100vw-2rem,280px)]" offset={4}>
                                        <Dropdown.Menu selectionMode="none" onAction={(k) => onMenuAction(String(k))}>
                                            <Dropdown.Section>
                                                <Dropdown.Item id="edit" label={pc.edit} icon={Edit03} selectionIndicator="none" />
                                            </Dropdown.Section>
                                            {showMoveMenuSection ? (
                                                <>
                                                    <Dropdown.Separator />
                                                    <Dropdown.Section>
                                                        <Dropdown.SectionHeader className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-quaternary">
                                                            {pc.moveToHeader}
                                                        </Dropdown.SectionHeader>
                                                        {showMoveMenuWaiting ? (
                                                            <Dropdown.Item
                                                                id="move-waiting"
                                                                label={pc.menuMoveWaitingShort}
                                                                selectionIndicator="none"
                                                            />
                                                        ) : null}
                                                        {showMoveMenuRecall ? (
                                                            <Dropdown.Item id="move-recall" label={pc.menuMoveRecallShort} selectionIndicator="none" />
                                                        ) : null}
                                                        {showMoveMenuCompleted ? (
                                                            <Dropdown.Item id="move-completed" label={pc.menuMoveCompletedShort} selectionIndicator="none" />
                                                        ) : null}
                                                    </Dropdown.Section>
                                                </>
                                            ) : null}
                                            <Dropdown.Separator />
                                            <Dropdown.Section>
                                                <Dropdown.Item
                                                    id="cancel"
                                                    label={pc.menuCancelShort}
                                                    icon={Trash02}
                                                    isDisabled={patient.status === "completed"}
                                                    selectionIndicator="none"
                                                />
                                            </Dropdown.Section>
                                        </Dropdown.Menu>
                                    </Dropdown.Popover>
                                </Dropdown.Root>
                            </div>
                        </div>

                        <div className="mt-1 text-base text-[#101828]">{patient.reason || dash}</div>

                        <div className="mt-2 rounded-[5px] bg-[#FCFCFD] p-2 text-sm text-[#667085]">
                            {patient.notes ? `“${patient.notes}”` : pc.notesPlaceholder}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 pb-3">
                    <div
                        className="min-w-0 shrink text-sm"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <CopyableFileNumber fileNumber={patient.fileNumber} patientId={patient.id} pc={pc} dash={dash} />
                    </div>
                    <div className="flex items-center gap-2">
                        <CopyableIcon
                            unavailableTitle={pc.lineUnavailablePhone}
                            copiedLabel={pc.copied}
                            copiedDescription={pc.copiedDescription}
                            clickToCopy={pc.clickToCopy}
                            value={patient.phone}
                            copyId={`phone:${patient.id}`}
                            icon={<Phone01 className="size-5" strokeWidth={1.75} aria-hidden />}
                        />
                        <CopyableIcon
                            unavailableTitle={pc.lineUnavailableEmail}
                            copiedLabel={pc.copied}
                            copiedDescription={pc.copiedDescription}
                            clickToCopy={pc.clickToCopy}
                            value={patient.email}
                            copyId={`email:${patient.id}`}
                            icon={<Mail01 className="size-5" strokeWidth={1.75} aria-hidden />}
                        />
                    </div>
                </div>

                {statusPill ? (
                    <div className="pb-2">
                        <span
                            className={cx(
                                "inline-flex max-w-full items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                                statusPill.className,
                            )}
                        >
                            {statusPill.label}
                        </span>
                    </div>
                ) : null}

                <div className="pb-3">
                    {canCallBack ? (
                        recallConfirmOpen ? (
                            <div className="flex min-w-0 gap-2">
                                <Button
                                    color="primary"
                                    size="md"
                                    className="min-h-10 min-w-0 flex-1 bg-[#0573D8] px-2 text-white hover:bg-[#0460B8]"
                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                        e.stopPropagation();
                                        onMoveTo("recall");
                                        notifyForStatusChange(patient.id, "recall");
                                        setRecallConfirmOpen(false);
                                    }}
                                >
                                    {pc.confirmRecall}
                                </Button>
                                <Button
                                    color="secondary"
                                    size="md"
                                    className="min-h-10 shrink-0 border border-[#BEDFFE] bg-white px-3 text-[#0573D8] hover:bg-[#F2FAFF]"
                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                        e.stopPropagation();
                                        setRecallConfirmOpen(false);
                                    }}
                                >
                                    {pc.cancel}
                                </Button>
                            </div>
                        ) : (
                            <Button
                                color="secondary"
                                size="md"
                                className="w-full border border-[#BEDFFE] bg-white text-[#0573D8] hover:bg-[#F2FAFF]"
                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                    e.stopPropagation();
                                    setRecallConfirmOpen(true);
                                }}
                            >
                                {pc.recall}
                            </Button>
                        )
                    ) : null}

                    {patient.status === "consentPending" ? (
                        <Button
                            color="secondary"
                            size="md"
                            className="w-full border border-[#BEDFFE] bg-white text-[#0573D8] hover:bg-[#F2FAFF]"
                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                onMoveTo("waiting");
                                notifyForStatusChange(patient.id, "waiting");
                            }}
                        >
                            {pc.consentReceived}
                        </Button>
                    ) : null}

                    {showArriveButton ? (
                        <Button
                            color="secondary"
                            size="md"
                            className="mt-2 w-full border border-[#BEDFFE] bg-white text-[#0573D8] hover:bg-[#F2FAFF]"
                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                onMoveTo("completed");
                            }}
                        >
                            {pc.arrived}
                        </Button>
                    ) : null}
                </div>
            </div>
        </motion.div>
    );
}

export function VersionDPatientCardOverlay({ patient, title }: { patient: Patient; title: string }) {
    const { strings } = useVEDLocale();
    const dash = strings.versionD.shared.dash;
    return (
        <div className="rounded-lg border border-[#E2E5EB] bg-white px-[15px] py-3 shadow-[0px_8px_24px_rgba(16,24,40,0.12)]">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 truncate text-lg font-medium text-[#1D2939]">{title}</div>
                <PriorityPill p={patient.priority} />
            </div>
            <div className="mt-1 text-base text-[#101828]">{patient.reason || dash}</div>
        </div>
    );
}

