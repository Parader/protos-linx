import { useEffect, useRef, useState } from "react";
import { XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { cx } from "@/utils/cx";
import { formatNanpFromRaw } from "@/utils/na-phone-format";
import { VERSION_C_USE_CLASSIC_ADD_PATIENT_MODAL } from "@/pages/version-c/version-c-add-patient-modal-config";
import { useVersionC } from "@/pages/version-c/version-c-context";

function Divider() {
    return <div className="h-px w-full bg-[#E2E5EB]" aria-hidden />;
}

type PriorityOption = {
    id: "P5" | "P4" | "P3";
    label: string;
    description: string;
    surface: string;
    ring: string;
    pill: string;
    pillBorder: string;
    pillText: string;
};

const PRIORITIES: PriorityOption[] = [
    {
        id: "P5",
        label: "P5",
        description: "Lowest, evaluation can be deferred.",
        surface: "bg-white",
        ring: "ring-1 ring-[#D0D5DD]",
        pill: "bg-[#ECFDF3]",
        pillBorder: "border-[#D1FADF]",
        pillText: "text-[#027A48]",
    },
    {
        id: "P4",
        label: "P4",
        description: "Medium, stable condition but should be evaluated promptly.",
        surface: "bg-white",
        ring: "ring-1 ring-[#D0D5DD]",
        pill: "bg-[#FFFAEB]",
        pillBorder: "border-[#FEF0C7]",
        pillText: "text-[#B54708]",
    },
    {
        id: "P3",
        label: "P3",
        description: "Highest, should be addressed as soon as possible.",
        surface: "bg-white",
        ring: "ring-1 ring-[#D0D5DD]",
        pill: "bg-[#FFF1F3]",
        pillBorder: "border-[#FFE4E8]",
        pillText: "text-[#C01048]",
    },
];

/** Formulaire long d’origine — ajout (si activé) et édition d’un patient existant. */
export function VersionCAddPatientModalClassic() {
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
                                    {isEditMode ? "Modifier le patient" : "Ajouter un patient"}
                                </div>
                                <Button
                                    type="button"
                                    color="tertiary"
                                    size="sm"
                                    iconLeading={XClose}
                                    aria-label="Fermer"
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
                                        label="Prénom"
                                        value={form.firstName}
                                        onChange={(v) => setForm((f) => ({ ...f, firstName: v }))}
                                        placeholder="Jane"
                                    />
                                    <Input
                                        label="Nom"
                                        value={form.lastName}
                                        onChange={(v) => setForm((f) => ({ ...f, lastName: v }))}
                                        placeholder="Doe"
                                    />
                                    <Input
                                        label="Numéro de dossier"
                                        value={form.fileNumber}
                                        onChange={(v) => setForm((f) => ({ ...f, fileNumber: v }))}
                                        placeholder="444555666"
                                    />
                                    <div className="hidden sm:block" aria-hidden />
                                </div>

                                <Divider />

                                <div className="flex flex-col gap-4">
                                    <div>
                                        <div className="text-base font-medium text-black">Contacter le patient</div>
                                        <div className="text-base text-[#667085]">
                                            Au moins un moyen (mobile ou courriel) est requis pour envoyer les notifications.
                                        </div>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Input
                                            label="Mobile (SMS)"
                                            isInvalid={showContactError}
                                            value={form.phone}
                                            onChange={(v) => setForm((f) => ({ ...f, phone: formatNanpFromRaw(v) }))}
                                            onBlur={() => setContactTouched(true)}
                                            placeholder="(514) 555-0123"
                                            inputMode="tel"
                                            autoComplete="tel"
                                        />
                                        <Input
                                            label="Courriel"
                                            isInvalid={showContactError}
                                            value={form.email}
                                            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                                            onBlur={() => setContactTouched(true)}
                                            placeholder="janedoe@akinox.com"
                                        />
                                    </div>
                                    {showContactError ? (
                                        <p className="text-sm font-medium text-[#B42318]">
                                            Indiquez un numéro de mobile ou une adresse courriel (au moins l’un des deux).
                                        </p>
                                    ) : null}
                                </div>

                                <Divider />

                                <Input
                                    label="Motif de présentation à l’urgence"
                                    isRequired
                                    isInvalid={showReasonError}
                                    hint={showReasonError ? "Ce champ est obligatoire." : undefined}
                                    value={form.reason}
                                    onChange={(v) => {
                                        setForm((f) => ({ ...f, reason: v }));
                                        if (v.trim()) setReasonTouched(false);
                                    }}
                                    onBlur={() => setReasonTouched(true)}
                                    placeholder="p. ex. céphalée, fièvre…"
                                />

                                <div className="flex flex-col gap-2">
                                    <div className="text-sm font-medium text-[#344054]">Priorité</div>
                                    <div className="grid gap-4 md:grid-cols-3">
                                        {PRIORITIES.map((opt) => {
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
                                                            {opt.id === "P5"
                                                                ? "La plus basse, l’évaluation peut être reportée."
                                                                : opt.id === "P4"
                                                                  ? "Moyenne, état stable mais doit être évalué rapidement."
                                                                  : "La plus élevée, doit être prise en charge dès que possible."}
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
                                    label="Notes"
                                    value={form.notes}
                                    onChange={(v) => setForm((f) => ({ ...f, notes: v }))}
                                    placeholder="Notes (optionnel)"
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
                                        <div className="text-sm font-medium text-[#344054]">Le consentement a été géré manuellement.</div>
                                        <div className="mt-1 text-sm text-[#667085]">
                                            Cocher cette case permet au patient de contourner l’étape de consentement. La laisser décochée
                                            déclenchera une notification demandant le consentement via la plateforme.
                                        </div>
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
                                        {isEditMode ? "Enregistrer" : "Ajouter à la file d’attente"}
                                    </Button>
                                    <Button
                                        color="tertiary"
                                        size="md"
                                        onClick={() => {
                                            closeModal();
                                            close();
                                        }}
                                    >
                                        Annuler
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
