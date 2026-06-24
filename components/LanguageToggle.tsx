"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { LOCALES, readLocale, writeLocale, type Locale } from "@/lib/i18n";

/** FR/EN switch. Persists to a cookie and reloads so the server re-renders. */
export function LanguageToggle() {
  const [locale, setLocale] = useState<Locale>("fr");

  useEffect(() => {
    setLocale(readLocale());
  }, []);

  function pick(next: Locale) {
    if (next === locale) return;
    writeLocale(next);
    window.location.reload();
  }

  return (
    <div className="flex items-center gap-1 text-[11px] uppercase tracking-widest">
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className="px-1 text-line">·</span>}
          <button
            type="button"
            onClick={() => pick(l)}
            aria-pressed={locale === l}
            className={cn(
              "transition-colors",
              locale === l ? "text-gold" : "text-muted hover:text-ink",
            )}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
