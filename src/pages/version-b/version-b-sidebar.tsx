import { BarChart01, Clipboard, DotsHorizontal, Globe01, HelpCircle, User01 } from "@untitledui/icons";
import { NavLink } from "react-router";
import { Button } from "@/components/base/buttons/button";
import { BRAND_AKINOX_LOGO } from "@/constants/brand-assets";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { cx } from "@/utils/cx";

const navItemClass =
    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left outline-hidden transition-colors hover:bg-[#F9FAFB]";
const navItemActiveClass =
    "rounded-lg bg-[#FCFCFD] p-0.5 text-left outline-hidden ring-1 ring-[#F2F4F7] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]";
const navItemActiveInnerClass = "flex h-10 items-center gap-3 rounded-md bg-white px-3 py-2";

export function VersionBSidebar() {
    return (
        <aside className="hidden h-dvh w-[296px] shrink-0 flex-col border-r border-[#E2E5EB] bg-white shadow-[0px_1px_5px_0px_rgba(16,24,40,0.05),0px_1px_2px_0px_rgba(16,24,40,0.05)] lg:flex">
            <div className="flex min-h-0 w-full flex-1 flex-col justify-between">
                <div className="flex flex-col gap-6 pt-6">
                    <div className="pl-6 pr-3">
                        <NavLink to="/version-b" className="inline-flex" aria-label="Akinox">
                            <img src={BRAND_AKINOX_LOGO} alt="Akinox" className="h-8 w-auto max-w-[140px] object-contain object-left" />
                        </NavLink>
                    </div>

                    <div className="px-3">
                        <div className="rounded-lg bg-[#F9FAFB] p-3">
                            <p className="text-left text-sm font-medium leading-5 text-[#475467]">
                                CIUSSS Centre Ouest - Jewish General Hospital
                            </p>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-1 px-3">
                        <NavLink to="/version-b" end className={({ isActive }) => cx(isActive ? navItemActiveClass : "p-0.5")}>
                            {({ isActive }) => (
                                <span
                                    className={cx(isActive ? navItemActiveInnerClass : navItemClass)}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    <Clipboard className="size-6 shrink-0 text-[#475467]" strokeWidth={1.75} aria-hidden />
                                    <span className="text-base font-medium leading-6 text-[#475467]">Worklist</span>
                                </span>
                            )}
                        </NavLink>
                        <NavLink
                            to="/version-b/patient-consent"
                            className={({ isActive }) => cx(isActive ? navItemActiveClass : "p-0.5")}
                        >
                            {({ isActive }) => (
                                <span
                                    className={cx(isActive ? navItemActiveInnerClass : navItemClass)}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    <User01 className="size-6 shrink-0 text-[#475467]" strokeWidth={1.75} aria-hidden />
                                    <span className="text-base font-medium leading-6 text-[#475467]">Simulate patient</span>
                                </span>
                            )}
                        </NavLink>
                        <button
                            type="button"
                            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left outline-hidden transition-colors hover:bg-[#F9FAFB]"
                        >
                            <BarChart01 className="size-6 shrink-0 text-[#475467]" strokeWidth={1.75} aria-hidden />
                            <span className="text-base font-medium leading-6 text-[#475467]">Reports and statistics</span>
                        </button>
                    </nav>
                </div>

                <div className="flex flex-col gap-6 px-4 pb-3">
                    <div className="flex flex-col gap-1">
                        <button
                            type="button"
                            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left outline-hidden transition-colors hover:bg-[#F9FAFB]"
                        >
                            <Globe01 className="size-6 shrink-0 text-[#475467]" strokeWidth={1.75} aria-hidden />
                            <span className="text-base font-medium leading-6 text-[#475467]">Français</span>
                        </button>
                        <button
                            type="button"
                            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left outline-hidden transition-colors hover:bg-[#F9FAFB]"
                        >
                            <HelpCircle className="size-6 shrink-0 text-[#475467]" strokeWidth={1.75} aria-hidden />
                            <span className="text-base font-medium leading-6 text-[#475467]">Help</span>
                        </button>
                    </div>

                    <div className="h-px w-full bg-[#E2E5EB]" aria-hidden />

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex min-w-0 items-center gap-2.5">
                                <div
                                    className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#F9FAFB] text-lg font-medium leading-7 text-[#475467]"
                                    aria-hidden
                                >
                                    OR
                                </div>
                                <div className="min-w-0">
                                    <div className="truncate text-sm font-medium leading-5 text-[#475467]">Olivia Rhye</div>
                                    <div className="truncate text-xs leading-[18px] text-[#475467]">orhye@msss.ca</div>
                                </div>
                            </div>
                            <Dropdown.Root>
                                <Button
                                    color="tertiary"
                                    size="sm"
                                    iconLeading={DotsHorizontal}
                                    aria-label="Account menu"
                                    className="size-9 shrink-0 rounded-lg p-0 text-[#475467] hover:bg-[#F9FAFB]"
                                />
                                <Dropdown.Popover>
                                    <Dropdown.Menu>
                                        <Dropdown.Section>
                                            <Dropdown.Item label="Sign out" onAction={() => {}} />
                                        </Dropdown.Section>
                                    </Dropdown.Menu>
                                </Dropdown.Popover>
                            </Dropdown.Root>
                        </div>
                        <p className="text-xs leading-[18px] text-[#475467]">v5.4.1</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
