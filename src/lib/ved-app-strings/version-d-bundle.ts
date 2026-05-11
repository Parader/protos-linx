import type { VEDLocale } from "@/lib/ved-locale";
import { getVersionCStringBundle, type VersionCStringBundle } from "@/lib/ved-app-strings/version-c-bundle";

/** Version D reuses almost all Version C chrome; extend here when D-specific copy diverges. */
export type VersionDStringBundle = VersionCStringBundle;

export function getVersionDStringBundle(locale: VEDLocale): VersionDStringBundle {
    return getVersionCStringBundle(locale);
}
