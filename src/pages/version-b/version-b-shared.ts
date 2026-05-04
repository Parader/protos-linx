import type { Patient, PatientStatus } from "@/pages/version-b/version-b-patient-card";

export type PatientPriority = "P1" | "P2" | "P3" | "P4" | "P5";
/** Add/edit forms: SMS or email only (no voice call). */
export type PreferredCommunication = "email" | "sms";

/** Priority options allowed when adding or editing a patient in this prototype. */
export type FormPatientPriority = "P4" | "P5";

export function normalizeFormPriority(p: PatientPriority): FormPatientPriority {
    return p === "P4" || p === "P5" ? p : "P5";
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

/** Version B: three board columns; each column holds one combined list (statuses shown on cards). */
export type BoardColumnId = "queue" | "prep" | "done";

export const BOARD_COLUMN_META: { id: BoardColumnId; title: string; subtitle: string }[] = [
    { id: "queue", title: "Queue", subtitle: "Waiting list & consent intake" },
    { id: "prep", title: "Prep & callback", subtitle: "Return confirmed & active callback" },
    { id: "done", title: "Completed", subtitle: "Closed visits" },
];

export function statusToColumn(status: PatientStatus): BoardColumnId {
    if (status === "waiting" || status === "consent") return "queue";
    if (status === "confirmed" || status === "calledBack") return "prep";
    return "done";
}

/**
 * When dropping onto a column surface (not another card), map to a concrete workflow status.
 * Keeps `consent` if the patient was already in pending consent and stays in Queue.
 */
export function statusWhenDroppedOnColumn(column: BoardColumnId, previousStatus: PatientStatus | undefined): PatientStatus {
    if (column === "queue") {
        return previousStatus === "consent" ? "consent" : "waiting";
    }
    if (column === "prep") return "confirmed";
    return "completed";
}

const STATUS_ORDER_IN_QUEUE: PatientStatus[] = ["waiting", "consent"];
const STATUS_ORDER_IN_PREP: PatientStatus[] = ["confirmed", "calledBack"];

/** Stable ordering inside a combined column list (status bands, then time). */
export function comparePatientsInBoardColumn(a: Patient, b: Patient, column: BoardColumnId): number {
    const order = column === "queue" ? STATUS_ORDER_IN_QUEUE : column === "prep" ? STATUS_ORDER_IN_PREP : (["completed"] as PatientStatus[]);
    const ia = order.indexOf(a.status);
    const ib = order.indexOf(b.status);
    if (ia !== ib) return ia - ib;
    return a.createdAt - b.createdAt || a.id.localeCompare(b.id);
}

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
