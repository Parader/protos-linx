import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/base/buttons/button";
import { BRAND_POWERED_BY_AKINOX, BRAND_QUEBEC_LOGO } from "@/constants/brand-assets";
import { useVEDLocale } from "@/lib/ved-locale";
import { buildCanonicalPatientProcessUrl } from "@/pages/version-cd/patient-request-routing";
import { ExitDistanceServiceConfirmModal } from "@/pages/version-d/version-d-exit-distance-confirm-modal";
import { useVersionD } from "@/pages/version-d/version-d-context";
import { fullName, type PatientStatus } from "@/pages/version-d/version-d-shared";

const PATIENT_PROCESS_BASE = "/version-d" as const;

type PageMode =
    | { kind: "ready"; status: "recall" | "arrived" }
    | { kind: "invalid_id" }
    | { kind: "unknown_patient" }
    | { kind: "completed_archived" }
    | { kind: "ineligible"; status: PatientStatus }
    | { kind: "done_confirm" }
    | { kind: "done_cancel" };

function resolveMode(patientId: string, status: PatientStatus | null): PageMode {
    if (!patientId.trim()) return { kind: "invalid_id" };
    if (!status) return { kind: "unknown_patient" };
    if (status === "recall" || status === "arrived") return { kind: "ready", status };
    if (status === "completed") return { kind: "completed_archived" };
    return { kind: "ineligible", status };
}

