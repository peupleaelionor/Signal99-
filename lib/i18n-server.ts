import "server-only";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n";

/**
 * Resolves the active locale on the server from the `signal99:lang` cookie, so
 * server components render the right language with no hydration mismatch.
 */
export function getServerLocale(): Locale {
  try {
    const value = cookies().get(LOCALE_COOKIE)?.value;
    if (value && isLocale(value)) return value;
  } catch {
    // cookies() unavailable (e.g. static context) — fall back
  }
  return DEFAULT_LOCALE;
}
