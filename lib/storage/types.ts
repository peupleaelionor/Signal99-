import type { SignalId, SignalPersonalization } from "@/types";

/**
 * Server-side persisted shape of a quiz result.
 * This is the source of truth for "is this result paid?" when a real store
 * (Supabase / KV) is configured. With the stripe-only adapter, persistence is a
 * no-op and payment truth is recomputed from Stripe on every request instead.
 */
export interface StoredResult {
  id: string;
  dominantSignal: SignalId;
  secondarySignal: SignalId;
  resultToken: string;
  shareSlug: string | null;
  isPaid: boolean;
  paymentId: string | null;
  payload: SignalPersonalization | null;
  createdAt: string;
}

export interface SaveResultInput {
  id: string;
  dominantSignal: SignalId;
  secondarySignal: SignalId;
  resultToken: string;
  shareSlug: string | null;
}

export interface MarkPaidInput {
  resultId: string;
  paymentId: string;
  amount: number;
  currency: string;
  email?: string | null;
  sku?: string;
}

/**
 * Storage abstraction for payment-relevant state.
 *
 * Adapters:
 *  - stripe-only  → no persistence; payment truth is verified live via Stripe.
 *  - supabase     → durable persistence (recommended for production / recovery).
 *  - kv           → optional lightweight cache (per-instance fallback).
 *
 * Every method must degrade gracefully and never throw to the caller.
 */
export interface PaymentStore {
  /** Adapter name, for diagnostics / telemetry. Never shown to users. */
  readonly name: string;
  /** True when this store can durably answer `isResultPaid` on its own. */
  readonly durable: boolean;

  saveResult(input: SaveResultInput): Promise<void>;
  getResult(id: string): Promise<StoredResult | null>;
  isResultPaid(id: string): Promise<boolean>;
  markPaid(input: MarkPaidInput): Promise<void>;
  savePayload(id: string, payload: SignalPersonalization): Promise<void>;
  getPayload(id: string): Promise<SignalPersonalization | null>;
}
