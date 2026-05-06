export type MessageTemplateId =
    | "closure"
    | "reopening"
    | "urgent_return_waiting"
    | "abnormal_delays"
    | "custom";

export const STAFF_MESSAGE_TEMPLATES: { id: MessageTemplateId; label: string; body: string }[] = [
    {
        id: "closure",
        label: "Fermeture",
        body: "L’accueil virtuel de l’urgence est temporairement interrompu. Vous serez avisé lorsque le service rouvrira. Si votre état se détériore ou devient critique, composez le 911 ou présentez-vous immédiatement à l’urgence.",
    },
    {
        id: "reopening",
        label: "Réouverture de l’urgence",
        body: "L’urgence a rouvert son accueil virtuel pour l’attente à distance : les messages de suivi reprennent normalement. Si votre état change ou s’aggrave, présentez-vous sans délai ou composez le 911.",
    },
    {
        id: "urgent_return_waiting",
        label: "Annulation du rappel (nouveaux cas prioritaires)",
        body: "Depuis votre rappel, l’urgence a accueilli de nouveaux cas jugés prioritaires : nous devons donc annuler votre rappel pour l’instant. Vous demeurez en attente virtuelle et serez avisé si la situation évolue. Si votre état s’aggrave, présentez-vous sans délai à l’urgence ou composez le 911.",
    },
    {
        id: "abnormal_delays",
        label: "Délais anormaux",
        body: "Nous rencontrons actuellement des délais de prise en charge inhabituels. Merci de votre patience; nous vous contacterons dès qu’il y a une mise à jour concernant votre attente.",
    },
    {
        id: "custom",
        label: "Personnalisé…",
        body: "",
    },
];

export function staffMessageTemplateBody(id: MessageTemplateId): string {
    return STAFF_MESSAGE_TEMPLATES.find((t) => t.id === id)?.body ?? "";
}
