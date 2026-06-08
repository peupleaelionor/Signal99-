import {
  PRODUCTS,
  SIGNAL_CURRENCY,
  type Sku,
} from "@/lib/config";

/**
 * Minimal, framework-free shape of the Stripe Checkout fields we trust.
 * Kept as a plain interface so this validator stays pure and unit-testable
 * without importing the Stripe SDK (or `server-only`).
 */
export interface CheckoutSessionLike {
  payment_status?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  metadata?: Record<string, string | null | undefined> | null;
}

export type PaidRejectionReason =
  | "not_paid"
  | "result_mismatch"
  | "unknown_sku"
  | "amount_mismatch"
  | "currency_mismatch";

export interface ValidationResult {
  valid: boolean;
  reason?: PaidRejectionReason;
  sku?: Sku;
}

function normalizeSku(raw: string | null | undefined): Sku | null {
  if (raw === "signal_unlock" || raw === "complete_pack") return raw;
  return null;
}

/**
 * The single source of truth for "may this Stripe session unlock THIS result?".
 *
 * Enforces, in order:
 *  - payment_status === "paid"
 *  - metadata.quiz_result_id === the requested result id (one payment ⇒ one result)
 *  - the sku is known
 *  - amount_total matches the expected price for that sku
 *  - currency matches
 *
 * Pure function — no I/O — so it can be exhaustively unit-tested.
 */
export function validatePaidSession(
  session: CheckoutSessionLike,
  requestedResultId: string,
): ValidationResult {
  if (session.payment_status !== "paid") {
    return { valid: false, reason: "not_paid" };
  }

  const sessionResultId = session.metadata?.quiz_result_id ?? "";
  if (!requestedResultId || sessionResultId !== requestedResultId) {
    return { valid: false, reason: "result_mismatch" };
  }

  const sku = normalizeSku(session.metadata?.sku);
  if (!sku) {
    return { valid: false, reason: "unknown_sku" };
  }

  const expectedAmount = PRODUCTS[sku].amount;
  if (session.amount_total !== expectedAmount) {
    return { valid: false, reason: "amount_mismatch", sku };
  }

  if ((session.currency ?? "").toLowerCase() !== SIGNAL_CURRENCY) {
    return { valid: false, reason: "currency_mismatch", sku };
  }

  return { valid: true, sku };
}
