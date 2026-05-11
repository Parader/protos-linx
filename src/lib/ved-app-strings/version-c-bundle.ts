import type { VEDLocale } from "@/lib/ved-locale";
import { getVersionCdPages, type VersionCdPagesStrings } from "@/lib/ved-app-strings/version-cd-pages";

/** Version C / D shared care statuses (UI labels). */
export type CUiPatientStatus = "waiting" | "consentPending" | "recall" | "arrived" | "completed";
export type CBoardColumnId = "waiting" | "recall" | "completed";

export type VersionCStringBundle = {
    shared: {
        patientStatus: Record<CUiPatientStatus, string>;
        boardColumnTitle: Record<CBoardColumnId, string>;
        unnamedPatient: string;
        dash: string;
    };
    worklist: {
        title: string;
        settings: string;
        settingsTitle: string;
        settingsSubtitle: string;
        close: string;
        listSection: string;
        addTenPatients: string;
        clearList: string;
        confirmClear: string;
        clearWarning: string;
        messagingSection: string;
        messagingBlurb: string;
        sendBulkMessage: string;
        searchPlaceholder: string;
        newPatient: string;
        emptyLaneDrag: string;
        emptyLanePrefix: string;
        boardClearSummary: string;
        boardClearDetail: (n: number) => string;
        statusMenuSummary: string;
        statusMenuDetail: (from: string, to: string) => string;
    };
    activity: {
        messageOut: (channel: string) => string;
        messageIn: (channel: string) => string;
        consentAccepted: string;
        returnConfirmed: string;
        consentRefused: string;
        consentWithdrawn: string;
        patientLeftViaLink: string;
        dragMoveSummary: string;
        dragMoveDetail: (from: string, to: string) => string;
        demoPatientsAdded: (n: number) => string;
        demoPatientsDetail: string;
        patientAdded: string;
        patientEdited: string;
        patientEditedOldLabel: (label: string) => string;
        staffCancelled: string;
        channelSms: string;
        channelEmail: string;
        acceptConsentDetail: string;
        confirmReturnDetail: string;
        consentClosedRemoteDetail: string;
        patientCancelFromConfirmDetail: string;
        staffCancelUnspecified: string;
        /** Version D — no-show closure from staff. */
        staffNoShowSummary: string;
        staffNoShowDetail: string;
    };
    notifications: {
        smsConsentInvitePrefix: string;
        emailConsentInviteBody: (args: { patientName: string; consentUrl: string }) => string;
        recallPresentToErBody: (confirmUrl: string) => string;
        revokeRemoteService: string;
        /** Version D — manual consent enrollment (already recorded by staff). */
        smsManualConsentEnrollmentPrefix: string;
        emailManualConsentEnrollmentBody: (args: { patientName: string; consentUrl: string }) => string;
    };
    pages: VersionCdPagesStrings;
};

