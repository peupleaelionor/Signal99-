import { CREDIT_PACKS, formatPrice, SIGNAL_PRICE_CENTS } from "@/lib/config";
import { cn } from "@/lib/cn";

/**
 * Presentational pricing overview.
 * MVP sells the single unlock (0,99 €); credit packs are shown so the value
 * ladder is visible, with the architecture already in place.
 */
export function PricingBlock() {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-gold/40 bg-card p-5 shadow-aura">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-base font-semibold text-ink">Débloquer ce résultat</p>
            <p className="mt-1 text-sm text-muted">
              Résultat complet + carte personnelle
            </p>
          </div>
          <p className="font-serif text-2xl text-gold">
            {formatPrice(SIGNAL_PRICE_CENTS)}
          </p>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">
          Ou prends de l&apos;avance
        </p>
        <div className="grid grid-cols-3 gap-3">
          {CREDIT_PACKS.map((pack) => (
            <div
              key={pack.id}
              className={cn(
                "rounded-xl border bg-surface p-3 text-center",
                pack.highlight ? "border-copper/50" : "border-line",
              )}
            >
              <p className="font-serif text-lg text-ink">{pack.credits}</p>
              <p className="text-[11px] uppercase tracking-wide text-muted">
                crédits
              </p>
              <p className="mt-1 text-xs text-gold">
                {formatPrice(pack.priceCents)}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-[11px] text-muted/70">
          Les packs de crédits arrivent bientôt.
        </p>
      </div>
    </div>
  );
}
