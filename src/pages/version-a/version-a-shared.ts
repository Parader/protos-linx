import type { Patient, PatientStatus } from "@/pages/version-a/version-a-patient-card";

export type PatientPriority = "P1" | "P2" | "P3" | "P4" | "P5";
/** Add/edit forms: SMS or email only (no voice call). */
export type PreferredCommunication = "email" | "sms";

/** Priority options allowed when adding or editing a patient in this prototype. */
export type FormPatientPriority = "P1" | "P2" | "P3";

export function normalizeFormPriority(p: PatientPriority): FormPatientPriority {
    return p === "P1" || p === "P2" || p === "P3" ? p : "P3";
}

/** Add patient “reason for consultation” suggestions (datalist + random demos). */
export const CONSULTATION_REASON_SUGGESTIONS: readonly string[] = [
    "Headache",
    "Chest pain",
    "Abdominal pain",
    "Shortness of breath",
    "Fever",
    "Dizziness",
    "Back pain",
    "Sore throat",
    "Cut / laceration",
    "Anxiety / panic",
    "Nausea",
    "Rash",
    "Follow-up",
    "Medication refill",
];

export const STATUS_LABELS: Record<PatientStatus, string> = {
    consent: "Consent",
    waiting: "Waiting",
    calledBack: "Called back",
    confirmed: "Confirmed",
    completed: "Completed",
};

/** Column titles for the first board column (waiting + consent lanes). */
export const QUEUE_LANE_LABELS: Record<"waiting" | "consent", string> = {
    waiting: "Waiting",
    consent: "Pending consent",
};

export type BoardSection = { key: string; statuses: PatientStatus[] };

export const BOARD_SECTIONS: BoardSection[] = [
    { key: "queue", statuses: ["waiting", "consent"] },
    { key: "prep", statuses: ["confirmed", "calledBack"] },
    { key: "done", statuses: ["completed"] },
];

/** Move patient to `next` status and place them at the bottom of that queue (after others with the same status). */
export function movePatientToStatus(
    patients: Patient[],
    patientId: string,
    next: PatientStatus,
    opts?: { cancelled?: boolean },
): Patient[] {
    const without = patients.filter((p) => p.id !== patientId);
    const base = patients.find((p) => p.id === patientId);
    if (!base) return patients;

    if (base.status === next) {
        if (next === "completed" && opts?.cancelled !== undefined && opts.cancelled !== base.cancelled) {
            return patients.map((p) => (p.id === patientId ? { ...p, cancelled: opts.cancelled } : p));
        }
        return patients;
    }

    const cancelled = next === "completed" ? (opts?.cancelled !== undefined ? opts.cancelled : false) : false;
    const hist = base.statusHistory ?? [{ status: base.status, enteredAt: base.createdAt }];
    const updated: Patient = {
        ...base,
        status: next,
        cancelled,
        statusHistory: [...hist, { status: next, enteredAt: Date.now() }],
    };
    let insertAt = without.length;
    for (let i = without.length - 1; i >= 0; i--) {
        if (without[i].status === next) {
            insertAt = i + 1;
            break;
        }
    }
    const result = [...without];
    result.splice(insertAt, 0, updated);
    return result;
}

export function createId() {
    return typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `p_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
