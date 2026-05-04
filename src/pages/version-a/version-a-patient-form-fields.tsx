import { useId } from "react";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { Input, InputBase, TextField } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import {
    CONSULTATION_REASON_SUGGESTIONS,
    type FormPatientPriority,
    type PreferredCommunication,
} from "@/pages/version-a/version-a-shared";
import { cx } from "@/utils/cx";

const FORM_PRIORITIES: FormPatientPriority[] = ["P1", "P2", "P3"];

export { CONSULTATION_REASON_SUGGESTIONS };

type ReasonInputProps = {
    value: string;
    onChange: (v: string) => void;
};

/** Single-line reason with datalist suggestions as the user types. */
export function PatientFormReasonInput({ value, onChange }: ReasonInputProps) {
    const listId = `consultation-reason-${useId().replace(/:/g, "")}`;
    return (
        <div className="sm:col-span-2">
            <TextField value={value} onChange={onChange} className="w-full" size="md">
                {({ isRequired, isInvalid }) => (
                    <>
                        <Label isRequired={isRequired} isInvalid={isInvalid}>
                            Reason for consultation
                        </Label>
                        <InputBase list={listId} placeholder="Headache, fever, etc." />
                    </>
                )}
            </TextField>
            <datalist id={listId}>
                {CONSULTATION_REASON_SUGGESTIONS.map((r) => (
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
    const smsChannel = preferredCommunication === "sms";
    const emailChannel = preferredCommunication === "email";

    return (
        <div className="sm:col-span-2 rounded-xl border border-secondary bg-secondary_alt/50 p-4">
            <Label className="text-sm font-semibold text-primary">Reach the patient</Label>
            <p className="mt-1 text-xs leading-snug text-tertiary">
                SMS or email only (no phone call). SMS uses the mobile number below.
            </p>

            <div className="mt-3">
                <RadioGroup
                    value={preferredCommunication}
                    onChange={(v) => {
                        if (v === "sms" || v === "email") onPreferredChange(v);
                    }}
                    className="flex-row gap-6"
                >
                    <RadioButton value="sms" label="SMS" />
                    <RadioButton value="email" label="Email" />
                </RadioGroup>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div
                    className={cx(
                        "rounded-lg p-0.5 transition-[box-shadow]",
                        smsChannel && "bg-[#E9F2FF]/80 ring-2 ring-[#2684FF]/45",
                    )}
                >
                    <Input label="Mobile (SMS)" value={phone} onChange={onPhoneChange} placeholder="(555) 555-5555" />
                </div>
                <div
                    className={cx(
                        "rounded-lg p-0.5 transition-[box-shadow]",
                        emailChannel && "bg-[#E9F2FF]/80 ring-2 ring-[#2684FF]/45",
                    )}
                >
                    <Input label="Email" value={email} onChange={onEmailChange} placeholder="jane@example.com" />
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
    const descriptions: Record<FormPatientPriority, { hint: string; accent: string; ring: string }> = {
        P1: {
            hint: "Immediate — critical symptoms, life-threatening risk.",
            accent: "text-[#b42318]",
            ring: "data-[selected]:ring-[#f04438]/40 data-[selected]:bg-[#fef3f2] data-[selected]:border-[#fda29b]",
        },
        P2: {
            hint: "Very urgent — needs quick assessment and action.",
            accent: "text-[#b54708]",
            ring: "data-[selected]:ring-[#f79009]/35 data-[selected]:bg-[#fffaeb] data-[selected]:border-[#fedf89]",
        },
        P3: {
            hint: "Urgent — stable, but should be seen soon.",
            accent: "text-[#027a48]",
            ring: "data-[selected]:ring-[#12b76a]/35 data-[selected]:bg-[#ecfdf3] data-[selected]:border-[#a6f4c5]",
        },
    };

    return (
        <div className="sm:col-span-2">
            <Label className="text-sm font-semibold text-primary">Priority</Label>
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
                                        <span className="text-xs font-medium text-tertiary">{p === "P1" ? "Highest" : p === "P2" ? "High" : "Medium"}</span>
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
