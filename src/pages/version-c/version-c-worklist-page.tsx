import { Mail01, Plus, SearchLg, Settings01 } from "@untitledui/icons";
import { DndContext, DragOverlay, closestCenter, useDroppable, type DropAnimation } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import { Heading } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { InputBase } from "@/components/base/input/input";
import { Dialog, DialogTrigger, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { cx } from "@/utils/cx";
import { useVEDLocale } from "@/lib/ved-locale";
import { useVersionC } from "@/pages/version-c/version-c-context";
import { BOARD_COLUMN_ORDER, fullName, movePatientToStatus, type BoardColumnId } from "@/pages/version-c/version-c-shared";
import { VersionCPatientCard, VersionCPatientCardOverlay } from "@/pages/version-c/version-c-patient-card";
import { VersionCAddPatientModal } from "@/pages/version-c/version-c-add-patient-modal";
import { VersionCSinglePatientMessageModal } from "@/pages/version-c/version-c-single-patient-message-modal";
import { VersionCStaffCancelPatientModal } from "@/pages/version-c/version-c-staff-cancel-patient-modal";
import { VersionCWorklistBulkMessageModal } from "@/pages/version-c/version-c-worklist-bulk-message-modal";
import { VersionCWorklistEmptyState } from "@/pages/version-c/version-c-worklist-empty-state";

const cardDropAnimation: DropAnimation = {
    duration: 320,
    easing: "cubic-bezier(0.18, 0.67, 0.45, 1)",
};

function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <div
            ref={setNodeRef}
            className={cx("rounded-lg p-0.5 transition-colors", isOver && "bg-[#E8F7FE] ring-1 ring-[#0573D8]/30")}
        >
            {children}
        </div>
    );
}

function CountPill({ n }: { n: number }) {
    return (
        <span className="inline-flex items-center justify-center rounded-full border border-[#F2F4F7] bg-white px-2 py-0.5 text-xs font-medium text-[#344054]">
            {n}
        </span>
    );
}

function EmptyLaneState({ laneTitle, emptyLanePrefix, emptyLaneDrag }: { laneTitle: string; emptyLanePrefix: string; emptyLaneDrag: string }) {
    return (
        <div className="rounded-lg border border-dashed border-[#D0D5DD] bg-[#FCFCFD] px-3 py-6 text-center">
            <div className="text-sm font-medium text-[#344054]">
                {emptyLanePrefix}
                {laneTitle}
            </div>
            <div className="mt-1 text-sm text-[#667085]">{emptyLaneDrag}</div>
        </div>
    );
}

