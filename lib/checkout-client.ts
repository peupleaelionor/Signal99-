"use client";

import { track } from "@/lib/analytics";
import { PAYMENT_LINK_URL, PAYMENT_MODE } from "@/lib/config";
import type { Sku } from "@/types";

interface StartCheckoutResult {
  /** When true, the caller should treat the unlock as done (mock dev mode). */
  mock?: boolean;
  /** When true, the browser is being redirected (payment link / checkout). */
  redirecting?: boolean;
  error?: string;
}

const PENDING_KEY = "signal99:pendingResultId";

/** Remember which result is being paid for, so /paid can recover it. */
function rememberPending(id: string): void {
  try {
    window.localStorage.setItem(PENDING_KEY, id);
  } catch {
    // ignore storage errors
  }
}

export function getPendingResultId(): string | null {
  try {
    return window.localStorage.getItem(PENDING_KEY);
  } catch {
    return null;
  }
}

/**
 * Kicks off checkout for a given quiz result, honoring the configured
 * payment mode (revenue-first):
 *   - payment_link    → redirect to the Stripe/PayPal Payment Link
 *   - stripe_checkout → /api/checkout, redirect to the Checkout URL
 *   - mock_dev        → server responds { mock: true }, caller unlocks locally
 */
export async function startCheckout(
  quizResultId: string,
  resultToken: string,
  sku: Sku = "signal_unlock",
): Promise<StartCheckoutResult> {
  track("checkout_started", { quizResultId, sku, mode: PAYMENT_MODE });
  rememberPending(quizResultId);

  // Fastest path to revenue: a hosted Payment Link.
  if (PAYMENT_MODE === "payment_link" && PAYMENT_LINK_URL) {
    const url = new URL(PAYMENT_LINK_URL);
    if (!url.searchParams.has("client_reference_id")) {
      url.searchParams.set("client_reference_id", quizResultId);
    }
    window.location.href = url.toString();
    return { redirecting: true };
  }

  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizResultId, resultToken, sku }),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      return { error: body.error || "Payment could not start." };
    }

    const data = (await res.json()) as { url?: string; mock?: boolean };

    if (data.mock) {
      return { mock: true };
    }

    if (data.url) {
      window.location.href = data.url;
      return { redirecting: true };
    }

    return { error: "Invalid payment response." };
  } catch {
    return { error: "Could not connect to payment." };
  }
}
