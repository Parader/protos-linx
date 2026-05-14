import { useEffect, useRef, useState } from "react";
import { XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { cx } from "@/utils/cx";
import { formatNanpFromRaw } from "@/utils/na-phone-format";
import type { VersionCdPagesCore } from "@/lib/ved-app-strings/version-cd-pages-core";
import { useVEDLocale } from "@/lib/ved-locale";
import { VERSION_C_USE_CLASSIC_ADD_PATIENT_MODAL } from "@/pages/version-c/version-c-add-patient-modal-config";
import { useVersionC } from "@/pages/version-c/version-c-context";

function Divider() {
    return <div className="h-px w-full bg-[#E2E5EB]" aria-hidden />;
}

type PriorityOption = {
    id: "P5" | "P4" | "P3";
    label: string;
    surface: string;
    ring: string;
    pill: string;
    pillBorder: string;
    pillText: string;
};

const PRIORITY_STYLES: PriorityOption[] = [
    {
        id: "P5",
        label: "P5",
        surface: "bg-white",
        ring: "ring-1 ring-[#D0D5DD]",
        pill: "bg-[#ECFDF3]",
        pillBorder: "border-[#D1FADF]",
        pillText: "text-[#027A48]",
    },
    {
        id: "P4",
        label: "P4",
        surface: "bg-white",
        ring: "ring-1 ring-[#D0D5DD]",
        pill: "bg-[#FFFAEB]",
        pillBorder: "border-[#FEF0C7]",
        pillText: "text-[#B54708]",
    },
    {
        id: "P3",
        label: "P3",
        surface: "bg-white",
        ring: "ring-1 ring-[#D0D5DD]",
        pill: "bg-[#FFF1F3]",
        pillBorder: "border-[#FFE4E8]",
        pillText: "text-[#C01048]",
    },
];

function priorityHint(id: PriorityOption["id"], w: VersionCdPagesCore["wizard"]) {
    if (id === "P3") return w.priorityP3Hint;
    if (id === "P4") return w.priorityP4Hint;
    return w.priorityP5Hint;
}

/** Formulaire long d’origine — ajout (si activé) et édition d’un patient existant. */
export function VersionCAddPatientModalClassic() {
    const { strings } = useVEDLocale();
    const w = strings.versionC.pages.wizard;
    const c = strings.versionC.pages.classicAddPatientC;
    const d = strings.versionC.pages.classicAddPatientD;
    const {
        addPatientOpen,
        setAddPatientOpen,
        editingPatientId,
        setEditingPatientId,
        patients,
        form,
        setForm,
        addPatient,
        savePatientEdits,
    } = useVersionC();
    const [reasonTouched, setReasonTouched] = useState(false);
    const [contactTouched, setContactTouched] = useState(false);
    const loadedEditIdRef = useRef<string | null>(null);

    const isEditMode = Boolean(editingPatientId);
    const isOpen = VERSION_C_USE_CLASSIC_ADD_PATIENT_MODAL ? addPatientOpen || isEditMode : isEditMode;

    const reasonMissing = !form.reason.trim();
    const showReasonError = reasonTouched && reasonMissing;
    const hasContact = Boolean(form.phone.trim() || form.email.trim());
    const showContactError = contactTouched && !hasContact;

    useEffect(() => {
        if (!editingPatientId) {
            loadedEditIdRef.current = null;
            return;
        }
        if (loadedEditIdRef.current === editingPatientId) return;
        const p = patients.find((x) => x.id === editingPatientId);
        if (!p) {
            setEditingPatientId(null);
            return;
        }
        loadedEditIdRef.current = editingPatientId;
        setForm({
            firstName: p.firstName,
            lastName: p.lastName,
            fileNumber: p.fileNumber,
            phone: p.phone ? formatNanpFromRaw(p.phone) : "",
            email: p.email ?? "",
            communicationLanguage: p.communicationLanguage ?? "fr",
            reason: p.reason,
            notes: p.notes ?? "",
            priority: p.priority,
            consentManagedManually: p.consentManagedManually ?? false,
        });
        setReasonTouched(false);
        setContactTouched(false);
    }, [editingPatientId, patients, setForm, setEditingPatientId]);

    useEffect(() => {
        if (!isOpen) {
            setReasonTouched(false);
            setContactTouched(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (hasContact) setContactTouched(false);
    }, [hasContact]);

    const closeModal = () => {
        setAddPatientOpen(false);
        setEditingPatientId(null);
    };

    return (
        <ModalOverlay
            isDismissable
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!open) closeModal();
            }}
        >
            <Modal>
                <Dialog>
                    {({ close }) => (
                        <div className="w-full max-w-[720px] rounded-xl bg-[#F9FAFB] shadow-lg ring-1 ring-[#E2E5EB]">
                            <div className="flex items-start justify-between gap-6 p-6">
                                <div className="text-2xl font-medium text-[#101828]">
                                    {isEditMode ? c.titleEdit : c.titleAdd}
                                </div>
                                <Button
                                    type="button"
                                    color="tertiary"
                                    size="sm"
                                    iconLeading={XClose}
                                    aria-label={w.closeAria}
                                    excludeFromTabOrder
                                    className="size-10 rounded-lg p-0 text-[#667085] hover:bg-white"
                                    onClick={() => {
                                        closeModal();
                                        close();
                                    }}
                                />
                            </div>

                            <div className="flex flex-col gap-6 px-6 pb-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Input
                                        label={w.firstName}
                                        value={form.firstName}
                                        onChange={(v) => setForm((f) => ({ ...f, firstName: v }))}
                                        placeholder={w.fallbackFirstName}
                                    />
                                    <Input
                                        label={w.lastName}
                                        value={form.lastName}
                                        onChange={(v) => setForm((f) => ({ ...f, lastName: v }))}
                                        placeholder={w.fallbackLastName}
                                    />
                                    <Input
                                        label={w.fileNumber}
                                        value={form.fileNumber}
                                        onChange={(v) => setForm((f) => ({ ...f, fileNumber: v }))}
                                        placeholder={w.fileNumberPh}
                                    />
                                    <div className="hidden sm:block" aria-hidden />
                                </div>

                                <Divider />

                                <div className="flex flex-col gap-4">
                                    <div>
                                        <div className="text-base font-medium text-black">{d.contactSection}</div>
                                        <div className="text-base text-[#667085]">{c.contactBlurb}</div>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Input
                                            label={w.mobileSms}
                                            isInvalid={showContactError}
                                            value={form.phone}
                                            onChange={(v) => setForm((f) => ({ ...f, phone: formatNanpFromRaw(v) }))}
                                            onBlur={() => setContactTouched(true)}
                                            placeholder={w.mobilePh}
                                            inputMode="tel"
                                            autoComplete="tel"
                                        />
                                        <Input
                                            label={w.email}
                                            isInvalid={showContactError}
                                            value={form.email}
                                            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                                            onBlur={() => setContactTouched(true)}
                                            placeholder={w.emailPh}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="text-sm font-medium text-[#344054]">{d.commLanguage}</div>
                                        <div className="flex flex-wrap gap-3">
                                            {(
                                                [
                                                    { id: "fr" as const, label: d.langFr },
                                                    { id: "en" as const, label: d.langEn },
                                                ] as const
                                            ).map((opt) => {
                                                const selected = form.communicationLanguage === opt.id;
                                                return (
                                                    <label
                                                        key={opt.id}
                                                        className={cx(
                                                            "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition",
                                                            selected
                                                                ? "border-[#8ED1FE] bg-[#E8F7FE] text-[#082244]"
                                                                : "border-[#E4E7EC] bg-white text-[#344054] hover:bg-[#F9FAFB]",
                                                        )}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="communicationLanguage"
                                                            value={opt.id}
                                                            checked={selected}
                                                            onChange={() => setForm((f) => ({ ...f, communicationLanguage: opt.id }))}
                                                        />
                                                        {opt.label}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        <p className="mt-1 text-xs leading-snug text-[#667085]">{d.commLanguageHint}</p>
                                    </div>
                                    {showContactError ? (
                                        <p className="text-sm font-medium text-[#B42318]">{c.contactError}</p>
                                    ) : null}
                                </div>

                                <Divider />

                                <Input
                                    label={w.step3Title}
                                    isRequired
                                    isInvalid={showReasonError}
                                    hint={showReasonError ? w.reasonRequired : undefined}
                                    value={form.reason}
                                    onChange={(v) => {
                                        setForm((f) => ({ ...f, reason: v }));
                                        if (v.trim()) setReasonTouched(false);
                                    }}
                                    onBlur={() => setReasonTouched(true)}
                                    placeholder={w.reasonPh}
                                />

                                <div className="flex flex-col gap-2">
                                    <div className="text-sm font-medium text-[#344054]">{d.priority}</div>
                                    <div className="grid gap-4 md:grid-cols-3">
                                        {PRIORITY_STYLES.map((opt) => {
                                            const selected = form.priority === opt.id;
                                            return (
                                                <label
                                                    key={opt.id}
                                                    className={cx(
                                                        "flex w-full cursor-pointer items-start justify-between gap-4 rounded-lg p-4 text-left transition",
                                                        selected
                                                            ? "bg-[#E8F7FE] ring-1 ring-[#8ED1FE]"
                                                            : cx(opt.surface, opt.ring, "hover:bg-[#F9FAFB]"),
                                                    )}
                                                >
                                                    <div className="min-w-0">
                                                        <span
                                                            className={cx(
                                                                "inline-flex items-center rounded-full border px-2 py-0.5 text-sm font-medium",
                                                                opt.pill,
                                                                opt.pillBorder,
                                                                opt.pillText,
                                                            )}
                                                        >
                                                            {opt.label}
                                                        </span>
                                                        <div
                                                            className={cx(
                                                                "mt-2 text-sm leading-5",
                                                                selected ? "text-[#0064B5]" : "text-[#667085]",
                                                            )}
                                                        >
                                                            {priorityHint(opt.id, w)}
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="radio"
                                                        name="version-c-priority-classic"
                                                        className={cx(
                                                            "mt-1 size-4 shrink-0 appearance-none rounded-full border bg-white",
                                                            "border-[#D0D5DD] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.03)]",
                                                            "checked:border-[#0573D8]",
                                                            "relative after:content-[''] after:absolute after:inset-1 after:rounded-full after:bg-[#0573D8] after:scale-0 after:transition-transform",
                                                            "checked:after:scale-100",
                                                        )}
                                                        checked={selected}
                                                        onChange={() => setForm((f) => ({ ...f, priority: opt.id }))}
                                                    />
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                <TextArea
                                    label={w.notes}
                                    value={form.notes}
                                    onChange={(v) => setForm((f) => ({ ...f, notes: v }))}
                                    placeholder={c.notesOptionalPlaceholder}
                                    rows={3}
                                />

                                <Divider />

                                <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-transparent p-1">
                                    <input
                                        type="checkbox"
                                        checked={form.consentManagedManually}
                                        onChange={(e) => setForm((f) => ({ ...f, consentManagedManually: e.target.checked }))}
                                        className="mt-1 size-4"
                                    />
                                    <div className="min-w-0">
                                        <div className="text-sm font-medium text-[#344054]">{w.manualConsentLabel}</div>
                                        <div className="mt-1 text-sm text-[#667085]">{c.manualConsentHelp}</div>
                                    </div>
                                </label>

                                <div className="flex items-center gap-3 pt-2">
                                    <Button
                                        size="md"
                                        className="bg-[#0573D8] text-white hover:bg-[#0460B8]"
                                        onClick={() => {
                                            let valid = true;
                                            if (reasonMissing) {
                                                setReasonTouched(true);
                                                valid = false;
                                            }
                                            if (!hasContact) {
                                                setContactTouched(true);
                                                valid = false;
                                            }
                                            if (!valid) return;
                                            if (isEditMode) {
                                                savePatientEdits();
                                            } else {
                                                addPatient();
                                                setAddPatientOpen(false);
                                            }
                                        }}
                                    >
                                        {isEditMode ? c.save : w.submitQueue}
                                    </Button>
                                    <Button
                                        color="tertiary"
                                        size="md"
                                        onClick={() => {
                                            closeModal();
                                            close();
                                        }}
                                    >
                                        {w.cancel}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}
