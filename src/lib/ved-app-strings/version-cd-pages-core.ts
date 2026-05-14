import type { VEDLocale } from "@/lib/ved-locale";

function T(locale: VEDLocale, fr: string, en: string) {
    return locale === "fr" ? fr : en;
}

export type MessageTemplateId = "closure" | "reopening" | "urgent_return_waiting" | "abnormal_delays" | "custom";

export const MESSAGE_TEMPLATE_ORDER: MessageTemplateId[] = ["closure", "reopening", "urgent_return_waiting", "abnormal_delays", "custom"];

export type VersionCdPagesCore = {
    publicChrome: {
        prototypeBadge: string;
        govQuebecAlt: string;
        poweredByAkinoxAlt: string;
    };
    emptyWorklist: {
        recallPill: string;
        title: string;
        subtitle: string;
        stepsHeading: string;
        steps: [{ title: string; body: string }, { title: string; body: string }, { title: string; body: string }];
        illustrationPatient: string;
        illustrationRemoteBadge: string;
        addFirstPatient: string;
        addFirstHint: string;
    };
    /** Version D worklist — compact empty state (Figma-aligned). */
    emptyWorklistD: {
        title: string;
        body: string;
        addButton: string;
    };
    staffCancelC: {
        title: string;
        introHtmlPrefix: string;
        introCompleted: string;
        introSuffix: string;
        introTail: string;
        reasonLabel: string;
        reasonPlaceholder: string;
        confirm: string;
        close: string;
    };
    staffCancelD: {
        title: string;
        introPrefix: string;
        introSuffix: string;
        legend: string;
        noShow: string;
        other: string;
        otherDetailLabel: string;
        otherDetailHint: string;
        otherDetailPlaceholder: string;
        confirm: string;
        cancel: string;
    };
    exitDistance: {
        refuseTitle: string;
        withdrawTitle: string;
        cancelManualTitle: string;
        /** Annulation avant acceptation du consentement (bouton « annuler le rendez-vous » — Version D). */
        cancelBeforeConsentTitle: string;
        /** Annulation depuis la page rappel / retour confirmé (Version D). */
        cancelRecallTitle: string;
        refuseConfirm: string;
        withdrawConfirm: string;
        cancelManualConfirm: string;
        cancelBeforeConsentConfirm: string;
        cancelRecallConfirm: string;
        bodyRefuse: string;
        bodyWithdraw: string;
        bodyCancelManual: string;
        bodyCancelBeforeConsent: string;
        bodyCancelRecall: string;
        footerInPerson: string;
        /** Fermer sans quitter (refus avant inscription, ou abandon de la fenêtre). */
        exitGoBack: string;
        /** Fermer sans quitter le service lorsqu’on est déjà inscrit / en suivi. */
        exitKeepEnrollment: string;
    };
    messagingBulk: {
        title: string;
        subtitle: string;
        close: string;
        targetLabel: string;
        targetAll: string;
        targetWaiting: string;
        targetRecall: string;
        targetCompleted: string;
        templateLabel: string;
        customOption: string;
        messageLabel: string;
        messagePlaceholder: string;
        footerHint: string;
        send: string;
    };
    messagingSingle: {
        title: string;
        toPrefix: string;
        toSuffix: string;
        close: string;
        templateLabel: string;
        customOption: string;
        messageLabel: string;
        messagePlaceholder: string;
        footerHint: string;
        send: string;
    };
    messageTemplates: Record<Exclude<MessageTemplateId, "custom">, { label: string; body: string }> & {
        custom: { label: string; body: string };
    };
    wizard: {
        closeAria: string;
        title: string;
        previousAnswers: string;
        frozenIdentity: string;
        frozenFile: string;
        frozenContact: string;
        frozenReason: string;
        frozenPriority: string;
        frozenNotes: string;
        frozenManualConsent: string;
        yes: string;
        no: string;
        questionN: (n: number, total: number) => string;
        step0Title: string;
        step0Hint: string;
        firstName: string;
        lastName: string;
        firstNamePh: string;
        lastNamePh: string;
        step1Title: string;
        fileNumber: string;
        fileNumberPh: string;
        step2Title: string;
        step2Hint: string;
        step2Subhint: string;
        mobileSms: string;
        email: string;
        mobilePh: string;
        emailPh: string;
        commLanguage: string;
        commLanguageHint: string;
        langFr: string;
        langEn: string;
        contactError: string;
        step3Title: string;
        reason: string;
        reasonRequired: string;
        reasonPh: string;
        step4Title: string;
        step4Hint: string;
        priorityP3Hint: string;
        priorityP4Hint: string;
        priorityP5Hint: string;
        step5Title: string;
        step5Hint: string;
        notes: string;
        notesPh: string;
        step6Title: string;
        step6Hint: string;
        step6Subhint: string;
        manualConsentLabel: string;
        continue: string;
        submitQueue: string;
        back: string;
        cancel: string;
        /** When first/last name left blank on submit (demo). */
        fallbackFirstName: string;
        fallbackLastName: string;
    };
    /** Bulk demo patients — names are locale-neutral; reasons/notes translated. */
    demoPatientContent: {
        firstNames: readonly string[];
        lastNames: readonly string[];
        reasons: readonly string[];
        notes: readonly string[];
        emailDomain: string;
    };
    classicAddPatientC: {
        titleAdd: string;
        titleEdit: string;
        contactBlurb: string;
        contactError: string;
        manualConsentHelp: string;
        notesOptionalPlaceholder: string;
        save: string;
    };
    moveRecall: {
        title: string;
        subtitleSuffix: string;
        consentWarningTitle: string;
        consentWarningBody: string;
        consentCheckbox: string;
        statusLegend: string;
        statusRecall: string;
        statusArrived: string;
        sendRecallTitle: string;
        sendRecallHint: string;
        confirm: string;
        cancel: string;
    };
    classicAddPatientD: {
        contactSection: string;
        commLanguage: string;
        commLanguageHint: string;
        langFr: string;
        langEn: string;
        priority: string;
        consentLockedLabelManual: string;
        consentLockedLabelPlatform: string;
        consentLockedLabelNone: string;
        consentLockedHelp: string;
        consentUnlockedHelp: string;
    };
};

