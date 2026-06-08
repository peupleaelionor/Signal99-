import "server-only";
import { SUPABASE_ENABLED } from "@/lib/config";
import type { PaymentStore } from "@/lib/storage/types";
import { createStripeOnlyStore } from "@/lib/storage/stripe-only";
import { createSupabaseStore } from "@/lib/storage/supabase";
import { createKvStore } from "@/lib/storage/kv";

export type StorageDriver = "auto" | "stripe-only" | "supabase" | "kv";

/**
 * Selects the payment store adapter.
 *
 * Resolution order:
 *   1. STORAGE_DRIVER env (explicit override): supabase | stripe-only | kv
 *   2. auto (default): Supabase when configured, otherwise stripe-only.
 *
 * The product is fully secure with the stripe-only adapter (payment is verified
 * live against Stripe). Supabase adds durable cross-device purchase recovery.
 */
let cached: PaymentStore | null = null;

export function getPaymentStore(): PaymentStore {
  if (cached) return cached;

  const driver = (process.env.STORAGE_DRIVER || "auto") as StorageDriver;

  switch (driver) {
    case "supabase":
      cached = createSupabaseStore();
      break;
    case "stripe-only":
      cached = createStripeOnlyStore();
      break;
    case "kv":
      cached = createKvStore();
      break;
    case "auto":
    default:
      cached = SUPABASE_ENABLED
        ? createSupabaseStore()
        : createStripeOnlyStore();
      break;
  }

  return cached;
}

export type { PaymentStore } from "@/lib/storage/types";
