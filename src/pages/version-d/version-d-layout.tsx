import { Outlet } from "react-router";
import { VersionDProvider } from "@/pages/version-d/version-d-context";
import { VersionDSidebar } from "@/pages/version-d/version-d-sidebar";

export function VersionDLayout() {
    return (
        <VersionDProvider>
            <div className="flex h-dvh min-h-0 overflow-hidden bg-[#F2F4F7]">
                <VersionDSidebar />
                <Outlet />
            </div>
        </VersionDProvider>
    );
}

