import type { NavigateFunction } from "react-router";
import { clearAllowedPrefix } from "@/lib/access-session";

/** Clears prototype gate session and navigates to the password screen. */
export function signOutToAccessGate(navigate: NavigateFunction): void {
    clearAllowedPrefix();
    navigate("/", { replace: true });
}
