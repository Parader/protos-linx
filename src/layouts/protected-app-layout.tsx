import { Outlet, Navigate, useLocation } from "react-router";
import { getAllowedPrefix, isPathAllowed } from "@/lib/access-session";

export const ProtectedAppLayout = () => {
    const location = useLocation();
    const prefix = getAllowedPrefix();

    if (!prefix) {
        return <Navigate to="/" replace state={{ from: location.pathname }} />;
    }

    if (!isPathAllowed(location.pathname, prefix)) {
        return <Navigate to={prefix} replace />;
    }

    return <Outlet />;
};
