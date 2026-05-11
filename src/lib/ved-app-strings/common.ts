import type { VEDLocale } from "@/lib/ved-locale";

export type CommonStrings = {
    accessGate: {
        title: string;
        subtitle: string;
        passwordLabel: string;
        submit: string;
        invalidPassword: string;
        switcherGroup: string;
        logoAlt: string;
        legalFr: string;
        legalEn: string;
    };
    hub: {
        signOut: string;
        title: string;
        subtitle: string;
        prototypesAria: string;
        logoAlt: string;
        prototypes: {
            versionA: { title: string; description: string };
            versionB: { title: string; description: string };
            versionC: { title: string; description: string };
            versionD: { title: string; description: string };
            trajectory: { title: string; description: string };
        };
    };
    notFound: {
        badge: string;
        title: string;
        body: string;
        goBack: string;
        home: string;
    };
    sidebar: {
        navAb: {
            worklist: string;
            simulatePatient: string;
            reports: string;
            help: string;
            signOut: string;
            accountMenu: string;
        };
        navCd: {
            worklist: string;
            reports: string;
            patientView: string;
            help: string;
            signOut: string;
            accountMenu: string;
        };
        /** Row label: switch to French (shown when UI is English). */
        switchToFr: string;
        /** Row label: switch to English (shown when UI is French). */
        switchToEn: string;
        switchToFrAria: string;
        switchToEnAria: string;
    };
};

