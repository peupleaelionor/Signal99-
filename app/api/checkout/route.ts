import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import {
  MOCK_PAYMENT_ENABLED,
  PRODUCTS,
  SIGNAL_CURRENCY,
  SITE_URL,
  STRIPE_PRICE_SIGNAL99,
  type Sku,
} from "@/lib/config";

export const runtime = "nodejs";

interface Body {
  quizResultId?: string;
  resultToken?: string;
  sku?: Sku;
}

/**
 * Creates a Stripe Checkout session for a quiz result.
 * Falls back to a dev-only mock response when Stripe isn't configured AND
 * NEXT_PUBLIC_ENABLE_MOCK_PAYMENT=true (never in production).
 */
export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const quizResultId = (body.quizResultId || "").trim();
  const resultToken = (body.resultToken || "").trim();
  const sku: Sku = body.sku === "complete_pack" ? "complete_pack" : "signal_unlock";

  if (!quizResultId || !resultToken) {
    return NextResponse.json(
      { error: "Résultat introuvable." },
      { status: 400 },
    );
  }

  const stripe = getStripe();

  // Dev mock path: no Stripe key, mock explicitly enabled.
  if (!stripe) {
    if (MOCK_PAYMENT_ENABLED) {
      return NextResponse.json({ mock: true });
    }
    return NextResponse.json(
      { error: "Le paiement n'est pas encore configuré." },
      { status: 503 },
    );
  }

  const product = PRODUCTS[sku];

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Use a configured Price when available (lets you manage it in Stripe),
      // otherwise build the line item inline.
      line_items: [
        sku === "signal_unlock" && STRIPE_PRICE_SIGNAL99
          ? { price: STRIPE_PRICE_SIGNAL99, quantity: 1 }
          : {
              quantity: 1,
              price_data: {
                currency: SIGNAL_CURRENCY,
                unit_amount: product.amount,
                product_data: {
                  name: `SIGNAL99 — ${product.label}`,
                  description: product.description,
                },
              },
            },
      ],
      metadata: { quiz_result_id: quizResultId, result_token: resultToken, sku },
      success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}&id=${encodeURIComponent(quizResultId)}`,
      cancel_url: `${SITE_URL}/result/${encodeURIComponent(quizResultId)}?canceled=1`,
      // Friendly for guest checkout — no account required.
      allow_promotion_codes: false,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Impossible de démarrer le paiement." },
      { status: 500 },
    );
  }
}
