import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { MarkerPin01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { BRAND_POWERED_BY_AKINOX, BRAND_QUEBEC_LOGO } from "@/constants/brand-assets";
import { useVEDLocale } from "@/lib/ved-locale";
import type { VersionCdPagesFlows } from "@/lib/ved-app-strings/version-cd-pages-flows";
import { buildCanonicalPatientProcessUrl } from "@/pages/version-cd/patient-request-routing";
import { ExitDistanceServiceConfirmModal } from "@/pages/version-d/version-d-exit-distance-confirm-modal";
import { useVersionD } from "@/pages/version-d/version-d-context";
import type { Patient } from "@/pages/version-d/version-d-shared";
import { fullName } from "@/pages/version-d/version-d-shared";

const PATIENT_PROCESS_BASE = "/version-d" as const;

function preferredContactHeadline(p: Patient, nx: { headlineSmsEmail: string; headlineSms: string; headlineEmail: string }): string {
    const hasPhone = Boolean(p.phone?.trim());
    const hasEmail = Boolean(p.email?.trim());
    if (hasPhone && hasEmail) return nx.headlineSmsEmail;
    if (hasPhone) return nx.headlineSms;
    return nx.headlineEmail;
}

function PreferredContactDetail({
    patient,
    nx,
}: {
    patient: Patient;
    nx: VersionCdPagesFlows["consentNext"];
}) {
    const hasPhone = Boolean(patient.phone?.trim());
    const hasEmail = Boolean(patient.email?.trim());

    if (hasPhone && hasEmail) {
        return <p className="mt-3 text-sm leading-relaxed text-[#475467]">{nx.detailBoth}</p>;
    }
    if (hasPhone) {
        return <p className="mt-3 text-sm leading-relaxed text-[#475467]">{nx.detailPhone}</p>;
    }
    return <p className="mt-3 text-sm leading-relaxed text-[#475467]">{nx.detailEmail}</p>;
}

type LocationState = { patientId?: string };

export function VersionDPatientConsentNextPage() {
    const { strings } = useVEDLocale();
    const pub = strings.versionD.pages.publicChrome;
    const nx = strings.versionD.pages.consentNext;

    const { patients, withdrawConsent } = useVersionD();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState | null;
    const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

    const patientId = state?.patientId;

    const patient = useMemo(
        () => (patientId ? patients.find((x) => x.id === patientId) ?? null : null),
        [patients, patientId],
    );

    useEffect(() => {
        if (!patientId?.trim()) return;
        const p = patients.find((x) => x.id === patientId) ?? null;
        if (!p) return;
        if (p.status === "waiting") return;
        const target = buildCanonicalPatientProcessUrl(PATIENT_PROCESS_BASE, patientId, p);
        const here = `${location.pathname}${location.search}`;
        if (target !== here) navigate(target, { replace: true });
    }, [patientId, patients, location.pathname, location.search, navigate]);

    if (!patientId) {
        return <Navigate to="/version-d/patient-consent" replace />;
    }

    const headline = patient ? preferredContactHeadline(patient, nx) : null;
    const canWithdrawConsent = Boolean(patient?.status === "waiting" && !patient.consentManagedManually);

    return (
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-[#F9FAFB]">
            <div className="mx-auto flex w-full max-w-[680px] flex-col px-4 py-8 pb-16">
                <header className="mb-6 text-center">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-[#5E6C84]">{pub.prototypeBadge}</p>
                    <h1 className="mt-1 text-lg font-semibold tracking-tight text-[#172B4D]">{nx.title}</h1>
                </header>

                <article className="overflow-hidden rounded-2xl border border-[#E4E6EA] bg-white shadow-[0px_4px_24px_rgba(16,24,40,0.06)]">
                    <div className="border-b border-[#EEF0F4] bg-white px-6 py-5">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-6">
                                <div className="flex min-w-0 items-center gap-3">
                                    <img
                                        src={BRAND_QUEBEC_LOGO}
                                        alt={pub.govQuebecAlt}
                                        className="h-8 w-auto max-w-[min(100%,220px)] shrink-0 object-contain object-left sm:h-9"
                                    />
                                </div>
                                <div className="min-w-0 sm:pb-0.5">
                                    <p className="text-lg font-semibold leading-snug text-[#082244]">{strings.versionD.pages.consentC.cardTitle}</p>
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

                        <h2 className="text-center text-xl font-semibold tracking-tight text-[#172B4D]">{nx.confirmationHeading}</h2>

                        {patient && headline ? (
                            <>
                                <p className="mt-4 text-center text-[15px] leading-relaxed text-[#475467]">
                                    {nx.hello} <strong>{fullName(patient)}</strong>,
                                </p>
                                <div className="mt-6 rounded-xl border border-[#E4E6EA] bg-[#F9FAFB] px-5 py-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-[#5E6C84]">{nx.nextStepLabel}</p>
                                    <p className="mt-3 text-[15px] leading-relaxed text-[#172B4D]">
                                        {nx.nextStepWithChannelPrefix}
                                        <strong>{headline}</strong>
                                        {nx.nextStepWithChannelSuffix}
                                    </p>
                                    <PreferredContactDetail patient={patient} nx={nx} />
                                </div>
                            </>
                        ) : (
                            <p className="mt-4 text-center text-[15px] leading-relaxed text-[#475467]">{nx.fallbackNoChannel}</p>
                        )}

                        <div className="mt-8 flex gap-2 rounded-xl border border-[#E4E6EA] bg-[#F9FAFB] px-4 py-3">
                            <MarkerPin01 className="mt-0.5 size-4 shrink-0 text-[#5E6C84]" strokeWidth={1.75} aria-hidden />
                            <div className="min-w-0 text-sm leading-snug text-[#475467]">
                                <span className="font-medium text-[#172B4D]">{nx.emergencySiteLabel}</span>
                                <span className="text-[#98A2B3]"> · </span>
                                <span>{nx.emergencySiteLine}</span>
                            </div>
                        </div>

                        {canWithdrawConsent ? (
                            <div className="mt-10 flex flex-col items-center gap-3">
                                <Button
                                    color="secondary-destructive"
                                    size="md"
                                    className="w-full sm:w-auto"
                                    onClick={() => setWithdrawModalOpen(true)}
                                >
                                    {nx.withdraw}
                                </Button>
                                <p className="max-w-md text-center text-xs text-[#5E6C84]">{nx.withdrawHint}</p>
                            </div>
                        ) : null}
                    </div>

                    <footer className="border-t border-[#EEF0F4] bg-[#FAFBFC] px-6 py-4 text-center">
                        <Link to="/version-d" className="inline-flex justify-center">
                            <img
                                src={BRAND_POWERED_BY_AKINOX}
                                alt={pub.poweredByAkinoxAlt}
                                className="h-[34px] w-auto max-w-full object-contain"
                            />
                        </Link>
                    </footer>
                </article>
            </div>

            <ExitDistanceServiceConfirmModal
                isOpen={withdrawModalOpen}
                onOpenChange={setWithdrawModalOpen}
                variant="withdraw"
                onConfirm={() => {
                    withdrawConsent(patientId);
                    setWithdrawModalOpen(false);
                    navigate("/version-d", { replace: true });
                }}
            />
        </main>
    );
}
