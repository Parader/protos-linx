import { Plus, Users01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { useVEDLocale } from "@/lib/ved-locale";

type Props = {
    onAddPatient: () => void;
};

/**
 * Empty state — aligné sur Figma (node 22413:15481), adapté au stack du projet (Button Untitled, icônes locales).
 */
export function VersionDWorklistEmptyState({ onAddPatient }: Props) {
    const { strings } = useVEDLocale();
    const ew = strings.versionD.pages.emptyWorklistD;

    return (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto bg-[#F9FAFB] px-4 py-10 sm:py-14">
            <div className="flex w-full max-w-[360px] flex-col gap-8">
                <div className="flex flex-col items-center gap-5">
                    <div
                        className="flex size-14 shrink-0 items-center justify-center rounded-[28px] border-[10px] border-[#E8F7FE] bg-[#D5EEFF]"
                        aria-hidden
                    >
                        <Users01 className="size-7 text-[#0573D8]" strokeWidth={1.75} />
                    </div>
                    <div className="flex w-full flex-col gap-2 text-center">
                        <p className="text-base font-medium leading-6 text-[#101828]">{ew.title}</p>
                        <p className="text-sm font-normal leading-5 text-[#344054]">{ew.body}</p>
                    </div>
                </div>
                <Button
                    size="lg"
                    iconLeading={Plus}
                    className="w-full bg-[#0573D8] text-white shadow-[0px_1px_2px_rgba(16,24,40,0.05)] hover:bg-[#0460B8]"
                    onClick={onAddPatient}
                >
                    {ew.addButton}
                </Button>
            </div>
        </div>
    );
}
