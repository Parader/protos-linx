export type PatientPriority = "P3" | "P4" | "P5";

/** Motif de fermeture lorsque le dossier est terminé et annulé (démo). */
export type PatientCompletionCause =
    | "no_show"
    | "consent_withdrawn"
    | "consent_refused"
    /** Annulation volontaire depuis la page publique (rappel / retour confirmé). */
    | "patient_cancelled_queue"
    /** Annulation depuis la liste de travail (motif saisi par l’équipe). */
    | "staff_cancelled";

export type PatientStatus =
    | "waiting"
    | "consentPending"
    | "recall"
    | "arrived"
    | "completed";

export type NotificationChannel = "sms" | "email";
export type NotificationDirection = "outbound" | "inbound";

export type CommunicationLanguage = "fr" | "en";

export type NotificationEntry = {
    id: string;
    channel: NotificationChannel;
    direction: NotificationDirection;
    body: string;
    sentAt: number;
    /** Present for automated consent invitations — used by the patient POV mock to render a tappable link. */
    consentUrl?: string;
    /** Optional action link embedded in the message (e.g. confirm return). */
    actionUrl?: string;
};

export type Patient = {
    id: string;
    firstName: string;
    lastName: string;
    fileNumber: string;
    phone?: string;
    email?: string;
    communicationLanguage?: CommunicationLanguage;
    reason: string;
    notes?: string;
    priority: PatientPriority;
    status: PatientStatus;
    createdAt: number;
    /** Horodatage du passage en « terminé » — tri colonne Terminé (plus récent en haut). */
    completedAt?: number;
    /** Completed but cancelled/no-show. */
    cancelled?: boolean;
    /** Présent seulement si `completed` et `cancelled` : pourquoi le dossier a été fermé. */
    completionCause?: PatientCompletionCause;
    /** Motif libre lorsque `completionCause === "staff_cancelled"`. */
    cancellationReason?: string;
    /** Consent bypassed because it was managed manually outside the platform. */
    consentManagedManually?: boolean;
    /**
     * Statut au moment d’une fermeture annulée — permet de rouvrir dans la même étape (p. ex. consentement en attente vs attente).
     */
    preCancellationStatus?: PatientStatus;
};

export type BoardColumnId = "waiting" | "recall" | "completed";

/** Entrées du journal d’activité (rapports) — messages et événements file. */
export type ActivityLogKind =
    | "message_outbound"
    | "message_inbound"
    | "patient_added"
    | "demo_patients_added"
    | "patient_edited"
    | "status_menu"
    | "status_drag"
    | "consent_accepted"
    | "consent_refused"
    | "consent_withdrawn"
    | "return_confirmed"
    | "patient_left_queue_via_link"
    | "staff_cancelled"
    | "board_cleared";

export type ActivityLogEntry = {
    id: string;
    at: number;
    kind: ActivityLogKind;
    /** `null` pour les entrées globales (ex. effacement de la liste). */
    patientId: string | null;
    patientLabel: string;
    summary: string;
    detail?: string;
    channel?: NotificationChannel;
    direction?: NotificationDirection;
};

export function patientStatusLabelFr(s: PatientStatus): string {
    switch (s) {
        case "waiting":
            return "En attente";
        case "consentPending":
            return "Consentement en attente";
        case "recall":
            return "Rappel";
        case "arrived":
            return "Retour confirmé";
        case "completed":
            return "Terminé";
        default:
            return s;
    }
}

export const BOARD_COLUMN_META: { id: BoardColumnId; title: string }[] = [
    { id: "waiting", title: "Attente" },
    { id: "recall", title: "Rappel" },
    { id: "completed", title: "Terminé" },
];

export function fullName(p: Patient): string {
    return `${p.firstName} ${p.lastName}`.trim() || "Unnamed patient";
}

export function createId() {
    return typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `p_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function statusToColumn(status: PatientStatus): BoardColumnId {
    if (status === "waiting" || status === "consentPending") return "waiting";
    if (status === "recall" || status === "arrived") return "recall";
    return "completed";
}

export function defaultStatusForNewPatient(consentManagedManually: boolean | undefined): PatientStatus {
    return consentManagedManually ? "waiting" : "consentPending";
}

/** Consentement obtenu (plateforme ou manuel), hors refus explicite — pour l’affichage de la fiche en édition. */
export function patientHasConsentEffectivelyRecorded(p: Patient): boolean {
    if (p.consentManagedManually) return true;
    if (p.status === "consentPending") return false;
    if (p.status === "completed" && p.cancelled && p.completionCause === "consent_refused") return false;
    return true;
}

/** Ordre d’arrivée dans la file (inscription) : le plus ancien en premier. */
export function comparePatientsByArrivalAsc(a: Patient, b: Patient): number {
    const d = a.createdAt - b.createdAt;
    return d !== 0 ? d : a.id.localeCompare(b.id);
}

/** Colonne Terminé : dossier complété le plus récemment en premier. */
export function comparePatientsCompletedDesc(a: Patient, b: Patient): number {
    const ta = a.completedAt ?? a.createdAt;
    const tb = b.completedAt ?? b.createdAt;
    const d = tb - ta;
    return d !== 0 ? d : a.id.localeCompare(b.id);
}

/**
 * Fiche sans consentement enregistré (actif ou avant une fermeture annulée) : le passage en colonne Rappel
 * doit être précédé d’une confirmation explicite par l’équipe.
 */
export function patientRequiresConsentAttestationForRecallMove(p: Patient): boolean {
    if (p.consentManagedManually) return false;
    if (p.status === "consentPending") return true;
    if (p.status === "completed" && p.cancelled && p.preCancellationStatus === "consentPending") return true;
    return false;
}

export function statusWhenDroppedOnColumn(column: BoardColumnId, dragged: Patient | undefined): PatientStatus {
    const prevStatus = dragged?.status;
    if (column === "waiting") {
        if (dragged?.status === "completed" && dragged.cancelled && dragged.preCancellationStatus != null) {
            const snap = dragged.preCancellationStatus;
            if (snap === "consentPending" || snap === "waiting") {
                return snap;
            }
            return "waiting";
        }
        return prevStatus === "consentPending" ? "consentPending" : "waiting";
    }
    if (column === "recall") return "recall";
    return "completed";
}

export function movePatientToStatus(
    patients: Patient[],
    patientId: string,
    next: PatientStatus,
    opts?: { cancelled?: boolean; completionCause?: PatientCompletionCause; cancellationReason?: string },
) {
    return patients.map((p) => {
        if (p.id !== patientId) return p;
        if (p.status === next && opts?.cancelled === undefined && opts?.completionCause === undefined && opts?.cancellationReason === undefined)
            return p;
        const cancelledNext = next === "completed" ? (opts?.cancelled ?? false) : false;
        const completionCauseNext =
            next === "completed" && cancelledNext ? opts?.completionCause ?? "no_show" : undefined;

        const cancellationReasonNext =
            next === "completed" && cancelledNext && completionCauseNext === "staff_cancelled"
                ? (opts?.cancellationReason?.trim() || "Non spécifié")
                : undefined;

        const completedAt =
            next === "completed"
                ? p.status === "completed" && p.completedAt != null
                    ? p.completedAt
                    : Date.now()
                : undefined;

        const preCancellationStatus = next === "completed" && cancelledNext ? p.status : undefined;

        return {
            ...p,
            status: next,
            cancelled: cancelledNext,
            completionCause: completionCauseNext,
            completedAt,
            cancellationReason: cancellationReasonNext,
            preCancellationStatus,
        };
    });
}