export function VersionDConfirmReturnPage() {
    const { strings } = useVEDLocale();
    const location = useLocation();
    const pub = strings.versionD.pages.publicChrome;
    const cr = strings.versionD.pages.confirmReturn;

    const { patients, confirmReturn, cancelQueueRequestFromPatient } = useVersionD();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [finished, setFinished] = useState<"confirm" | "cancel" | null>(null);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);

    const patientId = searchParams.get("patientId") ?? "";
    const patient = useMemo(
        () => (patientId ? (patients.find((p) => p.id === patientId) ?? null) : null),
        [patients, patientId],
    );

    const mode: PageMode = useMemo(() => {
        if (finished === "confirm") return { kind: "done_confirm" };
        if (finished === "cancel") return { kind: "done_cancel" };
        return resolveMode(patientId, patient?.status ?? null);
    }, [patientId, patient, finished]);

    const canCancelFromPatient =
        Boolean(patientId) && (patient?.status === "recall" || patient?.status === "arrived" || finished === "confirm");

    const onConfirm = () => {
        if (!patientId || patient?.status !== "recall") return;
        confirmReturn(patientId);
        setFinished("confirm");
    };

    const requestCancel = () => {
        if (!canCancelFromPatient) return;
        setCancelModalOpen(true);
    };

    const finalizeCancel = () => {
        if (!patientId) return;
        cancelQueueRequestFromPatient(patientId);
        setFinished("cancel");
        setCancelModalOpen(false);
    };

    useEffect(() => {
        if (!patientId.trim()) return;
        const target = buildCanonicalPatientProcessUrl(PATIENT_PROCESS_BASE, patientId, patient);
        const here = `${location.pathname}${location.search}`;
        if (target !== here) navigate(target, { replace: true });
    }, [patientId, patient, navigate, location.pathname, location.search]);

    return (
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-[#F9FAFB]">
            <div className="mx-auto flex w-full max-w-[680px] flex-col px-4 py-8 pb-16">
                <header className="mb-6 text-center">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-[#5E6C84]">{pub.prototypeBadge}</p>
                    <h1 className="mt-1 text-lg font-semibold tracking-tight text-[#172B4D]">{cr.pageTitle}</h1>
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
                                    <p className="text-lg font-semibold leading-snug text-[#082244]">{cr.cardTitle}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-8 sm:px-8">
                        {mode.kind === "invalid_id" ? (
                            <>
                                <h2 className="text-center text-xl font-semibold tracking-tight text-[#172B4D]">{cr.invalidTitle}</h2>
                                <p className="mt-4 text-center text-[15px] leading-relaxed text-[#475467]">{cr.invalidBody}</p>
                            </>
                        ) : null}

                        {mode.kind === "unknown_patient" ? (
                            <>
                                <h2 className="text-center text-xl font-semibold tracking-tight text-[#172B4D]">{cr.unknownTitle}</h2>
                                <p className="mt-4 text-center text-[15px] leading-relaxed text-[#475467]">{cr.unknownBody}</p>
                            </>
                        ) : null}

                        {mode.kind === "completed_archived" ? (
                            <>
                                <h2 className="text-center text-xl font-semibold tracking-tight text-[#172B4D]">{cr.completedTitle}</h2>
                                {patient ? (
                                    <p className="mt-4 text-center text-[15px] leading-relaxed text-[#475467]">
                                        {cr.completedHello} <strong>{fullName(patient)}</strong>,
                                    </p>
                                ) : null}
                                <p className="mt-4 text-center text-[15px] leading-relaxed text-[#475467]">{cr.completedBody}</p>
                                <p className="mt-4 rounded-xl border border-[#FEE4E2] bg-[#FFFBFA] px-4 py-3 text-center text-[15px] leading-relaxed text-[#B42318]">
                                    {cr.completedWarning}
                                </p>
                            </>
                        ) : null}

                        {mode.kind === "ineligible" ? (
                            <>
                                <h2 className="text-center text-xl font-semibold tracking-tight text-[#172B4D]">{cr.ineligibleTitle}</h2>
                                <p className="mt-4 text-center text-[15px] leading-relaxed text-[#475467]">{cr.ineligibleBody}</p>
                            </>
                        ) : null}

                        {mode.kind === "ready" ? (
                            <>
                                <h2 className="text-center text-xl font-semibold tracking-tight text-[#172B4D]">
                                    {mode.status === "recall" ? cr.readyTitleRecall : cr.readyTitleArrived}
                                </h2>
                                <p className="mt-4 text-center text-[15px] leading-relaxed text-[#475467]">
                                    {patient ? cr.readyBodyLine(fullName(patient)) : null}
                                </p>
                                {mode.status === "recall" ? (
                                    <p className="mt-3 text-center text-[15px] leading-relaxed text-[#475467]">{cr.readyBodyRecallExtra}</p>
                                ) : (
                                    <p className="mt-3 text-center text-[15px] leading-relaxed text-[#475467]">{cr.readyBodyArrivedExtra}</p>
                                )}

                                <div className="mt-8 flex flex-col items-stretch gap-3 sm:items-center">
                                    {mode.status === "recall" ? (
                                        <Button
                                            color="primary"
                                            size="md"
                                            className="w-full bg-[#0573D8] text-white hover:bg-[#0460B8] sm:w-auto sm:min-w-[280px]"
                                            onClick={onConfirm}
                                        >
                                            {cr.confirmReturnBtn}
                                        </Button>
                                    ) : null}
                                    <Button
                                        color="secondary"
                                        size="md"
                                        className="w-full border border-[#FDA29B] bg-white text-[#B42318] hover:bg-[#FFFBFA] sm:w-auto sm:min-w-[280px]"
                                        onClick={requestCancel}
                                    >
                                        {cr.cancelRequestBtn}
                                    </Button>
                                </div>
                            </>
                        ) : null}

                        {mode.kind === "done_confirm" ? (
                            <>
                                <h2 className="text-center text-xl font-semibold tracking-tight text-[#172B4D]">{cr.thanksTitle}</h2>
                                <p className="mt-4 text-center text-[15px] leading-relaxed text-[#475467]">
                                    {patient ? cr.thanksWithName(fullName(patient)) : cr.thanksGeneric}
                                </p>
                                <p className="mt-3 text-center text-sm text-[#475467]">{cr.thanksHint}</p>
                                <div className="mt-8 flex flex-col items-stretch gap-3 sm:items-center">
                                    <Button
                                        color="secondary"
                                        size="md"
                                        className="w-full border border-[#FDA29B] bg-white text-[#B42318] hover:bg-[#FFFBFA] sm:w-auto sm:min-w-[280px]"
                                        onClick={requestCancel}
                                    >
                                        {cr.cancelRequestBtn}
                                    </Button>
                                </div>
                            </>
                        ) : null}

                        {mode.kind === "done_cancel" ? (
                            <>
                                <h2 className="text-center text-xl font-semibold tracking-tight text-[#172B4D]">{cr.removedTitle}</h2>
                                <p className="mt-4 text-center text-[15px] leading-relaxed text-[#475467]">{cr.removedBody}</p>
                            </>
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
                isOpen={cancelModalOpen}
                onOpenChange={setCancelModalOpen}
                variant="cancel_recall_request"
                onConfirm={finalizeCancel}
            />
        </main>
    );
}
