import { Heading } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";

export type ExitDistanceVariant = "refuse" | "withdraw" | "cancel_manual_waiting";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    variant: ExitDistanceVariant;
    onConfirm: () => void;
};

export function ExitDistanceServiceConfirmModal({ isOpen, onOpenChange, variant, onConfirm }: Props) {
    const title =
        variant === "refuse"
            ? "Refuser le consentement"
            : variant === "withdraw"
              ? "Retirer le consentement"
              : "Annuler le rendez-vous";
    const confirmLabel =
        variant === "refuse"
            ? "Confirmer le refus"
            : variant === "withdraw"
              ? "Confirmer le retrait"
              : "Confirmer l’annulation";

    return (
        <ModalOverlay isDismissable isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal>
                <Dialog>
                    {({ close }) => (
                        <div className="w-full max-w-md rounded-xl bg-white shadow-lg ring-1 ring-[#E4E6EA]">
                            <div className="border-b border-[#EEF0F4] px-6 py-5">
                                <Heading slot="title" className="text-lg font-semibold text-[#172B4D]">
                                    {title}
                                </Heading>
                            </div>
                            <div className="px-6 py-5">
                                <p className="text-[15px] leading-relaxed text-[#475467]">
                                    {variant === "refuse" ? (
                                        <>
                                            En refusant, vous n’êtes <strong>pas inscrit</strong> au service de rappel et de suivi à distance et vous
                                            ne recevrez pas de messages liés à la file d’attente virtuelle.
                                        </>
                                    ) : variant === "withdraw" ? (
                                        <>
                                            Retirer votre consentement vous retire <strong>complètement</strong> du service de rappel et de suivi à
                                            distance. Vous ne recevrez plus de messages liés à votre place dans la file d’attente virtuelle.
                                        </>
                                    ) : (
                                        <>
                                            En annulant, vous êtes <strong>retiré de la file d’attente à distance</strong> : vous ne recevrez plus de
                                            messages de suivi liés à cette inscription. Pour toute évaluation ou soins, vous devrez vous présenter en
                                            personne à l’urgence.
                                        </>
                                    )}
                                </p>
                                {variant !== "cancel_manual_waiting" ? (
                                    <p className="mt-4 text-[15px] leading-relaxed text-[#475467]">
                                        Pour toute évaluation ou suite à donner à votre situation, vous devrez{" "}
                                        <strong>vous présenter en personne à l’urgence</strong>.
                                    </p>
                                ) : null}
                            </div>
                            <div className="flex flex-col gap-2 border-t border-[#EEF0F4] px-6 py-4 sm:flex-row sm:justify-start">
                                <Button
                                    color="primary"
                                    size="md"
                                    className="w-full sm:w-auto"
                                    onClick={() => {
                                        onConfirm();
                                        onOpenChange(false);
                                        close();
                                    }}
                                >
                                    {confirmLabel}
                                </Button>
                                <Button color="tertiary" size="md" className="w-full sm:w-auto" onClick={close}>
                                    Annuler
                                </Button>
                            </div>
                        </div>
                    )}
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}
