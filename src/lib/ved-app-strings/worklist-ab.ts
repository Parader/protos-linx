import type { VEDLocale } from "@/lib/ved-locale";

export type WorklistAbStrings = {
    statusLabels: {
        consent: string;
        waiting: string;
        calledBack: string;
        confirmed: string;
        completed: string;
    };
    queueLaneLabels: { waiting: string; consent: string };
    consultationReasons: readonly string[];
    worklistPage: {
        crumb: string;
        title: string;
        settings: string;
        settingsTitle: string;
        settingsSubtitle: string;
        close: string;
        bulkAddLabel: string;
        bulkAddHint: string;
        addRandomPatients: string;
        clearList: string;
        searchPlaceholder: string;
        newPatient: string;
        messageWaiting: string;
        emptyTitle: string;
        emptyBody: string;
        collapsedHint: string;
        expandLane: string;
        collapseLane: string;
        addPatientTitle: string;
        addPatientSubtitle: string;
        autofillRandom: string;
        name: string;
        fileNumber: string;
        notes: string;
        notesPlaceholder: string;
        consentCheckboxTitle: string;
        consentCheckboxHintAdd: string;
        consentCheckboxHintEdit: string;
        addPatientSubmit: string;
        cancel: string;
        editPatientTitle: string;
        editPatientSubtitle: string;
        saveChanges: string;
    };
    patientCard: {
        cancelled: string;
        pendingConsent: string;
        lastMessagePrefix: string;
        inColumn: string;
        noMobile: string;
        smsVoiceNote: string;
        noMobileAria: string;
        mobileSmsAria: (phone: string) => string;
        noEmail: string;
        noEmailAria: string;
        emailAria: (email: string) => string;
        sendEmail: string;
        calledBackBeforeArrived: string;
        calledBackArrivedWord: string;
        calledBackAfterArrived: string;
        confirmedBeforeArrived: string;
        confirmedArrivedWord: string;
        confirmedAfterArrived: string;
        confirmCallBack: string;
        edit: string;
        moreOptions: string;
        moveTo: (status: string) => string;
        cancelVisit: string;
        sendMessage: string;
        primaryPatientGaveConsent: string;
        primaryCallBack: string;
        primaryArrived: string;
        simulatePatientConfirmedReturn: string;
        /** Version B board chip when patient is in prep column after callback. */
        boardChipCalledBackInPrep: string;
    };
    staffDialog: {
        titleWaiting: string;
        titlePatient: string;
        subtitleWaitingOne: string;
        subtitleWaitingMany: (n: number) => string;
        subtitlePatientNamed: (name: string) => string;
        subtitlePatientGeneric: string;
        chooseMessage: string;
        messagePreviewLabel: string;
        customizeBeforeSend: string;
        yourMessage: string;
        editMessage: string;
        hintCustom: string;
        hintEdit: string;
        placeholderCustom: string;
        useOriginal: string;
        send: string;
        cancel: string;
    };
    staffTemplates: {
        queue_status: { title: string; description: string; body: string };
        delay: { title: string; description: string; body: string };
        return_er: { title: string; description: string; body: string };
        wrong_number: { title: string; description: string; body: string };
        custom: { title: string; description: string };
    };
    form: {
        reasonLabel: string;
        reasonPlaceholder: string;
        reachTitle: string;
        reachHint: string;
        sms: string;
        email: string;
        mobileSms: string;
        mobilePlaceholder: string;
        emailLabel: string;
        emailPlaceholder: string;
        priority: string;
        priorityP1: string;
        priorityP2: string;
        priorityP3: string;
        priorityTierP1: string;
        priorityTierP2: string;
        priorityTierP3: string;
        /** Version B (P4 / P5 only). */
        priorityP4: string;
        priorityP5: string;
    };
    unnamedPatient: string;
    dashFallback: string;
};

