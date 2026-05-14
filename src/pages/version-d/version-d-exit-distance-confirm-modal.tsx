import { Heading } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { useVEDLocale } from "@/lib/ved-locale";

export type ExitDistanceVariant =
    | "refuse"
    | "withdraw"
    | "cancel_manual_waiting"
    | "cancel_before_consent"
    | "cancel_recall_request";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    variant: ExitDistanceVariant;
    onConfirm: () => void;
};

export function ExitDistanceServiceConfirmModal({ isOpen, onOpenChange, variant, onConfirm }: Props) {
    const { strings } = useVEDLocale();
    const ex = strings.versionD.pages.exitDistance;

    const title =
        variant === "refuse"
            ? ex.refuseTitle
            : variant === "withdraw"
              ? ex.withdrawTitle
              : variant === "cancel_manual_waiting"
                ? ex.cancelManualTitle
                : variant === "cancel_before_consent"
                  ? ex.cancelBeforeConsentTitle
                  : ex.cancelRecallTitle;

    const confirmLabel =
        variant === "refuse"
            ? ex.refuseConfirm
            : variant === "withdraw"
              ? ex.withdrawConfirm
              : variant === "cancel_manual_waiting"
                ? ex.cancelManualConfirm
                : variant === "cancel_before_consent"
                  ? ex.cancelBeforeConsentConfirm
                  : ex.cancelRecallConfirm;

    const body =
        variant === "refuse"
            ? ex.bodyRefuse
            : variant === "withdraw"
              ? ex.bodyWithdraw
              : variant === "cancel_manual_waiting"
                ? ex.bodyCancelManual
                : variant === "cancel_before_consent"
                  ? ex.bodyCancelBeforeConsent
                  : ex.bodyCancelRecall;

    const showFooterInPerson = variant === "cancel_manual_waiting" ? false : true;

    const dismissLabel =
        variant === "refuse" || variant === "cancel_before_consent" ? ex.exitGoBack : ex.exitKeepEnrollment;

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
                                <p className="text-[15px] leading-relaxed text-[#475467]">{body}</p>
                                {showFooterInPerson ? (
                                    <p className="mt-4 text-[15px] leading-relaxed text-[#475467]">{ex.footerInPerson}</p>
                                ) : null}
                            </div>
                            <div className="flex flex-col gap-2 border-t border-[#EEF0F4] px-6 py-4 sm:flex-row sm:justify-start sm:gap-3">
                                <Button
                                    color="primary-destructive"
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
                                <Button color="secondary" size="md" className="w-full sm:w-auto" onClick={close}>
                                    {dismissLabel}
                                </Button>
                            </div>
                        </div>
                    )}
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}
