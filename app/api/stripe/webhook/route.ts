import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { STRIPE_WEBHOOK_SECRET } from "@/lib/config";
import { getPaymentStore } from "@/lib/storage";

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
    // Payment Links carry the result id as client_reference_id; server-created
    // Checkout sessions carry it in metadata. Accept either.
    const quizResultId =
      session.metadata?.quiz_result_id ?? session.client_reference_id ?? null;
    if (session.payment_status === "paid" && quizResultId) {
      await getPaymentStore().markPaid({
        resultId: quizResultId,
        paymentId: session.id,
        amount: session.amount_total ?? 0,
        currency: session.currency ?? "eur",
        email: session.customer_details?.email ?? null,
        sku: session.metadata?.sku ?? "signal_unlock",
      });
    }
  }

  return NextResponse.json({ received: true });
}
