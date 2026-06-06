import type { Signal, SignalPersonalization, SignalProduct } from "@/types";
import { CardShell } from "@/components/CardShell";

export const RECOMMENDATION_DISCLAIMER =
  "Les recommandations sont symboliques et lifestyle. Les suggestions sponsorisées ou affiliées sont clairement indiquées.";

const DISCLOSURE_LABEL: Record<NonNullable<SignalProduct["disclosure"]>, string> =
  {
    affiliate: "Lien affilié",
    sponsored: "Sponsorisé",
    partner: "Suggestion partenaire",
  };

interface Props {
  signal: Signal;
  /** Optional real products. When commercial, each carries a disclosure label. */
  products?: SignalProduct[];
  personalization?: SignalPersonalization | null;
}

/**
 * "Recommandé pour ton Signal" — lifestyle direction + optional product cards.
 * Transparency-first: any commercial item is labeled, never hidden.
 */
export function RecommendedForYourSignal({
  signal,
  products = [],
  personalization,
}: Props) {
  const recommendedCategories =
    personalization?.recommendedCategories ??
    signal.guidance.recommendedCategories;
  const productPlacementTone = signal.guidance.productPlacementTone;

  return (
    <section className="mt-10">
      <h2 className="text-center font-serif text-2xl text-ink sm:text-3xl">
        Recommandé pour ton Signal
      </h2>
      <p className="mt-2 text-center text-sm text-muted">{productPlacementTone}</p>

      {/* Lifestyle categories */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {recommendedCategories.map((cat) => (
          <div
            key={cat}
            className="rounded-xl border border-line bg-surface px-4 py-3 text-center text-sm text-ink/90"
          >
            {cat}
          </div>
        ))}
      </div>

      {/* Optional product cards (with mandatory disclosure when commercial) */}
      {products.length > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          {products.map((product) => (
            <a
              key={product.url}
              href={product.url}
              target="_blank"
              rel="noreferrer sponsored nofollow"
              className="flex items-center justify-between rounded-xl border border-line bg-card p-4 transition-colors hover:border-copper/60"
            >
              <div>
                <p className="text-ink">{product.name}</p>
                <p className="text-xs text-muted">{product.category}</p>
              </div>
              {product.disclosure && (
                <span className="rounded-full border border-copper/40 px-2.5 py-1 text-[10px] uppercase tracking-wider text-copper">
                  {DISCLOSURE_LABEL[product.disclosure]}
                </span>
              )}
            </a>
          ))}
        </div>
      )}

      <CardShell className="mt-4 border-line/60">
        <p className="text-[11px] leading-relaxed text-muted/80">
          {RECOMMENDATION_DISCLAIMER}
        </p>
      </CardShell>
    </section>
  );
}
