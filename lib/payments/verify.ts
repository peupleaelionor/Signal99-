import "server-only";
import { getStripe } from "@/lib/stripe";
import { MOCK_PAYMENT_ENABLED, type Sku } from "@/lib/config";
import { getPaymentStore } from "@/lib/storage";
import { validatePaidSession } from "@/lib/payments/validate";

export interface PaidCheck {
  paid: boolean;
  sku: Sku;
  /** Adapter that confirmed payment — internal telemetry only. */
  via: "mock" | "store" | "stripe" | "none";
}

export interface VerifyInput {
  quizResultId: string;
  /** Stripe Checkout session id (or a dev mock id). Optional. */
  sessionId?: string | null;
}

const NOT_PAID: PaidCheck = { paid: false, sku: "signal_unlock", via: "none" };

/**
 * Server-side source of truth for "is this result unlocked?".
 *
 * Order of trust:
 *  1. Dev mock (only when NEXT_PUBLIC_ENABLE_MOCK_PAYMENT=true, never in prod).
 *  2. Durable store (Supabase): a previously confirmed purchase.
 *  3. Live Stripe verification of the provided session, bound to THIS result id
 *     (validatePaidSession). On success we persist it to the store so future
 *     requests resolve via step 2.
 *
 * localStorage is never consulted here. The client may send a session id as a
 * hint, but it is always re-verified against Stripe.
 */
export async function verifyResultPaid(
  input: VerifyInput,
): Promise<PaidCheck> {
  const quizResultId = (input.quizResultId || "").trim();
  const sessionId = (input.sessionId || "").trim();

  if (!quizResultId) return NOT_PAID;

  // 1. Dev-only mock unlock.
  if (sessionId.startsWith("mock") && MOCK_PAYMENT_ENABLED) {
    return { paid: true, sku: "signal_unlock", via: "mock" };
  }

  const store = getPaymentStore();

  // 2. Durable store already knows this result is paid.
  try {
    if (await store.isResultPaid(quizResultId)) {
      return { paid: true, sku: "signal_unlock", via: "store" };
    }
  } catch {
    // ignore and fall through to live verification
  }

  // 3. Live Stripe verification, strictly bound to this result id.
  if (!sessionId) return NOT_PAID;
  const stripe = getStripe();
  if (!stripe) return NOT_PAID;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const verdict = validatePaidSession(
      {
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        currency: session.currency,
        metadata: session.metadata,
      },
      quizResultId,
    );

    if (!verdict.valid || !verdict.sku) return NOT_PAID;

    // Persist so subsequent reads resolve from the store (idempotent).
    try {
      await store.markPaid({
        resultId: quizResultId,
        paymentId: session.id,
        amount: session.amount_total ?? 0,
        currency: session.currency ?? "eur",
        email: session.customer_details?.email ?? null,
        sku: verdict.sku,
      });
    } catch {
      // best-effort persistence; payment is still valid
    }

    return { paid: true, sku: verdict.sku, via: "stripe" };
  } catch {
    return NOT_PAID;
  }
}
