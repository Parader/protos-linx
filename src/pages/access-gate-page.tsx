import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { BRAND_AKINOX_LOGO } from "@/constants/brand-assets";
import { resolvePathForPassword } from "@/config/access-gate";
import { getAllowedPrefix, setAllowedPrefix } from "@/lib/access-session";

export const AccessGatePage = () => {
    const navigate = useNavigate();
    const existing = getAllowedPrefix();
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    if (existing) {
        return <Navigate to={existing} replace />;
    }

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        const target = resolvePathForPassword(password);
        if (!target) {
            setError("Mot de passe non reconnu.");
            return;
        }
        setAllowedPrefix(target);
        navigate(target, { replace: true });
    };

    return (
        <div className="flex min-h-dvh flex-col bg-primary">
            <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
                <div className="mb-6 flex flex-col items-center gap-4">
                    <div className="flex justify-center px-2">
                        <img
                            src={BRAND_AKINOX_LOGO}
                            alt="Akinox"
                            className="h-10 w-auto max-w-[200px] object-contain object-center"
                        />
                    </div>
                    <h1 className="text-center text-display-sm font-semibold text-primary">Environnement de démonstration</h1>
                    <p className="text-center text-md text-tertiary">Saisissez le mot de passe pour accéder au prototype.</p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Mot de passe"
                        type="password"
                        value={password}
                        onChange={setPassword}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        isInvalid={!!error}
                        hint={error ?? undefined}
                    />
                    <Button type="submit" size="lg" color="primary">
                        Accéder
                    </Button>
                </form>

                <div className="mt-8 rounded-xl border border-secondary bg-secondary px-4 py-3">
                    <p className="text-center text-xs leading-relaxed text-tertiary">
                        Les éléments accessibles par l’entremise de la présente interface — notamment démonstrations,
                        maquettes et logiciels — constituent des œuvres et des informations protégées au titre du droit
                        d’auteur et de la propriété intellectuelle appartenant à{" "}
                        <strong className="font-medium text-secondary">Akinox Inc.</strong> Ils vous sont communiqués à
                        titre strictement confidentiel. Toute reproduction, diffusion auprès de tiers ou exploitation à
                        des fins commerciales, sans autorisation préalable et expresse d’Akinox Inc., est interdite. En
                        accédant au prototype, vous reconnaissez avoir pris connaissance des présentes dispositions et vous
                        vous engagez à les respecter.
                    </p>
                </div>
            </div>
        </div>
    );
};
