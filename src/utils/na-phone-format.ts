/** Extrait les chiffres pour un numéro nord-américain (10 chiffres ; « 1 » pays optionnel en tête). */
export function parseDigitsForNanp(raw: string): string {
    let d = raw.replace(/\D/g, "");
    if (d.length >= 11 && d.startsWith("1")) d = d.slice(1);
    return d.slice(0, 10);
}

/** Affichage type (514) 555-0123 pendant la saisie. */
export function formatNanpFromRaw(raw: string): string {
    const d = parseDigitsForNanp(raw);
    if (d.length === 0) return "";
    if (d.length <= 3) return `(${d}`;
    if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
