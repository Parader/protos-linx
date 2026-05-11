import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router";
import { Globe01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { BRAND_AKINOX_LOGO } from "@/constants/brand-assets";
import { resolvePathForPassword } from "@/config/access-gate";
import { getAllowedPrefix, setAllowedPrefix } from "@/lib/access-session";
import { useVEDLocale } from "@/lib/ved-locale";
import { cx } from "@/utils/cx";

export const AccessGatePage = () => {
    const navigate = useNavigate();
    const { locale, setLocale, strings } = useVEDLocale();
    const existing = getAllowedPrefix();
    const [password, setPassword] = useState("");
    const [error, setError] = useState<"invalid" | null>(null);

    const t = strings.common.accessGate;
    const sb = strings.common.sidebar;

    if (existing) {
        return <Navigate to={existing} replace />;
    }

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        const target = resolvePathForPassword(password);
        if (!target) {
            setError("invalid");
            return;
        }
        setAllowedPrefix(target);
        navigate(target, { replace: true });
    };

    return (
        <div className="relative flex min-h-dvh flex-col bg-primary">
            <div
                className="absolute top-4 right-4 z-10 flex items-center gap-2 sm:top-6 sm:right-6"
                role="group"
                aria-label={t.switcherGroup}
            >
                <Globe01 className="size-5 shrink-0 text-tertiary" strokeWidth={1.75} aria-hidden />
                <div className="inline-flex rounded-lg border border-secondary bg-primary p-0.5 shadow-sm">
                    <button
                        type="button"
                        onClick={() => setLocale("fr")}
                        className={cx(
                            "rounded-md px-3 py-1.5 text-sm font-semibold transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-primary",
                            locale === "fr"
                                ? "bg-brand-solid text-white shadow-xs-skeuomorphic"
                                : "text-tertiary hover:bg-secondary_hover hover:text-secondary",
                        )}
                        aria-pressed={locale === "fr"}
                        aria-label={sb.switchToFrAria}
                    >
                        {sb.switchToFr}
                    </button>
                    <button
                        type="button"
                        onClick={() => setLocale("en")}
                        className={cx(
                            "rounded-md px-3 py-1.5 text-sm font-semibold transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-primary",
                            locale === "en"
                                ? "bg-brand-solid text-white shadow-xs-skeuomorphic"
                                : "text-tertiary hover:bg-secondary_hover hover:text-secondary",
                        )}
                        aria-pressed={locale === "en"}
                        aria-label={sb.switchToEnAria}
                    >
                        {sb.switchToEn}
                    </button>
                </div>
            </div>

            <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
                <div className="mb-6 flex flex-col items-center gap-4">
                    <div className="flex justify-center px-2">
                        <img
                            src={BRAND_AKINOX_LOGO}
                            alt={t.logoAlt}
                            className="h-10 w-auto max-w-[200px] object-contain object-center"
                        />
                    </div>
                    <h1 className="text-center text-display-sm font-semibold text-primary">{t.title}</h1>
                    <p className="text-center text-md text-tertiary">{t.subtitle}</p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <Input
                        label={t.passwordLabel}
                        type="password"
                        value={password}
                        onChange={setPassword}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        isInvalid={!!error}
                        hint={error === "invalid" ? t.invalidPassword : undefined}
                    />
                    <Button type="submit" size="lg" color="primary">
                        {t.submit}
                    </Button>
                </form>

                <div className="mt-8 rounded-xl border border-secondary bg-secondary px-4 py-3">
                    <p className="text-center text-xs leading-relaxed text-tertiary">
                        {locale === "fr" ? t.legalFr : t.legalEn}
                    </p>
                </div>
            </div>
        </div>
    );
};
