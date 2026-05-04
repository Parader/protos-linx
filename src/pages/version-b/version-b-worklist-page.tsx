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
import { VersionBPatientCard, VersionBPatientCardOverlay } from "@/pages/version-b/version-b-patient-card";
import { VersionBStaffMessageDialog } from "@/pages/version-b/version-b-staff-message-dialog";
import { useVersionB } from "@/pages/version-b/version-b-context";
import {
    PatientFormPriorityBar,
    PatientFormReasonInput,
    PatientFormReachSection,
} from "@/pages/version-b/version-b-patient-form-fields";
import { BOARD_COLUMN_META, movePatientToStatus } from "@/pages/version-b/version-b-shared";

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

function EmptyLaneState() {
    return (
        <div className="rounded-md border border-dashed border-[#C1C7D0] bg-white/70 px-3 py-3">
            <div className="text-[11px] font-semibold text-[#42526E]">No cards</div>
            <div className="mt-0.5 text-[11px] leading-snug text-[#5E6C84]">Drag a patient here.</div>
        </div>
    );
}

export function VersionBWorklistPage() {
    const {
        query,
        setQuery,
        patients,
        setPatients,
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
        sendStaffMessage,
        sendStaffMessageToAllWaiting,
    } = useVersionB();

    type StaffMessageTarget = null | { kind: "waiting" } | { kind: "patient"; id: string; name: string };
    const [staffMsgTarget, setStaffMsgTarget] = useState<StaffMessageTarget>(null);

    const waitingLaneCount = useMemo(
        () => patients.filter((p) => p.status === "waiting" || p.status === "consent").length,
        [patients],
    );

    return (
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="shrink-0 border-b border-[#DFE1E6] bg-white px-4 py-3 shadow-sm lg:px-6">
                <header className="flex flex-col gap-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-[11px] font-medium text-[#5E6C84]">Spaces / VED dispatch</p>
                            <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
                                <h1 className="text-xl font-semibold tracking-tight text-[#172B4D]">Worklist</h1>
                                <span className="rounded-full bg-[#DFE1E6] px-2 py-0.5 text-xs font-semibold text-[#42526E]">
                                    {patients.length}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                            <DialogTrigger>
                                <Button color="secondary" size="md" iconLeading={Settings01}>
                                    Settings
                                </Button>
                                <ModalOverlay isDismissable>
                                    <Modal>
                                        <Dialog>
                                            {({ close }) => (
                                                <div className="w-full max-w-md rounded-xl bg-primary shadow-lg ring-1 ring-secondary_alt">
                                                    <div className="flex items-start justify-between gap-4 border-b border-secondary p-6">
                                                        <div>
                                                            <Heading slot="title" className="text-md font-semibold text-primary">
                                                                Settings
                                                            </Heading>
                                                            <div className="mt-1 text-sm text-tertiary">
                                                                Prototype tools for testing the worklist.
                                                            </div>
                                                        </div>
                                                        <Button color="tertiary" size="sm" onClick={close}>
                                                            Close
                                                        </Button>
                                                    </div>

                                                    <div className="flex flex-col gap-4 p-6">
                                                        <div className="min-w-0 max-w-[10rem]">
                                                            <Input
                                                                label="Bulk add"
                                                                size="sm"
                                                                type="text"
                                                                inputMode="numeric"
                                                                value={bulkCount}
                                                                onChange={(v) => setBulkCount(v.replace(/\D/g, "").slice(0, 3))}
                                                                placeholder="48"
                                                                hint="Random patients (max 500)"
                                                            />
                                                        </div>
                                                        <Button color="secondary" size="md" iconLeading={ZapFast} onClick={addBulkRandomPatients}>
                                                            Add random patients
                                                        </Button>
                                                        <Button
                                                            color="tertiary"
                                                            size="md"
                                                            onClick={() => setPatients([])}
                                                            isDisabled={patients.length === 0}
                                                        >
                                                            Clear list
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
                            placeholder="Search board…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            wrapperClassName="bg-primary min-w-0 w-full flex-1 sm:max-w-xl"
                        />
                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                            <Button size="md" iconLeading={Plus} onClick={() => setAddPatientOpen(true)}>
                                New patient
                            </Button>
                            <Button
                                color="secondary"
                                size="md"
                                iconLeading={MessageChatSquare}
                                isDisabled={waitingLaneCount === 0}
                                onClick={() => setStaffMsgTarget({ kind: "waiting" })}
                            >
                                Message Waiting
                            </Button>
                        </div>
                    </div>
                </header>
            </div>

            {patients.length === 0 ? (
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-16">
                    <div className="max-w-md text-center">
                        <h2 className="text-lg font-semibold tracking-tight text-[#172B4D]">No patients yet</h2>
                        <p className="mt-2 text-sm leading-relaxed text-[#5E6C84]">
                            Create a patient to start moving them through consent, the queue, callbacks, and completion from this
                            worklist.
                        </p>
                        <Button className="mt-8" size="lg" iconLeading={Plus} onClick={() => setAddPatientOpen(true)}>
                            New patient
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
                        <LayoutGroup id="ved-worklist-board-version-b">
                            <div className="grid w-max min-w-[1152px] max-w-[1188px] shrink-0 grid-cols-[repeat(3,minmax(0,380px))] gap-4">
                                {BOARD_COLUMN_META.map((col) => {
                                    const lanePatients = patientsByColumn[col.id];
                                    const isCollapsed = collapsedLanes.has(col.id);
                                    return (
                                        <section key={col.id} className="min-w-0">
                                            <div className="sticky top-0 z-10 -mx-1 mb-2 flex items-center gap-2 border-b border-[#E4E6EA] bg-[#F4F5F7] px-1 py-2">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5E6C84]">
                                                            {col.title}
                                                        </span>
                                                        <span className="rounded-full bg-[#DFE1E6] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[#42526E]">
                                                            {lanePatients.length}
                                                        </span>
                                                    </div>
                                                    <p className="mt-0.5 text-[10px] font-medium leading-snug text-[#97A0AF]">{col.subtitle}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="flex size-7 shrink-0 items-center justify-center self-start rounded-md text-[#5E6C84] transition-colors hover:bg-[#DFE1E6]/80 hover:text-[#172B4D]"
                                                    aria-expanded={!isCollapsed}
                                                    aria-label={isCollapsed ? "Expand list" : "Collapse list"}
                                                    onClick={() => toggleLaneCollapsed(col.id)}
                                                >
                                                    <ChevronDown
                                                        className={cx("size-4 transition-transform", isCollapsed && "-rotate-90")}
                                                        aria-hidden
                                                    />
                                                </button>
                                            </div>

                                            <DroppableColumn id={`col:${col.id}`}>
                                                <div className="flex min-h-[32px] flex-col gap-2">
                                                    {isCollapsed ? (
                                                        lanePatients.length > 0 ? (
                                                            <div className="rounded-md border border-dashed border-[#C1C7D0] bg-[#F4F5F7]/80 px-2 py-2 text-center text-[11px] leading-snug text-[#5E6C84]">
                                                                Collapsed — expand to view cards, or drop here
                                                            </div>
                                                        ) : (
                                                            <EmptyLaneState />
                                                        )
                                                    ) : (
                                                        <>
                                                            <SortableContext
                                                                items={lanePatients.map((p) => p.id)}
                                                                strategy={verticalListSortingStrategy}
                                                            >
                                                                {lanePatients.map((p) => (
                                                                    <VersionBPatientCard
                                                                        key={p.id}
                                                                        patient={p}
                                                                        onEdit={() => openPatientEditor(p.id)}
                                                                        onSendMessage={() =>
                                                                            setStaffMsgTarget({ kind: "patient", id: p.id, name: p.name })
                                                                        }
                                                                        onMoveTo={(next) =>
                                                                            setPatients((prev) => movePatientToStatus(prev, p.id, next))
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
                                                            {lanePatients.length === 0 && (
                                                                <EmptyLaneState />
                                                            )}
                                                        </>
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
                                <div className="w-[min(100vw-2rem,380px)] rotate-1">
                                    <VersionBPatientCardOverlay
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

            <VersionBStaffMessageDialog
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
                                            Add patient
                                        </Heading>
                                        <div className="mt-1 text-sm text-tertiary">Create a patient and place them in the correct step.</div>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        <Button color="secondary" size="sm" iconLeading={ZapFast} onClick={autofillFormRandom}>
                                            Autofill random
                                        </Button>
                                        <Button color="tertiary" size="sm" onClick={() => setAddPatientOpen(false)}>
                                            Close
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid gap-4 p-6 sm:grid-cols-2">
                                    <Input label="Name" isRequired value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Jane Doe" />
                                    <Input
                                        label="File number"
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
                                            label="Notes"
                                            value={form.notes}
                                            onChange={(v) => setForm((f) => ({ ...f, notes: v }))}
                                            placeholder="Optional notes…"
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
                                            <div className="text-sm font-semibold text-primary">Consent already given</div>
                                            <div className="text-sm text-tertiary">If unchecked, the patient starts in the Consent step.</div>
                                        </div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-end gap-3 border-t border-secondary p-6">
                                    <Button color="secondary" onClick={() => setAddPatientOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            addPatient();
                                            setAddPatientOpen(false);
                                        }}
                                    >
                                        Add patient
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
                                                Edit patient
                                            </Heading>
                                            <div className="mt-1 text-sm text-tertiary">
                                                Update chart details. Workflow step is unchanged — use the board or card actions to move steps.
                                            </div>
                                        </div>
                                        <Button color="tertiary" size="sm" onClick={() => setEditingPatientId(null)}>
                                            Close
                                        </Button>
                                    </div>

                                    <div className="grid gap-4 p-6 sm:grid-cols-2">
                                        <Input
                                            label="Name"
                                            isRequired
                                            value={editForm.name}
                                            onChange={(v) => setEditForm((f) => ({ ...f, name: v }))}
                                            placeholder="Jane Doe"
                                        />
                                        <Input
                                            label="File number"
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
                                                label="Notes"
                                                value={editForm.notes}
                                                onChange={(v) => setEditForm((f) => ({ ...f, notes: v }))}
                                                placeholder="Optional notes…"
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
                                                <div className="text-sm font-semibold text-primary">Consent already given</div>
                                                <div className="text-sm text-tertiary">For chart accuracy only; does not move the card.</div>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 border-t border-secondary p-6">
                                        <Button color="secondary" onClick={() => setEditingPatientId(null)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={saveEditedPatient}>Save changes</Button>
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
