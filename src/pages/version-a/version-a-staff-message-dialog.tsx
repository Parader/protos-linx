import { useEffect, useMemo, useState } from "react";
import { Heading } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { TextArea } from "@/components/base/textarea/textarea";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { ALL_STAFF_MESSAGE_OPTIONS } from "@/pages/version-a/version-a-staff-messages";
import { cx } from "@/utils/cx";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "waiting" | "patient";
    waitingCount?: number;
    patientName?: string;
    onSend: (body: string, templateId?: string) => void;
};

export function VersionAStaffMessageDialog({ isOpen, onOpenChange, mode, waitingCount = 0, patientName, onSend }: Props) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [draft, setDraft] = useState("");
    const [editorOpen, setEditorOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setSelectedId(null);
            setDraft("");
            setEditorOpen(false);
        }
    }, [isOpen]);

    const selectedPreset = useMemo(
        () => (selectedId ? ALL_STAFF_MESSAGE_OPTIONS.find((t) => t.id === selectedId) ?? null : null),
        [selectedId],
    );

    const isCustom = selectedId === "custom";
    const showReadOnlyPreview = selectedPreset && !isCustom && !editorOpen && draft.trim().length > 0;

    const title = mode === "waiting" ? "Message to everyone in Waiting" : "Send message to patient";
    const subtitle =
        mode === "waiting"
            ? `${waitingCount} patient${waitingCount === 1 ? "" : "s"} in the Waiting lane will receive this (simulated).`
            : patientName
              ? `Message will be logged on ${patientName}’s chart (simulated).`
              : "Message will be logged on this chart (simulated).";

    const handleSend = () => {
        const trimmed = draft.trim();
        if (!trimmed || !selectedId) return;
        let templateId: string | undefined;
        if (selectedId !== "custom") {
            const preset = ALL_STAFF_MESSAGE_OPTIONS.find((t) => t.id === selectedId);
            if (preset && preset.body === trimmed) templateId = selectedId;
        }
        onSend(trimmed, templateId);
        onOpenChange(false);
    };

    const selectOption = (id: string) => {
        const t = ALL_STAFF_MESSAGE_OPTIONS.find((x) => x.id === id);
        if (!t) return;
        setSelectedId(id);
        if (id === "custom") {
            setDraft("");
            setEditorOpen(true);
        } else {
            setDraft(t.body);
            setEditorOpen(false);
        }
    };

    const canSend = Boolean(selectedId && draft.trim());

    return (
        <ModalOverlay isDismissable isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal>
                <Dialog>
                    {() => (
                        <div className="w-full max-w-lg rounded-xl bg-primary shadow-lg ring-1 ring-secondary_alt">
                            <div className="border-b border-secondary p-6">
                                <Heading slot="title" className="text-md font-semibold text-primary">
                                    {title}
                                </Heading>
                                <p className="mt-1 text-sm text-tertiary">{subtitle}</p>
                            </div>

                            <div className="flex max-h-[min(60vh,28rem)] flex-col gap-4 overflow-y-auto p-6">
                                <div>
                                    <p className="mb-2 text-xs font-medium text-tertiary">Choose a message</p>
                                    <ul className="flex flex-col gap-2">
                                        {ALL_STAFF_MESSAGE_OPTIONS.map((t) => (
                                            <li key={t.id}>
                                                <button
                                                    type="button"
                                                    onClick={() => selectOption(t.id)}
                                                    className={cx(
                                                        "w-full rounded-lg border px-3 py-2.5 text-left transition-colors outline-hidden",
                                                        selectedId === t.id
                                                            ? "border-brand bg-primary_alt ring-2 ring-brand/25"
                                                            : "border-secondary bg-primary hover:bg-primary_hover",
                                                    )}
                                                >
                                                    <span className="block text-sm font-semibold text-primary">{t.title}</span>
                                                    <span className="mt-1 block text-sm leading-snug text-tertiary">{t.description}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {showReadOnlyPreview ? (
                                    <div className="rounded-lg border border-secondary bg-secondary_alt px-3 py-2.5">
                                        <p className="text-xs font-medium text-tertiary">Message text (sent as-is)</p>
                                        <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-primary">{draft}</p>
                                        <button
                                            type="button"
                                            className="mt-3 text-sm font-semibold text-brand-secondary hover:text-brand-secondary_hover"
                                            onClick={() => setEditorOpen(true)}
                                        >
                                            Customize before sending
                                        </button>
                                    </div>
                                ) : null}

                                {(editorOpen || isCustom) && selectedId ? (
                                    <TextArea
                                        label={isCustom ? "Your message" : "Edit message"}
                                        hint={
                                            isCustom
                                                ? "Compose the full text. Nothing is sent until you click Send."
                                                : "Adjust the wording if needed; the template link is kept only if the text still matches the original."
                                        }
                                        value={draft}
                                        onChange={setDraft}
                                        rows={isCustom ? 5 : 4}
                                        placeholder={isCustom ? "Type your message…" : undefined}
                                    />
                                ) : null}

                                {editorOpen && selectedId && selectedId !== "custom" && selectedPreset ? (
                                    <button
                                        type="button"
                                        className="self-start text-sm font-semibold text-tertiary hover:text-secondary_hover"
                                        onClick={() => {
                                            setDraft(selectedPreset.body);
                                            setEditorOpen(false);
                                        }}
                                    >
                                        Use original wording
                                    </button>
                                ) : null}
                            </div>

                            <div className="flex flex-wrap justify-start gap-3 border-t border-secondary p-6">
                                <Button type="button" isDisabled={!canSend} onClick={handleSend}>
                                    Send message
                                </Button>
                                <Button color="tertiary" type="button" onClick={() => onOpenChange(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}
