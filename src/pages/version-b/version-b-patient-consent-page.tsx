import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/base/buttons/button";
import { Select } from "@/components/base/select/select";
import { BRAND_POWERED_BY_AKINOX, BRAND_QUEBEC_LOGO } from "@/constants/brand-assets";
import { useVersionB } from "@/pages/version-b/version-b-context";

/** Provincial invitation / consent copy (FR), registre administratif. */
const CONSENT_BODY = (
    <>
        <p className="text-[15px] leading-relaxed text-[#172B4D]">
            Vous avez été orienté vers la <strong>Plateforme provinciale de soins virtuels</strong> en vue d’une consultation par vidéoconférence ou par téléphone auprès d’un professionnel de la santé.
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-[#172B4D]">
            Préalablement à toute poursuite, il vous appartient de <strong>prendre connaissance du consentement éclairé et d’y donner votre accord</strong>, lequel porte notamment sur la collecte, l’utilisation et la communication de vos renseignements personnels et de santé dans le cadre du présent service.
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-[#172B4D]">
            En appuyant sur le bouton « J’accepte et je continue », vous attestez avoir pris connaissance des modalités qui vous sont présentées et{" "}
            <strong>consentez à participer à la consultation virtuelle</strong>.
        </p>
    </>
);

function formatExpiryDate(ts: number) {
    try {
        return new Intl.DateTimeFormat("fr-CA", { dateStyle: "long", timeStyle: "short" }).format(new Date(ts + 7 * 24 * 60 * 60 * 1000));
    } catch {
        return "dans les 7 jours";
    }
}

export function VersionBPatientConsentPage() {
    const { consentPatients, acceptConsent } = useVersionB();
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        if (consentPatients.length === 0) {
            setSelectedId(null);
            return;
        }
        setSelectedId((prev) => {
            if (prev && consentPatients.some((p) => p.id === prev)) return prev;
            return consentPatients[0]?.id ?? null;
        });
    }, [consentPatients]);

    const selected = useMemo(
        () => (selectedId ? consentPatients.find((p) => p.id === selectedId) ?? null : null),
        [consentPatients, selectedId],
    );

    return (
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-[#F9FAFB]">
            <div className="mx-auto flex w-full max-w-[680px] flex-col px-4 py-8 pb-16">
                <header className="mb-6 text-center">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-[#5E6C84]">Prototype — perspective usager</p>
                    <h1 className="mt-1 text-lg font-semibold tracking-tight text-[#172B4D]">Consentement éclairé</h1>
                </header>

                {consentPatients.length === 0 ? (
                    <div className="rounded-2xl border border-[#E4E6EA] bg-white p-10 text-center shadow-[0px_4px_24px_rgba(16,24,40,0.06)]">
                        <p className="text-[15px] leading-relaxed text-[#475467]">
                            Aucun dossier n’est présentement <strong>en attente de consentement</strong>. Pour en ajouter un, veuillez procéder depuis la liste de travail (sans cocher l’option « Consentement déjà donné ») ou déplacer une fiche vers la voie « En attente de consentement ».
                        </p>
                        <Button className="mt-6" color="secondary" size="md" href="/version-b">
                            Retour à la liste de travail
                        </Button>
                    </div>
                ) : (
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
                                    <div className="h-px w-full bg-[#E4E6EA] sm:hidden" aria-hidden />
                                    <div className="min-w-0 sm:pb-0.5">
                                        <p className="text-lg font-semibold leading-snug text-[#082244]">Plateforme provinciale de soins virtuels</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-6 sm:px-8 sm:py-8">
                            {consentPatients.length > 1 && (
                                <div className="mb-6 max-w-md">
                                    <Select
                                        label="Sélection du dossier (simulation)"
                                        selectedKey={selectedId ?? undefined}
                                        onSelectionChange={(key) => setSelectedId(String(key))}
                                    >
                                        {consentPatients.map((p) => (
                                            <Select.Item key={p.id} id={p.id}>
                                                {p.name} — {p.fileNumber}
                                            </Select.Item>
                                        ))}
                                    </Select>
                                </div>
                            )}

                            {selected ? (
                                <>
                                    <div className="space-y-4 border-b border-[#EEF0F4] pb-6">
                                        <p className="text-[15px] leading-relaxed text-[#172B4D]">
                                            Bonjour, <strong>{selected.name}</strong>,
                                        </p>
                                        {CONSENT_BODY}
                                    </div>

                                    {(selected.notes?.trim() || selected.reason?.trim()) && (
                                        <div className="mt-6 rounded-lg border border-[#E4E6EA] bg-[#F9FAFB] px-4 py-3">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-[#5E6C84]">Message transmis par l’équipe soignante</p>
                                            {selected.reason?.trim() && selected.reason !== "—" && (
                                                <p className="mt-2 text-sm leading-relaxed text-[#172B4D]">
                                                    Le professionnel ou l’équipe clinique a indiqué ce qui suit : {selected.reason}
                                                </p>
                                            )}
                                            {selected.notes?.trim() && (
                                                <p className="mt-2 text-sm italic leading-relaxed text-[#082244] underline decoration-[#0573d8]/40">
                                                    {selected.notes}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-8 border-t border-[#EEF0F4] pt-6">
                                        <p className="text-sm italic leading-relaxed text-[#082244]">
                                            Pour prendre connaissance de l’avis complet relatif à la confidentialité ainsi qu’aux droits qui vous sont reconnus, veuillez{" "}
                                            <a href="#" className="font-medium text-[#0573d8] underline underline-offset-2">
                                                consulter le document afférent
                                            </a>
                                            .
                                        </p>
                                        <p className="mt-4 text-sm text-[#5E6C84]">
                                            La validité du présent lien prend fin le <span className="font-medium text-[#172B4D]">{formatExpiryDate(selected.createdAt)}</span>{" "}
                                            (délai indicatif aux fins de démonstration seulement).
                                        </p>
                                    </div>

                                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <Button
                                            size="lg"
                                            className="w-full bg-[#0573d8] text-white hover:bg-[#0460b8] sm:w-auto"
                                            onClick={() => {
                                                const patientId = selected.id;
                                                acceptConsent(patientId);
                                                navigate("/version-b/patient-consent/next", { state: { patientId } });
                                            }}
                                        >
                                            J’accepte et je continue
                                        </Button>
                                        <p className="text-center text-xs text-[#5E6C84] sm:text-left">
                                            Une fois l’acceptation enregistrée, le dossier est classé en <strong>file d’attente</strong> dans la liste de travail (démonstration).
                                        </p>
                                    </div>
                                </>
                            ) : null}
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
                )}
            </div>
        </main>
    );
}
