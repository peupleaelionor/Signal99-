import { fr, type Dictionary } from "@/locales/fr";
import { en } from "@/locales/en";

/**
 * Lightweight i18n. FR is the default and ships first; EN is ready for the
 * global launch. Components read their strings from the dictionary instead of
 * hardcoding copy, so adding a locale is a data change, not a refactor.
 */
export type Locale = "fr" | "en";

export const DEFAULT_LOCALE: Locale = "fr";
export const LOCALES: Locale[] = ["fr", "en"];

const DICTS: Record<Locale, Dictionary> = { fr, en };

export function isLocale(value: string): value is Locale {
  return value === "fr" || value === "en";
}

export function getDictionary(locale: Locale = DEFAULT_LOCALE): Dictionary {
  return DICTS[locale] ?? fr;
}

/** Cookie used to persist the locale (readable on server + client). */
export const LOCALE_COOKIE = "signal99:lang";

/** Reads the visitor's preferred locale (client only). Falls back to default. */
export function readLocale(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  try {
    const fromQuery = new URLSearchParams(window.location.search).get("lang");
    if (fromQuery && isLocale(fromQuery)) return fromQuery;
    const match = document.cookie.match(/(?:^|;\s*)signal99:lang=([^;]+)/);
    if (match && isLocale(match[1])) return match[1];
    const nav = window.navigator.language.slice(0, 2);
    if (isLocale(nav)) return nav;
  } catch {
    // ignore
  }
  return DEFAULT_LOCALE;
}

/** Persists the locale in a cookie (client). Server reads it via getServerLocale. */
export function writeLocale(locale: Locale): void {
  if (typeof document === "undefined") return;
  // 1 year, site-wide
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
}
