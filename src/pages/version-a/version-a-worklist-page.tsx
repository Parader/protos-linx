import {
    ChevronDown,
    MessageChatSquare,
    Plus,
    SearchLg,
    Settings01,
    ZapFast,
} from "@untitledui/icons";
import {
    DndContext,
    DragOverlay,
    closestCenter,
    useDroppable,
    type DropAnimation,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/base/buttons/button";
import { Input, InputBase } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import { Dialog, DialogTrigger, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { useMemo, useState } from "react";
import { Heading } from "react-aria-components";
import { LayoutGroup, motion } from "motion/react";
import { cx } from "@/utils/cx";
import { VersionAPatientCard, VersionAPatientCardOverlay } from "@/pages/version-a/version-a-patient-card";
import { VersionAStaffMessageDialog } from "@/pages/version-a/version-a-staff-message-dialog";
import { useVersionA } from "@/pages/version-a/version-a-context";
import {
    PatientFormPriorityBar,
    PatientFormReasonInput,
    PatientFormReachSection,
} from "@/pages/version-a/version-a-patient-form-fields";
import { BOARD_SECTIONS, movePatientToStatus } from "@/pages/version-a/version-a-shared";
import { useVEDLocale } from "@/lib/ved-locale";

const cardDropAnimation: DropAnimation = {
    duration: 320,
    easing: "cubic-bezier(0.18, 0.67, 0.45, 1)",
};

function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <div
            ref={setNodeRef}
            className={cx("rounded-md p-0.5 transition-colors", isOver && "bg-[#E9F2FF] ring-1 ring-[#2684FF]/50")}
        >
            {children}
        </div>
    );
}

