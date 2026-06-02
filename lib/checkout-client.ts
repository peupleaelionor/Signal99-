"use client";

import { track } from "@/lib/analytics";
import type { Sku } from "@/lib/config";

interface StartCheckoutResult {
  /** When true, the caller should treat the unlock as done (mock dev mode). */
  mock?: boolean;
  error?: string;
}

/**
 * Kicks off checkout for a given quiz result.
 * - Real mode: redirects to the Stripe Checkout URL returned by the server.
 * - Mock mode (dev only): server responds with `mock: true` and the caller
 *   simulates the unlock locally.
 */
export async function startCheckout(
  quizResultId: string,
  resultToken: string,
  sku: Sku = "signal_unlock",
): Promise<StartCheckoutResult> {
  track("checkout_started", { quizResultId, sku });
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizResultId, resultToken, sku }),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      return { error: body.error || "Le paiement n'a pas pu démarrer." };
    }

    const data = (await res.json()) as { url?: string; mock?: boolean };

    if (data.mock) {
      return { mock: true };
    }

    if (data.url) {
      window.location.href = data.url;
      return {};
    }

    return { error: "Réponse de paiement invalide." };
  } catch {
    return { error: "Connexion au paiement impossible." };
  }
}
