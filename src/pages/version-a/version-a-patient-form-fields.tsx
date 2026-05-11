import { useId } from "react";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { Input, InputBase, TextField } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { useVEDLocale } from "@/lib/ved-locale";
import { type FormPatientPriority, type PreferredCommunication } from "@/pages/version-a/version-a-shared";
import { cx } from "@/utils/cx";

const FORM_PRIORITIES: FormPatientPriority[] = ["P1", "P2", "P3"];

type ReasonInputProps = {
    value: string;
    onChange: (v: string) => void;
};

/** Single-line reason with datalist suggestions as the user types. */
export function PatientFormReasonInput({ value, onChange }: ReasonInputProps) {
    const { strings } = useVEDLocale();
    const f = strings.worklistAb.form;
    const listId = `consultation-reason-${useId().replace(/:/g, "")}`;
    return (
        <div className="sm:col-span-2">
            <TextField value={value} onChange={onChange} className="w-full" size="md">
                {({ isRequired, isInvalid }) => (
                    <>
                        <Label isRequired={isRequired} isInvalid={isInvalid}>
                            {f.reasonLabel}
                        </Label>
                        <InputBase list={listId} placeholder={f.reasonPlaceholder} />
                    </>
                )}
            </TextField>
            <datalist id={listId}>
                {strings.worklistAb.consultationReasons.map((r: string) => (
                    <option key={r} value={r} />
                ))}
            </datalist>
        </div>
    );
}

type ReachProps = {
    preferredCommunication: PreferredCommunication;
    phone: string;
    email: string;
    onPreferredChange: (v: PreferredCommunication) => void;
    onPhoneChange: (v: string) => void;
    onEmailChange: (v: string) => void;
};

/** SMS or email only — no voice call. Phone number is for SMS. */
export function PatientFormReachSection({
    preferredCommunication,
    phone,
    email,
    onPreferredChange,
    onPhoneChange,
    onEmailChange,
}: ReachProps) {
    const { strings } = useVEDLocale();
    const f = strings.worklistAb.form;
    const smsChannel = preferredCommunication === "sms";
    const emailChannel = preferredCommunication === "email";

    return (
        <div className="sm:col-span-2 rounded-xl border border-secondary bg-secondary_alt/50 p-4">
            <Label className="text-sm font-semibold text-primary">{f.reachTitle}</Label>
            <p className="mt-1 text-xs leading-snug text-tertiary">{f.reachHint}</p>

            <div className="mt-3">
                <RadioGroup
                    value={preferredCommunication}
                    onChange={(v) => {
                        if (v === "sms" || v === "email") onPreferredChange(v);
                    }}
                    className="flex-row gap-6"
                >
                    <RadioButton value="sms" label={f.sms} />
                    <RadioButton value="email" label={f.email} />
                </RadioGroup>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div
                    className={cx(
                        "rounded-lg p-0.5 transition-[box-shadow]",
                        smsChannel && "bg-[#E9F2FF]/80 ring-2 ring-[#2684FF]/45",
                    )}
                >
                    <Input label={f.mobileSms} value={phone} onChange={onPhoneChange} placeholder={f.mobilePlaceholder} />
                </div>
                <div
                    className={cx(
                        "rounded-lg p-0.5 transition-[box-shadow]",
                        emailChannel && "bg-[#E9F2FF]/80 ring-2 ring-[#2684FF]/45",
                    )}
                >
                    <Input label={f.emailLabel} value={email} onChange={onEmailChange} placeholder={f.emailPlaceholder} />
                </div>
            </div>
        </div>
    );
}

type PriorityProps = {
    priority: FormPatientPriority;
    onChange: (p: FormPatientPriority) => void;
};

export function PatientFormPriorityBar({ priority, onChange }: PriorityProps) {
    const { strings } = useVEDLocale();
    const f = strings.worklistAb.form;
    const descriptions: Record<FormPatientPriority, { hint: string; accent: string; ring: string; tier: string }> = {
        P1: {
            hint: f.priorityP1,
            tier: f.priorityTierP1,
            accent: "text-[#b42318]",
            ring: "data-[selected]:ring-[#f04438]/40 data-[selected]:bg-[#fef3f2] data-[selected]:border-[#fda29b]",
        },
        P2: {
            hint: f.priorityP2,
            tier: f.priorityTierP2,
            accent: "text-[#b54708]",
            ring: "data-[selected]:ring-[#f79009]/35 data-[selected]:bg-[#fffaeb] data-[selected]:border-[#fedf89]",
        },
        P3: {
            hint: f.priorityP3,
            tier: f.priorityTierP3,
            accent: "text-[#027a48]",
            ring: "data-[selected]:ring-[#12b76a]/35 data-[selected]:bg-[#ecfdf3] data-[selected]:border-[#a6f4c5]",
        },
    };

    return (
        <div className="sm:col-span-2">
            <Label className="text-sm font-semibold text-primary">{f.priority}</Label>
            <div className="mt-2">
                <RadioGroup
                    value={priority}
                    onChange={(v) => {
                        if (v === "P1" || v === "P2" || v === "P3") onChange(v);
                    }}
                    className="grid gap-2 sm:grid-cols-3"
                >
                    {FORM_PRIORITIES.map((p) => (
                        <RadioButton
                            key={p}
                            value={p}
                            className={(state) =>
                                cx(
                                    "group relative w-full rounded-xl border border-secondary bg-white p-3 ring-0 ring-inset transition-[box-shadow,background-color,border-color] duration-200",
                                    "hover:bg-secondary_alt/50",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0573d8]/35",
                                    state.isSelected && "ring-2",
                                    descriptions[p].ring,
                                )
                            }
                            label={
                                <div className="flex min-w-0 flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className={cx("text-sm font-semibold", descriptions[p].accent)}>{p}</span>
                                        <span className="text-xs font-medium text-tertiary">{descriptions[p].tier}</span>
                                    </div>
                                    <span className="text-xs leading-snug text-tertiary">{descriptions[p].hint}</span>
                                </div>
                            }
                        />
                    ))}
                </RadioGroup>
            </div>
        </div>
    );
}
