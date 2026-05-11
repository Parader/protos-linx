/**
 * Mot de passe → route après connexion (garde légère côté client).
 * Modifier ce tableau si besoin.
 */
const PASSWORD_TO_PATH: Record<string, string> = {
    "3HgvLj": "/version-a",
    "i)J?m/": "/version-b",
    "iM.$:-": "/version-c",
    "CWpN80": "/version-d",
    "Bbu-Mw": "/mockup/trajectory-care",
    "g:W]:i": "/hub",
};

export function resolvePathForPassword(password: string): string | null {
    const key = password.trim();
    if (!key) return null;
    return PASSWORD_TO_PATH[key] ?? null;
}
