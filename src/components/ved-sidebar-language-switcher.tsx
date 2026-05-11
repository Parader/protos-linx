import { Globe01 } from "@untitledui/icons";
import { useVEDLocale } from "@/lib/ved-locale";

/**
 * Sidebar language control: shows the language you will switch **to**
 * (“Français” when the UI is in English, “English” when the UI is in French).
 */
export function VedSidebarLanguageSwitcher() {
    const { locale, setLocale, strings } = useVEDLocale();
    const { switchToFr, switchToEn, switchToFrAria, switchToEnAria } = strings.common.sidebar;

    const isFr = locale === "fr";
    const next: "fr" | "en" = isFr ? "en" : "fr";
    const label = isFr ? switchToEn : switchToFr;
    const aria = isFr ? switchToEnAria : switchToFrAria;

    return (
        <button
            type="button"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left outline-hidden transition-colors hover:bg-[#F9FAFB] focus-visible:ring-2 focus-visible:ring-[#7F56D9] focus-visible:ring-offset-2"
            onClick={() => setLocale(next)}
            aria-label={aria}
        >
            <Globe01 className="size-6 shrink-0 text-[#475467]" strokeWidth={1.75} aria-hidden />
            <span className="text-base font-medium leading-6 text-[#475467]">{label}</span>
        </button>
    );
}
