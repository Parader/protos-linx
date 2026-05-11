import { useEffect, useState } from "react";
import { Heading } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { TextArea } from "@/components/base/textarea/textarea";
import { useVEDLocale } from "@/lib/ved-locale";
import { useVersionC } from "@/pages/version-c/version-c-context";
import { fullName } from "@/pages/version-c/version-c-shared";

type Props = {
    patientId: string | null;
    onDismiss: () => void;
};

export function VersionCStaffCancelPatientModal({ patientId, onDismiss }: Props) {
    const { strings } = useVEDLocale();
    const sc = strings.versionC.pages.staffCancelC;
    const { patients, staffCancelPatient } = useVersionC();
    const [reason, setReason] = useState("");

    const patient = patientId ? patients.find((p) => p.id === patientId) ?? null : null;
    const isOpen = Boolean(patientId && patient);

    useEffect(() => {
        if (!isOpen) setReason("");
    }, [isOpen]);

    return (
        <ModalOverlay
            isDismissable
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!open) onDismiss();
            }}
        >
            <Modal>
                <Dialog>
                    {({ close }) => (
                        <div className="w-full max-w-lg rounded-xl bg-primary shadow-lg ring-1 ring-secondary_alt">
                            <div className="border-b border-secondary p-6">
                                <Heading slot="title" className="text-md font-semibold text-primary">
                                    {sc.title}
                                </Heading>
                                {patient ? (
                                    <p className="mt-2 text-sm text-tertiary">
                                        {sc.introHtmlPrefix}
                                        <strong className="text-secondary">{fullName(patient)}</strong>
                                        {sc.introSuffix}
                                        <strong>{sc.introCompleted}</strong>
                                        {sc.introTail}
                                    </p>
                                ) : null}
                            </div>
                            <div className="flex flex-col gap-4 p-6">
                                <TextArea
                                    label={sc.reasonLabel}
                                    isRequired
                                    rows={4}
                                    value={reason}
                                    onChange={(v) => setReason(v)}
                                    placeholder={sc.reasonPlaceholder}
                                />
                                <div className="flex flex-wrap justify-start gap-3 pt-2">
                                    <Button
                                        color="primary-destructive"
                                        size="md"
                                        isDisabled={!reason.trim() || !patientId}
                                        onClick={() => {
                                            if (!patientId || !reason.trim()) return;
                                            staffCancelPatient(patientId, reason.trim());
                                            onDismiss();
                                            close();
                                        }}
                                    >
                                        {sc.confirm}
                                    </Button>
                                    <Button color="tertiary" size="md" onClick={close}>
                                        {sc.close}
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
