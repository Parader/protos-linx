import { useEffect, useState } from "react";
import { Heading } from "react-aria-components";
import { Mail01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { useVersionD } from "@/pages/version-d/version-d-context";
import {
    staffMessageTemplateBody,
    STAFF_MESSAGE_TEMPLATES,
    type MessageTemplateId,
} from "@/pages/version-d/version-d-staff-message-templates";

type MessageTarget = "all" | "waiting" | "recall" | "completed";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
};

export function VersionDWorklistBulkMessageModal({ isOpen, onOpenChange }: Props) {
    const { patients, patientsByColumn, sendStaffMessage } = useVersionD();
    const [messageTarget, setMessageTarget] = useState<MessageTarget>("all");
    const [messageTemplate, setMessageTemplate] = useState<MessageTemplateId>("abnormal_delays");
    const [messageBody, setMessageBody] = useState(() => staffMessageTemplateBody("abnormal_delays"));

    useEffect(() => {
        if (!isOpen) return;
        setMessageTarget("all");
        setMessageTemplate("abnormal_delays");
        setMessageBody(staffMessageTemplateBody("abnormal_delays"));
    }, [isOpen]);

    return (
        <ModalOverlay isDismissable isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal>
                <Dialog>
                    {({ close }) => (
                        <div className="w-full max-w-2xl rounded-xl bg-primary shadow-lg ring-1 ring-secondary_alt">
                            <div className="flex items-start justify-between gap-4 border-b border-secondary p-6">
                                <div>
                                    <Heading slot="title" className="text-md font-semibold text-primary">
                                        Envoyer un message
                                    </Heading>
                                    <div className="mt-1 text-sm text-tertiary">
                                        Messagerie groupée (démo) : SMS et/ou courriel selon les coordonnées de chaque patient.
                                    </div>
                                </div>
                                <Button color="tertiary" size="sm" onClick={close}>
                                    Fermer
                                </Button>
                            </div>

                            <div className="flex flex-col gap-4 p-6 sm:p-8">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-primary" htmlFor="bulk-msg-target">
                                            Cible
                                        </label>
                                        <select
                                            id="bulk-msg-target"
                                            className="w-full rounded-lg border border-secondary bg-primary px-3 py-2 text-sm text-primary shadow-xs"
                                            value={messageTarget}
                                            onChange={(e) => setMessageTarget(e.target.value as MessageTarget)}
                                        >
                                            <option value="all">Tous les patients</option>
                                            <option value="waiting">Colonne Attente</option>
                                            <option value="recall">Colonne Rappel</option>
                                            <option value="completed">Colonne Terminé</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-primary" htmlFor="bulk-msg-template">
                                            Modèle
                                        </label>
                                        <select
                                            id="bulk-msg-template"
                                            className="w-full rounded-lg border border-secondary bg-primary px-3 py-2 text-sm text-primary shadow-xs"
                                            value={messageTemplate}
                                            onChange={(e) => {
                                                const next = e.target.value as MessageTemplateId;
                                                setMessageTemplate(next);
                                                if (next !== "custom") setMessageBody(staffMessageTemplateBody(next));
                                                else setMessageBody("");
                                            }}
                                        >
                                            {STAFF_MESSAGE_TEMPLATES.filter((t) => t.id !== "custom").map((t) => (
                                                <option key={t.id} value={t.id}>
                                                    {t.label}
                                                </option>
                                            ))}
                                            <option value="custom">Personnalisé…</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-primary" htmlFor="bulk-msg-body">
                                        Message
                                    </label>
                                    <textarea
                                        id="bulk-msg-body"
                                        className="min-h-32 w-full resize-y rounded-lg border border-secondary bg-primary px-3 py-2 text-sm text-primary shadow-xs outline-hidden sm:min-h-40"
                                        value={messageBody}
                                        onChange={(e) => setMessageBody(e.target.value)}
                                        placeholder="Saisissez votre message…"
                                    />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-xs text-tertiary">
                                        <Mail01 className="size-4 text-tertiary" strokeWidth={1.75} aria-hidden />
                                        Un envoi par canal disponible (SMS et/ou courriel).
                                    </div>
                                    <div className="flex justify-start">
                                        <Button
                                            size="md"
                                            isDisabled={patients.length === 0 || messageBody.trim().length === 0}
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
                                                    if (p.phone?.trim()) sendStaffMessage(id, "sms", messageBody);
                                                    if (p.email?.trim()) sendStaffMessage(id, "email", messageBody);
                                                }
                                                onOpenChange(false);
                                                close();
                                            }}
                                        >
                                            Envoyer
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
