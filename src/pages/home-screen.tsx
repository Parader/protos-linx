import { ArrowRight } from "@untitledui/icons";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/base/buttons/button";
import { BRAND_AKINOX_LOGO } from "@/constants/brand-assets";
import { signOutToAccessGate } from "@/lib/sign-out-to-gate";
import { useVEDLocale } from "@/lib/ved-locale";

export const HomeScreen = () => {
    const navigate = useNavigate();
    const { strings } = useVEDLocale();
    const h = strings.common.hub;
    const items = [
        { ...h.prototypes.versionA, href: "/version-a" },
        { ...h.prototypes.versionB, href: "/version-b" },
        { ...h.prototypes.versionC, href: "/version-c" },
        { ...h.prototypes.versionD, href: "/version-d" },
        { ...h.prototypes.trajectory, href: "/mockup/trajectory-care" },
    ];

    return (
        <div className="flex min-h-dvh flex-col bg-primary">
            <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-10 sm:py-14">
                <div className="mb-4 flex justify-end">
                    <Button type="button" color="link-gray" size="sm" onClick={() => signOutToAccessGate(navigate)}>
                        {h.signOut}
                    </Button>
                </div>
                <div className="mb-8 flex flex-col items-center gap-4 sm:mb-10">
                    <div className="flex justify-center px-2">
                        <img
                            src={BRAND_AKINOX_LOGO}
                            alt={h.logoAlt}
                            className="h-10 w-auto max-w-[200px] object-contain object-center"
                        />
                    </div>
                    <h1 className="text-center text-display-sm font-semibold text-primary">{h.title}</h1>
                    <p className="text-center text-md text-tertiary">{h.subtitle}</p>
                </div>

                <ul className="flex flex-col gap-2" aria-label={h.prototypesAria}>
                    {items.map((item) => (
                        <li key={item.href}>
                            <Link
                                to={item.href}
                                className="group flex items-start gap-3 rounded-xl border border-secondary bg-primary p-4 shadow-xs transition hover:border-secondary_hover hover:bg-secondary"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="text-md font-semibold text-primary">{item.title}</p>
                                    <p className="mt-0.5 text-sm text-tertiary">{item.description}</p>
                                </div>
                                <ArrowRight
                                    aria-hidden
                                    className="mt-0.5 size-5 shrink-0 text-fg-quaternary transition group-hover:text-fg-quaternary_hover"
                                />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
