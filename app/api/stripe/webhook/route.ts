import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { STRIPE_WEBHOOK_SECRET } from "@/lib/config";
import { recordPurchase } from "@/lib/results-server";

export const runtime = "nodejs";

/**
 * Stripe webhook — the only trusted source for "this result is paid".
 * Verifies the signature, then records the purchase + flips the result to paid
 * (when Supabase is configured). Never trust the client for payment state.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Webhook non configuré." },
      { status: 503 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") {
      await recordPurchase({
        stripeSessionId: session.id,
        amount: session.amount_total ?? 0,
        currency: session.currency ?? "eur",
        status: "paid",
        quizResultId: session.metadata?.quiz_result_id ?? null,
        email: session.customer_details?.email ?? null,
      });
    }
  }

  return NextResponse.json({ received: true });
}