const WORKLIST_AB: Record<VEDLocale, WorklistAbStrings> = {
    fr: {
        statusLabels: {
            consent: "Consentement",
            waiting: "Attente",
            calledBack: "Rappel",
            confirmed: "Retour confirmé",
            completed: "Terminé",
        },
        queueLaneLabels: { waiting: "Attente", consent: "Consentement en attente" },
        consultationReasons: [
            "Céphalée",
            "Douleur thoracique",
            "Douleur abdominale",
            "Essoufflement",
            "Fièvre",
            "Étourdissement",
            "Mal de dos",
            "Mal de gorge",
            "Coupure / lacération",
            "Anxiété / panique",
            "Nausée",
            "Éruption cutanée",
            "Suivi",
            "Renouvellement de médicament",
        ],
        worklistPage: {
            crumb: "Espaces / Répartition VED",
            title: "Liste de travail",
            settings: "Paramètres",
            settingsTitle: "Paramètres",
            settingsSubtitle: "Outils de prototype pour tester la liste de travail.",
            close: "Fermer",
            bulkAddLabel: "Ajout groupé",
            bulkAddHint: "Patients aléatoires (max 500)",
            addRandomPatients: "Ajouter des patients aléatoires",
            clearList: "Vider la liste",
            searchPlaceholder: "Rechercher sur le tableau…",
            newPatient: "Nouveau patient",
            messageWaiting: "Message à l’attente",
            emptyTitle: "Aucun patient pour l’instant",
            emptyBody:
                "Créez un patient pour le faire progresser dans le consentement, la file, les rappels et la fin de parcours depuis cette liste.",
            collapsedHint: "Réduit — développez pour voir les cartes, ou déposez ici",
            expandLane: "Développer la liste",
            collapseLane: "Réduire la liste",
            addPatientTitle: "Ajouter un patient",
            addPatientSubtitle: "Créez un patient et placez-le à la bonne étape.",
            autofillRandom: "Remplir au hasard",
            name: "Nom",
            fileNumber: "Numéro de dossier",
            notes: "Notes",
            notesPlaceholder: "Notes facultatives…",
            consentCheckboxTitle: "Consentement déjà obtenu",
            consentCheckboxHintAdd: "Si la case n’est pas cochée, le patient commence à l’étape Consentement.",
            consentCheckboxHintEdit: "Pour l’exactitude du dossier seulement ; ne déplace pas la carte.",
            addPatientSubmit: "Ajouter le patient",
            cancel: "Annuler",
            editPatientTitle: "Modifier le patient",
            editPatientSubtitle:
                "Mettez à jour les données du dossier. L’étape du parcours ne change pas — utilisez le tableau ou les actions de la carte pour déplacer.",
            saveChanges: "Enregistrer",
        },
        patientCard: {
            cancelled: "Annulé",
            pendingConsent: "Consentement en attente",
            lastMessagePrefix: "Dernier message · ",
            inColumn: "Dans cette colonne : ",
            noMobile: "Aucun cellulaire au dossier",
            smsVoiceNote: "Les appels vocaux ne sont pas disponibles — SMS ou courriel seulement.",
            noMobileAria: "Aucun cellulaire au dossier",
            mobileSmsAria: (phone) => `Cellulaire (SMS) : ${phone}`,
            noEmail: "Aucun courriel au dossier",
            noEmailAria: "Aucun courriel au dossier",
            emailAria: (email) => `Courriel : ${email}`,
            sendEmail: "Envoyer un courriel",
            calledBackBeforeArrived: "Le patient peut confirmer son retour (simulé ci-dessous). Ensuite, ",
            calledBackArrivedWord: "Arrivé",
            calledBackAfterArrived: " termine la visite.",
            confirmedBeforeArrived: "Le patient a confirmé son retour. Utilisez ",
            confirmedArrivedWord: "Arrivé",
            confirmedAfterArrived: " lorsqu’il se présente.",
            confirmCallBack: "Confirmer le rappel",
            edit: "Modifier",
            moreOptions: "Autres options",
            moveTo: (status) => `Déplacer vers ${status}`,
            cancelVisit: "Annuler la visite",
            sendMessage: "Envoyer un message",
            primaryPatientGaveConsent: "Le patient a donné son consentement",
            primaryCallBack: "Rappeler",
            primaryArrived: "Arrivé",
            simulatePatientConfirmedReturn: "Simuler la confirmation de retour par le patient",
            boardChipCalledBackInPrep: "Réponse en cours / en route",
        },
        staffDialog: {
            titleWaiting: "Message à tous les patients en attente",
            titlePatient: "Envoyer un message au patient",
            subtitleWaitingOne: "1 patient dans la voie Attente recevra ce message (simulation).",
            subtitleWaitingMany: (n: number) => `${n} patients dans la voie Attente recevront ce message (simulation).`,
            subtitlePatientNamed: (name: string) => `Le message sera consigné au dossier de ${name} (simulation).`,
            subtitlePatientGeneric: "Le message sera consigné à ce dossier (simulation).",
            chooseMessage: "Choisir un message",
            messagePreviewLabel: "Texte du message (tel quel)",
            customizeBeforeSend: "Personnaliser avant l’envoi",
            yourMessage: "Votre message",
            editMessage: "Modifier le message",
            hintCustom: "Rédigez le texte complet. Rien n’est envoyé tant que vous n’appuyez pas sur Envoyer.",
            hintEdit: "Ajustez le libellé si besoin ; le lien au modèle est conservé seulement si le texte correspond encore à l’original.",
            placeholderCustom: "Saisissez votre message…",
            useOriginal: "Reprendre le texte d’origine",
            send: "Envoyer le message",
            cancel: "Annuler",
        },
        staffTemplates: {
            queue_status: {
                title: "Position dans la file",
                description: "Rassurer le patient qu’il demeure dans la file virtuelle et qu’un clinicien communiquera dès que possible.",
                body: "Vous êtes toujours dans la file virtuelle. Nous communiquerons avec vous dès qu’un clinicien est disponible.",
            },
            delay: {
                title: "Court délai",
                description: "Reconnaître l’attente et indiquer que l’équipe répondra bientôt par le moyen de contact préféré.",
                body: "Merci d’attendre. Il y a un court délai ; nous communiquerons sous peu par votre moyen de contact préféré.",
            },
            return_er: {
                title: "Retour à l’urgence",
                description: "Rappeler de revenir à la même urgence lorsque demandé, pas immédiatement sauf indication contraire.",
                body: "Lorsque demandé, veuillez retourner à l’urgence où vous avez d’abord été évalué. Gardez ce message si utile.",
            },
            wrong_number: {
                title: "Impossible de rejoindre",
                description: "Utilisé lorsque les appels ou texto ont échoué ; demande d’appeler l’urgence ou de répondre dès que possible.",
                body: "Nous avons tenté de vous joindre sans succès. Veuillez appeler l’urgence ou répondre dès que vous le pouvez.",
            },
            custom: {
                title: "Message personnalisé",
                description: "Rédigez votre propre texte lorsqu’aucun message standard ne convient.",
            },
        },
        form: {
            reasonLabel: "Motif de consultation",
            reasonPlaceholder: "Céphalée, fièvre, etc.",
            reachTitle: "Rejoindre le patient",
            reachHint: "SMS ou courriel seulement (pas d’appel vocal). Le SMS utilise le numéro de cellulaire ci-dessous.",
            sms: "SMS",
            email: "Courriel",
            mobileSms: "Cellulaire (SMS)",
            mobilePlaceholder: "(555) 555-5555",
            emailLabel: "Courriel",
            emailPlaceholder: "marie@exemple.com",
            priority: "Priorité",
            priorityP1: "Immédiat — symptômes critiques, risque vital.",
            priorityP2: "Très urgent — évaluation et action rapides requises.",
            priorityP3: "Urgent — stable, mais à voir bientôt.",
            priorityTierP1: "La plus haute",
            priorityTierP2: "Élevée",
            priorityTierP3: "Moyenne",
            priorityP4: "Priorité plus élevée (à traiter en premier)",
            priorityP5: "Routine (urgence la plus basse)",
        },
        unnamedPatient: "Patient sans nom",
        dashFallback: "—",
    },
    en: {
        statusLabels: {
            consent: "Consent",
            waiting: "Waiting",
            calledBack: "Called back",
            confirmed: "Confirmed",
            completed: "Completed",
        },
        queueLaneLabels: { waiting: "Waiting", consent: "Pending consent" },
        consultationReasons: [
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
        ],
        worklistPage: {
            crumb: "Spaces / VED dispatch",
            title: "Worklist",
            settings: "Settings",
            settingsTitle: "Settings",
            settingsSubtitle: "Prototype tools for testing the worklist.",
            close: "Close",
            bulkAddLabel: "Bulk add",
            bulkAddHint: "Random patients (max 500)",
            addRandomPatients: "Add random patients",
            clearList: "Clear list",
            searchPlaceholder: "Search board…",
            newPatient: "New patient",
            messageWaiting: "Message Waiting",
            emptyTitle: "No patients yet",
            emptyBody:
                "Create a patient to start moving them through consent, the queue, callbacks, and completion from this worklist.",
            collapsedHint: "Collapsed — expand to view cards, or drop here",
            expandLane: "Expand list",
            collapseLane: "Collapse list",
            addPatientTitle: "Add patient",
            addPatientSubtitle: "Create a patient and place them in the correct step.",
            autofillRandom: "Autofill random",
            name: "Name",
            fileNumber: "File number",
            notes: "Notes",
            notesPlaceholder: "Optional notes…",
            consentCheckboxTitle: "Consent already given",
            consentCheckboxHintAdd: "If unchecked, the patient starts in the Consent step.",
            consentCheckboxHintEdit: "For chart accuracy only; does not move the card.",
            addPatientSubmit: "Add patient",
            cancel: "Cancel",
            editPatientTitle: "Edit patient",
            editPatientSubtitle:
                "Update chart details. Workflow step is unchanged — use the board or card actions to move steps.",
            saveChanges: "Save changes",
        },
        patientCard: {
            cancelled: "Cancelled",
            pendingConsent: "Pending consent",
            lastMessagePrefix: "Last message · ",
            inColumn: "In this column: ",
            noMobile: "No mobile on file",
            smsVoiceNote: "Voice calls are not available — SMS or email only.",
            noMobileAria: "No mobile on file",
            mobileSmsAria: (phone) => `Mobile (SMS): ${phone}`,
            noEmail: "No email on file",
            noEmailAria: "No email on file",
            emailAria: (email) => `Email: ${email}`,
            sendEmail: "Send email",
            calledBackBeforeArrived: "Patient can confirm return (simulated below). Then ",
            calledBackArrivedWord: "Arrived",
            calledBackAfterArrived: " completes the visit.",
            confirmedBeforeArrived: "Patient confirmed return. Use ",
            confirmedArrivedWord: "Arrived",
            confirmedAfterArrived: " when they present.",
            confirmCallBack: "Confirm call back",
            edit: "Edit",
            moreOptions: "More options",
            moveTo: (status) => `Move to ${status}`,
            cancelVisit: "Cancel visit",
            sendMessage: "Send message",
            primaryPatientGaveConsent: "Patient gave consent",
            primaryCallBack: "Call back",
            primaryArrived: "Arrived",
            simulatePatientConfirmedReturn: "Simulate patient confirmed return",
            boardChipCalledBackInPrep: "Responded / coming back",
        },
        staffDialog: {
            titleWaiting: "Message to everyone in Waiting",
            titlePatient: "Send message to patient",
            subtitleWaitingOne: "1 patient in the Waiting lane will receive this (simulated).",
            subtitleWaitingMany: (n: number) => `${n} patients in the Waiting lane will receive this (simulated).`,
            subtitlePatientNamed: (name: string) => `Message will be logged on ${name}’s chart (simulated).`,
            subtitlePatientGeneric: "Message will be logged on this chart (simulated).",
            chooseMessage: "Choose a message",
            messagePreviewLabel: "Message text (sent as-is)",
            customizeBeforeSend: "Customize before sending",
            yourMessage: "Your message",
            editMessage: "Edit message",
            hintCustom: "Compose the full text. Nothing is sent until you click Send.",
            hintEdit: "Adjust the wording if needed; the template link is kept only if the text still matches the original.",
            placeholderCustom: "Type your message…",
            useOriginal: "Use original wording",
            send: "Send message",
            cancel: "Cancel",
        },
        staffTemplates: {
            queue_status: {
                title: "Queue position",
                description:
                    "Reassure the patient that they remain in the virtual queue and a clinician will reach out when available.",
                body: "You are still in the virtual queue. We will contact you as soon as a clinician is available.",
            },
            delay: {
                title: "Short delay",
                description: "Acknowledge a wait and set expectation that the team will respond soon via their preferred contact method.",
                body: "Thank you for waiting. There is a short delay; we will reach out shortly via your preferred contact method.",
            },
            return_er: {
                title: "Return to emergency department",
                description: "Remind them to come back to the same ER when instructed, not immediately unless directed.",
                body: "When instructed, please return to the emergency department where you were first assessed. Bring this message if helpful.",
            },
            wrong_number: {
                title: "Unable to reach",
                description: "Used when calls or texts failed; asks the patient to call the ER or reply when possible.",
                body: "We tried to reach you but could not connect. Please call the emergency department or reply when you can.",
            },
            custom: {
                title: "Custom message",
                description: "Compose your own text from scratch when none of the standard messages apply.",
            },
        },
        form: {
            reasonLabel: "Reason for consultation",
            reasonPlaceholder: "Headache, fever, etc.",
            reachTitle: "Reach the patient",
            reachHint: "SMS or email only (no phone call). SMS uses the mobile number below.",
            sms: "SMS",
            email: "Email",
            mobileSms: "Mobile (SMS)",
            mobilePlaceholder: "(555) 555-5555",
            emailLabel: "Email",
            emailPlaceholder: "jane@example.com",
            priority: "Priority",
            priorityP1: "Immediate — critical symptoms, life-threatening risk.",
            priorityP2: "Very urgent — needs quick assessment and action.",
            priorityP3: "Urgent — stable, but should be seen soon.",
            priorityTierP1: "Highest",
            priorityTierP2: "High",
            priorityTierP3: "Medium",
            priorityP4: "Higher priority (prioritize first)",
            priorityP5: "Routine (lowest urgency)",
        },
        unnamedPatient: "Unnamed patient",
        dashFallback: "—",
    },
};

export function getWorklistAbStrings(locale: VEDLocale): WorklistAbStrings {
    return WORKLIST_AB[locale];
}
