import type { MessageTemplateId } from "@/lib/ved-app-strings/version-cd-pages";
import type { VersionCStringBundle } from "@/lib/ved-app-strings/version-c-bundle";

export function staffMessageTemplateBody(
    templates: VersionCStringBundle["pages"]["messageTemplates"],
    id: MessageTemplateId,
): string {
    if (id === "custom") return "";
    return templates[id].body;
}
