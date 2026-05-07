import { useEffect, useState } from "react";
import { Heading } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { cx } from "@/utils/cx";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    patientLabel: string;
    /** Dossier annulé ou en attente de consentement : case à cocher obligatoire avant confirmation. */
    requiresConsentAttestation?: boolean;
    onConfirm: (opts: { targetStatus: "recall" | "arrived"; sendRecallMessage: boolean }) => void;
};

export function VersionDMoveToRecallModal({
    isOpen,
    onOpenChange,
    patientLabel,
    requiresConsentAttestation = false,
    onConfirm,
}: Props) {
    const [targetStatus, setTargetStatus] = useState<"recall" | "arrived">("recall");
    const [sendRecallMessage, setSendRecallMessage] = useState(true);
    const [consentAttested, setConsentAttested] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTargetStatus("recall");
            setSendRecallMessage(true);
            setConsentAttested(false);
        }
    }, [isOpen]);

    const canConfirm = !requiresConsentAttestation || consentAttested;

    return (
        <ModalOverlay isDismissable isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal>
                <Dialog>
                    {({ close }) => (
                        <div className="w-full max-w-lg rounded-xl bg-primary shadow-lg ring-1 ring-secondary_alt">
                            <div className="border-b border-secondary p-6">
                                <Heading slot="title" className="text-md font-semibold text-primary">
                                    Passer en colonne Rappel
                                </Heading>
                                <p className="mt-2 text-sm text-tertiary">
                                    <span className="text-secondary">{patientLabel}</span> — choisissez le statut dans cette colonne et si le message de
                                    rappel doit être envoyé.
                                </p>
                            </div>
                            <div className="flex flex-col gap-5 p-6">
                                {requiresConsentAttestation ? (
                                    <div className="rounded-lg border border-[#FEF0C7] bg-[#FFFAEB] p-3 text-sm text-[#B54708]">
                                        <p className="font-medium text-[#93370D]">Consentement requis</p>
                                        <p className="mt-1 text-[#B54708]">
                                            Ce dossier était sans consentement enregistré (y compris avant une annulation). Vous devez confirmer avoir reçu
                                            le consentement du patient avant de le placer en colonne Rappel.
                                        </p>
                                        <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-lg border border-[#FEF0C7] bg-white p-3 text-left text-primary">
                                            <input
                                                type="checkbox"
                                                className="mt-0.5 size-4 shrink-0"
                                                checked={consentAttested}
                                                onChange={(e) => setConsentAttested(e.target.checked)}
                                            />
                                            <span className="text-sm font-medium">Je confirme avoir reçu le consentement du patient</span>
                                        </label>
                                    </div>
                                ) : null}

                                <fieldset className="min-w-0">
                                    <legend className="text-sm font-medium text-secondary">Statut</legend>
                                    <div className="mt-3 flex flex-col gap-3">
                                        <label
                                            className={cx(
                                                "flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-left text-sm transition",
                                                targetStatus === "recall"
                                                    ? "border-[#8ED1FE] bg-[#E8F7FE] ring-1 ring-[#8ED1FE]"
                                                    : "border-secondary hover:bg-secondary",
                                            )}
                                        >
                                            <input
                                                type="radio"
                                                name="recall-target-status"
                                                className="mt-0.5"
                                                checked={targetStatus === "recall"}
                                                onChange={() => setTargetStatus("recall")}
                                            />
                                            <span className="text-primary">Rappelé — en attente de confirmation</span>
                                        </label>
                                        <label
                                            className={cx(
                                                "flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-left text-sm transition",
                                                targetStatus === "arrived"
                                                    ? "border-[#8ED1FE] bg-[#E8F7FE] ring-1 ring-[#8ED1FE]"
                                                    : "border-secondary hover:bg-secondary",
                                            )}
                                        >
                                            <input
                                                type="radio"
                                                name="recall-target-status"
                                                className="mt-0.5"
                                                checked={targetStatus === "arrived"}
                                                onChange={() => setTargetStatus("arrived")}
                                            />
                                            <span className="text-primary">Retour confirmé</span>
                                        </label>
                                    </div>
                                </fieldset>

                                <label
                                    className={cx(
                                        "flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-left text-sm transition",
                                        targetStatus === "arrived" && "pointer-events-none opacity-50",
                                        sendRecallMessage && targetStatus === "recall"
                                            ? "border-[#8ED1FE] bg-[#E8F7FE]"
                                            : "border-secondary",
                                    )}
                                >
                                    <input
                                        type="checkbox"
                                        className="mt-0.5 size-4"
                                        checked={targetStatus === "recall" && sendRecallMessage}
                                        disabled={targetStatus === "arrived"}
                                        onChange={(e) => setSendRecallMessage(e.target.checked)}
                                    />
                                    <div className="min-w-0">
                                        <div className="font-medium text-primary">Envoyer le message de rappel</div>
                                        <div className="mt-0.5 text-xs text-tertiary">
                                            SMS et courriel selon les coordonnées du patient (lien pour confirmer le retour). Sans effet si le statut est
                                            « Retour confirmé ».
                                        </div>
                                    </div>
                                </label>

                                <div className="flex justify-start gap-3 pt-1">
                                    <Button
                                        color="primary"
                                        size="md"
                                        isDisabled={!canConfirm}
                                        onClick={() => {
                                            if (!canConfirm) return;
                                            onConfirm({
                                                targetStatus,
                                                sendRecallMessage: targetStatus === "recall" ? sendRecallMessage : false,
                                            });
                                            close();
                                        }}
                                    >
                                        Confirmer
                                    </Button>
                                    <Button color="tertiary" size="md" onClick={close}>
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
