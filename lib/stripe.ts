import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "@/lib/config";

/**
 * Lazily-instantiated server-side Stripe client.
 * Returns `null` when no secret key is configured, so the checkout route can
 * fall back to mock mode in development without throwing.
 */

let stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!STRIPE_SECRET_KEY) return null;
  if (!stripe) {
    // Use the SDK's pinned API version (no explicit override needed).
    stripe = new Stripe(STRIPE_SECRET_KEY, { typescript: true });
  }
  return stripe;
}
