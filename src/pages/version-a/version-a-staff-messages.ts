/** Quick messages staff can send (prototype — simulated patient notifications). */
export type StaffMessageTemplate = {
    id: string;
    /** Short label for the list. */
    title: string;
    /** When to use this message (staff-facing). */
    description: string;
    /** Text sent to the patient; empty only for the synthetic “custom” option. */
    body: string;
};

export const STAFF_MESSAGE_TEMPLATES: StaffMessageTemplate[] = [
    {
        id: "queue_status",
        title: "Queue position",
        description: "Reassure the patient that they remain in the virtual queue and a clinician will reach out when available.",
        body: "You are still in the virtual queue. We will contact you as soon as a clinician is available.",
    },
    {
        id: "delay",
        title: "Short delay",
        description: "Acknowledge a wait and set expectation that the team will respond soon via their preferred contact method.",
        body: "Thank you for waiting. There is a short delay; we will reach out shortly via your preferred contact method.",
    },
    {
        id: "return_er",
        title: "Return to emergency department",
        description: "Remind them to come back to the same ER when instructed, not immediately unless directed.",
        body: "When instructed, please return to the emergency department where you were first assessed. Bring this message if helpful.",
    },
    {
        id: "wrong_number",
        title: "Unable to reach",
        description: "Used when calls or texts failed; asks the patient to call the ER or reply when possible.",
        body: "We tried to reach you but could not connect. Please call the emergency department or reply when you can.",
    },
];

/** Shown in the dialog as a fifth option; body is filled by staff. */
export const CUSTOM_MESSAGE_OPTION: StaffMessageTemplate = {
    id: "custom",
    title: "Custom message",
    description: "Compose your own text from scratch when none of the standard messages apply.",
    body: "",
};

export const ALL_STAFF_MESSAGE_OPTIONS: StaffMessageTemplate[] = [...STAFF_MESSAGE_TEMPLATES, CUSTOM_MESSAGE_OPTION];
