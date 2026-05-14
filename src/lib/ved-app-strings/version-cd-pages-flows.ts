import type { VEDLocale } from "@/lib/ved-locale";
import type { ActivityLogKind, BoardColumnId, PatientCompletionCause } from "@/pages/version-c/version-c-shared";

function T(locale: VEDLocale, fr: string, en: string) {
    return locale === "fr" ? fr : en;
}

export type VersionCdPagesFlows = {
    consentC: {
        cardTitle: string;
        emptyBody: string;
        selectChartLabel: string;
        helloPrefix: string;
        bodyParagraphs: [string, string, string, string];
        privacyBeforeLink: string;
        privacyLink: string;
        privacyAfterLink: string;
        validityPrefix: string;
        validitySuffix: string;
        accept: string;
        refuse: string;
        footnoteAfterAccept: string;
        withdrawOnlyTitle: string;
        withdrawHello: string;
        withdrawP1: string;
        withdrawP2: string;
        withdrawButton: string;
        waitingManualP1: string;
        waitingManualP2: string;
        withdrawConsentButton: string;
        cancelAppointmentButton: string;
    };
    consentD: {
        /** Titre H1 de la page consentement (Version D). */
        pageHeading: string;
        refuseButton: string;
        /** Paragraphs same as C for main consent flow — reuse bodyParagraphs from consentC in component or duplicate EN */
        bodyParagraphs: [string, string, string, string];
        accept: string;
        waitingQueueManualP1: string;
        waitingQueueManualP2: string;
        waitingQueueNonManualP1: string;
        waitingQueueNonManualP2: string;
    };
    consentNext: {
        title: string;
        confirmationHeading: string;
        hello: string;
        nextStepLabel: string;
        nextStepWithChannelPrefix: string;
        nextStepWithChannelSuffix: string;
        fallbackNoChannel: string;
        detailBoth: string;
        detailPhone: string;
        detailEmail: string;
        headlineSmsEmail: string;
        headlineSms: string;
        headlineEmail: string;
        emergencySiteLabel: string;
        emergencySiteLine: string;
        withdraw: string;
        withdrawHint: string;
        dateFallback7d: string;
    };
    confirmReturn: {
        pageTitle: string;
        cardTitle: string;
        invalidTitle: string;
        invalidBody: string;
        unknownTitle: string;
        unknownBody: string;
        completedTitle: string;
        completedHello: string;
        completedBody: string;
        completedWarning: string;
        ineligibleTitle: string;
        ineligibleBody: string;
            readyTitleRecall: string;
            readyTitleArrived: string;
            readyBodyLine: (patientName: string) => string;
            readyBodyRecallExtra: string;
        readyBodyArrivedExtra: string;
        confirmReturnBtn: string;
        cancelRequestBtn: string;
        thanksTitle: string;
            thanksWithName: (patientName: string) => string;
            thanksGeneric: string;
        thanksHint: string;
        removedTitle: string;
        removedBody: string;
    };
    patientPov: {
        pageTitle: string;
        pageSubtitle: string;
        patientLabel: string;
        noPatientsOption: string;
        tabSms: string;
        tabEmail: string;
        columnBadge: (columnLabel: string) => string;
        smsDisabled: string;
        emailDisabled: string;
        phoneHeaderTitle: string;
        phoneHeaderSubtitle: string;
        smsEmpty: string;
        smsPickPatient: string;
        openConsent: string;
        confirmReturnLink: string;
        emailInbox: string;
        emailSubjectRecall: string;
        emailSubjectConsent: string;
        emailEmptyList: string;
        emailPickPatient: string;
        emailPreviewEmptyWithPatient: string;
        emailPreviewNoPatient: string;
        emailCardTitle: string;
        emailFromLine: string;
        emailToPrefix: string;
        consentInviteP1: string;
        consentPolicyLink: string;
        consentInviteP2Prefix: string;
        consentInviteP2Suffix: string;
        openConsentPage: string;
        confirmReturnIntro: string;
        openConfirmPage: string;
        smsComposerPlaceholder: string;
    };
    reports: {
        title: string;
        subtitle: string;
        tabStats: string;
        tabJournal: string;
        overview: string;
        statTotalTitle: string;
        statTotalHint: string;
        statWaitingTitle: string;
        statWaitingHint: (pending: number) => string;
        statRecallTitle: string;
        statRecallHint: (inRecall: number, arrived: number) => string;
        statDoneTitle: string;
        statDoneHint: (cancelled: number, other: number) => string;
        prioritiesTitle: string;
        prioritiesSubtitle: string;
        channelsTitle: string;
        channelsSubtitle: string;
        withPhone: string;
        withEmail: string;
        manualConsent: string;
        messagesTitle: string;
        messagesSubtitle: string;
        outbound: string;
        inbound: string;
        closureCausesTitle: string;
        closureCausesSubtitle: string;
        closureCausesEmpty: string;
        journalTitle: string;
        journalSubtitle: string;
        searchLabel: string;
        searchPlaceholder: string;
        entryTypeLabel: string;
        entryTypeAll: string;
        entryTypeMessages: string;
        entryTypeWorklist: string;
        channelLabel: string;
        channelAll: string;
        channelSms: string;
        channelEmail: string;
        dossiersLabel: string;
        dossiersAll: string;
        dossiersCompletedOnly: string;
        thWhen: string;
        thType: string;
        thPatient: string;
        thSummary: string;
        thChannel: string;
        journalEmpty: string;
        journalNoMatch: string;
        columnLine: (label: string) => string;
        activityKind: Record<ActivityLogKind, string>;
        activityKindSearch: Record<ActivityLogKind, string>;
        causeLabel: Record<PatientCompletionCause | "other", string>;
        columnLabel: Record<BoardColumnId | "dash", string>;
    };
    patientCardC: {
        copyUnavailable: string;
        copied: string;
        copiedDescription: string;
        clickToCopy: string;
        actionsAria: string;
        edit: string;
        sendMessage: string;
        moveToHeader: string;
        colWaiting: string;
        colRecall: string;
        colDone: string;
        cancelChart: string;
        notesPlaceholder: string;
        phone: string;
        email: string;
        confirmRecall: string;
        cancel: string;
        recall: string;
        consentReceived: string;
        arrived: string;
        minSuffix: string;
        statusConsentPending: string;
        statusArrived: string;
        statusWithdrawn: string;
        statusRefused: string;
        statusPatientCancelled: string;
        statusStaffCancelled: (short: string) => string;
        statusStaffCancelledEmpty: string;
        statusNoShow: string;
        lineUnavailablePhone: string;
        lineUnavailableEmail: string;
        fileNumberUnavailable: string;
        menuMoveWaitingShort: string;
        menuMoveRecallShort: string;
        menuMoveCompletedShort: string;
        menuCancelShort: string;
    };
};

