import { useEffect, useState } from "react";
import { Heading } from "react-aria-components";
import { Mail01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { MESSAGE_TEMPLATE_ORDER } from "@/lib/ved-app-strings/version-cd-pages";
import { useVEDLocale } from "@/lib/ved-locale";
import { useVersionD } from "@/pages/version-d/version-d-context";
import { fullName } from "@/pages/version-d/version-d-shared";
import { staffMessageTemplateBody, type MessageTemplateId } from "@/pages/version-d/version-d-staff-message-templates";

type Props = {
    patientId: string | null;
    onDismiss: () => void;
};

export function VersionDSinglePatientMessageModal({ patientId, onDismiss }: Props) {
    const { strings, locale } = useVEDLocale();
    const { patients, sendStaffMessage } = useVersionD();
    const msg = strings.versionD.pages.messagingSingle;
    const templates = strings.versionD.pages.messageTemplates;
    const [messageTemplate, setMessageTemplate] = useState<MessageTemplateId>("abnormal_delays");
    const [messageBody, setMessageBody] = useState(() => staffMessageTemplateBody(templates, "abnormal_delays"));

    const patient = patientId ? patients.find((p) => p.id === patientId) ?? null : null;
    const isOpen = Boolean(patientId && patient);

    useEffect(() => {
        if (!isOpen) return;
        setMessageTemplate("abnormal_delays");
        setMessageBody(staffMessageTemplateBody(templates, "abnormal_delays"));
    }, [isOpen, patientId, locale, templates]);

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
                        <div className="w-full max-w-2xl rounded-xl bg-primary shadow-lg ring-1 ring-secondary_alt">
                            <div className="flex items-start justify-between gap-4 border-b border-secondary p-6">
                                <div>
                                    <Heading slot="title" className="text-md font-semibold text-primary">
                                        {msg.title}
                                    </Heading>
                                    <div className="mt-1 text-sm text-tertiary">
                                        {patient ? (
                                            <>
                                                {msg.toPrefix}
                                                <strong className="text-secondary">{fullName(patient)}</strong>
                                                {msg.toSuffix}
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                                <Button color="tertiary" size="sm" onClick={close}>
                                    {msg.close}
                                </Button>
                            </div>

                            <div className="flex flex-col gap-4 p-6 sm:p-8">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-primary" htmlFor="single-msg-template">
                                        {msg.templateLabel}
                                    </label>
                                    <select
                                        id="single-msg-template"
                                        className="w-full max-w-md rounded-lg border border-secondary bg-primary px-3 py-2 text-sm text-primary shadow-xs"
                                        value={messageTemplate}
                                        onChange={(e) => {
                                            const next = e.target.value as MessageTemplateId;
                                            setMessageTemplate(next);
                                            if (next !== "custom") setMessageBody(staffMessageTemplateBody(templates, next));
                                            else setMessageBody("");
                                        }}
                                    >
                                        {MESSAGE_TEMPLATE_ORDER.filter((id) => id !== "custom").map((id) => (
                                            <option key={id} value={id}>
                                                {templates[id].label}
                                            </option>
                                        ))}
                                        <option value="custom">{msg.customOption}</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-primary" htmlFor="single-msg-body">
                                        {msg.messageLabel}
                                    </label>
                                    <textarea
                                        id="single-msg-body"
                                        className="min-h-32 w-full resize-y rounded-lg border border-secondary bg-primary px-3 py-2 text-sm text-primary shadow-xs outline-hidden sm:min-h-40"
                                        value={messageBody}
                                        onChange={(e) => setMessageBody(e.target.value)}
                                        placeholder={msg.messagePlaceholder}
                                    />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-xs text-tertiary">
                                        <Mail01 className="size-4 text-tertiary" strokeWidth={1.75} aria-hidden />
                                        {msg.footerHint}
                                    </div>
                                    <div className="flex justify-start">
                                        <Button
                                            size="md"
                                            isDisabled={!patientId || messageBody.trim().length === 0}
                                            onClick={() => {
                                                if (!patientId) return;
                                                const p = patients.find((x) => x.id === patientId);
                                                if (!p) return;
                                                const body = messageBody.trim();
                                                if (p.phone?.trim()) sendStaffMessage(patientId, "sms", body);
                                                if (p.email?.trim()) sendStaffMessage(patientId, "email", body);
                                                onDismiss();
                                                close();
                                            }}
                                        >
                                            {msg.send}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}