const COMMON: Record<VEDLocale, CommonStrings> = {
    fr: {
        accessGate: {
            title: "Environnement de démonstration",
            subtitle: "Saisissez le mot de passe pour accéder au prototype.",
            passwordLabel: "Mot de passe",
            submit: "Accéder",
            invalidPassword: "Mot de passe non reconnu.",
            switcherGroup: "Langue",
            logoAlt: "Akinox",
            legalFr:
                "Les éléments accessibles par l’entremise de la présente interface — notamment démonstrations, maquettes et logiciels — constituent des œuvres et des informations protégées au titre du droit d’auteur et de la propriété intellectuelle appartenant à Akinox Inc. Ils vous sont communiqués à titre strictement confidentiel. Toute reproduction, diffusion auprès de tiers ou exploitation à des fins commerciales, sans autorisation préalable et expresse d’Akinox Inc., est interdite. En accédant au prototype, vous reconnaissez avoir pris connaissance des présentes dispositions et vous vous engagez à les respecter.",
            legalEn:
                "Materials accessible through this interface — including demonstrations, mockups, and software — are works and information protected by copyright and intellectual property belonging to Akinox Inc. They are provided to you on a strictly confidential basis. Any reproduction, disclosure to third parties, or commercial use without the prior express authorization of Akinox Inc. is prohibited. By accessing the prototype, you acknowledge that you have read these terms and agree to comply with them.",
        },
        hub: {
            signOut: "Se déconnecter",
            title: "Environnement de démonstration",
            subtitle: "Prototypes — choisissez un parcours ou une maquette.",
            prototypesAria: "Liste des prototypes",
            logoAlt: "Akinox",
            prototypes: {
                versionA: {
                    title: "Version A",
                    description:
                        "Parcours complet — liste de travail, consentement patient et étapes suivantes.",
                },
                versionB: {
                    title: "Version B",
                    description: "Mise en page alternative pour le même parcours (à comparer avec la Version A).",
                },
                versionC: {
                    title: "Version C",
                    description: "Démo vente — liste de travail haute fidélité avec notifications côté patient.",
                },
                versionD: {
                    title: "Version D",
                    description: "Copie de la Version C pour itérer sans impacter la démo C.",
                },
                trajectory: {
                    title: "Épisodes de soins",
                    description: "Figma mockup — trajectoire de soins, questionnaire de triage.",
                },
            },
        },
        notFound: {
            badge: "Erreur 404",
            title: "Page introuvable",
            body: "Désolé, la page demandée n’existe pas ou a été déplacée.",
            goBack: "Retour",
            home: "Accueil",
        },
        sidebar: {
            navAb: {
                worklist: "Liste de travail",
                simulatePatient: "Simuler le patient",
                reports: "Rapports et statistiques",
                help: "Aide",
                signOut: "Se déconnecter",
                accountMenu: "Menu du compte",
            },
            navCd: {
                worklist: "Liste de travail",
                reports: "Rapports et statistiques",
                patientView: "Vue patient",
                help: "Aide",
                signOut: "Se déconnecter",
                accountMenu: "Menu du compte",
            },
            switchToFr: "Français",
            switchToEn: "English",
            switchToFrAria: "Afficher l’interface en français",
            switchToEnAria: "Show interface in English",
        },
    },
    en: {
        accessGate: {
            title: "Demonstration environment",
            subtitle: "Enter the password to access the prototype.",
            passwordLabel: "Password",
            submit: "Enter",
            invalidPassword: "Password not recognized.",
            switcherGroup: "Language",
            logoAlt: "Akinox",
            legalFr:
                "Les éléments accessibles par l’entremise de la présente interface — notamment démonstrations, maquettes et logiciels — constituent des œuvres et des informations protégées au titre du droit d’auteur et de la propriété intellectuelle appartenant à Akinox Inc. Ils vous sont communiqués à titre strictement confidentiel. Toute reproduction, diffusion auprès de tiers ou exploitation à des fins commerciales, sans autorisation préalable et expresse d’Akinox Inc., est interdite. En accédant au prototype, vous reconnaissez avoir pris connaissance des présentes dispositions et vous vous engagez à les respecter.",
            legalEn:
                "Materials accessible through this interface — including demonstrations, mockups, and software — are works and information protected by copyright and intellectual property belonging to Akinox Inc. They are provided to you on a strictly confidential basis. Any reproduction, disclosure to third parties, or commercial use without the prior express authorization of Akinox Inc. is prohibited. By accessing the prototype, you acknowledge that you have read these terms and agree to comply with them.",
        },
        hub: {
            signOut: "Sign out",
            title: "Demonstration environment",
            subtitle: "Prototypes — choose a flow or mockup.",
            prototypesAria: "Prototype list",
            logoAlt: "Akinox",
            prototypes: {
                versionA: {
                    title: "Version A",
                    description: "Full flow — worklist, patient consent, and follow-up steps.",
                },
                versionB: {
                    title: "Version B",
                    description: "Alternate layout for the same flow (compare with Version A).",
                },
                versionC: {
                    title: "Version C",
                    description: "Sales demo — high-fidelity worklist with patient-side notifications.",
                },
                versionD: {
                    title: "Version D",
                    description: "Copy of Version C for iteration without impacting the C demo.",
                },
                trajectory: {
                    title: "Care episodes",
                    description: "Figma mockup — care trajectory and triage questionnaire.",
                },
            },
        },
        notFound: {
            badge: "404 error",
            title: "We can’t find that page",
            body: "Sorry, the page you are looking for doesn't exist or has been moved.",
            goBack: "Go back",
            home: "Take me home",
        },
        sidebar: {
            navAb: {
                worklist: "Worklist",
                simulatePatient: "Simulate patient",
                reports: "Reports and statistics",
                help: "Help",
                signOut: "Sign out",
                accountMenu: "Account menu",
            },
            navCd: {
                worklist: "Worklist",
                reports: "Reports and statistics",
                patientView: "Patient view",
                help: "Help",
                signOut: "Sign out",
                accountMenu: "Account menu",
            },
            switchToFr: "Français",
            switchToEn: "English",
            switchToFrAria: "Switch interface to French",
            switchToEnAria: "Afficher l’interface en anglais",
        },
    },
};

export function getCommonStrings(locale: VEDLocale): CommonStrings {
    return COMMON[locale];
}
