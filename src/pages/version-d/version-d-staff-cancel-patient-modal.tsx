import { useEffect, useState } from "react";
import { Heading } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { TextArea } from "@/components/base/textarea/textarea";
import { useVEDLocale } from "@/lib/ved-locale";
import { cx } from "@/utils/cx";
import { useVersionD } from "@/pages/version-d/version-d-context";
import { fullName } from "@/pages/version-d/version-d-shared";

type Props = {
    patientId: string | null;
    onDismiss: () => void;
};

type CancelReasonMode = "no_show" | "other";

export function VersionDStaffCancelPatientModal({ patientId, onDismiss }: Props) {
    const { strings } = useVEDLocale();
    const sc = strings.versionD.pages.staffCancelD;
    const { patients, staffCancelPatient } = useVersionD();
    const [mode, setMode] = useState<CancelReasonMode>("no_show");
    const [otherReason, setOtherReason] = useState("");
    const [otherReasonError, setOtherReasonError] = useState(false);

    const patient = patientId ? (patients.find((p) => p.id === patientId) ?? null) : null;
    const isOpen = Boolean(patientId && patient);

    useEffect(() => {
        if (!isOpen) {
            setMode("no_show");
            setOtherReason("");
            setOtherReasonError(false);
        }
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
                                        {sc.introPrefix}
                                        <strong className="text-secondary">{fullName(patient)}</strong>
                                        {sc.introSuffix}
                                    </p>
                                ) : null}
                            </div>
                            <div className="flex flex-col gap-5 p-6">
                                <fieldset className="min-w-0">
                                    <legend className="text-sm font-medium text-secondary">{sc.legend}</legend>
                                    <div className="mt-3 flex flex-col gap-3">
                                        <label
                                            className={cx(
                                                "flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-left text-sm transition",
                                                mode === "no_show"
                                                    ? "border-[#8ED1FE] bg-[#E8F7FE] ring-1 ring-[#8ED1FE]"
                                                    : "border-secondary hover:bg-secondary",
                                            )}
                                        >
                                            <input
                                                type="radio"
                                                name="cancel-reason"
                                                className="mt-0.5"
                                                checked={mode === "no_show"}
                                                onChange={() => {
                                                    setMode("no_show");
                                                    setOtherReasonError(false);
                                                }}
                                            />
                                            <span className="text-primary">{sc.noShow}</span>
                                        </label>
                                        <label
                                            className={cx(
                                                "flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-left text-sm transition",
                                                mode === "other"
                                                    ? "border-[#8ED1FE] bg-[#E8F7FE] ring-1 ring-[#8ED1FE]"
                                                    : "border-secondary hover:bg-secondary",
                                            )}
                                        >
                                            <input
                                                type="radio"
                                                name="cancel-reason"
                                                className="mt-0.5"
                                                checked={mode === "other"}
                                                onChange={() => {
                                                    setMode("other");
                                                    setOtherReasonError(false);
                                                }}
                                            />
                                            <span className="text-primary">{sc.other}</span>
                                        </label>
                                    </div>
                                </fieldset>

                                {mode === "other" ? (
                                    <TextArea
                                        label={sc.otherDetailLabel}
                                        isRequired
                                        isInvalid={otherReasonError}
                                        hint={otherReasonError ? sc.otherDetailHint : undefined}
                                        rows={3}
                                        value={otherReason}
                                        onChange={(v) => {
                                            setOtherReason(v);
                                            if (v.trim()) setOtherReasonError(false);
                                        }}
                                        placeholder={sc.otherDetailPlaceholder}
                                    />
                                ) : null}

                                <div className="flex justify-start gap-3 pt-1">
                                    <Button
                                        color="primary"
                                        size="md"
                                        onClick={() => {
                                            if (!patientId) return;
                                            if (mode === "other" && !otherReason.trim()) {
                                                setOtherReasonError(true);
                                                return;
                                            }
                                            setOtherReasonError(false);
                                            if (mode === "no_show") {
                                                staffCancelPatient(patientId, { mode: "no_show" });
                                            } else {
                                                staffCancelPatient(patientId, { mode: "other", reason: otherReason.trim() });
                                            }
                                            onDismiss();
                                            close();
                                        }}
                                    >
                                        {sc.confirm}
                                    </Button>
                                    <Button color="tertiary" size="md" onClick={close}>
                                        {sc.cancel}
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
