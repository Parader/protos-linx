import { useEffect, useMemo, useState } from "react";
import { Heading } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { TextArea } from "@/components/base/textarea/textarea";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { useVEDLocale } from "@/lib/ved-locale";
import { cx } from "@/utils/cx";

type StaffTemplateOption = {
    id: string;
    title: string;
    description: string;
    body: string;
};

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "waiting" | "patient";
    waitingCount?: number;
    patientName?: string;
    onSend: (body: string, templateId?: string) => void;
};

export function VersionAStaffMessageDialog({ isOpen, onOpenChange, mode, waitingCount = 0, patientName, onSend }: Props) {
    const { strings } = useVEDLocale();
    const sd = strings.worklistAb.staffDialog;
    const st = strings.worklistAb.staffTemplates;

    const ALL_STAFF_MESSAGE_OPTIONS: StaffTemplateOption[] = useMemo(
        () => [
            { id: "queue_status", ...st.queue_status },
            { id: "delay", ...st.delay },
            { id: "return_er", ...st.return_er },
            { id: "wrong_number", ...st.wrong_number },
            { id: "custom", title: st.custom.title, description: st.custom.description, body: "" },
        ],
        [st],
    );

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
        [selectedId, ALL_STAFF_MESSAGE_OPTIONS],
    );

    const isCustom = selectedId === "custom";
    const showReadOnlyPreview = selectedPreset && !isCustom && !editorOpen && draft.trim().length > 0;

    const title = mode === "waiting" ? sd.titleWaiting : sd.titlePatient;
    const subtitle =
        mode === "waiting"
            ? waitingCount === 1
                ? sd.subtitleWaitingOne
                : sd.subtitleWaitingMany(waitingCount)
            : patientName
              ? sd.subtitlePatientNamed(patientName)
              : sd.subtitlePatientGeneric;

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
                                    <p className="mb-2 text-xs font-medium text-tertiary">{sd.chooseMessage}</p>
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
                                        <p className="text-xs font-medium text-tertiary">{sd.messagePreviewLabel}</p>
                                        <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-primary">{draft}</p>
                                        <button
                                            type="button"
                                            className="mt-3 text-sm font-semibold text-brand-secondary hover:text-brand-secondary_hover"
                                            onClick={() => setEditorOpen(true)}
                                        >
                                            {sd.customizeBeforeSend}
                                        </button>
                                    </div>
                                ) : null}

                                {(editorOpen || isCustom) && selectedId ? (
                                    <TextArea
                                        label={isCustom ? sd.yourMessage : sd.editMessage}
                                        hint={isCustom ? sd.hintCustom : sd.hintEdit}
                                        value={draft}
                                        onChange={setDraft}
                                        rows={isCustom ? 5 : 4}
                                        placeholder={isCustom ? sd.placeholderCustom : undefined}
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
                                        {sd.useOriginal}
                                    </button>
                                ) : null}
                            </div>

                            <div className="flex flex-wrap justify-start gap-3 border-t border-secondary p-6">
                                <Button type="button" isDisabled={!canSend} onClick={handleSend}>
                                    {sd.send}
                                </Button>
                                <Button color="tertiary" type="button" onClick={() => onOpenChange(false)}>
                                    {sd.cancel}
                                </Button>
                            </div>
                        </div>
                    )}
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}