function activityKinds(locale: VEDLocale): VersionCdPagesFlows["reports"]["activityKind"] {
    const t = (fr: string, en: string) => T(locale, fr, en);
    return {
        message_outbound: t("Message sortant", "Outbound message"),
        message_inbound: t("Message entrant", "Inbound message"),
        patient_added: t("Ajout patient", "Patient added"),
        demo_patients_added: t("Ajout démo", "Demo bulk add"),
        patient_edited: t("Fiche modifiée", "Chart updated"),
        status_menu: t("Statut (menu)", "Status (menu)"),
        status_drag: t("Statut (glisser)", "Status (drag)"),
        consent_accepted: t("Consentement accepté", "Consent accepted"),
        consent_refused: t("Consentement refusé", "Consent refused"),
        consent_withdrawn: t("Quitter attente à distance", "Left remote waiting"),
        return_confirmed: t("Retour confirmé", "Return confirmed"),
        patient_left_queue_via_link: t("Annul. patient (lien)", "Patient cancel (link)"),
        staff_cancelled: t("Annul. équipe", "Staff cancelled"),
        board_cleared: t("Liste effacée", "List cleared"),
    };
}

function activityKindSearch(locale: VEDLocale): VersionCdPagesFlows["reports"]["activityKindSearch"] {
    const t = (fr: string, en: string) => T(locale, fr, en);
    return {
        message_outbound: t("sms courriel email sortant envoi", "sms email outbound send"),
        message_inbound: t("sms courriel email entrant réponse", "sms email inbound reply"),
        patient_added: t("nouveau inscription file", "new enrollment queue"),
        demo_patients_added: t("démonstration lot paramètres", "demo bulk settings"),
        patient_edited: t("modification dossier coordonnées", "chart edit contact"),
        status_menu: t("colonne attente rappel terminé déplacement carte", "column waiting recall done move card"),
        status_drag: t("colonne attente rappel terminé déplacement carte", "column waiting recall done move card"),
        consent_accepted: t("accord plateforme", "platform agreement"),
        consent_refused: t("fermeture annulation service distance", "closure cancel remote service"),
        consent_withdrawn: t("fermeture annulation service distance", "closure cancel remote service"),
        return_confirmed: t("arrivée urgence", "er arrival"),
        patient_left_queue_via_link: t("public confirmation", "public confirmation"),
        staff_cancelled: t("motif équipe soignant", "staff reason"),
        board_cleared: t("reset effacer vider", "reset clear empty"),
    };
}

