import type { Patient } from "@/pages/version-b/version-b-patient-card";
import type { FormPatientPriority } from "@/pages/version-b/version-b-shared";

const FIRST = [
    "Alex",
    "Sam",
    "Jordan",
    "Taylor",
    "Riley",
    "Casey",
    "Morgan",
    "Quinn",
    "Avery",
    "Jamie",
    "Drew",
    "Skyler",
    "Reese",
    "Parker",
    "Rowan",
] as const;

const LAST = [
    "Nguyen",
    "Patel",
    "Chen",
    "Roy",
    "Tremblay",
    "Gagnon",
    "Bélanger",
    "Fortin",
    "Leblanc",
    "Morin",
    "Pelletier",
    "Ouellet",
    "Lavoie",
    "Bergeron",
    "Côté",
] as const;

const NOTE_SNIPPETS = [
    "Symptoms worsened overnight.",
    "Stable since last visit.",
    "Allergic to penicillin.",
    "Prefers callback after 5pm.",
    "Interpreter may be needed.",
    "Tried OTC, limited relief.",
    "History of hypertension.",
    "",
] as const;

const PRIORITIES: FormPatientPriority[] = ["P4", "P5"];
const COMMS: Patient["preferredCommunication"][] = ["email", "sms"];

function pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]!;
}

function randInt(min: number, max: number) {
    return Math.floor(min + Math.random() * (max - min + 1));
}

function makeId() {
    return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `p_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function fileNumberUnique(salt: number) {
    const base = Date.now() % 1_000_000_000;
    return String((base + salt * 7919) % 1_000_000_000).padStart(9, "0");
}

export type RandomPatientFormFields = {
    name: string;
    fileNumber: string;
    phone: string;
    email: string;
    preferredCommunication: Patient["preferredCommunication"];
    reason: string;
    priority: FormPatientPriority;
    notes: string;
    consentGiven: boolean;
};

/** Fills the “New patient” form with plausible random values (testing / demos). */
export function randomPatientFormFields(consultationReasons: readonly string[]): RandomPatientFormFields {
    const first = pick(FIRST);
    const last = pick(LAST);
    const n = randInt(1, 9999);
    const fileNumber = fileNumberUnique(n);
    const phone = `(${randInt(200, 999)}) ${randInt(200, 999)}-${randInt(1000, 9999)}`;
    const email = `${first.toLowerCase()}.${last.toLowerCase()}.${n}@example.com`;

    return {
        name: `${first} ${last}`,
        fileNumber,
        phone,
        email,
        preferredCommunication: pick(COMMS),
        reason: pick(consultationReasons),
        priority: pick(PRIORITIES),
        notes: pick(NOTE_SNIPPETS),
        consentGiven: Math.random() > 0.55,
    };
}

/** Many patients with varied status/priority for load and UX testing. */
export function generateRandomPatients(count: number, consultationReasons: readonly string[]): Patient[] {
    const safeCount = Math.min(500, Math.max(0, Math.floor(count)));
    const out: Patient[] = [];
    const now = Date.now();

    for (let i = 0; i < safeCount; i++) {
        const first = pick(FIRST);
        const last = pick(LAST);
        const form = {
            name: `${first} ${last}`,
            fileNumber: fileNumberUnique(i + safeCount * 17),
            phone: `(${randInt(200, 999)}) ${randInt(200, 999)}-${randInt(1000, 9999)}`,
            email: `${first.toLowerCase()}.${last.toLowerCase()}.${i}.${randInt(10, 99)}@example.com`,
            preferredCommunication: pick(COMMS),
            reason: pick(consultationReasons),
            priority: pick(PRIORITIES),
            notes: Math.random() > 0.35 ? pick(NOTE_SNIPPETS) : undefined,
            consentGiven: true,
        };

        /** All bulk patients start in the first column (Waiting). `createdAt` steps preserve list order. */
        const createdAt = now + i;

        out.push({
            id: makeId(),
            ...form,
            consentGiven: form.consentGiven,
            status: "waiting",
            cancelled: false,
            createdAt,
            statusHistory: [{ status: "waiting", enteredAt: createdAt }],
        });
    }

    return out;
}
