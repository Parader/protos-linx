import type { VEDLocale } from "@/lib/ved-locale";
import { getCommonStrings, type CommonStrings } from "@/lib/ved-app-strings/common";
import { getWorklistAbStrings, type WorklistAbStrings } from "@/lib/ved-app-strings/worklist-ab";
import { getWorklistBStrings, type WorklistBStrings } from "@/lib/ved-app-strings/worklist-b";
import { getVersionCStringBundle, type VersionCStringBundle } from "@/lib/ved-app-strings/version-c-bundle";
import { getVersionDStringBundle, type VersionDStringBundle } from "@/lib/ved-app-strings/version-d-bundle";

export type VedAppStrings = {
    common: CommonStrings;
    worklistAb: WorklistAbStrings;
    worklistB: WorklistBStrings;
    versionC: VersionCStringBundle;
    versionD: VersionDStringBundle;
};

export function getVedAppStrings(locale: VEDLocale): VedAppStrings {
    return {
        common: getCommonStrings(locale),
        worklistAb: getWorklistAbStrings(locale),
        worklistB: getWorklistBStrings(locale),
        versionC: getVersionCStringBundle(locale),
        versionD: getVersionDStringBundle(locale),
    };
}

export type { CommonStrings, WorklistAbStrings, WorklistBStrings, VersionCStringBundle, VersionDStringBundle };
