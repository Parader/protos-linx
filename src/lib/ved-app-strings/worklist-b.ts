import type { VEDLocale } from "@/lib/ved-locale";

export type WorklistBStrings = {
    boardColumns: {
        queue: { title: string; subtitle: string };
        prep: { title: string; subtitle: string };
        done: { title: string; subtitle: string };
    };
    emptyLane: { title: string; subtitle: string };
};

const WORKLIST_B: Record<VEDLocale, WorklistBStrings> = {
    fr: {
        boardColumns: {
            queue: { title: "File d’attente", subtitle: "Liste d’attente et prise de consentement" },
            prep: { title: "Préparation et rappel", subtitle: "Retour confirmé et rappel actif" },
            done: { title: "Terminé", subtitle: "Visites clôturées" },
        },
        emptyLane: { title: "Aucune fiche", subtitle: "Glissez un patient ici." },
    },
    en: {
        boardColumns: {
            queue: { title: "Queue", subtitle: "Waiting list & consent intake" },
            prep: { title: "Prep & callback", subtitle: "Return confirmed & active callback" },
            done: { title: "Completed", subtitle: "Closed visits" },
        },
        emptyLane: { title: "No cards", subtitle: "Drag a patient here." },
    },
};

export function getWorklistBStrings(locale: VEDLocale): WorklistBStrings {
    return WORKLIST_B[locale];
}
