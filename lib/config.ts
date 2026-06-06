/**
 * Centralized, typed access to environment configuration.
 * Anything that reads process.env should go through here.
 */

import type { PaymentMode, Sku } from "@/types";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

/** Mock payment is only ever allowed outside production. */
export const MOCK_PAYMENT_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_MOCK_PAYMENT === "true" &&
  process.env.NODE_ENV !== "production";

/**
 * Complete-pack upsell. Architecture is ready, but it stays a "coming soon"
 * teaser until the extra content (Signal love/money/social + premium cards)
 * actually ships — we never charge for undelivered content.
 */
export const UPSELL_ENABLED = process.env.NEXT_PUBLIC_ENABLE_UPSELL === "true";

/** Price of unlocking a single Signal, in cents (USD). */
export const SIGNAL_PRICE_CENTS = 99;
export const SIGNAL_CURRENCY = "usd";

/** Upsell: complete pack shown right after the unlock. */
export const COMPLETE_PACK_CENTS = 499;

export const PRODUCTS: Record<
  Sku,
  { label: string; description: string; amount: number }
> = {
  signal_unlock: {
    label: "Unlock my card",
    description: "Full result + personal card",
    amount: SIGNAL_PRICE_CENTS,
  },
  complete_pack: {
    label: "Full Signal Guide",
    description:
      "Deeper guidance, love/money/career direction, recommended resources and 3 premium cards.",
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
  { id: "pack_5", credits: 5, priceCents: 499, label: "5 credits" },
  { id: "pack_12", credits: 12, priceCents: 999, label: "12 credits", highlight: true },
  { id: "pack_30", credits: 30, priceCents: 1999, label: "30 credits" },
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
 * Revenue-first payment mode.
 *
 *   payment_link    — redirect to a Stripe/PayPal Payment Link (ships fastest)
 *   stripe_checkout — full Checkout + webhook (server source of truth)
 *   mock_dev        — dev-only simulated unlock
 *
 * Resolution: explicit env wins; otherwise prefer Checkout when Stripe keys are
 * present, else a Payment Link if one is set, else mock in dev.
 */
const RAW_PAYMENT_MODE = process.env.NEXT_PUBLIC_PAYMENT_MODE as PaymentMode | undefined;

export const PAYMENT_LINK_URL =
  process.env.NEXT_PUBLIC_SIGNAL99_PAYMENT_LINK || "";

export const PAYMENT_MODE: PaymentMode =
  RAW_PAYMENT_MODE ||
  (STRIPE_ENABLED
    ? "stripe_checkout"
    : PAYMENT_LINK_URL
      ? "payment_link"
      : "mock_dev");

/** Public contact used as an ultimate "never lose a payer" fallback. */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";

/** AI is invisible and runs after payment by default. */
export const AI_PREGENERATE = process.env.AI_PREGENERATE === "true";

/** Secret guarding the lightweight admin orders export. Server only. */
export const ADMIN_SECRET = process.env.ADMIN_SECRET || "";

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
