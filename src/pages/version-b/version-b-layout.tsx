import { Outlet } from "react-router";
import { VersionBProvider } from "@/pages/version-b/version-b-context";
import { VersionBSidebar } from "@/pages/version-b/version-b-sidebar";

export function VersionBLayout() {
    return (
        <VersionBProvider>
            <div className="flex h-dvh min-h-0 overflow-hidden bg-[#F4F5F7]">
                <VersionBSidebar />
                <Outlet />
            </div>
        </VersionBProvider>
    );
}
