import { useMemo } from "react";
import { Link, Navigate, useLocation } from "react-router";
import { MarkerPin01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { BRAND_POWERED_BY_AKINOX, BRAND_QUEBEC_LOGO } from "@/constants/brand-assets";
import { useVersionB } from "@/pages/version-b/version-b-context";
import type { Patient } from "@/pages/version-b/version-b-patient-card";

/** Demo: same site as sidebar (Jewish General / CIUSSS West-Central Montreal). */
const EMERGENCY_SITE = {
    label: "Urgence — Hôpital général juif",
    line: "3750, ch. de la Côte-Sainte-Catherine, Montréal  H3T 1E2",
} as const;

function preferredContactHeadline(p: Patient): string {
    switch (p.preferredCommunication) {
        case "sms":
            return "message texto (SMS)";
        case "email":
            return "courriel";
    }
}

function PreferredContactDetail({ patient }: { patient: Patient }) {
    switch (patient.preferredCommunication) {
        case "sms":
            return (
                <p className="mt-3 text-sm leading-relaxed text-[#475467]">
                    Les précisions communiquées porteront notamment sur les modalités de rappel et la transmission du lien de consultation.
                </p>
            );
        case "email":
            return (
                <p className="mt-3 text-sm leading-relaxed text-[#475467]">
                    Les précisions communiquées porteront notamment sur la confirmation des coordonnées et la transmission du lien de consultation.
                </p>
            );
    }
}

type LocationState = { patientId?: string };

export function VersionBPatientConsentNextPage() {
    const { patients } = useVersionB();
    const location = useLocation();
    const state = location.state as LocationState | null;

    const patientId = state?.patientId;

    const patient = useMemo(
        () => (patientId ? patients.find((x) => x.id === patientId) ?? null : null),
        [patients, patientId],
    );

    if (!patientId) {
        return <Navigate to="/version-b/patient-consent" replace />;
    }

    const headline = patient ? preferredContactHeadline(patient) : null;

    return (
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-[#F9FAFB]">
            <div className="mx-auto flex w-full max-w-[680px] flex-col px-4 py-8 pb-16">
                <header className="mb-6 text-center">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-[#5E6C84]">Prototype — perspective usager</p>
                    <h1 className="mt-1 text-lg font-semibold tracking-tight text-[#172B4D]">Suite du processus</h1>
                </header>

                <article className="overflow-hidden rounded-2xl border border-[#E4E6EA] bg-white shadow-[0px_4px_24px_rgba(16,24,40,0.06)]">
                    <div className="border-b border-[#EEF0F4] bg-white px-6 py-5">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-6">
                                <div className="flex min-w-0 items-center gap-3">
                                    <img
                                        src={BRAND_QUEBEC_LOGO}
                                        alt="Gouvernement du Québec"
                                        className="h-8 w-auto max-w-[min(100%,220px)] shrink-0 object-contain object-left sm:h-9"
                                    />
                                </div>
                                <div className="min-w-0 sm:pb-0.5">
                                    <p className="text-lg font-semibold leading-snug text-[#082244]">Plateforme provinciale de soins virtuels</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-8 sm:px-8">
                        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100">
                            <svg className="size-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h2 className="text-center text-xl font-semibold tracking-tight text-[#172B4D]">
                            Confirmation de l’enregistrement de votre consentement
                        </h2>

                        {patient && headline ? (
                            <>
                                <p className="mt-4 text-center text-[15px] leading-relaxed text-[#475467]">
                                    Bonjour, <strong>{patient.name}</strong>,
                                </p>
                                <div className="mt-6 rounded-xl border border-[#E4E6EA] bg-[#F9FAFB] px-5 py-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-[#5E6C84]">Étape suivante</p>
                                    <p className="mt-3 text-[15px] leading-relaxed text-[#172B4D]">
                                        Conformément aux modalités du service, l’établissement communiquera avec vous par le biais suivant :{" "}
                                        <strong>{headline}</strong>. Cette communication permettra d’assurer la poursuite de votre parcours de soins
                                        virtuels.
                                    </p>
                                    <PreferredContactDetail patient={patient} />
                                </div>
                            </>
                        ) : (
                            <p className="mt-4 text-center text-[15px] leading-relaxed text-[#475467]">
                                Votre consentement a été enregistré. L’établissement communiquera avec vous selon le mode de correspondance figurant à
                                votre dossier.
                            </p>
                        )}

                        <div className="mt-8 flex gap-2 rounded-xl border border-[#E4E6EA] bg-[#F9FAFB] px-4 py-3">
                            <MarkerPin01 className="mt-0.5 size-4 shrink-0 text-[#5E6C84]" strokeWidth={1.75} aria-hidden />
                            <div className="min-w-0 text-sm leading-snug text-[#475467]">
                                <span className="font-medium text-[#172B4D]">{EMERGENCY_SITE.label}</span>
                                <span className="text-[#98A2B3]"> · </span>
                                <span>{EMERGENCY_SITE.line}</span>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-col items-center gap-3">
                            <Button size="lg" className="w-full bg-[#0573d8] text-white hover:bg-[#0460b8] sm:w-auto" href="/version-b">
                                Retour à l’interface de démonstration
                            </Button>
                            <p className="max-w-md text-center text-xs text-[#5E6C84]">
                                Dans un contexte de production, la présente page correspondrait à la fin du parcours sur l’appareil de l’usager; ici, le
                                bouton permet à l’opérateur de la démonstration de retourner à la liste de travail.
                            </p>
                        </div>
                    </div>

                    <footer className="border-t border-[#EEF0F4] bg-[#FAFBFC] px-6 py-4 text-center">
                        <Link to="/version-b" className="inline-flex justify-center">
                            <img
                                src={BRAND_POWERED_BY_AKINOX}
                                alt="Propulsé par Akinox"
                                className="h-[34px] w-auto max-w-full object-contain"
                            />
                        </Link>
                    </footer>
                </article>
            </div>
        </main>
    );
}
