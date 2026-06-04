/**
 * Centralized, typed access to environment configuration.
 * Anything that reads process.env should go through here.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

/** Mock payment is only ever allowed outside production. */
export const MOCK_PAYMENT_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_MOCK_PAYMENT === "true" &&
  process.env.NODE_ENV !== "production";

/**
 * Complete-pack upsell. Architecture is ready, but it stays a "coming soon"
 * teaser until the extra content (Signal amour/argent/social + premium cards)
 * actually ships — we never charge for undelivered content.
 */
export const UPSELL_ENABLED = process.env.NEXT_PUBLIC_ENABLE_UPSELL === "true";

/** Stock-keeping units for the products we sell. */
export type Sku = "signal_unlock" | "complete_pack";

/** Price of unlocking a single Signal, in cents (EUR). */
export const SIGNAL_PRICE_CENTS = 99;
export const SIGNAL_CURRENCY = "eur";

/** Upsell: complete pack shown right after the 0,99 € unlock. */
export const COMPLETE_PACK_CENTS = 499;

export const PRODUCTS: Record<
  Sku,
  { label: string; description: string; amount: number }
> = {
  signal_unlock: {
    label: "Débloquer ce résultat",
    description: "Résultat complet + carte personnelle",
    amount: SIGNAL_PRICE_CENTS,
  },
  complete_pack: {
    label: "Signal Guide complet",
    description:
      "Guidance détaillée, direction amour/argent/carrière, ressources recommandées et 3 cartes premium.",
    amount: COMPLETE_PACK_CENTS,
  },
};

/** Credit packs — architecture is ready, MVP focuses on the single unlock. */
export interface CreditPack {
  id: string;
  credits: number;
  priceCents: number;
  label: string;
  highlight?: boolean;
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: "pack_5", credits: 5, priceCents: 499, label: "5 crédits" },
  {
    id: "pack_12",
    credits: 12,
    priceCents: 999,
    label: "12 crédits",
    highlight: true,
  },
  { id: "pack_30", credits: 30, priceCents: 1999, label: "30 crédits" },
];

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
export const STRIPE_PRICE_SIGNAL99 = process.env.STRIPE_PRICE_SIGNAL99 || "";
export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

export const STRIPE_ENABLED = Boolean(STRIPE_SECRET_KEY);

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const SUPABASE_ENABLED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Invisible AI personalization layer.
 * Optional: when no key is set, the deterministic template fallback is used and
 * the product is unaffected. Never branded as "AI" in the UI.
 */
export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";
export const AI_ENABLED = Boolean(ANTHROPIC_API_KEY);
/** Model + budget for personalization (short, premium copy generation). */
export const AI_MODEL = process.env.AI_MODEL || "claude-opus-4-8";
export const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 9000);
/**
 * When false (default): AI runs after payment only — cheaper, lower risk.
 * When true (experimental): pre-generate right after quiz completion to test
 * the instant "Ton Signal est prêt" experience. Client-readable flag.
 */
export const AI_PREGENERATE =
  process.env.NEXT_PUBLIC_AI_PREGENERATE === "true";

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}