function messageTemplates(locale: VEDLocale): VersionCdPagesCore["messageTemplates"] {
    const t = (fr: string, en: string) => T(locale, fr, en);
    return {
        closure: {
            label: t("Fermeture", "Closure"),
            body: t(
                "L’accueil virtuel de l’urgence est temporairement interrompu. Vous serez avisé lorsque le service rouvrira. Si votre état se détériore ou devient critique, composez le 911 ou présentez-vous immédiatement à l’urgence.",
                "The emergency department’s virtual waiting room is temporarily paused. You will be notified when it reopens. If your condition worsens or is critical, call 911 or go to the emergency department immediately.",
            ),
        },
        reopening: {
            label: t("Réouverture de l’urgence", "Emergency department reopening"),
            body: t(
                "L’urgence a rouvert son accueil virtuel pour l’attente à distance : les messages de suivi reprennent normalement. Si votre état change ou s’aggrave, présentez-vous sans délai ou composez le 911.",
                "The emergency department has reopened its virtual waiting room: follow-up messages resume as usual. If your condition changes or worsens, go without delay or call 911.",
            ),
        },
        urgent_return_waiting: {
            label: t("Annulation du rappel (nouveaux cas prioritaires)", "Recall cancelled (new priority cases)"),
            body: t(
                "Depuis votre rappel, l’urgence a accueilli de nouveaux cas jugés prioritaires : nous devons donc annuler votre rappel pour l’instant. Vous demeurez en attente virtuelle et serez avisé si la situation évolue. Si votre état s’aggrave, présentez-vous sans délai à l’urgence ou composez le 911.",
                "Since your recall, the emergency department has taken new cases deemed higher priority, so we must cancel your recall for now. You remain in the virtual queue and will be notified if the situation changes. If your condition worsens, go to the emergency department without delay or call 911.",
            ),
        },
        abnormal_delays: {
            label: t("Délais anormaux", "Unusual delays"),
            body: t(
                "Nous rencontrons actuellement des délais de prise en charge inhabituels. Merci de votre patience; nous vous contacterons dès qu’il y a une mise à jour concernant votre attente.",
                "We are currently experiencing unusual wait times. Thank you for your patience; we will contact you as soon as there is an update about your wait.",
            ),
        },
        custom: { label: t("Personnalisé…", "Custom…"), body: "" },
    };
}

