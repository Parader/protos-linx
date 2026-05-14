import { useEffect, useState } from "react";
import { Heading } from "react-aria-components";
import { Mail01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { MESSAGE_TEMPLATE_ORDER } from "@/lib/ved-app-strings/version-cd-pages";
import { getVersionCStringBundle } from "@/lib/ved-app-strings/version-c-bundle";
import { useVEDLocale } from "@/lib/ved-locale";
import { useVersionD } from "@/pages/version-d/version-d-context";
import { staffMessageTemplateBody, type MessageTemplateId } from "@/pages/version-d/version-d-staff-message-templates";

type MessageTarget = "all" | "waiting" | "recall" | "completed";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
};

export function VersionDWorklistBulkMessageModal({ isOpen, onOpenChange }: Props) {
    const { strings, locale } = useVEDLocale();
    const { patients, patientsByColumn, sendStaffMessage } = useVersionD();
    const msg = strings.versionD.pages.messagingBulk;
    const templates = strings.versionD.pages.messageTemplates;
    const [messageTarget, setMessageTarget] = useState<MessageTarget>("all");
    const [messageTemplate, setMessageTemplate] = useState<MessageTemplateId>("abnormal_delays");
    const [messageBody, setMessageBody] = useState(() => staffMessageTemplateBody(templates, "abnormal_delays"));

    useEffect(() => {
        if (!isOpen) return;
        setMessageTarget("all");
        setMessageTemplate("abnormal_delays");
        setMessageBody(staffMessageTemplateBody(templates, "abnormal_delays"));
    }, [isOpen, locale, templates]);

    return (
        <ModalOverlay isDismissable isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal>
                <Dialog>
                    {({ close }) => (
                        <div className="w-full max-w-2xl rounded-xl bg-primary shadow-lg ring-1 ring-secondary_alt">
                            <div className="flex items-start justify-between gap-4 border-b border-secondary p-6">
                                <div>
                                    <Heading slot="title" className="text-md font-semibold text-primary">
                                        {msg.title}
                                    </Heading>
                                    <div className="mt-1 text-sm text-tertiary">{msg.subtitle}</div>
                                </div>
                                <Button color="tertiary" size="sm" onClick={close}>
                                    {msg.close}
                                </Button>
                            </div>

                            <div className="flex flex-col gap-4 p-6 sm:p-8">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-primary" htmlFor="bulk-msg-target">
                                            {msg.targetLabel}
                                        </label>
                                        <select
                                            id="bulk-msg-target"
                                            className="w-full rounded-lg border border-secondary bg-primary px-3 py-2 text-sm text-primary shadow-xs"
                                            value={messageTarget}
                                            onChange={(e) => setMessageTarget(e.target.value as MessageTarget)}
                                        >
                                            <option value="all">{msg.targetAll}</option>
                                            <option value="waiting">{msg.targetWaiting}</option>
                                            <option value="recall">{msg.targetRecall}</option>
                                            <option value="completed">{msg.targetCompleted}</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-primary" htmlFor="bulk-msg-template">
                                            {msg.templateLabel}
                                        </label>
                                        <select
                                            id="bulk-msg-template"
                                            className="w-full rounded-lg border border-secondary bg-primary px-3 py-2 text-sm text-primary shadow-xs"
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
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-primary" htmlFor="bulk-msg-body">
                                        {msg.messageLabel}
                                    </label>
                                    <textarea
                                        id="bulk-msg-body"
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
                                            isDisabled={
                                                patients.length === 0 ||
                                                (messageTemplate === "custom" ? messageBody.trim().length === 0 : false)
                                            }
                                            onClick={() => {
                                                const ids =
                                                    messageTarget === "all"
                                                        ? patients.map((p) => p.id)
                                                        : messageTarget === "waiting"
                                                          ? patientsByColumn.waiting.map((p) => p.id)
                                                          : messageTarget === "recall"
                                                            ? patientsByColumn.recall.map((p) => p.id)
                                                            : patientsByColumn.completed.map((p) => p.id);

                                                for (const id of ids) {
                                                    const p = patients.find((x) => x.id === id);
                                                    if (!p) continue;
                                                    const body =
                                                        messageTemplate === "custom"
                                                            ? messageBody.trim()
                                                            : staffMessageTemplateBody(
                                                                  getVersionCStringBundle(p.communicationLanguage ?? "fr").pages
                                                                      .messageTemplates,
                                                                  messageTemplate,
                                                              );
                                                    if (!body) continue;
                                                    if (p.phone?.trim()) sendStaffMessage(id, "sms", body);
                                                    if (p.email?.trim()) sendStaffMessage(id, "email", body);
                                                }
                                                onOpenChange(false);
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
