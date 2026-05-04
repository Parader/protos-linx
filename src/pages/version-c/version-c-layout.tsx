import { Outlet } from "react-router";
import { VersionCProvider } from "@/pages/version-c/version-c-context";
import { VersionCSidebar } from "@/pages/version-c/version-c-sidebar";

export function VersionCLayout() {
    return (
        <VersionCProvider>
            <div className="flex h-dvh min-h-0 overflow-hidden bg-[#F2F4F7]">
                <VersionCSidebar />
                <Outlet />
            </div>
        </VersionCProvider>
    );
}

