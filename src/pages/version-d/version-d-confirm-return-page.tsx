import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Button } from "@/components/base/buttons/button";
import { BRAND_POWERED_BY_AKINOX, BRAND_QUEBEC_LOGO } from "@/constants/brand-assets";
import { useVersionD } from "@/pages/version-d/version-d-context";
import { fullName, type PatientStatus } from "@/pages/version-d/version-d-shared";

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
    const { patients, confirmReturn, cancelQueueRequestFromPatient } = useVersionD();
    const [searchParams] = useSearchParams();
    const [finished, setFinished] = useState<"confirm" | "cancel" | null>(null);

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

    const onConfirm = () => {
        if (!patientId || patient?.status !== "recall") return;
        confirmReturn(patientId);
        setFinished("confirm");
    };

    const onCancelRequest = () => {
        if (!patientId) return;
        if (patient?.status !== "recall" && patient?.status !== "arrived") return;
        cancelQueueRequestFromPatient(patientId);
        setFinished("cancel");
    };

    return (
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-[#F9FAFB]">
            <div className="mx-auto flex w-full max-w-[680px] flex-col px-4 py-8 pb-16">
                <header className="mb-6 text-center">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-[#5E6C84]">Prototype — perspective usager</p>
                    <h1 className="mt-1 text-lg font-semibold tracking-tight text-[#172B4D]">Rappel — urgence</h1>
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
                                    <p className="text-lg font-semibold leading-snug text-[#082244]">Attente à distance — File d’attente à l’urgence</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-8 sm:px-8">
                        {mode.kind === "invalid_id" ? (
                            <>
                                <h2 className="text-center text-xl font-semibold tracking-tight text-[#172B4D]">Lien incomplet</h2>
                                <p className="mt-4 text-center text-[15px] leading-relaxed text-[#475467]">
                                    Ce lien ne contient pas les informations nécessaires. Utilisez le lien reçu par message.
                                </p>
                            </>
                        ) : null}

                        {mode.kind === "unknown_patient" ? (
                            <>
                                <h2 className="text-center text-xl font-semibold tracking-tight text-[#172B4D]">Lien non reconnu</h2>
                                <p className="mt-4 text-center text-[15px] leading-relaxed text-[#475467]">
                                    Nous ne trouvons pas de dossier correspondant à ce lien. Il est peut-être expiré ou la démo a été réinitialisée.
                                </p>
                            </>
                        ) : null}

                        {mode.kind === "completed_archived" ? (
                            <>
                                <h2 className="text-center text-xl font-semibold tracking-tight text-[#172B4D]">Dossier terminé</h2>
                                {patient ? (
                                    <p className="mt-4 text-center text-[15px] leading-relaxed text-[#475467]">
                                        Bonjour <strong>{fullName(patient)}</strong>,
                                    </p>
                                ) : null}
                                <p className="mt-4 text-center text-[15px] leading-relaxed text-[#475467]">
                                    Votre inscription à l’<strong className="font-medium text-[#344054]">attente à distance</strong> a été{" "}
                                    <strong className="font-medium text-[#344054]">clôturée</strong> : le dossier figure désormais dans le statut{" "}
                                    <strong className="font-medium text-[#344054]">terminé</strong> côté équipe de l’urgence. Ce lien de confirmation
                                    ne permet donc plus de confirmer un retour ni d’annuler la requête en ligne.
                                </p>
                                <p className="mt-4 rounded-xl border border-[#FEE4E2] bg-[#FFFBFA] px-4 py-3 text-center text-[15px] leading-relaxed text-[#B42318]">
                                    Si vous pensez qu’il s’agit d’une <strong>erreur</strong>, ou si votre état vous inquiète,{" "}
                                    <strong>présentez-vous en personne à l’urgence</strong> pour qu’on puisse vérifier la situation avec vous. En cas
                                    d’urgence vitale, composez le <strong>911</strong>.
                                </p>
                            </>
                        ) : null}

                        {mode.kind === "ineligible" ? (
                            <>
                                <h2 className="text-center text-xl font-semibold tracking-tight text-[#172B4D]">Lien non disponible</h2>
                                <p className="mt-4 text-center text-[15px] leading-relaxed text-[#475467]">
                                    Votre situation ne correspond pas à une demande de rappel active. Pour toute question, présentez-vous à l’urgence.
                                </p>
                            </>
                        ) : null}

                        {mode.kind === "ready" ? (
                            <>
                                <h2 className="text-center text-xl font-semibold tracking-tight text-[#172B4D]">
                                    {mode.status === "recall" ? "Confirmez votre retour" : "Retour déjà confirmé"}
                                </h2>
                                <p className="mt-4 text-center text-[15px] leading-relaxed text-[#475467]">
                                    {patient ? (
                                        <>
                                            Bonjour <strong>{fullName(patient)}</strong>, l’équipe vous demande de vous présenter à l’urgence. Les
                                            professionnels voient votre statut dans la file lorsque vous confirmez.
                                        </>
                                    ) : null}
                                </p>
                                {mode.status === "recall" ? (
                                    <p className="mt-3 text-center text-[15px] leading-relaxed text-[#475467]">
                                        Si vous ne souhaitez plus être suivi à distance ou ne pouvez pas revenir pour l’instant, vous pouvez annuler
                                        complètement votre inscription.
                                    </p>
                                ) : (
                                    <p className="mt-3 text-center text-[15px] leading-relaxed text-[#475467]">
                                        Vous avez déjà indiqué que vous revenez. Vous pouvez toujours retirer votre inscription au service d’attente à
                                        distance ci-dessous.
                                    </p>
                                )}

                                <div className="mt-8 flex flex-col items-stretch gap-3 sm:items-center">
                                    {mode.status === "recall" ? (
                                        <Button
                                            color="primary"
                                            size="md"
                                            className="w-full bg-[#0573D8] text-white hover:bg-[#0460B8] sm:w-auto sm:min-w-[280px]"
                                            onClick={onConfirm}
                                        >
                                            Je confirme mon retour à l’urgence
                                        </Button>
                                    ) : null}
                                    <Button
                                        color="secondary"
                                        size="md"
                                        className="w-full border border-[#FDA29B] bg-white text-[#B42318] hover:bg-[#FFFBFA] sm:w-auto sm:min-w-[280px]"
                                        onClick={onCancelRequest}
                                    >
                                        Annuler ma requête (retirer l’attente à distance)
                                    </Button>
                                </div>
                            </>
                        ) : null}

                        {mode.kind === "done_confirm" ? (
                            <>
                                <h2 className="text-center text-xl font-semibold tracking-tight text-[#172B4D]">Merci</h2>
                                <p className="mt-4 text-center text-[15px] leading-relaxed text-[#475467]">
                                    {patient ? (
                                        <>
                                            <strong>{fullName(patient)}</strong>, votre retour est enregistré. L’équipe voit que vous revenez.
                                        </>
                                    ) : (
                                        "Votre retour est enregistré."
                                    )}
                                </p>
                                <p className="mt-3 text-center text-sm text-[#475467]">
                                    Vous pouvez encore annuler votre inscription au service ci-dessous si vos plans changent.
                                </p>
                                <div className="mt-8 flex flex-col items-stretch gap-3 sm:items-center">
                                    <Button
                                        color="secondary"
                                        size="md"
                                        className="w-full border border-[#FDA29B] bg-white text-[#B42318] hover:bg-[#FFFBFA] sm:w-auto sm:min-w-[280px]"
                                        onClick={onCancelRequest}
                                    >
                                        Annuler ma requête (retirer l’attente à distance)
                                    </Button>
                                </div>
                            </>
                        ) : null}

                        {mode.kind === "done_cancel" ? (
                            <>
                                <h2 className="text-center text-xl font-semibold tracking-tight text-[#172B4D]">Inscription retirée</h2>
                                <p className="mt-4 text-center text-[15px] leading-relaxed text-[#475467]">
                                    Vous ne recevrez plus de messages liés à l’attente à distance. Pour toute urgence, présentez-vous à l’urgence ou
                                    composez le 911.
                                </p>
                            </>
                        ) : null}
                    </div>

                    <footer className="border-t border-[#EEF0F4] bg-[#FAFBFC] px-6 py-4 text-center">
                        <Link to="/version-d" className="inline-flex justify-center">
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
