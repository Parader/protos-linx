import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getVedAppStrings, type VedAppStrings } from "@/lib/ved-app-strings";

/** Same key as legacy access-gate page — keeps gate + app in sync. */
export const VED_LOCALE_STORAGE_KEY = "ved-access-gate-locale";

export type VEDLocale = "fr" | "en";

export function readVEDLocale(): VEDLocale {
    try {
        const raw = sessionStorage.getItem(VED_LOCALE_STORAGE_KEY);
        if (raw === "en" || raw === "fr") return raw;
    } catch {
        /* private mode or blocked storage */
    }
    return "fr";
}

type VEDLocaleContextValue = {
    locale: VEDLocale;
    setLocale: (next: VEDLocale) => void;
    strings: VedAppStrings;
};

const VEDLocaleContext = createContext<VEDLocaleContextValue | null>(null);

export function VEDLocaleProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<VEDLocale>(() => readVEDLocale());

    const setLocale = useCallback((next: VEDLocale) => {
        setLocaleState(next);
        try {
            sessionStorage.setItem(VED_LOCALE_STORAGE_KEY, next);
        } catch {
            /* ignore */
        }
    }, []);

    useEffect(() => {
        document.documentElement.lang = locale === "fr" ? "fr" : "en";
    }, [locale]);

    const strings = useMemo(() => getVedAppStrings(locale), [locale]);

    const value = useMemo(() => ({ locale, setLocale, strings }), [locale, setLocale, strings]);

    return <VEDLocaleContext.Provider value={value}>{children}</VEDLocaleContext.Provider>;
}

export function useVEDLocale(): VEDLocaleContextValue {
    const ctx = useContext(VEDLocaleContext);
    if (!ctx) {
        throw new Error("useVEDLocale must be used within VEDLocaleProvider");
    }
    return ctx;
}
