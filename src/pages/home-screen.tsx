import { ArrowRight } from "@untitledui/icons";
import { Link } from "react-router";
import { UntitledLogoMinimal } from "@/components/foundations/logo/untitledui-logo-minimal";

type PrototypeItem = {
    title: string;
    description: string;
    href: string;
};

const PROTOTYPES: PrototypeItem[] = [
    {
        title: "Version A",
        description: "Parcours complet — liste de travail, consentement patient et étapes suivantes.",
        href: "/version-a",
    },
    {
        title: "Version B",
        description: "Mise en page alternative pour le même parcours (à comparer avec la Version A).",
        href: "/version-b",
    },
    {
        title: "Version C",
        description: "Démo vente — liste de travail haute fidélité avec notifications côté patient.",
        href: "/version-c",
    },
    {
        title: "Épisodes de soins",
        description: "Figma mockup — trajectoire de soins, questionnaire de triage.",
        href: "/mockup/trajectory-care",
    },
];

export const HomeScreen = () => {
    return (
        <div className="flex min-h-dvh flex-col bg-primary">
            <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-10 sm:py-14">
                <div className="mb-8 flex flex-col items-center gap-3 sm:mb-10">
                    <div className="flex size-14 items-center justify-center">
                        <UntitledLogoMinimal className="size-9" />
                    </div>
                    <h1 className="text-center text-display-sm font-semibold text-primary">VED Dispatch</h1>
                    <p className="text-center text-md text-tertiary">Prototypes — choisissez un parcours ou une maquette.</p>
                </div>

                <ul className="flex flex-col gap-2" aria-label="Liste des prototypes">
                    {PROTOTYPES.map((item) => (
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