const VC: Record<VEDLocale, VersionCStringBundle> = {
    fr: {
        shared: {
            patientStatus: {
                waiting: "En attente",
                consentPending: "Consentement en attente",
                recall: "Rappel",
                arrived: "Retour confirmé",
                completed: "Terminé",
            },
            boardColumnTitle: { waiting: "Attente", recall: "Rappel", completed: "Terminé" },
            unnamedPatient: "Patient sans nom",
            dash: "—",
        },
        worklist: {
            title: "Liste de travail",
            settings: "Paramètres",
            settingsTitle: "Paramètres",
            settingsSubtitle: "Outils de démo : messagerie, ajout en lot et réinitialisation.",
            close: "Fermer",
            listSection: "Liste",
            addTenPatients: "Ajouter 10 patients",
            clearList: "Effacer la liste",
            confirmClear: "Confirmer l’effacement",
            clearWarning: "Cette action supprime tous les patients de la démo.",
            messagingSection: "Messagerie",
            messagingBlurb:
                "Ouvrir une fenêtre dédiée pour envoyer un message groupé (modèles : fermeture, réouverture, annulation du rappel, délais anormaux, etc.).",
            sendBulkMessage: "Envoyer un message…",
            searchPlaceholder: "Chercher par nom",
            newPatient: "Nouveau patient",
            emptyLaneDrag: "Glissez-déposez une carte patient ici.",
            emptyLanePrefix: "Aucun patient dans ",
            boardClearSummary: "Liste effacée",
            boardClearDetail: (n) => `${n} dossier${n > 1 ? "s" : ""} supprimé${n > 1 ? "s" : ""}.`,
            statusMenuSummary: "Changement de statut",
            statusMenuDetail: (from, to) => `${from} → ${to}`,
        },
        activity: {
            messageOut: (ch) => `Message envoyé (${ch})`,
            messageIn: (ch) => `Message reçu (${ch})`,
            consentAccepted: "Consentement accepté",
            returnConfirmed: "Retour confirmé",
            consentRefused: "Consentement refusé",
            consentWithdrawn: "Retrait du consentement",
            patientLeftViaLink: "Annulation par le patient (lien public)",
            dragMoveSummary: "Déplacement (glisser-déposer)",
            dragMoveDetail: (from, to) => `${from} → ${to}`,
            demoPatientsAdded: (n) => `${n} patient${n > 1 ? "s" : ""} de démonstration ajouté${n > 1 ? "s" : ""}`,
            demoPatientsDetail: "Ajout groupé depuis les paramètres de la liste.",
            patientAdded: "Patient ajouté à la liste",
            patientEdited: "Fiche patient modifiée",
            patientEditedOldLabel: (label) => `Ancien libellé : ${label}`,
            staffCancelled: "Dossier annulé par l’équipe",
            channelSms: "SMS",
            channelEmail: "Courriel",
            acceptConsentDetail: "Le patient passe en attente à distance.",
            confirmReturnDetail: "Le patient a confirmé son retour depuis le message.",
            consentClosedRemoteDetail: "Dossier clôturé — service à distance retiré.",
            patientCancelFromConfirmDetail: "Annulation depuis la page de confirmation.",
            staffCancelUnspecified: "Non spécifié",
            staffNoShowSummary: "Dossier terminé — absent",
            staffNoShowDetail: "Le patient ne s’est pas présenté.",
        },
        notifications: {
            smsConsentInvitePrefix: "Urgence — attente à distance: consentement requis. Ouvrez:",
            emailConsentInviteBody: ({ patientName, consentUrl }) =>
                [
                    `Bonjour ${patientName},`,
                    "",
                    "Vous avez été ajouté à la file d’attente de l’urgence avec suivi à distance. Vous devez finaliser votre consentement pour recevoir les messages liés à votre attente (p. ex. rappels).",
                    "",
                    "Avant de poursuivre, veuillez prendre connaissance du consentement éclairé et confirmer votre accord en ligne.",
                    "",
                    `Lien sécurisé : ${consentUrl}`,
                    "",
                    "Si vous n’êtes pas à l’origine de cette demande, ignorez ce message.",
                    "",
                    "— Attente à distance — Urgence",
                ].join("\n"),
            recallPresentToErBody: (confirmUrl) =>
                `Veuillez vous présenter à l’urgence. Confirmez votre retour depuis ce lien : ${confirmUrl}`,
            revokeRemoteService:
                "Vous êtes retiré du service de rappel et de suivi à distance. Vous ne recevrez plus de messages. Pour toute suite, présentez-vous en personne à l’urgence.",
            smsManualConsentEnrollmentPrefix: "Urgence — attente à distance: inscription confirmée. Suivi ou annulation:",
            emailManualConsentEnrollmentBody: ({ patientName, consentUrl }) =>
                [
                    `Bonjour ${patientName},`,
                    "",
                    "Vous êtes inscrit au service d’attente à distance pour la file d’attente de l’urgence. Le consentement a été enregistré par l’équipe pour votre dossier.",
                    "",
                    "Conservez ce lien pour consulter les informations de suivi ou pour annuler votre inscription au besoin :",
                    "",
                    `Lien sécurisé : ${consentUrl}`,
                    "",
                    "Si vous n’êtes pas à l’origine de cette demande, ignorez ce message.",
                    "",
                    "— Attente à distance — Urgence",
                ].join("\n"),
        },
        pages: getVersionCdPages("fr"),
    },
    en: {
        shared: {
            patientStatus: {
                waiting: "Waiting",
                consentPending: "Pending consent",
                recall: "Recall",
                arrived: "Return confirmed",
                completed: "Completed",
            },
            boardColumnTitle: { waiting: "Waiting", recall: "Recall", completed: "Completed" },
            unnamedPatient: "Unnamed patient",
            dash: "—",
        },
        worklist: {
            title: "Worklist",
            settings: "Settings",
            settingsTitle: "Settings",
            settingsSubtitle: "Demo tools: messaging, bulk add, and reset.",
            close: "Close",
            listSection: "List",
            addTenPatients: "Add 10 patients",
            clearList: "Clear list",
            confirmClear: "Confirm clear",
            clearWarning: "This removes every patient from the demo.",
            messagingSection: "Messaging",
            messagingBlurb:
                "Open a dedicated window to send a bulk message (templates: closure, ER reopening, recall cancellation, unusual delays, etc.).",
            sendBulkMessage: "Send a message…",
            searchPlaceholder: "Search by name",
            newPatient: "New patient",
            emptyLaneDrag: "Drag and drop a patient card here.",
            emptyLanePrefix: "No patients in ",
            boardClearSummary: "List cleared",
            boardClearDetail: (n) => `${n} chart${n === 1 ? "" : "s"} removed.`,
            statusMenuSummary: "Status change",
            statusMenuDetail: (from, to) => `${from} → ${to}`,
        },
        activity: {
            messageOut: (ch) => `Message sent (${ch})`,
            messageIn: (ch) => `Message received (${ch})`,
            consentAccepted: "Consent accepted",
            returnConfirmed: "Return confirmed",
            consentRefused: "Consent refused",
            consentWithdrawn: "Consent withdrawn",
            patientLeftViaLink: "Cancelled by patient (public link)",
            dragMoveSummary: "Move (drag and drop)",
            dragMoveDetail: (from, to) => `${from} → ${to}`,
            demoPatientsAdded: (n) => `${n} demo patient${n === 1 ? "" : "s"} added`,
            demoPatientsDetail: "Bulk add from list settings.",
            patientAdded: "Patient added to list",
            patientEdited: "Patient chart updated",
            patientEditedOldLabel: (label) => `Previous label: ${label}`,
            staffCancelled: "Chart cancelled by staff",
            channelSms: "SMS",
            channelEmail: "Email",
            acceptConsentDetail: "Patient moved to remote waiting.",
            confirmReturnDetail: "Patient confirmed return from the message.",
            consentClosedRemoteDetail: "Chart closed — remote follow-up ended.",
            patientCancelFromConfirmDetail: "Cancelled from the confirmation page.",
            staffCancelUnspecified: "Not specified",
            staffNoShowSummary: "Chart closed — no show",
            staffNoShowDetail: "The patient did not present.",
        },
        notifications: {
            smsConsentInvitePrefix: "ER — remote waiting: consent required. Open:",
            emailConsentInviteBody: ({ patientName, consentUrl }) =>
                [
                    `Hello ${patientName},`,
                    "",
                    "You were added to the emergency department’s remote waiting list. Please complete consent to receive messages about your wait (for example, recalls).",
                    "",
                    "Before continuing, review the informed consent and confirm your agreement online.",
                    "",
                    `Secure link: ${consentUrl}`,
                    "",
                    "If you did not request this, you can ignore this message.",
                    "",
                    "— Remote waiting — Emergency department",
                ].join("\n"),
            recallPresentToErBody: (confirmUrl) =>
                `Please come to the emergency department. Confirm your return using this link: ${confirmUrl}`,
            revokeRemoteService:
                "You have been removed from recall and remote follow-up. You will not receive further messages. For next steps, please come to the emergency department in person.",
            smsManualConsentEnrollmentPrefix: "ER — remote waiting: enrollment confirmed. Follow-up or cancel:",
            emailManualConsentEnrollmentBody: ({ patientName, consentUrl }) =>
                [
                    `Hello ${patientName},`,
                    "",
                    "You are enrolled in remote waiting for the emergency department queue. Consent was recorded on your chart by the care team.",
                    "",
                    "Keep this link to view follow-up information or cancel your enrollment if needed:",
                    "",
                    `Secure link: ${consentUrl}`,
                    "",
                    "If you did not request this, you can ignore this message.",
                    "",
                    "— Remote waiting — Emergency department",
                ].join("\n"),
        },
        pages: getVersionCdPages("en"),
    },
};

export function getVersionCStringBundle(locale: VEDLocale): VersionCStringBundle {
    return VC[locale];
}
