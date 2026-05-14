import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/base/buttons/button";
import { Select } from "@/components/base/select/select";
import { BRAND_POWERED_BY_AKINOX, BRAND_QUEBEC_LOGO } from "@/constants/brand-assets";
import { useVEDLocale } from "@/lib/ved-locale";
import { buildCanonicalPatientProcessUrl } from "@/pages/version-cd/patient-request-routing";
import {
    ExitDistanceServiceConfirmModal,
    type ExitDistanceVariant,
} from "@/pages/version-c/version-c-exit-distance-confirm-modal";
import { useVersionC } from "@/pages/version-c/version-c-context";
import { fullName } from "@/pages/version-c/version-c-shared";

const PATIENT_PROCESS_BASE = "/version-c" as const;

function formatExpiryDate(ts: number, locale: string, dateFallback: string) {
    try {
        const tag = locale === "en" ? "en-CA" : "fr-CA";
        return new Intl.DateTimeFormat(tag, { dateStyle: "long", timeStyle: "short" }).format(new Date(ts + 7 * 24 * 60 * 60 * 1000));
    } catch {
        return dateFallback;
    }
}

type ExitModalState = { variant: ExitDistanceVariant; patientId: string } | null;

export function VersionCPatientConsentPage() {
    const { strings, locale } = useVEDLocale();
    const pub = strings.versionC.pages.publicChrome;
    const consentC = strings.versionC.pages.consentC;
    const consentD = strings.versionC.pages.consentD;
    const consentNext = strings.versionC.pages.consentNext;

    const { patients, acceptConsent, refuseConsent, withdrawConsent } = useVersionC();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [exitModal, setExitModal] = useState<ExitModalState>(null);

    const consentPatients = useMemo(
        () => patients.filter((p) => p.status === "consentPending").sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id)),
        [patients],
    );

    const patientIdFromQuery = searchParams.get("patientId");
    const waitingWithdrawPatient = useMemo(() => {
        if (!patientIdFromQuery) return null;
        const p = patients.find((x) => x.id === patientIdFromQuery);
        if (!p || p.status !== "waiting" || p.consentManagedManually) return null;
        return p;
    }, [patients, patientIdFromQuery]);

    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        const fromQuery = searchParams.get("patientId");
        if (fromQuery && consentPatients.some((p) => p.id === fromQuery)) {
            setSelectedId(fromQuery);
            return;
        }

        if (consentPatients.length === 0) {
            setSelectedId(null);
            return;
        }
        setSelectedId((prev) => {
            if (prev && consentPatients.some((p) => p.id === prev)) return prev;
            return consentPatients[0]?.id ?? null;
        });
    }, [consentPatients, searchParams]);

    const selected = useMemo(
        () => (selectedId ? consentPatients.find((p) => p.id === selectedId) ?? null : null),
        [consentPatients, selectedId],
    );

    const showWithdrawOnly = consentPatients.length === 0 && waitingWithdrawPatient !== null;

    useEffect(() => {
        const pid = searchParams.get("patientId");
        if (!pid?.trim()) return;
        const p = patients.find((x) => x.id === pid) ?? null;
        const target = buildCanonicalPatientProcessUrl(PATIENT_PROCESS_BASE, pid, p);
        const here = `${location.pathname}${location.search}`;
        if (target !== here) navigate(target, { replace: true });
    }, [searchParams, patients, navigate, location.pathname, location.search]);

    return (
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-[#F9FAFB]">
            <div className="mx-auto flex w-full max-w-[680px] flex-col px-4 py-8 pb-16">
                <header className="mb-6 text-center">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-[#5E6C84]">{pub.prototypeBadge}</p>
                    <h1 className="mt-1 text-lg font-semibold tracking-tight text-[#172B4D]">{consentD.pageHeading}</h1>
                </header>

                {consentPatients.length === 0 && !showWithdrawOnly ? (
                    <div className="rounded-2xl border border-[#E4E6EA] bg-white p-10 text-center shadow-[0px_4px_24px_rgba(16,24,40,0.06)]">
                        <p className="text-[15px] leading-relaxed text-[#475467]">{consentC.emptyBody}</p>
                    </div>
                ) : showWithdrawOnly && waitingWithdrawPatient ? (
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
                                    <div className="h-px w-full bg-[#E4E6EA] sm:hidden" aria-hidden />
                                    <div className="min-w-0 sm:pb-0.5">
                                        <p className="text-lg font-semibold leading-snug text-[#082244]">{consentC.cardTitle}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-6 sm:px-8 sm:py-8">
                            <p className="text-[15px] leading-relaxed text-[#172B4D]">
                                {consentC.helloPrefix} <strong>{fullName(waitingWithdrawPatient)}</strong>,
                            </p>
                            <p className="mt-4 text-[15px] leading-relaxed text-[#172B4D]">{consentC.withdrawP1}</p>
                            <p className="mt-4 text-sm text-[#5E6C84]">{consentC.withdrawP2}</p>
                            <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <Button
                                    color="secondary-destructive"
                                    size="lg"
                                    className="w-full sm:w-auto"
                                    onClick={() =>
                                        setExitModal({ variant: "withdraw", patientId: waitingWithdrawPatient.id })
                                    }
                                >
                                    {consentC.withdrawButton}
                                </Button>
                            </div>
                        </div>
                        <footer className="border-t border-[#EEF0F4] bg-[#FAFBFC] px-6 py-4 text-center">
                            <Link to="/version-c" className="inline-flex justify-center">
                                <img
                                    src={BRAND_POWERED_BY_AKINOX}
                                    alt={pub.poweredByAkinoxAlt}
                                    className="h-[34px] w-auto max-w-full object-contain"
                                />
                            </Link>
                        </footer>
                    </article>
                ) : (
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
                                    <div className="h-px w-full bg-[#E4E6EA] sm:hidden" aria-hidden />
                                    <div className="min-w-0 sm:pb-0.5">
                                        <p className="text-lg font-semibold leading-snug text-[#082244]">{consentC.cardTitle}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-6 sm:px-8 sm:py-8">
                            {consentPatients.length > 1 && (
                                <div className="mb-6 max-w-md">
                                    <Select
                                        label={consentC.selectChartLabel}
                                        selectedKey={selectedId ?? undefined}
                                        onSelectionChange={(key) => setSelectedId(String(key))}
                                    >
                                        {consentPatients.map((p) => (
                                            <Select.Item key={p.id} id={p.id}>
                                                {fullName(p)} — {p.fileNumber}
                                            </Select.Item>
                                        ))}
                                    </Select>
                                </div>
                            )}

                            {selected ? (
                                <>
                                    <div className="space-y-4 border-b border-[#EEF0F4] pb-6">
                                        <p className="text-[15px] leading-relaxed text-[#172B4D]">
                                            {consentC.helloPrefix} <strong>{fullName(selected)}</strong>,
                                        </p>
                                        {consentC.bodyParagraphs.map((para, i) => (
                                            <p key={i} className="mt-4 text-[15px] leading-relaxed text-[#172B4D]">
                                                {para}
                                            </p>
                                        ))}
                                    </div>

                                    <div className="mt-8 border-t border-[#EEF0F4] pt-6">
                                        <p className="text-sm italic leading-relaxed text-[#082244]">
                                            {consentC.privacyBeforeLink}
                                            <a href="#" className="font-medium text-[#0573d8] underline underline-offset-2">
                                                {consentC.privacyLink}
                                            </a>
                                            {consentC.privacyAfterLink}
                                        </p>
                                        <p className="mt-4 text-sm text-[#5E6C84]">
                                            {consentC.validityPrefix}
                                            <span className="font-medium text-[#172B4D]">
                                                {formatExpiryDate(selected.createdAt, locale, consentNext.dateFallback7d)}
                                            </span>
                                            {consentC.validitySuffix}
                                        </p>
                                    </div>

                                    <div className="mt-8 flex flex-col gap-4">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                                            <Button
                                                size="lg"
                                                className="w-full bg-[#0573d8] text-white hover:bg-[#0460b8] sm:w-auto sm:min-w-[200px]"
                                                onClick={() => {
                                                    const patientId = selected.id;
                                                    acceptConsent(patientId);
                                                    navigate("/version-c/patient-consent/next", { state: { patientId } });
                                                }}
                                            >
                                                {consentC.accept}
                                            </Button>
                                            <Button
                                                color="secondary-destructive"
                                                size="lg"
                                                className="w-full sm:w-auto sm:min-w-[200px]"
                                                onClick={() => setExitModal({ variant: "refuse", patientId: selected.id })}
                                            >
                                                {consentC.refuse}
                                            </Button>
                                        </div>
                                        <p className="text-center text-xs text-[#5E6C84] sm:text-left">{consentC.footnoteAfterAccept}</p>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <footer className="border-t border-[#EEF0F4] bg-[#FAFBFC] px-6 py-4 text-center">
                            <Link to="/version-c" className="inline-flex justify-center">
                                <img
                                    src={BRAND_POWERED_BY_AKINOX}
                                    alt={pub.poweredByAkinoxAlt}
                                    className="h-[34px] w-auto max-w-full object-contain"
                                />
                            </Link>
                        </footer>
                    </article>
                )}
            </div>

            <ExitDistanceServiceConfirmModal
                isOpen={exitModal !== null}
                onOpenChange={(open) => {
                    if (!open) setExitModal(null);
                }}
                variant={exitModal?.variant ?? "refuse"}
                onConfirm={() => {
                    if (!exitModal) return;
                    if (exitModal.variant === "refuse") refuseConsent(exitModal.patientId);
                    else if (exitModal.variant === "withdraw") withdrawConsent(exitModal.patientId);
                    setExitModal(null);
                    navigate("/version-c", { replace: true });
                }}
            />
        </main>
    );
}
