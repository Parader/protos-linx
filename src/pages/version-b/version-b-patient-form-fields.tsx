import type { Key } from "@react-types/shared";
import { useId } from "react";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import { Input, InputBase, TextField } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { useVEDLocale } from "@/lib/ved-locale";
import { type FormPatientPriority, type PreferredCommunication } from "@/pages/version-b/version-b-shared";
import { cx } from "@/utils/cx";

const FORM_PRIORITIES: FormPatientPriority[] = ["P4", "P5"];

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
                <ButtonGroup
                    size="sm"
                    selectionMode="single"
                    disallowEmptySelection
                    selectedKeys={new Set<Key>([preferredCommunication])}
                    onSelectionChange={(keys) => {
                        const k = [...keys][0];
                        if (k === "sms" || k === "email") onPreferredChange(k);
                    }}
                >
                    <ButtonGroupItem id="sms">{f.sms}</ButtonGroupItem>
                    <ButtonGroupItem id="email">{f.email}</ButtonGroupItem>
                </ButtonGroup>
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
    const descriptions: Record<FormPatientPriority, string> = {
        P4: f.priorityP4,
        P5: f.priorityP5,
    };
    return (
        <div className="sm:col-span-2">
            <Label className="text-sm font-semibold text-primary">{f.priority}</Label>
            <div className="mt-2">
                <ButtonGroup
                    size="sm"
                    selectionMode="single"
                    disallowEmptySelection
                    selectedKeys={new Set<Key>([priority])}
                    onSelectionChange={(keys) => {
                        const k = [...keys][0];
                        if (k === "P4" || k === "P5") onChange(k);
                    }}
                >
                    {FORM_PRIORITIES.map((p) => (
                        <ButtonGroupItem key={p} id={p} className="min-w-[9.5rem] justify-start">
                            <span className="flex min-w-0 flex-col items-start leading-tight">
                                <span className="text-sm font-semibold">{p}</span>
                                <span className="mt-0.5 text-[10px] font-medium text-tertiary">{descriptions[p]}</span>
                            </span>
                        </ButtonGroupItem>
                    ))}
                </ButtonGroup>
            </div>
        </div>
    );
}
