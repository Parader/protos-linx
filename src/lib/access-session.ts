const STORAGE_KEY = "ved-dispatch-allowed-prefix";

export function getAllowedPrefix(): string | null {
    try {
        return sessionStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

export function setAllowedPrefix(prefix: string): void {
    try {
        sessionStorage.setItem(STORAGE_KEY, prefix);
    } catch {
        /* ignore quota / private mode */
    }
}

export function clearAllowedPrefix(): void {
    try {
        sessionStorage.removeItem(STORAGE_KEY);
    } catch {
        /* ignore */
    }
}

export function isPathAllowed(pathname: string, prefix: string): boolean {
    if (pathname === prefix) return true;
    return pathname.startsWith(`${prefix}/`);
}
