import type { PatientStatus } from "@/pages/version-d/version-d-shared";

export type PatientProcessBasePath = "/version-c" | "/version-d";

type MinimalPatient = { status: PatientStatus };

/**
 * Canonical patient-facing URL for a chart: consent/waiting flows use `patient-consent`;
 * recall, return confirmed, and completed charts use `confirm-return` (which already encodes
 * invalid / unknown / completed / ineligible messaging).
 */
export function buildCanonicalPatientProcessUrl(
    basePath: PatientProcessBasePath,
    patientId: string,
    patient: MinimalPatient | null,
): string {
    const q = `?patientId=${encodeURIComponent(patientId.trim())}`;
    if (!patient) {
        return `${basePath}/confirm-return${q}`;
    }
    if (patient.status === "consentPending" || patient.status === "waiting") {
        return `${basePath}/patient-consent${q}`;
    }
    return `${basePath}/confirm-return${q}`;
}
