import type { VEDLocale } from "@/lib/ved-locale";
import { getVersionCdPagesCore, type VersionCdPagesCore } from "@/lib/ved-app-strings/version-cd-pages-core";
import { getVersionCdPagesFlows, type VersionCdPagesFlows } from "@/lib/ved-app-strings/version-cd-pages-flows";

export type VersionCdPagesStrings = VersionCdPagesCore & VersionCdPagesFlows;

export function getVersionCdPages(locale: VEDLocale): VersionCdPagesStrings {
    return { ...getVersionCdPagesCore(locale), ...getVersionCdPagesFlows(locale) };
}

export type { MessageTemplateId } from "@/lib/ved-app-strings/version-cd-pages-core";
export { MESSAGE_TEMPLATE_ORDER } from "@/lib/ved-app-strings/version-cd-pages-core";
