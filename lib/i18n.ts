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

const STORAGE_KEY = "signal99:lang";

/** Reads the visitor's preferred locale (client only). Falls back to default. */
export function readLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const fromQuery = new URLSearchParams(window.location.search).get("lang");
    if (fromQuery && isLocale(fromQuery)) {
      window.localStorage.setItem(STORAGE_KEY, fromQuery);
      return fromQuery;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && isLocale(stored)) return stored;
    const nav = window.navigator.language.slice(0, 2);
    if (isLocale(nav)) return nav;
  } catch {
    // ignore
  }
  return DEFAULT_LOCALE;
}
