import type { ReactNode } from "react";
import {
    ArrowRight,
    BellRinging01,
    Building07,
    Check,
    Clipboard,
    Clock,
    HomeSmile,
    Phone01,
    Plus,
    User01,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

type Step = {
    n: number;
    title: string;
    body: string;
    illustration: ReactNode;
};

function StepIllustrationShell({ className, children }: { className?: string; children: ReactNode }) {
    return (
        <div
            className={cx(
                "relative flex h-[140px] w-full items-center justify-center overflow-hidden rounded-2xl border border-[#E4E7EC] bg-gradient-to-b from-[#F8FAFC] to-[#EFF8FF]",
                className,
            )}
            aria-hidden
        >
            {children}
        </div>
    );
}

function IllustrationStep1() {
    return (
        <StepIllustrationShell>
            <div className="flex items-end gap-3">
                <div className="relative rounded-xl border border-[#D0D5DD] bg-white px-3 py-2 shadow-[0px_1px_2px_rgba(16,24,40,0.06)]">
                    <div className="flex items-center gap-2">
                        <User01 className="size-5 text-[#667085]" strokeWidth={1.75} />
                        <span className="text-[11px] font-medium text-[#344054]">Patient</span>
                    </div>
                    <div className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full bg-[#0573D8] text-white shadow-md ring-2 ring-white">
                        <Plus className="size-4" strokeWidth={2} />
                    </div>
                </div>
                <div className="relative rounded-xl border border-[#D1FADF] bg-[#ECFDF3] px-3 py-2.5 shadow-sm">
                    <Clipboard className="size-7 text-[#027A48]" strokeWidth={1.75} />
                    <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-white ring-1 ring-[#D1FADF]">
                        <Check className="size-3 text-emerald-600" strokeWidth={2.5} />
                    </span>
                </div>
            </div>
        </StepIllustrationShell>
    );
}

function IllustrationStep2() {
    return (
        <StepIllustrationShell>
            <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-4">
                    <HomeSmile className="size-12 text-[#0573D8]/85" strokeWidth={1.5} />
                    <Phone01 className="size-9 text-[#475467]" strokeWidth={1.75} />
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-[#5E6C84] ring-1 ring-[#E4E7EC]">
                    <Clock className="size-3.5 text-[#98A2B3]" strokeWidth={2} />
                    Attente à distance
                </div>
            </div>
        </StepIllustrationShell>
    );
}

function IllustrationStep3() {
    return (
        <StepIllustrationShell>
            <div className="flex items-center gap-2 sm:gap-4">
                <div className="relative rounded-2xl border border-[#D0D5DD] bg-white p-3 shadow-sm">
                    <Phone01 className="size-9 text-[#344054]" strokeWidth={1.75} />
                    <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-[#E8F7FE] ring-2 ring-white">
                        <BellRinging01 className="size-3.5 text-[#0573D8]" strokeWidth={2} />
                    </span>
                </div>
                <ArrowRight className="size-6 shrink-0 text-[#98A2B3]" strokeWidth={1.75} />
                <Building07 className="size-11 shrink-0 text-[#027A48]" strokeWidth={1.5} />
            </div>
        </StepIllustrationShell>
    );
}

const STEPS: Step[] = [
    {
        n: 1,
        title: "Ajouter un patient",
        body: "👉 Inscrivez un patient admissible et confirmez son consentement pour l’attente à distance.",
        illustration: <IllustrationStep1 />,
    },
    {
        n: 2,
        title: "Attente à distance",
        body: "👉 Le patient attend de chez lui en conservant sa place dans la file.",
        illustration: <IllustrationStep2 />,
    },
    {
        n: 3,
        title: "Rappel du patient",
        body: "👉 Lorsqu’il est temps de revenir, envoyez une invitation par SMS ou courriel : le patient confirme son retour depuis le message avant de se présenter.",
        illustration: <IllustrationStep3 />,
    },
];

type Props = {
    onAddPatient: () => void;
};

export function VersionCWorklistEmptyState({ onAddPatient }: Props) {
    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#F9FAFB]">
            <div className="mx-auto flex w-full max-w-5xl flex-col px-6 py-10 sm:py-14">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#D1E9FF] bg-[#EFF8FF] px-3 py-1 text-xs font-semibold text-[#082244]">
                        <Building07 className="size-3.5 text-[#0573D8]" strokeWidth={2} aria-hidden />
                        Centre de rappel
                    </div>
                    <h2 className="mt-5 text-balance text-2xl font-semibold tracking-tight text-[#101828] sm:text-3xl">
                        Bienvenue dans le Centre de rappel
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-pretty text-base leading-relaxed text-[#475467] sm:text-lg">
                        Gérez l’attente des patients à distance et faites-les revenir au bon moment, sans surcharger l’urgence.
                    </p>
                </div>

                <div className="mt-12 sm:mt-14">
                    <p className="text-center text-xs font-semibold uppercase tracking-[0.12em] text-[#98A2B3]">Fonctionnement en 3 étapes</p>
                    <div className="mt-8 grid gap-6 lg:grid-cols-3">
                        {STEPS.map((step) => (
                            <article
                                key={step.n}
                                className="flex flex-col rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E8F7FE] text-sm font-semibold text-[#0573D8] ring-1 ring-[#BEDFFE]/80">
                                        {step.n}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-lg font-semibold text-[#101828]">{step.title}</h3>
                                        <p className="mt-2 text-sm leading-relaxed text-[#475467]">{step.body}</p>
                                    </div>
                                </div>
                                <div className="mt-5">{step.illustration}</div>
                            </article>
                        ))}
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center gap-3 sm:mt-14">
                    <Button
                        size="lg"
                        iconLeading={Plus}
                        className="bg-[#0573D8] text-white shadow-[0px_1px_2px_rgba(16,24,40,0.05)] hover:bg-[#0460B8]"
                        onClick={onAddPatient}
                    >
                        Ajouter un premier patient
                    </Button>
                    <p className="max-w-md text-center text-sm text-[#667085]">Réservé aux patients admissibles à l’attente à distance.</p>
                </div>
            </div>
        </div>
    );
}