export function VersionAWorklistPage() {
    const {
        query,
        setQuery,
        patients,
        setPatients,
        patientsByStatus,
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
        sendStaffMessage,
        sendStaffMessageToAllWaiting,
    } = useVersionA();

    const { strings } = useVEDLocale();
    const wb = strings.worklistAb;
    const w = wb.worklistPage;

    type StaffMessageTarget = null | { kind: "waiting" } | { kind: "patient"; id: string; name: string };
    const [staffMsgTarget, setStaffMsgTarget] = useState<StaffMessageTarget>(null);

    const waitingLaneCount = useMemo(() => patients.filter((p) => p.status === "waiting").length, [patients]);

    return (
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="shrink-0 border-b border-[#DFE1E6] bg-white px-4 py-3 shadow-sm lg:px-6">
                <header className="flex flex-col gap-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-[11px] font-medium text-[#5E6C84]">{w.crumb}</p>
                            <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
                                <h1 className="text-xl font-semibold tracking-tight text-[#172B4D]">{w.title}</h1>
                                <span className="rounded-full bg-[#DFE1E6] px-2 py-0.5 text-xs font-semibold text-[#42526E]">
                                    {patients.length}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                            <DialogTrigger>
                                <Button color="secondary" size="md" iconLeading={Settings01}>
                                    {w.settings}
                                </Button>
                                <ModalOverlay isDismissable>
                                    <Modal>
                                        <Dialog>
                                            {({ close }) => (
                                                <div className="w-full max-w-md rounded-xl bg-primary shadow-lg ring-1 ring-secondary_alt">
                                                    <div className="flex items-start justify-between gap-4 border-b border-secondary p-6">
                                                        <div>
                                                            <Heading slot="title" className="text-md font-semibold text-primary">
                                                                {w.settingsTitle}
                                                            </Heading>
                                                            <div className="mt-1 text-sm text-tertiary">
                                                                {w.settingsSubtitle}
                                                            </div>
                                                        </div>
                                                        <Button color="tertiary" size="sm" onClick={close}>
                                                            {w.close}
                                                        </Button>
                                                    </div>

                                                    <div className="flex flex-col gap-4 p-6">
                                                        <div className="min-w-0 max-w-[10rem]">
                                                            <Input
                                                                label={w.bulkAddLabel}
                                                                size="sm"
                                                                type="text"
                                                                inputMode="numeric"
                                                                value={bulkCount}
                                                                onChange={(v) => setBulkCount(v.replace(/\D/g, "").slice(0, 3))}
                                                                placeholder="48"
                                                                hint={w.bulkAddHint}
                                                            />
                                                        </div>
                                                        <Button color="secondary" size="md" iconLeading={ZapFast} onClick={addBulkRandomPatients}>
                                                            {w.addRandomPatients}
                                                        </Button>
                                                        <Button
                                                            color="tertiary"
                                                            size="md"
                                                            onClick={() => setPatients([])}
                                                            isDisabled={patients.length === 0}
                                                        >
                                                            {w.clearList}
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </Dialog>
                                    </Modal>
                                </ModalOverlay>
                            </DialogTrigger>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                        <InputBase
                            icon={SearchLg}
                            placeholder={w.searchPlaceholder}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            wrapperClassName="bg-primary min-w-0 w-full flex-1 sm:max-w-xl"
                        />
                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                            <Button size="md" iconLeading={Plus} onClick={() => setAddPatientOpen(true)}>
                                {w.newPatient}
                            </Button>
                            <Button
                                color="secondary"
                                size="md"
                                iconLeading={MessageChatSquare}
                                isDisabled={waitingLaneCount === 0}
                                onClick={() => setStaffMsgTarget({ kind: "waiting" })}
                            >
                                {w.messageWaiting}
                            </Button>
                        </div>
                    </div>
                </header>
            </div>

            {patients.length === 0 ? (
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-16">
                    <div className="max-w-md text-center">
                        <h2 className="text-lg font-semibold tracking-tight text-[#172B4D]">{w.emptyTitle}</h2>
                        <p className="mt-2 text-sm leading-relaxed text-[#5E6C84]">{w.emptyBody}</p>
                        <Button className="mt-8" size="lg" iconLeading={Plus} onClick={() => setAddPatientOpen(true)}>
                            {w.newPatient}
                        </Button>
                    </div>
                </div>
            ) : (
                <motion.div
                    layoutScroll
                    className="flex min-h-0 flex-1 justify-start overflow-y-auto overflow-x-auto px-4 py-4 lg:px-6 lg:py-5"
                >
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={onDragStart}
                        onDragCancel={onDragCancel}
                        onDragEnd={onDragEnd}
                    >
                        <LayoutGroup id="ved-worklist-board">
                            <div className="grid w-max min-w-[1152px] max-w-[1188px] shrink-0 grid-cols-[repeat(3,minmax(0,380px))] gap-4">
                                {BOARD_SECTIONS.map((section) => (
                                    <section key={section.key} className="min-w-0">
                                        <div className="flex flex-col gap-4">
                                            {section.statuses.map((status) => {
                                                const lanePatients = patientsByStatus[status];
                                                const isCollapsed = collapsedLanes.has(status);
                                                return (
                                                    <div key={status} className="min-w-0">
                                                        <div className="sticky top-0 z-10 -mx-1 mb-2 flex items-center gap-2 border-b border-[#E4E6EA] bg-[#F4F5F7] px-1 py-2">
                                                            <div className="flex min-w-0 flex-1 items-center gap-2">
                                                                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5E6C84]">
                                                                    {status === "waiting" || status === "consent"
                                                                        ? wb.queueLaneLabels[status]
                                                                        : wb.statusLabels[status]}
                                                                </span>
                                                                <span className="rounded-full bg-[#DFE1E6] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[#42526E]">
                                                                    {lanePatients?.length ?? 0}
                                                                </span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="flex size-7 shrink-0 items-center justify-center rounded-md text-[#5E6C84] transition-colors hover:bg-[#DFE1E6]/80 hover:text-[#172B4D]"
                                                                aria-expanded={!isCollapsed}
                                                                aria-label={isCollapsed ? w.expandLane : w.collapseLane}
                                                                onClick={() => toggleLaneCollapsed(status)}
                                                            >
                                                                <ChevronDown
                                                                    className={cx("size-4 transition-transform", isCollapsed && "-rotate-90")}
                                                                    aria-hidden
                                                                />
                                                            </button>
                                                        </div>

                                                        <DroppableColumn id={`col:${status}`}>
                                                            <div className="flex min-h-[32px] flex-col gap-2">
                                                                {isCollapsed ? (
                                                                    lanePatients.length > 0 ? (
                                                                        <div className="rounded-md border border-dashed border-[#C1C7D0] bg-[#F4F5F7]/80 px-2 py-2 text-center text-[11px] leading-snug text-[#5E6C84]">
                                                                            {w.collapsedHint}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="min-h-8" aria-hidden />
                                                                    )
                                                                ) : (
                                                                    <>
                                                                        <SortableContext
                                                                            items={lanePatients.map((p) => p.id)}
                                                                            strategy={verticalListSortingStrategy}
                                                                        >
                                                                            {lanePatients.map((p) => (
                                                                        <VersionAPatientCard
                                                                            key={p.id}
                                                                            patient={p}
                                                                            onEdit={() => openPatientEditor(p.id)}
                                                                            onSendMessage={() =>
                                                                                setStaffMsgTarget({ kind: "patient", id: p.id, name: p.name })
                                                                            }
                                                                            onMoveTo={(next) =>
                                                                                setPatients((prev) =>
                                                                                    movePatientToStatus(prev, p.id, next),
                                                                                )
                                                                            }
                                                                            onCancel={() =>
                                                                                setPatients((prev) =>
                                                                                    movePatientToStatus(prev, p.id, "completed", {
                                                                                        cancelled: true,
                                                                                    }),
                                                                                )
                                                                            }
                                                                        />
                                                                            ))}
                                                                        </SortableContext>
                                                                        {lanePatients.length === 0 && <div className="min-h-8" aria-hidden />}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </DroppableColumn>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        </LayoutGroup>

                        <DragOverlay adjustScale={false} dropAnimation={cardDropAnimation} zIndex={100}>
                            {activePatient ? (
                                <div className="w-[min(100vw-2rem,380px)] rotate-1">
                                    <VersionAPatientCardOverlay
                                        patient={activePatient}
                                        onEdit={() => {}}
                                        onSendMessage={() =>
                                            setStaffMsgTarget({ kind: "patient", id: activePatient.id, name: activePatient.name })
                                        }
                                        onMoveTo={(next) => setPatients((prev) => movePatientToStatus(prev, activePatient.id, next))}
                                        onCancel={() =>
                                            setPatients((prev) =>
                                                movePatientToStatus(prev, activePatient.id, "completed", { cancelled: true }),
                                            )
                                        }
                                    />
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </motion.div>
            )}

            <VersionAStaffMessageDialog
                isOpen={staffMsgTarget !== null}
                onOpenChange={(open) => {
                    if (!open) setStaffMsgTarget(null);
                }}
                mode={staffMsgTarget?.kind === "patient" ? "patient" : "waiting"}
                waitingCount={waitingLaneCount}
                patientName={staffMsgTarget?.kind === "patient" ? staffMsgTarget.name : undefined}
                onSend={(body, templateId) => {
                    if (staffMsgTarget?.kind === "waiting") sendStaffMessageToAllWaiting(body, templateId);
                    else if (staffMsgTarget?.kind === "patient") sendStaffMessage(staffMsgTarget.id, body, templateId);
                }}
            />

            <ModalOverlay isDismissable isOpen={addPatientOpen} onOpenChange={setAddPatientOpen}>
                <Modal>
                    <Dialog>
                        {() => (
                            <div className="w-full max-w-2xl rounded-xl bg-primary shadow-lg ring-1 ring-secondary_alt">
                                <div className="flex items-start justify-between gap-4 border-b border-secondary p-6">
                                    <div>
                                        <Heading slot="title" className="text-md font-semibold text-primary">
                                            {w.addPatientTitle}
                                        </Heading>
                                        <div className="mt-1 text-sm text-tertiary">{w.addPatientSubtitle}</div>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        <Button color="secondary" size="sm" iconLeading={ZapFast} onClick={autofillFormRandom}>
                                            {w.autofillRandom}
                                        </Button>
                                        <Button color="tertiary" size="sm" onClick={() => setAddPatientOpen(false)}>
                                            {w.close}
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid gap-4 p-6 sm:grid-cols-2">
                                    <Input label={w.name} isRequired value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Jane Doe" />
                                    <Input
                                        label={w.fileNumber}
                                        isRequired
                                        value={form.fileNumber}
                                        onChange={(v) => setForm((f) => ({ ...f, fileNumber: v }))}
                                        placeholder="123456789"
                                    />

                                    <PatientFormReachSection
                                        preferredCommunication={form.preferredCommunication}
                                        phone={form.phone}
                                        email={form.email}
                                        onPreferredChange={(v) => setForm((f) => ({ ...f, preferredCommunication: v }))}
                                        onPhoneChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                                        onEmailChange={(v) => setForm((f) => ({ ...f, email: v }))}
                                    />

                                    <PatientFormReasonInput
                                        value={form.reason}
                                        onChange={(v) => setForm((f) => ({ ...f, reason: v }))}
                                    />

                                    <PatientFormPriorityBar
                                        priority={form.priority}
                                        onChange={(p) => setForm((f) => ({ ...f, priority: p }))}
                                    />

                                    <div className="sm:col-span-2">
                                        <TextArea
                                            label={w.notes}
                                            value={form.notes}
                                            onChange={(v) => setForm((f) => ({ ...f, notes: v }))}
                                            placeholder={w.notesPlaceholder}
                                            rows={4}
                                        />
                                    </div>

                                    <label className="sm:col-span-2 flex cursor-pointer items-center gap-3 rounded-lg border border-secondary bg-primary p-3">
                                        <input
                                            type="checkbox"
                                            checked={form.consentGiven}
                                            onChange={(e) => setForm((f) => ({ ...f, consentGiven: e.target.checked }))}
                                            className="size-4"
                                        />
                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold text-primary">{w.consentCheckboxTitle}</div>
                                            <div className="text-sm text-tertiary">{w.consentCheckboxHintAdd}</div>
                                        </div>
                                    </label>
                                </div>

                                <div className="flex flex-wrap items-center justify-start gap-3 border-t border-secondary p-6">
                                    <Button
                                        onClick={() => {
                                            addPatient();
                                            setAddPatientOpen(false);
                                        }}
                                    >
                                        {w.addPatientSubmit}
                                    </Button>
                                    <Button color="tertiary" onClick={() => setAddPatientOpen(false)}>
                                        {w.cancel}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>

            <ModalOverlay
                isDismissable
                isOpen={editingPatientId !== null}
                onOpenChange={(open) => {
                    if (!open) setEditingPatientId(null);
                }}
            >
                <Modal>
                    <Dialog>
                        {() =>
                            editingPatientId ? (
                                <div className="w-full max-w-2xl rounded-xl bg-primary shadow-lg ring-1 ring-secondary_alt">
                                    <div className="flex items-start justify-between gap-4 border-b border-secondary p-6">
                                        <div>
                                            <Heading slot="title" className="text-md font-semibold text-primary">
                                                {w.editPatientTitle}
                                            </Heading>
                                            <div className="mt-1 text-sm text-tertiary">{w.editPatientSubtitle}</div>
                                        </div>
                                        <Button color="tertiary" size="sm" onClick={() => setEditingPatientId(null)}>
                                            {w.close}
                                        </Button>
                                    </div>

                                    <div className="grid gap-4 p-6 sm:grid-cols-2">
                                        <Input
                                            label={w.name}
                                            isRequired
                                            value={editForm.name}
                                            onChange={(v) => setEditForm((f) => ({ ...f, name: v }))}
                                            placeholder="Jane Doe"
                                        />
                                        <Input
                                            label={w.fileNumber}
                                            isRequired
                                            value={editForm.fileNumber}
                                            onChange={(v) => setEditForm((f) => ({ ...f, fileNumber: v }))}
                                            placeholder="123456789"
                                        />

                                        <PatientFormReachSection
                                            preferredCommunication={editForm.preferredCommunication}
                                            phone={editForm.phone}
                                            email={editForm.email}
                                            onPreferredChange={(v) => setEditForm((f) => ({ ...f, preferredCommunication: v }))}
                                            onPhoneChange={(v) => setEditForm((f) => ({ ...f, phone: v }))}
                                            onEmailChange={(v) => setEditForm((f) => ({ ...f, email: v }))}
                                        />

                                        <PatientFormReasonInput
                                            value={editForm.reason}
                                            onChange={(v) => setEditForm((f) => ({ ...f, reason: v }))}
                                        />

                                        <PatientFormPriorityBar
                                            priority={editForm.priority}
                                            onChange={(p) => setEditForm((f) => ({ ...f, priority: p }))}
                                        />

                                        <div className="sm:col-span-2">
                                            <TextArea
                                            label={w.notes}
                                            value={editForm.notes}
                                            onChange={(v) => setEditForm((f) => ({ ...f, notes: v }))}
                                            placeholder={w.notesPlaceholder}
                                                rows={4}
                                            />
                                        </div>

                                        <label className="sm:col-span-2 flex cursor-pointer items-center gap-3 rounded-lg border border-secondary bg-primary p-3">
                                            <input
                                                type="checkbox"
                                                checked={editForm.consentGiven}
                                                onChange={(e) => setEditForm((f) => ({ ...f, consentGiven: e.target.checked }))}
                                                className="size-4"
                                            />
                                            <div className="min-w-0">
                                                <div className="text-sm font-semibold text-primary">{w.consentCheckboxTitle}</div>
                                                <div className="text-sm text-tertiary">{w.consentCheckboxHintEdit}</div>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-start gap-3 border-t border-secondary p-6">
                                        <Button onClick={saveEditedPatient}>{w.saveChanges}</Button>
                                        <Button color="tertiary" onClick={() => setEditingPatientId(null)}>
                                            {w.cancel}
                                        </Button>
                                    </div>
                                </div>
                            ) : null
                        }
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </main>
    );
}