export function getVersionCdPagesFlows(locale: VEDLocale): VersionCdPagesFlows {
    const t = (fr: string, en: string) => T(locale, fr, en);
    const bodyC: [string, string, string, string] = [
        t(
            "Vous êtes inscrit au service d’attente à distance pour la file d’attente de l’urgence. Il ne s’agit pas d’une consultation médicale à distance : ce service sert à gérer votre attente et les communications avec l’équipe (p. ex. rappels, coordonnées) jusqu’à votre prise en charge à l’urgence.",
            "You are enrolled in remote waiting for the emergency department queue. This is not a remote medical visit: it manages your wait and communications with the team (for example recalls and contact details) until you are seen in the emergency department.",
        ),
        t(
            "Préalablement à toute poursuite, il vous appartient de prendre connaissance du consentement éclairé et d’y donner votre accord, lequel porte notamment sur la collecte, l’utilisation et la communication de vos renseignements personnels et de santé dans le cadre du présent service.",
            "Before continuing, you must read the informed consent and agree to it, including how your personal and health information is collected, used, and shared for this service.",
        ),
        t(
            "En appuyant sur le bouton « J’accepte et je continue », vous attestez avoir pris connaissance des modalités qui vous sont présentées et consentez à utiliser ce service d’attente à distance pour la file d’attente à l’urgence.",
            "By clicking “I agree and continue”, you confirm you have read the terms presented and agree to use this remote waiting service for the emergency department queue.",
        ),
        t(
            "Vous pouvez annuler votre demande avant d’avoir accepté le consentement. Après acceptation, vous pouvez à tout moment annuler votre demande d’attente à distance en accédant de nouveau à cette même page au moyen du lien qui vous a été communiqué ; une fenêtre vous demandera de confirmer l’annulation.",
            "You may cancel your request before accepting consent. After accepting, you may cancel your remote waiting request at any time by returning to this same page using the link you were given; a dialog will ask you to confirm cancellation.",
        ),
    ];
    const bodyD: [string, string, string, string] = [
        t(
            "Vous êtes inscrit au service d’attente à distance pour la file d’attente de l’urgence. Il ne s’agit pas d’une consultation médicale à distance : ce service sert à gérer votre attente et les communications avec l’équipe (p. ex. rappels, coordonnées) jusqu’à votre prise en charge à l’urgence.",
            "You are enrolled in remote waiting for the emergency department queue. This is not a remote medical visit: it manages your wait and communications with the team until you are seen in the emergency department.",
        ),
        t(
            "Préalablement à toute poursuite, il vous appartient de prendre connaissance du consentement éclairé et d’y donner votre accord, lequel porte notamment sur la collecte, l’utilisation et la communication de vos renseignements personnels et de santé dans le cadre du présent service.",
            "Before continuing, you must read the informed consent and agree to it, including how your personal and health information is collected, used, and shared for this service.",
        ),
        t(
            "En appuyant sur le bouton « J’accepte », vous attestez avoir pris connaissance des modalités qui vous sont présentées et consentez à utiliser ce service d’attente à distance pour la file d’attente à l’urgence.",
            "By clicking “I agree”, you confirm you have read the terms presented and agree to use this remote waiting service for the emergency department queue.",
        ),
        t(
            "Vous pouvez annuler votre demande d’inscription avant d’avoir accepté. Après acceptation, vous pourrez annuler votre demande d’attente à distance en accédant de nouveau à cette même page au moyen du lien qui vous a été communiqué ; une fenêtre vous demandera de confirmer l’annulation.",
            "You may cancel your enrollment request before accepting. After accepting, you may cancel your remote waiting request by returning to this same page using the link you were given; a dialog will ask you to confirm cancellation.",
        ),
    ];

    return {
        consentC: {
            cardTitle: t("Attente à distance — File d’attente à l’urgence", "Remote waiting — Emergency department queue"),
            emptyBody: t(
                "Aucun dossier n’est présentement en attente de consentement pour cette session. Si vous avez reçu un lien personnel, ouvrez-le pour accéder à votre formulaire.",
                "No chart is currently waiting for consent in this session. If you received a personal link, open it to access your form.",
            ),
            selectChartLabel: t("Sélection du dossier (simulation)", "Select chart (simulation)"),
            helloPrefix: t("Bonjour,", "Hello,"),
            bodyParagraphs: bodyC,
            privacyBeforeLink: t(
                "Pour prendre connaissance de l’avis complet relatif à la confidentialité ainsi qu’aux droits qui vous sont reconnus, veuillez ",
                "To read the full privacy notice and your rights, please ",
            ),
            privacyLink: t("consulter le document afférent", "view the related document"),
            privacyAfterLink: t(".", "."),
            validityPrefix: t("La validité du présent lien prend fin le ", "This link is valid until "),
            validitySuffix: t(" (délai indicatif aux fins de démonstration seulement).", " (demo timeline only)."),
            accept: t("J’accepte et je continue", "I agree and continue"),
            refuse: t("Annuler votre demande", "Cancel your request"),
            footnoteAfterAccept: t(
                "Une fois l’acceptation enregistrée, le dossier est classé en file d’attente côté établissement.",
                "Once accepted, your chart is placed in the facility’s waiting queue.",
            ),
            withdrawOnlyTitle: t("Attente à distance — File d’attente à l’urgence", "Remote waiting — Emergency department queue"),
            withdrawHello: t("Bonjour,", "Hello,"),
            withdrawP1: t(
                "Vous êtes inscrit à l’attente à distance : votre consentement est déjà enregistré. Vous pouvez à tout moment annuler votre demande depuis cette page.",
                "You are enrolled in remote waiting: your consent is already on record. You may cancel your request at any time from this page.",
            ),
            withdrawP2: t(
                "Une fenêtre vous demandera de confirmer l’annulation. Vous ne recevrez plus de messages de rappel ou de suivi par ce canal. Pour toute suite, présentez-vous en personne à l’urgence.",
                "A dialog will ask you to confirm cancellation. You will no longer receive recall or follow-up messages through this channel. For next steps, present in person at the emergency department.",
            ),
            withdrawButton: t("Annuler votre demande", "Cancel your request"),
            waitingManualP1: t(
                "Votre inscription au service d’attente à distance est confirmée. Le consentement a été enregistré par l’équipe pour votre dossier. Vous pouvez à tout moment annuler votre demande depuis cette page.",
                "Your remote waiting enrollment is confirmed. Consent was recorded by the team on your chart. You may cancel your request at any time from this page.",
            ),
            waitingManualP2: t(
                "Une fenêtre vous demandera de confirmer l’annulation. L’annulation met fin au suivi à distance : pour toute urgence ou soins, présentez-vous en personne à l’urgence.",
                "A dialog will ask you to confirm cancellation. Cancellation ends remote follow-up: for any emergency or care, present in person at the emergency department.",
            ),
            withdrawConsentButton: t("Annuler votre demande", "Cancel your request"),
            cancelAppointmentButton: t("Annuler votre demande", "Cancel your request"),
        },
        consentD: {
            pageHeading: t("Consentement éclairé", "Informed consent"),
            refuseButton: t("Annuler votre demande", "Cancel your request"),
            bodyParagraphs: bodyD,
            accept: t("J’accepte", "I agree"),
            waitingQueueManualP1: t(
                "Votre inscription au service d’attente à distance est confirmée. Le consentement a été enregistré par l’équipe pour votre dossier. Vous pouvez à tout moment annuler votre demande depuis cette page.",
                "Your remote waiting enrollment is confirmed. Consent was recorded by the team. You may cancel your request at any time from this page.",
            ),
            waitingQueueManualP2: t(
                "Une fenêtre vous demandera de confirmer l’annulation. L’annulation met fin au suivi à distance : pour toute urgence ou soins, présentez-vous en personne à l’urgence.",
                "A dialog will ask you to confirm cancellation. Cancellation ends remote follow-up: for emergencies or care, present in person at the emergency department.",
            ),
            waitingQueueNonManualP1: t(
                "Vous êtes inscrit à l’attente à distance : votre consentement est déjà enregistré. Vous pouvez à tout moment annuler votre demande depuis cette page.",
                "You are enrolled in remote waiting: your consent is already on record. You may cancel your request at any time from this page.",
            ),
            waitingQueueNonManualP2: t(
                "Une fenêtre vous demandera de confirmer l’annulation. Vous ne recevrez plus de messages de rappel ou de suivi par ce canal. Pour toute suite, présentez-vous en personne à l’urgence.",
                "A dialog will ask you to confirm cancellation. You will no longer receive recall or follow-up messages through this channel. For next steps, present in person at the emergency department.",
            ),
        },
        consentNext: {
            title: t("Suite du processus", "Next step"),
            confirmationHeading: t(
                "Confirmation de l’enregistrement de votre consentement",
                "Confirmation that your consent was recorded",
            ),
            hello: t("Bonjour,", "Hello,"),
            nextStepLabel: t("Étape suivante", "Next step"),
            nextStepWithChannelPrefix: t(
                "Conformément aux modalités du service, l’établissement communiquera avec vous par le biais suivant : ",
                "Under the service rules, the facility will contact you via: ",
            ),
            nextStepWithChannelSuffix: t(
                ". Cette communication permettra d’assurer le suivi de votre attente jusqu’à votre prise en charge à l’urgence.",
                ". This communication supports your wait until you are seen in the emergency department.",
            ),
            fallbackNoChannel: t(
                "Votre consentement a été enregistré. L’établissement communiquera avec vous selon le mode de correspondance figurant à votre dossier.",
                "Your consent was recorded. The facility will contact you using the method on file.",
            ),
            detailBoth: t(
                "Les précisions communiquées porteront notamment sur les modalités de rappel, la confirmation des coordonnées et le suivi de votre attente à l’urgence.",
                "Updates will cover recall logistics, confirming your contact details, and monitoring your emergency wait.",
            ),
            detailPhone: t(
                "Les précisions communiquées porteront notamment sur les modalités de rappel et le suivi de votre attente à l’urgence.",
                "Updates will cover recall logistics and monitoring your emergency wait.",
            ),
            detailEmail: t(
                "Les précisions communiquées porteront notamment sur la confirmation des coordonnées et le suivi de votre attente à l’urgence.",
                "Updates will cover confirming your contact details and monitoring your emergency wait.",
            ),
            headlineSmsEmail: t("message texto (SMS) ou courriel", "text (SMS) or email"),
            headlineSms: t("message texto (SMS)", "text (SMS)"),
            headlineEmail: t("courriel", "email"),
            emergencySiteLabel: t("Urgence — Hôpital général juif", "Emergency — Jewish General Hospital"),
            emergencySiteLine: t("3750, ch. de la Côte-Sainte-Catherine, Montréal  H3T 1E2", "3750 Côte-Sainte-Catherine Rd, Montreal  H3T 1E2"),
            withdraw: t("Annuler votre demande", "Cancel your request"),
            withdrawHint: t(
                "Une fenêtre s’ouvrira pour confirmer l’annulation. Pour toute urgence ou soins, présentez-vous à l’urgence.",
                "A dialog will open to confirm cancellation. For emergencies or care, go to the emergency department.",
            ),
            dateFallback7d: t("dans les 7 jours", "within 7 days"),
        },
        confirmReturn: {
            pageTitle: t("Rappel — urgence", "Recall — emergency"),
            cardTitle: t("Attente à distance — File d’attente à l’urgence", "Remote waiting — Emergency department queue"),
            invalidTitle: t("Lien incomplet", "Incomplete link"),
            invalidBody: t(
                "Ce lien ne contient pas les informations nécessaires. Utilisez le lien reçu par message.",
                "This link is missing required information. Use the link you received in your message.",
            ),
            unknownTitle: t("Lien non reconnu", "Link not recognized"),
            unknownBody: t(
                "Nous ne trouvons pas de dossier correspondant à ce lien. Il est peut-être expiré ou la démo a été réinitialisée.",
                "We cannot find a chart for this link. It may have expired or the demo was reset.",
            ),
            completedTitle: t("Dossier terminé", "Chart completed"),
            completedHello: t("Bonjour", "Hello"),
            completedBody: t(
                "Votre inscription à l’attente à distance a été clôturée : le dossier figure désormais dans le statut terminé côté équipe de l’urgence. Ce lien de confirmation ne permet donc plus de confirmer un retour ni d’annuler la requête en ligne.",
                "Your remote waiting enrollment is closed: the chart is now completed on the emergency team side. This confirmation link can no longer confirm a return or cancel the request online.",
            ),
            completedWarning: t(
                "Si vous pensez qu’il s’agit d’une erreur, ou si votre état vous inquiète, présentez-vous en personne à l’urgence pour qu’on puisse vérifier la situation avec vous. En cas d’urgence vitale, composez le 911.",
                "If you believe this is an error, or you are worried about your condition, go to the emergency department in person. For life-threatening emergencies, call 911.",
            ),
            ineligibleTitle: t("Lien non disponible", "Link not available"),
            ineligibleBody: t(
                "Votre situation ne correspond pas à une demande de rappel active. Pour toute question, présentez-vous à l’urgence.",
                "Your situation does not match an active recall request. For questions, go to the emergency department.",
            ),
            readyTitleRecall: t("Confirmez votre retour", "Confirm your return"),
            readyTitleArrived: t("Retour déjà confirmé", "Return already confirmed"),
            readyBodyLine: (patientName: string) =>
                t(
                    `Bonjour ${patientName}, l’équipe vous demande de vous présenter à l’urgence. Les professionnels voient votre statut dans la file lorsque vous confirmez.`,
                    `Hello ${patientName}, the team asks you to come to the emergency department. Staff see your queue status when you confirm.`,
                ),
            readyBodyRecallExtra: t(
                "Si vous ne souhaitez plus être suivi à distance ou ne pouvez pas revenir pour l’instant, vous pouvez annuler votre demande ci-dessous.",
                "If you no longer want remote follow-up or cannot return for now, you can cancel your request below.",
            ),
            readyBodyArrivedExtra: t(
                "Vous avez déjà indiqué que vous revenez. Vous pouvez toujours annuler votre demande d’attente à distance ci-dessous.",
                "You already indicated you are returning. You can still cancel your remote waiting request below.",
            ),
            confirmReturnBtn: t("Je confirme mon retour à l’urgence", "I confirm I am returning to the emergency department"),
            cancelRequestBtn: t("Annuler votre demande", "Cancel your request"),
            thanksTitle: t("Merci", "Thank you"),
            thanksWithName: (patientName: string) =>
                t(
                    `${patientName}, votre retour est enregistré. L’équipe voit que vous revenez.`,
                    `${patientName}, your return is recorded. The team sees you are coming back.`,
                ),
            thanksGeneric: t("Votre retour est enregistré.", "Your return is recorded."),
            thanksHint: t(
                "Vous pouvez encore annuler votre demande ci-dessous si vos plans changent.",
                "You can still cancel your request below if your plans change.",
            ),
            removedTitle: t("Inscription retirée", "Enrollment removed"),
            removedBody: t(
                "Vous ne recevrez plus de messages liés à l’attente à distance. Pour toute urgence, présentez-vous à l’urgence ou composez le 911.",
                "You will no longer receive remote waiting messages. For emergencies, go to the emergency department or call 911.",
            ),
        },
        patientPov: {
            pageTitle: t("Vue patient", "Patient view"),
            pageSubtitle: t(
                "Simulation de l’expérience usager pour l’attente à distance à la file d’attente de l’urgence : SMS ou courriel, puis consentement.",
                "Simulated patient experience for remote emergency waiting: SMS or email, then consent.",
            ),
            patientLabel: t("Patient", "Patient"),
            noPatientsOption: t("Aucun patient", "No patients"),
            tabSms: t("SMS", "SMS"),
            tabEmail: t("Courriel", "Email"),
            columnBadge: (columnLabel) => t(`Colonne : ${columnLabel}`, `Column: ${columnLabel}`),
            smsDisabled: t(
                "Ce patient n’a pas de numéro — le fil SMS est désactivé pour cette démo.",
                "This patient has no phone number — SMS is disabled for this demo.",
            ),
            emailDisabled: t(
                "Ce patient n’a pas de courriel — la boîte de réception est désactivée pour cette démo.",
                "This patient has no email — the inbox is disabled for this demo.",
            ),
            phoneHeaderTitle: t("Urgence", "Emergency"),
            phoneHeaderSubtitle: t("Messages texte", "Text messages"),
            smsEmpty: t(
                "Aucun SMS pour l’instant. Ajoutez un patient sans consentement manuel pour voir l’invitation automatique.",
                "No SMS yet. Add a patient without manual consent to see the automatic invitation.",
            ),
            smsPickPatient: t("Sélectionnez un patient pour afficher les messages.", "Select a patient to view messages."),
            openConsent: t("Ouvrir le consentement", "Open consent"),
            confirmReturnLink: t("Confirmer mon retour (page sécurisée)", "Confirm my return (secure page)"),
            emailInbox: t("Boîte de réception", "Inbox"),
            emailSubjectRecall: t("Rappel — confirmer le retour", "Recall — confirm return"),
            emailSubjectConsent: t("Invitation — consentement", "Invitation — consent"),
            emailEmptyList: t("Aucun courriel.", "No emails."),
            emailPickPatient: t("Sélectionnez un patient.", "Select a patient."),
            emailPreviewEmptyWithPatient: t("Aucun courriel à afficher pour ce patient.", "No email to show for this patient."),
            emailPreviewNoPatient: t("Sélectionnez un patient pour prévisualiser le courriel.", "Select a patient to preview email."),
            emailCardTitle: t("Attente à distance — File d’attente à l’urgence", "Remote waiting — Emergency department queue"),
            emailFromLine: t("De : Urgence — attente à distance", "From: Emergency — remote waiting"),
            emailToPrefix: t("À :", "To:"),
            consentInviteP1: t(
                "En accédant au lien ci-dessous, vous poursuivez le processus de consentement pour l’attente à distance à l’urgence. Pour plus d’information sur la protection des renseignements, ",
                "By opening the link below, you continue the consent process for emergency remote waiting. For more on privacy, ",
            ),
            consentPolicyLink: t("consultez la politique de l’établissement", "see the facility policy"),
            consentInviteP2Prefix: t("Cette invitation expirera le ", "This invitation expires on "),
            consentInviteP2Suffix: t(".", "."),
            openConsentPage: t("Ouvrir la page de consentement", "Open consent page"),
            confirmReturnIntro: t(
                "Utilisez le bouton ci-dessous pour ouvrir la page sécurisée : vous pourrez confirmer votre retour à l’urgence (visible pour l’équipe) ou choisir « Annuler votre demande ». Une fenêtre vous demandera alors de confirmer l’annulation avant que la demande soit retirée.",
                "Use the button below to open the secure page: you can confirm your return to the emergency department (visible to staff) or choose “Cancel your request”. A dialog will then ask you to confirm cancellation before the request is withdrawn.",
            ),
            openConfirmPage: t("Ouvrir la page de confirmation", "Open confirmation page"),
            smsComposerPlaceholder: t("Texto", "Text message"),
        },
        reports: {
            title: t("Rapports et statistiques", "Reports and statistics"),
            subtitle: t(
                "Tableau de bord démo : agrégats sur la file d’attente Version C. Le journal d’activité regroupe les communications (SMS / courriel) et les changements sur la liste (statuts, consentements, annulations, etc.) pour la session courante.",
                "Demo dashboard: aggregates for Version C waiting. The activity log lists communications (SMS / email) and list changes (status, consent, cancellations, etc.) for the current session.",
            ),
            tabStats: t("Statistiques", "Statistics"),
            tabJournal: t("Journal d’activité", "Activity log"),
            overview: t("Vue d’ensemble", "Overview"),
            statTotalTitle: t("Patients (total)", "Patients (total)"),
            statTotalHint: t("Tous statuts confondus", "All statuses"),
            statWaitingTitle: t("Colonne Attente", "Waiting column"),
            statWaitingHint: (pending) => t(`Dont ${pending} en attente de consentement`, `${pending} pending consent`),
            statRecallTitle: t("Colonne Rappel", "Recall column"),
            statRecallHint: (inRecall, arrived) =>
                t(`${inRecall} en rappel · ${arrived} retour confirmé`, `${inRecall} in recall · ${arrived} return confirmed`),
            statDoneTitle: t("Colonne Terminé", "Completed column"),
            statDoneHint: (cancelled, other) =>
                t(`${cancelled} clôturés / annulés · ${other} autres`, `${cancelled} closed / cancelled · ${other} other`),
            prioritiesTitle: t("Priorités", "Priorities"),
            prioritiesSubtitle: t("Répartition des dossiers actifs et terminés.", "Distribution of active and completed charts."),
            channelsTitle: t("Canaux & consentement", "Channels & consent"),
            channelsSubtitle: t("Coordonnées et consentement géré hors plateforme.", "Contact details and manually managed consent."),
            withPhone: t("Avec téléphone (SMS)", "With phone (SMS)"),
            withEmail: t("Avec courriel", "With email"),
            manualConsent: t("Consentement manuel", "Manual consent"),
            messagesTitle: t("Messages (session)", "Messages (session)"),
            messagesSubtitle: t("Comptage des entrées du journal de notifications simulées.", "Count of simulated notification log entries."),
            outbound: t("Sortants", "Outbound"),
            inbound: t("Entrants", "Inbound"),
            closureCausesTitle: t("Motifs de fermeture (terminés annulés)", "Closure reasons (cancelled completed)"),
            closureCausesSubtitle: t(
                "Répartition des causes enregistrées sur les dossiers annulés.",
                "Distribution of recorded causes on cancelled charts.",
            ),
            closureCausesEmpty: t("Aucun dossier annulé pour l’instant.", "No cancelled charts yet."),
            journalTitle: t("Journal d’activité", "Activity log"),
            journalSubtitle: t(
                "Communications et événements de la liste — tri du plus récent au plus ancien (session courante).",
                "Communications and list events — newest first (current session).",
            ),
            searchLabel: t("Recherche", "Search"),
            searchPlaceholder: t("Patient, type d’événement, texte du message…", "Patient, event type, message text…"),
            entryTypeLabel: t("Type d’entrée", "Entry type"),
            entryTypeAll: t("Toutes les entrées", "All entries"),
            entryTypeMessages: t("Communications seulement", "Communications only"),
            entryTypeWorklist: t("Liste (sans messages)", "List (no messages)"),
            channelLabel: t("Canal (messages)", "Channel (messages)"),
            channelAll: t("Tous canaux", "All channels"),
            channelSms: t("SMS", "SMS"),
            channelEmail: t("Courriel", "Email"),
            dossiersLabel: t("Dossiers", "Charts"),
            dossiersAll: t("Tous les dossiers", "All charts"),
            dossiersCompletedOnly: t("Terminés uniquement", "Completed only"),
            thWhen: t("Date / heure", "Date / time"),
            thType: t("Type", "Type"),
            thPatient: t("Patient", "Patient"),
            thSummary: t("Résumé", "Summary"),
            thChannel: t("Canal", "Channel"),
            journalEmpty: t(
                "Aucune activité enregistrée. Utilisez la liste de travail pour ajouter des patients, déplacer des cartes ou envoyer des messages.",
                "No activity yet. Use the worklist to add patients, move cards, or send messages.",
            ),
            journalNoMatch: t("Aucun résultat pour ces filtres ou cette recherche.", "No results for these filters or search."),
            columnLine: (label) => t(`Colonne ${label}`, `Column ${label}`),
            activityKind: activityKinds(locale),
            activityKindSearch: activityKindSearch(locale),
            causeLabel: {
                no_show: t("Absence", "No show"),
                consent_withdrawn: t("Quitter attente à distance", "Left remote waiting"),
                consent_refused: t("Refus consentement", "Consent refused"),
                patient_cancelled_queue: t("Annul. patient (lien)", "Patient cancel (link)"),
                staff_cancelled: t("Annul. équipe", "Staff cancelled"),
                other: t("Autre", "Other"),
            },
            columnLabel: {
                waiting: t("Attente", "Waiting"),
                recall: t("Rappel", "Recall"),
                completed: t("Terminé", "Completed"),
                dash: "—",
            },
        },
        patientCardC: {
            copyUnavailable: t("indisponible", "unavailable"),
            copied: t("Copié", "Copied"),
            copiedDescription: t("La valeur a été copiée dans le presse-papiers.", "Value copied to clipboard."),
            clickToCopy: t("Cliquer pour copier.", "Click to copy."),
            actionsAria: t("Actions sur la fiche", "Chart actions"),
            edit: t("Modifier", "Edit"),
            sendMessage: t("Envoyer un message", "Send message"),
            moveToHeader: t("Déplacer vers", "Move to"),
            colWaiting: t("Colonne Attente", "Waiting column"),
            colRecall: t("Colonne Rappel", "Recall column"),
            colDone: t("Colonne Terminé", "Completed column"),
            cancelChart: t("Annuler la fiche…", "Cancel chart…"),
            notesPlaceholder: t("« Essai de repos, symptômes toujours présents »", "“Tried resting, symptoms still present”"),
            phone: t("Téléphone", "Phone"),
            email: t("Courriel", "Email"),
            confirmRecall: t("Confirmer le rappel", "Confirm recall"),
            cancel: t("Annuler", "Cancel"),
            recall: t("Rappeler", "Recall"),
            consentReceived: t("Consentement reçu", "Consent received"),
            arrived: t("Arrivé", "Arrived"),
            minSuffix: t(" min", " min"),
            statusConsentPending: t("Consentement en attente", "Pending consent"),
            statusArrived: t("Retour confirmé", "Return confirmed"),
            statusWithdrawn: t("Quitté l’attente à distance", "Left remote waiting"),
            statusRefused: t("Refus du consentement", "Consent refused"),
            statusPatientCancelled: t("Requête annulée (patient)", "Request cancelled (patient)"),
            statusStaffCancelled: (short) => t(`Annulé : ${short}`, `Cancelled: ${short}`),
            statusStaffCancelledEmpty: t("Annulé (équipe)", "Cancelled (staff)"),
            statusNoShow: t("Annulé – absence", "Cancelled — no show"),
            lineUnavailablePhone: t("Téléphone indisponible", "Phone unavailable"),
            lineUnavailableEmail: t("Courriel indisponible", "Email unavailable"),
            fileNumberUnavailable: t("Numéro de dossier indisponible", "File number unavailable"),
            menuMoveWaitingShort: t("En attente", "Waiting"),
            menuMoveRecallShort: t("Rappel", "Recall"),
            menuMoveCompletedShort: t("Terminé", "Completed"),
            menuCancelShort: t("Annuler", "Cancel"),
        },
    };
}
