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
import { useVersionC } from "@/pages/version-c/version-c-context";
import { BOARD_COLUMN_META, fullName, movePatientToStatus, patientStatusLabelFr } from "@/pages/version-c/version-c-shared";
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

function EmptyLaneState({ label }: { label: string }) {
    return (
        <div className="rounded-lg border border-dashed border-[#D0D5DD] bg-[#FCFCFD] px-3 py-6 text-center">
            <div className="text-sm font-medium text-[#344054]">{label}</div>
            <div className="mt-1 text-sm text-[#667085]">Glissez-déposez une carte patient ici.</div>
        </div>
    );
}

export function VersionCWorklistPage() {
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
                            <h1 className="text-2xl font-medium tracking-tight text-[#101828]">Liste de travail</h1>
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
                                    Paramètres
                                </Button>
                                <ModalOverlay isDismissable>
                                    <Modal>
                                        <Dialog>
                                            {({ close }) => (
                                                <div className="w-full max-w-md rounded-xl bg-primary shadow-lg ring-1 ring-secondary_alt">
                                                    <div className="flex items-start justify-between gap-4 border-b border-secondary p-6">
                                                        <div>
                                                            <Heading slot="title" className="text-md font-semibold text-primary">
                                                                Paramètres
                                                            </Heading>
                                                            <div className="mt-1 text-sm text-tertiary">
                                                                Outils de démo : messagerie, ajout en lot et réinitialisation.
                                                            </div>
                                                        </div>
                                                        <Button color="tertiary" size="sm" onClick={close}>
                                                            Fermer
                                                        </Button>
                                                    </div>
                                                    <div className="flex flex-col gap-4 p-6">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="text-sm font-semibold text-primary">Liste</div>
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    color="secondary"
                                                                    size="md"
                                                                    onClick={() => addDemoPatients(10)}
                                                                >
                                                                    Ajouter 10 patients
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
                                                                            patientLabel: "—",
                                                                            summary: "Liste effacée",
                                                                            detail: `${patients.length} dossier${patients.length > 1 ? "s" : ""} supprimé${patients.length > 1 ? "s" : ""}.`,
                                                                        });
                                                                        setPatients([]);
                                                                        setConfirmClear(false);
                                                                        close();
                                                                    }}
                                                                >
                                                                    {confirmClear ? "Confirmer l’effacement" : "Effacer la liste"}
                                                                </Button>
                                                            </div>
                                                            {confirmClear ? (
                                                                <div className="text-xs text-tertiary">
                                                                    Cette action supprime tous les patients de la démo.
                                                                </div>
                                                            ) : null}
                                                        </div>

                                                        <div className="h-px w-full bg-secondary" aria-hidden />

                                                        <div className="flex flex-col gap-2">
                                                            <div className="text-sm font-semibold text-primary">Messagerie</div>
                                                            <p className="text-sm text-tertiary">
                                                                Ouvrir une fenêtre dédiée pour envoyer un message groupé (modèles : fermeture, réouverture,
                                                                annulation du rappel, délais anormaux, etc.).
                                                            </p>
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
                                                                Envoyer un message…
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
                                placeholder="Chercher par nom"
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
                                Nouveau patient
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
                            {BOARD_COLUMN_META.map((col) => {
                                const lanePatients = patientsByColumn[col.id];
                                return (
                                    <section key={col.id} className="min-w-0">
                                        <div className="z-10 mb-3 flex items-center gap-2 border-b border-[#E2E5EB] pb-3">
                                            <div className="min-w-0 flex-1 text-base font-semibold text-[#475467]">{col.title}</div>
                                            <CountPill n={lanePatients.length} />
                                        </div>

                                        <DroppableColumn id={`col:${col.id}`}>
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
                                                                    summary: "Changement de statut",
                                                                    detail: `${patientStatusLabelFr(p.status)} → ${patientStatusLabelFr(next)}`,
                                                                });
                                                                setPatients((prev) => movePatientToStatus(prev, p.id, next));
                                                            }}
                                                        />
                                                    ))}
                                                </SortableContext>
                                                {lanePatients.length === 0 && (
                                                    <EmptyLaneState label={`Aucun patient dans ${col.title}`} />
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