export function getVersionCdPagesCore(locale: VEDLocale): VersionCdPagesCore {
    const t = (fr: string, en: string) => T(locale, fr, en);
    return {
        publicChrome: {
            prototypeBadge: t("Prototype — perspective usager", "Prototype — patient view"),
            govQuebecAlt: t("Gouvernement du Québec", "Government of Quebec"),
            poweredByAkinoxAlt: t("Propulsé par Akinox", "Powered by Akinox"),
        },
        emptyWorklist: {
            recallPill: t("Centre de rappel", "Recall centre"),
            title: t("Bienvenue dans le Centre de rappel", "Welcome to the recall centre"),
            subtitle: t(
                "Gérez l’attente des patients à distance et faites-les revenir au bon moment, sans surcharger l’urgence.",
                "Manage patient waiting remotely and bring them back at the right time without overloading the emergency department.",
            ),
            stepsHeading: t("Fonctionnement en 3 étapes", "How it works in 3 steps"),
            steps: [
                {
                    title: t("Ajouter un patient", "Add a patient"),
                    body: t(
                        "👉 Inscrivez un patient admissible et confirmez son consentement pour l’attente à distance.",
                        "👉 Enroll an eligible patient and confirm consent for remote waiting.",
                    ),
                },
                {
                    title: t("Attente à distance", "Remote waiting"),
                    body: t(
                        "👉 Le patient attend de chez lui en conservant sa place dans la file.",
                        "👉 The patient waits from home while keeping their place in the queue.",
                    ),
                },
                {
                    title: t("Rappel du patient", "Patient recall"),
                    body: t(
                        "👉 Lorsqu’il est temps de revenir, envoyez une invitation par SMS ou courriel : le patient confirme son retour depuis le message avant de se présenter.",
                        "👉 When it is time to return, send an SMS or email invitation: the patient confirms return from the message before presenting.",
                    ),
                },
            ],
            illustrationPatient: t("Patient", "Patient"),
            illustrationRemoteBadge: t("Attente à distance", "Remote waiting"),
            addFirstPatient: t("Ajouter un premier patient", "Add your first patient"),
            addFirstHint: t("Réservé aux patients admissibles à l’attente à distance.", "For patients eligible for remote waiting only."),
        },
        emptyWorklistD: {
            title: t("Aucun patient pour l’instant", "No patients yet"),
            body: t(
                "Créez un dossier patient pour commencer à le faire progresser dans le processus de répartition sur cette liste.",
                "Create a patient chart to start moving them through the dispatch process on this list.",
            ),
            addButton: t("Inviter des patients", "Invite patients"),
        },
        staffCancelC: {
            title: t("Annuler la fiche patient", "Cancel patient chart"),
            introHtmlPrefix: t("Le dossier de ", "The chart for "),
            introCompleted: t("Terminé", "Completed"),
            introSuffix: t(
                " sera déplacé dans ",
                " will be moved to ",
            ),
            introTail: t(" avec le motif d’annulation ci-dessous.", " with the cancellation reason below."),
            reasonLabel: t("Raison d’annulation", "Cancellation reason"),
            reasonPlaceholder: t(
                "p. ex. doublon, erreur d’inscription, patient retiré sur demande de l’établissement…",
                "e.g. duplicate, registration error, patient removed at facility request…",
            ),
            confirm: t("Confirmer l’annulation", "Confirm cancellation"),
            close: t("Fermer", "Close"),
        },
        staffCancelD: {
            title: t("Veuillez préciser la raison d’annulation", "Please specify the cancellation reason"),
            introPrefix: t("La demande de ", "The request for "),
            introSuffix: t(" sera annulée.", " will be cancelled."),
            legend: t("Raison d’annulation", "Cancellation reason"),
            noShow: t("Le patient ne s’est pas présenté", "The patient did not show up"),
            other: t("Autre", "Other"),
            otherDetailLabel: t("Préciser la raison", "Specify the reason"),
            otherDetailHint: t("Veuillez préciser la raison.", "Please specify the reason."),
            otherDetailPlaceholder: t("Préciser la raison", "Specify the reason"),
            confirm: t("Confirmer", "Confirm"),
            cancel: t("Annuler", "Cancel"),
        },
        exitDistance: {
            refuseTitle: t("Annuler votre demande ?", "Cancel your request?"),
            withdrawTitle: t("Annuler votre demande ?", "Cancel your request?"),
            cancelManualTitle: t("Annuler votre demande ?", "Cancel your request?"),
            cancelBeforeConsentTitle: t("Annuler votre demande ?", "Cancel your request?"),
            cancelRecallTitle: t("Annuler votre demande ?", "Cancel your request?"),
            refuseConfirm: t("Confirmer l’annulation", "Confirm cancellation"),
            withdrawConfirm: t("Confirmer l’annulation", "Confirm cancellation"),
            cancelManualConfirm: t("Confirmer l’annulation", "Confirm cancellation"),
            cancelBeforeConsentConfirm: t("Confirmer l’annulation", "Confirm cancellation"),
            cancelRecallConfirm: t("Confirmer l’annulation", "Confirm cancellation"),
            bodyRefuse: t(
                "Si vous confirmez l’annulation de votre demande, vous n’êtes pas inscrit au service de rappel et de suivi à distance et vous ne recevrez pas de messages liés à la file d’attente virtuelle.",
                "If you confirm cancellation of your request, you are not enrolled in recall and remote follow-up, and you will not receive messages related to the virtual waiting queue.",
            ),
            bodyWithdraw: t(
                "Si vous confirmez l’annulation de votre demande, votre inscription à l’attente à distance prend fin : vous ne recevrez plus de messages de rappel ou de suivi par ce canal et vous ne serez plus suivi virtuellement dans la file d’attente.",
                "If you confirm cancellation of your request, your remote waiting enrollment ends: you will no longer receive recall or follow-up messages through this channel, and you will no longer be followed virtually in the queue.",
            ),
            bodyCancelManual: t(
                "Si vous confirmez l’annulation de votre demande, vous êtes retiré de la file d’attente à distance : vous ne recevrez plus de messages de suivi liés à cette inscription. Pour toute évaluation ou soins, vous devrez vous présenter en personne à l’urgence.",
                "If you confirm cancellation of your request, you are removed from the remote waiting queue: you will no longer receive follow-up messages for this enrollment. For any assessment or care, you must present in person at the emergency department.",
            ),
            bodyCancelBeforeConsent: t(
                "Si vous confirmez l’annulation de votre demande maintenant, votre inscription à l’attente à distance n’est pas poursuivie : vous ne serez pas ajouté à la file virtuelle et vous ne recevrez pas de messages de suivi liés à ce service.",
                "If you confirm cancellation of your request now, your remote waiting enrollment will not proceed: you will not be added to the virtual queue and you will not receive follow-up messages for this service.",
            ),
            bodyCancelRecall: t(
                "Si vous confirmez l’annulation de votre demande, vous mettez fin à votre inscription au service d’attente à distance : l’équipe ne pourra plus vous suivre par ce canal et vous ne recevrez plus de rappels ni de messages liés à cette inscription. Pour toute urgence ou soins, présentez-vous en personne à l’urgence.",
                "If you confirm cancellation of your request, your remote waiting enrollment ends: the team can no longer follow you through this channel and you will no longer receive recalls or messages for this enrollment. For emergencies or care, go to the emergency department in person.",
            ),
            footerInPerson: t(
                "Pour toute évaluation ou suite à donner à votre situation, vous devrez vous présenter en personne à l’urgence.",
                "For any assessment or next steps for your situation, you must present in person at the emergency department.",
            ),
            exitGoBack: t("Retour", "Go back"),
            exitKeepEnrollment: t("Conserver mon inscription", "Keep my enrollment"),
        },
        messagingBulk: {
            title: t("Envoyer un message", "Send a message"),
            subtitle: t(
                "Messagerie groupée (démo) : SMS et/ou courriel selon les coordonnées de chaque patient.",
                "Bulk messaging (demo): SMS and/or email based on each patient’s contact details.",
            ),
            close: t("Fermer", "Close"),
            targetLabel: t("Cible", "Audience"),
            targetAll: t("Tous les patients", "All patients"),
            targetWaiting: t("Colonne Attente", "Waiting column"),
            targetRecall: t("Colonne Rappel", "Recall column"),
            targetCompleted: t("Colonne Terminé", "Completed column"),
            templateLabel: t("Modèle", "Template"),
            customOption: t("Personnalisé…", "Custom…"),
            messageLabel: t("Message", "Message"),
            messagePlaceholder: t("Saisissez votre message…", "Type your message…"),
            footerHint: t("Un envoi par canal disponible (SMS et/ou courriel).", "One send per available channel (SMS and/or email)."),
            send: t("Envoyer", "Send"),
        },
        messagingSingle: {
            title: t("Envoyer un message", "Send a message"),
            toPrefix: t("À : ", "To: "),
            toSuffix: t(" — SMS et/ou courriel selon les coordonnées du dossier.", " — SMS and/or email based on chart contact details."),
            close: t("Fermer", "Close"),
            templateLabel: t("Modèle", "Template"),
            customOption: t("Personnalisé…", "Custom…"),
            messageLabel: t("Message", "Message"),
            messagePlaceholder: t("Saisissez votre message…", "Type your message…"),
            footerHint: t("Un envoi par canal disponible (SMS et/ou courriel).", "One send per available channel (SMS and/or email)."),
            send: t("Envoyer", "Send"),
        },
        messageTemplates: messageTemplates(locale),
        wizard: {
            closeAria: t("Fermer", "Close"),
            title: t("Nouveau patient", "New patient"),
            previousAnswers: t("Réponses précédentes", "Previous answers"),
            frozenIdentity: t("Identité", "Identity"),
            frozenFile: t("Nº dossier", "File no."),
            frozenContact: t("Coordonnées", "Contact"),
            frozenReason: t("Motif", "Reason"),
            frozenPriority: t("Priorité", "Priority"),
            frozenNotes: t("Notes", "Notes"),
            frozenManualConsent: t("Consentement manuel", "Manual consent"),
            yes: t("Oui", "Yes"),
            no: t("Non", "No"),
            questionN: (n, total) => t(`Question ${n} sur ${total}`, `Question ${n} of ${total}`),
            step0Title: t("Quel est le nom du patient ?", "What is the patient’s name?"),
            step0Hint: t(
                "Prénom et nom de famille — la touche Entrée passe du prénom au nom.",
                "First and last name — Enter moves from first name to last name.",
            ),
            firstName: t("Prénom", "First name"),
            lastName: t("Nom", "Last name"),
            firstNamePh: t("Ex. Marie", "e.g. Marie"),
            lastNamePh: t("Ex. Tremblay", "e.g. Tremblay"),
            step1Title: t("Quel est le numéro de dossier ?", "What is the file number?"),
            fileNumber: t("Numéro de dossier", "File number"),
            fileNumberPh: t("Ex. 444555666", "e.g. 444555666"),
            step2Title: t("Comment rejoindre le patient ?", "How should we reach the patient?"),
            step2Hint: t(
                "Au moins un moyen (SMS ou courriel) est nécessaire pour l’attente à distance.",
                "At least one channel (SMS or email) is required for remote waiting.",
            ),
            step2Subhint: t(
                "Entrée dans le mobile : passe au courriel si les deux sont vides, sinon continue.",
                "Enter in the mobile field: goes to email if both are empty, otherwise continues.",
            ),
            mobileSms: t("Mobile (SMS)", "Mobile (SMS)"),
            email: t("Courriel", "Email"),
            mobilePh: t("(514) 555-0123", "(514) 555-0123"),
            emailPh: t("courriel@exemple.com", "email@example.com"),
            commLanguage: t("Langue de communication", "Communication language"),
            commLanguageHint: t(
                "Cette langue est utilisée pour les messages texto (SMS) et les courriels automatisés envoyés au patient (invitation, rappel, etc.).",
                "This language is used for automated text messages (SMS) and emails sent to the patient (invitation, recall, etc.).",
            ),
            langFr: t("Français", "French"),
            langEn: t("Anglais", "English"),
            contactError: t("Indiquez un mobile ou un courriel (au moins l’un des deux).", "Provide a mobile number or an email (at least one)."),
            step3Title: t("Motif de présentation à l’urgence", "Reason for emergency visit"),
            reason: t("Motif", "Reason"),
            reasonRequired: t("Ce champ est obligatoire.", "This field is required."),
            reasonPh: t("p. ex. céphalée, fièvre…", "e.g. headache, fever…"),
            step4Title: t("Quelle priorité clinique ?", "What is the clinical priority?"),
            step4Hint: t("Flèches ← → ou ↑ ↓ : changer la priorité · Entrée : continuer.", "Arrow keys ← → or ↑ ↓: change priority · Enter: continue."),
            priorityP3Hint: t("La plus élevée, doit être prise en charge dès que possible.", "Highest — should be addressed as soon as possible."),
            priorityP4Hint: t("Moyenne, état stable mais doit être évalué rapidement.", "Medium — stable but should be evaluated promptly."),
            priorityP5Hint: t("La plus basse, l’évaluation peut être reportée.", "Lowest — evaluation can be deferred."),
            step5Title: t("Notes cliniques (optionnel)", "Clinical notes (optional)"),
            step5Hint: t("Entrée : continuer · Maj+Entrée : saut de ligne", "Enter: continue · Shift+Enter: new line"),
            notes: t("Notes", "Notes"),
            notesPh: t("Allergies, contexte, etc.", "Allergies, context, etc."),
            step6Title: t("Consentement déjà recueilli hors plateforme ?", "Consent already collected outside the platform?"),
            step6Hint: t(
                "Si le consentement a été géré en personne ou par un autre canal, cochez la case. Sinon, une demande de consentement sera envoyée au patient.",
                "If consent was obtained in person or through another channel, check the box. Otherwise a consent request will be sent to the patient.",
            ),
            step6Subhint: t(
                "Entrée avec le focus sur la case : cocher ou décocher. Soumission : bouton ci-dessous (ou Entrée si le focus est sur le bouton).",
                "Enter while focused on the checkbox toggles it. Submit using the button below (or Enter if focus is on the button).",
            ),
            manualConsentLabel: t("Le consentement a été géré manuellement.", "Consent was managed manually."),
            continue: t("Continuer", "Continue"),
            submitQueue: t("Ajouter à la file d’attente", "Add to waiting list"),
            back: t("Retour", "Back"),
            cancel: t("Annuler", "Cancel"),
            fallbackFirstName: t("Jeanne", "Jane"),
            fallbackLastName: t("Dupont", "Doe"),
        },
        demoPatientContent: {
            firstNames: ["Alex", "Sam", "Jordan", "Taylor", "Riley", "Casey", "Morgan", "Quinn", "Avery", "Jamie"],
            lastNames: ["Nguyen", "Patel", "Chen", "Roy", "Tremblay", "Gagnon", "Bélanger", "Fortin", "Leblanc", "Morin"],
            reasons: [
                t("Mal de tête", "Headache"),
                t("Douleur thoracique", "Chest pain"),
                t("Douleur abdominale", "Abdominal pain"),
                t("Essoufflement", "Shortness of breath"),
                t("Fièvre", "Fever"),
                t("Étourdissement", "Dizziness"),
            ],
            notes: [
                t("Symptômes aggravés pendant la nuit.", "Symptoms worsened overnight."),
                t("Stable depuis la dernière visite.", "Stable since last visit."),
                t("Allergie à la pénicilline.", "Penicillin allergy."),
                t("A essayé repos et hydratation, peu de soulagement.", "Tried rest and hydration, little relief."),
                "",
            ],
            emailDomain: t("exemple.com", "example.com"),
        },
        classicAddPatientC: {
            titleAdd: t("Ajouter un patient", "Add a patient"),
            titleEdit: t("Modifier le patient", "Edit patient"),
            contactBlurb: t(
                "Au moins un moyen (mobile ou courriel) est requis pour envoyer les notifications.",
                "At least one channel (mobile or email) is required to send notifications.",
            ),
            contactError: t(
                "Indiquez un numéro de mobile ou une adresse courriel (au moins l’un des deux).",
                "Provide a mobile number or an email address (at least one).",
            ),
            manualConsentHelp: t(
                "Cocher cette case permet au patient de contourner l’étape de consentement. La laisser décochée déclenchera une notification demandant le consentement via la plateforme.",
                "Checking this lets the patient skip the consent step. Leaving it unchecked triggers a notification requesting consent through the platform.",
            ),
            notesOptionalPlaceholder: t("Notes (optionnel)", "Notes (optional)"),
            save: t("Enregistrer", "Save"),
        },
        moveRecall: {
            title: t("Passer en colonne Rappel", "Move to recall column"),
            subtitleSuffix: t(
                " — choisissez le statut dans cette colonne et si le message de rappel doit être envoyé.",
                " — choose the status in this column and whether the recall message should be sent.",
            ),
            consentWarningTitle: t("Consentement requis", "Consent required"),
            consentWarningBody: t(
                "Ce dossier était sans consentement enregistré (y compris avant une annulation). Vous devez confirmer avoir reçu le consentement du patient avant de le placer en colonne Rappel.",
                "This chart had no recorded consent (including before a cancellation). You must confirm you have received the patient’s consent before placing them in the recall column.",
            ),
            consentCheckbox: t("Je confirme avoir reçu le consentement du patient", "I confirm I have received the patient’s consent"),
            statusLegend: t("Statut", "Status"),
            statusRecall: t("Rappelé — en attente de confirmation", "Recalled — awaiting confirmation"),
            statusArrived: t("Retour confirmé", "Return confirmed"),
            sendRecallTitle: t("Envoyer le message de rappel", "Send recall message"),
            sendRecallHint: t(
                "SMS et courriel selon les coordonnées du patient (lien pour confirmer le retour). Sans effet si le statut est « Retour confirmé ».",
                "SMS and email based on patient details (link to confirm return). No effect if status is “Return confirmed”.",
            ),
            confirm: t("Confirmer", "Confirm"),
            cancel: t("Annuler", "Cancel"),
        },
        classicAddPatientD: {
            contactSection: t("Contacter le patient", "Contact the patient"),
            commLanguage: t("Langue de communication", "Communication language"),
            commLanguageHint: t(
                "Cette langue est utilisée pour les messages texto (SMS) et les courriels automatisés envoyés au patient (invitation, rappel, etc.).",
                "This language is used for automated text messages (SMS) and emails sent to the patient (invitation, recall, etc.).",
            ),
            langFr: t("Français", "French"),
            langEn: t("Anglais", "English"),
            priority: t("Priorité", "Priority"),
            consentLockedLabelManual: t("Le consentement a été géré manuellement.", "Consent was managed manually."),
            consentLockedLabelPlatform: t("Le consentement a été enregistré via la plateforme.", "Consent was recorded through the platform."),
            consentLockedLabelNone: t("Consentement non enregistré pour ce dossier.", "No consent recorded for this chart."),
            consentLockedHelp: t(
                "Le consentement est déjà pris en compte pour ce dossier ; il ne peut pas être modifié ou retiré depuis cette fiche.",
                "Consent is already reflected on this chart; it cannot be changed or removed from this form.",
            ),
            consentUnlockedHelp: t(
                "Cocher cette case permet au patient de contourner l’étape de consentement et passe la fiche en attente lors de l’enregistrement. La laisser décochée déclenchera une notification demandant le consentement via la plateforme.",
                "Checking this lets the patient skip the consent step and moves the chart to waiting when saved. Leaving it unchecked triggers a notification requesting consent through the platform.",
            ),
        },
    };
}
