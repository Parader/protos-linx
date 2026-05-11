import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { cx } from "@/utils/cx";
import { formatNanpFromRaw } from "@/utils/na-phone-format";
import type { VersionCdPagesCore } from "@/lib/ved-app-strings/version-cd-pages-core";
import { useVEDLocale } from "@/lib/ved-locale";
import { useVersionD } from "@/pages/version-d/version-d-context";
import type { VersionDNewPatientForm } from "@/pages/version-d/version-d-context";

/** Étapes questions seulement : 0 = identité … 6 = consentement ; dernière étape = ajout à la file d’attente. */
const QUESTION_STEP_COUNT = 7;
const LAST_STEP = 6;
const TOTAL_STEPS = QUESTION_STEP_COUNT;

type PriorityOption = {
    id: "P5" | "P4" | "P3";
    label: string;
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

function contactSummary(f: VersionDNewPatientForm, dash: string) {
    const p = f.phone.trim();
    const e = f.email.trim();
    if (p && e) return `${p} · ${e}`;
    if (p) return p;
    if (e) return e;
    return dash;
}

function FrozenBlock({
    form,
    currentStep,
    w,
    dash,
}: {
    form: VersionDNewPatientForm;
    currentStep: number;
    w: VersionCdPagesCore["wizard"];
    dash: string;
}) {
    const rows: { label: string; value: string }[] = [];
    if (currentStep > 0) {
        const id = [form.firstName, form.lastName].map((s) => s.trim()).filter(Boolean).join(" ");
        rows.push({ label: w.frozenIdentity, value: id || dash });
    }
    if (currentStep > 1) rows.push({ label: w.frozenFile, value: form.fileNumber.trim() || dash });
    if (currentStep > 2) rows.push({ label: w.frozenContact, value: contactSummary(form, dash) });
    if (currentStep > 3) rows.push({ label: w.frozenReason, value: form.reason.trim() || dash });
    if (currentStep > 4) rows.push({ label: w.frozenPriority, value: form.priority });
    if (currentStep > 5)
        rows.push({
            label: w.frozenNotes,
            value: form.notes.trim() ? `${form.notes.trim().slice(0, 80)}${form.notes.trim().length > 80 ? "…" : ""}` : dash,
        });
    if (currentStep > 6)
        rows.push({ label: w.frozenManualConsent, value: form.consentManagedManually ? w.yes : w.no });

    if (rows.length === 0) return null;

    return (
        <div className="space-y-2 rounded-xl border border-[#E4E7EC] bg-[#FCFCFD] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#98A2B3]">{w.previousAnswers}</p>
            <dl className="space-y-2.5">
                {rows.map((r) => (
                    <div key={r.label} className="grid grid-cols-[minmax(0,7.5rem)_1fr] gap-2 text-sm">
                        <dt className="font-medium text-[#667085]">{r.label}</dt>
                        <dd className="min-w-0 break-words text-[#101828]">{r.value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

export function VersionDAddPatientModalWizard() {
    const { strings } = useVEDLocale();
    const w = strings.versionD.pages.wizard;
    const dash = strings.versionD.shared.dash;
    const { addPatientOpen, setAddPatientOpen, form, setForm, addPatient } = useVersionD();
    const [step, setStep] = useState(0);
    const [reasonTouched, setReasonTouched] = useState(false);
    const [contactTouched, setContactTouched] = useState(false);
    const lastNameInputRef = useRef<HTMLInputElement | null>(null);
    const emailInputRef = useRef<HTMLInputElement | null>(null);
    const priorityGroupRef = useRef<HTMLDivElement | null>(null);
    const notesTextAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const consentCheckboxRef = useRef<HTMLInputElement | null>(null);

    const hasContact = Boolean(form.phone.trim() || form.email.trim());
    const showContactError = contactTouched && !hasContact;
    const reasonMissing = !form.reason.trim();
    const showReasonError = reasonTouched && reasonMissing;

    useEffect(() => {
        if (!addPatientOpen) {
            setStep(0);
            setReasonTouched(false);
            setContactTouched(false);
        }
    }, [addPatientOpen]);

    useEffect(() => {
        if (hasContact) setContactTouched(false);
    }, [hasContact]);

    useEffect(() => {
        if (addPatientOpen && step === 4) {
            const id = requestAnimationFrame(() => priorityGroupRef.current?.focus());
            return () => cancelAnimationFrame(id);
        }
    }, [addPatientOpen, step]);

    useEffect(() => {
        if (addPatientOpen && step === 5) {
            const id = requestAnimationFrame(() => notesTextAreaRef.current?.focus());
            return () => cancelAnimationFrame(id);
        }
    }, [addPatientOpen, step]);

    useEffect(() => {
        if (!addPatientOpen || step !== 6) return;
        let cancelled = false;
        const id = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (!cancelled) consentCheckboxRef.current?.focus({ preventScroll: true });
            });
        });
        return () => {
            cancelled = true;
            cancelAnimationFrame(id);
        };
    }, [addPatientOpen, step]);

    const goNext = () => {
        if (step === 2 && !hasContact) {
            setContactTouched(true);
            return;
        }
        if (step === 3 && !form.reason.trim()) {
            setReasonTouched(true);
            return;
        }
        setStep((s) => Math.min(LAST_STEP, s + 1));
    };

    const handlePriorityKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            goNext();
            return;
        }
        const nextKeys = e.key === "ArrowRight" || e.key === "ArrowDown";
        const prevKeys = e.key === "ArrowLeft" || e.key === "ArrowUp";
        if (!nextKeys && !prevKeys) return;
        e.preventDefault();
        const idx = PRIORITIES.findIndex((p) => p.id === form.priority);
        const i = idx < 0 ? 0 : idx;
        const next = nextKeys ? (i + 1) % PRIORITIES.length : (i - 1 + PRIORITIES.length) % PRIORITIES.length;
        const id = PRIORITIES[next].id;
        setForm((f) => ({ ...f, priority: id }));
    };

    const goBack = () => setStep((s) => Math.max(0, s - 1));

    const submit = () => {
        if (!hasContact) {
            setContactTouched(true);
            setStep(2);
            return;
        }
        if (!form.reason.trim()) {
            setReasonTouched(true);
            setStep(3);
            return;
        }
        addPatient();
        setAddPatientOpen(false);
    };

    const progress = ((step + 1) / TOTAL_STEPS) * 100;

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (step === LAST_STEP) submit();
        else goNext();
    };

    const handleFormKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
        if (e.key !== "Enter") return;
        if (step === LAST_STEP) {
            if (
                e.target instanceof HTMLInputElement &&
                e.target.type === "checkbox" &&
                consentCheckboxRef.current === e.target
            ) {
                e.preventDefault();
                setForm((f) => ({ ...f, consentManagedManually: !f.consentManagedManually }));
            }
            return;
        }
        if (step === 5 && e.target instanceof HTMLTextAreaElement) {
            if (e.shiftKey) return;
            e.preventDefault();
            goNext();
        }
    };

    const handleFirstNameEnter = (e: KeyboardEvent) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        lastNameInputRef.current?.focus();
    };

    const handlePhoneEnter = (e: KeyboardEvent) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        const p = form.phone.trim();
        const em = form.email.trim();
        if (p || em) {
            goNext();
            return;
        }
        emailInputRef.current?.focus();
    };

    return (
        <ModalOverlay isDismissable isOpen={addPatientOpen} onOpenChange={setAddPatientOpen}>
            <Modal>
                <Dialog>
                    {({ close }) => (
                        <div className="w-full max-w-[960px] rounded-xl bg-[#F9FAFB] shadow-lg ring-1 ring-[#E2E5EB]">
                            <div className="flex items-start justify-between gap-4 border-b border-[#E4E7EC] p-5 sm:p-6">
                                <div className="min-w-0">
                                    <h2 className="text-xl font-semibold text-[#101828] sm:text-2xl">{w.title}</h2>
                                    <div className="mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-[#E4E7EC]">
                                        <div
                                            className="h-full rounded-full bg-[#0573D8] transition-[width] duration-300 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    color="tertiary"
                                    size="sm"
                                    iconLeading={XClose}
                                    aria-label={w.closeAria}
                                    excludeFromTabOrder
                                    className="size-10 shrink-0 rounded-lg p-0 text-[#667085] hover:bg-white"
                                    onClick={close}
                                />
                            </div>

                            <div className="flex flex-col gap-6 p-5 sm:gap-8 sm:p-8">
                                <FrozenBlock form={form} currentStep={step} w={w} dash={dash} />

                                <form
                                        className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-sm sm:p-6"
                                        onSubmit={handleFormSubmit}
                                        onKeyDown={handleFormKeyDown}
                                    >
                                        {step === 0 ? (
                                            <>
                                                <p className="text-sm font-medium text-[#0573D8]">{w.questionN(1, QUESTION_STEP_COUNT)}</p>
                                                <h3 className="mt-1 text-lg font-semibold text-[#101828] sm:text-xl">{w.step0Title}</h3>
                                                <p className="mt-2 text-sm text-[#667085]">{w.step0Hint}</p>
                                                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                                    <Input
                                                        label={w.firstName}
                                                        value={form.firstName}
                                                        onChange={(v) => setForm((f) => ({ ...f, firstName: v }))}
                                                        onKeyDown={handleFirstNameEnter}
                                                        placeholder={w.firstNamePh}
                                                        autoFocus
                                                    />
                                                    <Input
                                                        ref={lastNameInputRef}
                                                        label={w.lastName}
                                                        value={form.lastName}
                                                        onChange={(v) => setForm((f) => ({ ...f, lastName: v }))}
                                                        placeholder={w.lastNamePh}
                                                    />
                                                </div>
                                            </>
                                        ) : null}

                                        {step === 1 ? (
                                            <>
                                                <p className="text-sm font-medium text-[#0573D8]">{w.questionN(2, QUESTION_STEP_COUNT)}</p>
                                                <h3 className="mt-1 text-lg font-semibold text-[#101828] sm:text-xl">{w.step1Title}</h3>
                                                <Input
                                                    className="mt-5"
                                                    label={w.fileNumber}
                                                    value={form.fileNumber}
                                                    onChange={(v) => setForm((f) => ({ ...f, fileNumber: v }))}
                                                    placeholder={w.fileNumberPh}
                                                    autoFocus
                                                />
                                            </>
                                        ) : null}

                                        {step === 2 ? (
                                            <>
                                                <p className="text-sm font-medium text-[#0573D8]">{w.questionN(3, QUESTION_STEP_COUNT)}</p>
                                                <h3 className="mt-1 text-lg font-semibold text-[#101828] sm:text-xl">{w.step2Title}</h3>
                                                <p className="mt-2 text-sm leading-relaxed text-[#667085]">{w.step2Hint}</p>
                                                <p className="mt-1 text-xs text-[#98A2B3]">{w.step2Subhint}</p>
                                                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                                    <Input
                                                        label={w.mobileSms}
                                                        isInvalid={showContactError}
                                                        value={form.phone}
                                                        onChange={(v) => setForm((f) => ({ ...f, phone: formatNanpFromRaw(v) }))}
                                                        onBlur={() => setContactTouched(true)}
                                                        onKeyDown={handlePhoneEnter}
                                                        placeholder={w.mobilePh}
                                                        inputMode="tel"
                                                        autoComplete="tel"
                                                        autoFocus
                                                    />
                                                    <Input
                                                        ref={emailInputRef}
                                                        label={w.email}
                                                        isInvalid={showContactError}
                                                        value={form.email}
                                                        onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                                                        onBlur={() => setContactTouched(true)}
                                                        placeholder={w.emailPh}
                                                    />
                                                </div>
                                                <div className="mt-4 flex flex-col gap-2">
                                                    <div className="text-sm font-medium text-[#344054]">{w.commLanguage}</div>
                                                    <div className="flex flex-wrap gap-3">
                                                        {(
                                                            [
                                                                { id: "fr" as const, label: w.langFr },
                                                                { id: "en" as const, label: w.langEn },
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
                                                                        name="communicationLanguageWizard"
                                                                        value={opt.id}
                                                                        checked={selected}
                                                                        onChange={() => setForm((f) => ({ ...f, communicationLanguage: opt.id }))}
                                                                    />
                                                                    {opt.label}
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                {showContactError ? (
                                                    <p className="mt-3 text-sm font-medium text-[#B42318]">{w.contactError}</p>
                                                ) : null}
                                            </>
                                        ) : null}

                                        {step === 3 ? (
                                            <>
                                                <p className="text-sm font-medium text-[#0573D8]">{w.questionN(4, QUESTION_STEP_COUNT)}</p>
                                                <h3 className="mt-1 text-lg font-semibold text-[#101828] sm:text-xl">{w.step3Title}</h3>
                                                <Input
                                                    className="mt-5"
                                                    label={w.reason}
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
                                                    autoFocus
                                                />
                                            </>
                                        ) : null}

                                        {step === 4 ? (
                                            <>
                                                <p className="text-sm font-medium text-[#0573D8]">{w.questionN(5, QUESTION_STEP_COUNT)}</p>
                                                <h3
                                                    id="version-d-priority-heading"
                                                    className="mt-1 text-lg font-semibold text-[#101828] sm:text-xl"
                                                >
                                                    {w.step4Title}
                                                </h3>
                                                <p className="mt-2 text-xs text-[#98A2B3]">{w.step4Hint}</p>
                                                <div
                                                    ref={priorityGroupRef}
                                                    role="radiogroup"
                                                    aria-labelledby="version-d-priority-heading"
                                                    aria-orientation="horizontal"
                                                    tabIndex={0}
                                                    onKeyDownCapture={handlePriorityKeyDown}
                                                    className={cx(
                                                        "mt-5 grid gap-3 outline-none sm:grid-cols-3",
                                                        "focus-visible:ring-2 focus-visible:ring-[#0573D8] focus-visible:ring-offset-2",
                                                    )}
                                                >
                                                    {PRIORITIES.map((opt) => {
                                                        const selected = form.priority === opt.id;
                                                        return (
                                                            <label
                                                                key={opt.id}
                                                                className={cx(
                                                                    "flex cursor-pointer flex-col rounded-xl border p-4 text-left transition",
                                                                    selected
                                                                        ? "border-[#0573D8] bg-[#E8F7FE] ring-1 ring-[#8ED1FE]"
                                                                        : "border-[#E4E7EC] bg-[#FAFBFC] hover:border-[#D0D5DD]",
                                                                )}
                                                            >
                                                                <span
                                                                    className={cx(
                                                                        "inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
                                                                        opt.pill,
                                                                        opt.pillBorder,
                                                                        opt.pillText,
                                                                    )}
                                                                >
                                                                    {opt.label}
                                                                </span>
                                                                <span className="mt-2 text-xs leading-snug text-[#667085]">{priorityHint(opt.id, w)}</span>
                                                                <input
                                                                    type="radio"
                                                                    name="version-d-priority-wizard"
                                                                    className="sr-only"
                                                                    tabIndex={-1}
                                                                    checked={selected}
                                                                    onChange={() => setForm((f) => ({ ...f, priority: opt.id }))}
                                                                />
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        ) : null}

                                        {step === 5 ? (
                                            <>
                                                <p className="text-sm font-medium text-[#0573D8]">{w.questionN(6, QUESTION_STEP_COUNT)}</p>
                                                <h3 className="mt-1 text-lg font-semibold text-[#101828] sm:text-xl">{w.step5Title}</h3>
                                                <p className="mt-2 text-xs text-[#98A2B3]">{w.step5Hint}</p>
                                                <TextArea
                                                    className="mt-5"
                                                    label={w.notes}
                                                    textAreaRef={notesTextAreaRef}
                                                    value={form.notes}
                                                    onChange={(v) => setForm((f) => ({ ...f, notes: v }))}
                                                    placeholder={w.notesPh}
                                                    rows={4}
                                                />
                                            </>
                                        ) : null}

                                        {step === 6 ? (
                                            <>
                                                <p className="text-sm font-medium text-[#0573D8]">{w.questionN(7, QUESTION_STEP_COUNT)}</p>
                                                <h3 className="mt-1 text-lg font-semibold text-[#101828] sm:text-xl">{w.step6Title}</h3>
                                                <p className="mt-2 text-sm text-[#667085]">{w.step6Hint}</p>
                                                <p className="mt-1 text-xs text-[#98A2B3]">{w.step6Subhint}</p>
                                                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-[#E4E7EC] bg-[#FAFBFC] p-4">
                                                    <input
                                                        ref={consentCheckboxRef}
                                                        type="checkbox"
                                                        checked={form.consentManagedManually}
                                                        onChange={(e) => setForm((f) => ({ ...f, consentManagedManually: e.target.checked }))}
                                                        className="mt-1 size-4 rounded border-[#D0D5DD]"
                                                    />
                                                    <span className="text-sm font-medium text-[#344054]">{w.manualConsentLabel}</span>
                                                </label>
                                            </>
                                        ) : null}

                                        <div className="mt-8 flex flex-wrap items-center gap-3">
                                            {step < LAST_STEP ? (
                                                <Button
                                                    type="submit"
                                                    size="md"
                                                    className="bg-[#0573D8] text-white hover:bg-[#0460B8]"
                                                    iconTrailing={ArrowRight}
                                                >
                                                    {w.continue}
                                                </Button>
                                            ) : (
                                                <Button type="submit" size="md" className="bg-[#0573D8] text-white hover:bg-[#0460B8]">
                                                    {w.submitQueue}
                                                </Button>
                                            )}
                                            {step > 0 ? (
                                                <Button type="button" color="secondary" size="md" iconLeading={ArrowLeft} onClick={goBack}>
                                                    {w.back}
                                                </Button>
                                            ) : null}
                                            <Button type="button" color="tertiary" size="md" onClick={() => setAddPatientOpen(false)}>
                                                {w.cancel}
                                            </Button>
                                        </div>
                                </form>
                            </div>
                        </div>
                    )}
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}
