import { BarChart01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";

export function VersionCReportsPage() {
    return (
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="shrink-0 border-b border-[#E2E5EB] bg-[#F2F4F7] px-6 py-8">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-medium text-[#101828]">Rapports et statistiques</h1>
                        <p className="mt-1 text-sm text-[#667085]">Écran provisoire pour la démo vente (navigation complète).</p>
                    </div>
                </div>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center px-6 py-12">
                <div className="max-w-md rounded-xl border border-dashed border-[#D0D5DD] bg-white p-6 text-center shadow-xs">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#F2FAFF] text-[#0573D8]">
                        <BarChart01 className="size-6" strokeWidth={1.75} aria-hidden />
                    </div>
                    <h2 className="mt-4 text-base font-semibold text-[#101828]">Les rapports arrivent bientôt</h2>
                    <p className="mt-1 text-sm text-[#667085]">
                        Cet écran est volontairement léger pour la présentation. La Liste de travail et la Vue patient sont la priorité.
                    </p>
                    <Button className="mt-6" color="secondary" size="md" href="/version-c">
                        Retour à la liste
                    </Button>
                </div>
            </div>
        </main>
    );
}

