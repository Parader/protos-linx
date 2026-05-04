/** Fichiers dans `/public` — noms avec espaces ou caractères spéciaux encodés pour l’URL. */

function publicUrl(fileName: string): string {
    const base = import.meta.env.BASE_URL;
    const prefix = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${prefix}/${encodeURIComponent(fileName)}`;
}

export const BRAND_QUEBEC_LOGO = publicUrl("logo_quebec.svg");
export const BRAND_AKINOX_LOGO = publicUrl("logo akinox.svg");
export const BRAND_POWERED_BY_AKINOX = publicUrl("propulsé par akinox.svg");
