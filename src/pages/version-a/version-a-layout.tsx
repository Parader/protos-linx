import { Outlet } from "react-router";
import { VersionAProvider } from "@/pages/version-a/version-a-context";
import { VersionASidebar } from "@/pages/version-a/version-a-sidebar";

export function VersionALayout() {
    return (
        <VersionAProvider>
            <div className="flex h-dvh min-h-0 overflow-hidden bg-[#F4F5F7]">
                <VersionASidebar />
                <Outlet />
            </div>
        </VersionAProvider>
    );
}