export function VersionCWorklistPage() {
    const { strings } = useVEDLocale();
    const wl = strings.versionC.worklist;
    const vcShared = strings.versionC.shared;
    const {
        query,
        setQuery,
        patients,
        setPatients,
        appendActivityLog,
        patientsByColumn,
        activePatient,
        sensors,
        onDragStart,
        onDragCancel,
        onDragEnd,
        setAddPatientOpen,
        setSelectedPatientId,
        addDemoPatients,
        cancelModalPatientId,
        setCancelModalPatientId,
        singleMessagePatientId,
        setSingleMessagePatientId,
    } = useVersionC();

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [bulkMessageOpen, setBulkMessageOpen] = useState(false);
    const [confirmClear, setConfirmClear] = useState(false);

    return (
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="shrink-0 border-b border-[#E2E5EB] bg-white px-6 py-8 shadow-sm">
                <header className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <h1 className="text-2xl font-medium tracking-tight text-[#101828]">{wl.title}</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <DialogTrigger
                                isOpen={settingsOpen}
                                onOpenChange={(open) => {
                                    setSettingsOpen(open);
                                    if (!open) {
                                        setConfirmClear(false);
                                    }
                                }}
                            >
                                <Button
                                    color="secondary"
                                    size="md"
                                    iconLeading={Settings01}
                                    className="border border-[#BEDFFE] bg-white text-[#0573D8]"
                                >
                                    {wl.settings}
                                </Button>
                                <ModalOverlay isDismissable>
                                    <Modal>
                                        <Dialog>
                                            {({ close }) => (
                                                <div className="w-full max-w-md rounded-xl bg-primary shadow-lg ring-1 ring-secondary_alt">
                                                    <div className="flex items-start justify-between gap-4 border-b border-secondary p-6">
                                                        <div>
                                                            <Heading slot="title" className="text-md font-semibold text-primary">
                                                                {wl.settingsTitle}
                                                            </Heading>
                                                            <div className="mt-1 text-sm text-tertiary">{wl.settingsSubtitle}</div>
                                                        </div>
                                                        <Button color="tertiary" size="sm" onClick={close}>
                                                            {wl.close}
                                                        </Button>
                                                    </div>
                                                    <div className="flex flex-col gap-4 p-6">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="text-sm font-semibold text-primary">{wl.listSection}</div>
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    color="secondary"
                                                                    size="md"
                                                                    onClick={() => addDemoPatients(10)}
                                                                >
                                                                    {wl.addTenPatients}
                                                                </Button>
                                                                <Button
                                                                    color={confirmClear ? "tertiary-destructive" : "tertiary"}
                                                                    size="md"
                                                                    isDisabled={patients.length === 0}
                                                                    onClick={() => {
                                                                        if (!confirmClear) {
                                                                            setConfirmClear(true);
                                                                            return;
                                                                        }
                                                                        appendActivityLog({
                                                                            kind: "board_cleared",
                                                                            patientId: null,
                                                                            patientLabel: vcShared.dash,
                                                                            summary: wl.boardClearSummary,
                                                                            detail: wl.boardClearDetail(patients.length),
                                                                        });
                                                                        setPatients([]);
                                                                        setConfirmClear(false);
                                                                        close();
                                                                    }}
                                                                >
                                                                    {confirmClear ? wl.confirmClear : wl.clearList}
                                                                </Button>
                                                            </div>
                                                            {confirmClear ? (
                                                                <div className="text-xs text-tertiary">{wl.clearWarning}</div>
                                                            ) : null}
                                                        </div>

                                                        <div className="h-px w-full bg-secondary" aria-hidden />

                                                        <div className="flex flex-col gap-2">
                                                            <div className="text-sm font-semibold text-primary">{wl.messagingSection}</div>
                                                            <p className="text-sm text-tertiary">{wl.messagingBlurb}</p>
                                                            <Button
                                                                color="secondary"
                                                                size="md"
                                                                iconLeading={Mail01}
                                                                className="w-full border border-secondary"
                                                                onClick={() => {
                                                                    setBulkMessageOpen(true);
                                                                    setSettingsOpen(false);
                                                                    close();
                                                                }}
                                                            >
                                                                {wl.sendBulkMessage}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Dialog>
                                    </Modal>
                                </ModalOverlay>
                            </DialogTrigger>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                            <InputBase
                                icon={SearchLg}
                                placeholder={wl.searchPlaceholder}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                wrapperClassName="bg-white w-full sm:max-w-[445px]"
                            />
                            <Button
                                size="md"
                                iconLeading={Plus}
                                onClick={() => setAddPatientOpen(true)}
                                className="bg-[#0573D8] text-white hover:bg-[#0460B8]"
                            >
                                {wl.newPatient}
                            </Button>
                        </div>
                    </div>
                </header>
            </div>

            {patients.length === 0 ? (
                <VersionCWorklistEmptyState onAddPatient={() => setAddPatientOpen(true)} />
            ) : (
                <motion.div layoutScroll className="flex min-h-0 flex-1 overflow-x-auto overflow-y-auto px-6 py-6">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={onDragStart}
                    onDragCancel={onDragCancel}
                    onDragEnd={(e) => {
                        onDragEnd(e);
                        const id = e.active.id?.toString();
                        if (id) setSelectedPatientId(id);
                    }}
                >
                    <LayoutGroup id="ved-worklist-board-version-c">
                        <div className="grid w-max min-w-[1152px] max-w-[1188px] grid-cols-[repeat(3,minmax(0,381.667px))] gap-4">
                            {BOARD_COLUMN_ORDER.map((colId: BoardColumnId) => {
                                const lanePatients = patientsByColumn[colId];
                                const colTitle = vcShared.boardColumnTitle[colId];
                                return (
                                    <section key={colId} className="min-w-0">
                                        <div className="z-10 mb-3 flex items-center gap-2 border-b border-[#E2E5EB] pb-3">
                                            <div className="min-w-0 flex-1 text-base font-semibold text-[#475467]">{colTitle}</div>
                                            <CountPill n={lanePatients.length} />
                                        </div>

                                        <DroppableColumn id={`col:${colId}`}>
                                            <div className="flex min-h-[32px] flex-col gap-3">
                                                <SortableContext items={lanePatients.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                                                    {lanePatients.map((p) => (
                                                        <VersionCPatientCard
                                                            key={p.id}
                                                            patient={p}
                                                            onSelect={() => setSelectedPatientId(p.id)}
                                                            onMoveTo={(next) => {
                                                                if (p.status === next) return;
                                                                appendActivityLog({
                                                                    kind: "status_menu",
                                                                    patientId: p.id,
                                                                    patientLabel: `${fullName(p)} — ${p.fileNumber}`,
                                                                    summary: wl.statusMenuSummary,
                                                                    detail: wl.statusMenuDetail(
                                                                        vcShared.patientStatus[p.status],
                                                                        vcShared.patientStatus[next],
                                                                    ),
                                                                });
                                                                setPatients((prev) => movePatientToStatus(prev, p.id, next));
                                                            }}
                                                        />
                                                    ))}
                                                </SortableContext>
                                                {lanePatients.length === 0 && (
                                                    <EmptyLaneState
                                                        laneTitle={colTitle}
                                                        emptyLanePrefix={wl.emptyLanePrefix}
                                                        emptyLaneDrag={wl.emptyLaneDrag}
                                                    />
                                                )}
                                            </div>
                                        </DroppableColumn>
                                    </section>
                                );
                            })}
                        </div>
                    </LayoutGroup>

                    <DragOverlay adjustScale={false} dropAnimation={cardDropAnimation} zIndex={100}>
                        {activePatient ? (
                            <div className="w-[min(100vw-2rem,381.667px)] rotate-1">
                                <VersionCPatientCardOverlay patient={activePatient} title={fullName(activePatient)} />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </motion.div>
            )}

            <VersionCAddPatientModal />
            <VersionCWorklistBulkMessageModal isOpen={bulkMessageOpen} onOpenChange={setBulkMessageOpen} />
            <VersionCStaffCancelPatientModal patientId={cancelModalPatientId} onDismiss={() => setCancelModalPatientId(null)} />
            <VersionCSinglePatientMessageModal patientId={singleMessagePatientId} onDismiss={() => setSingleMessagePatientId(null)} />
        </main>
    );
}
