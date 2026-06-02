import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { MOCK_PAYMENT_ENABLED } from "@/lib/config";

export const runtime = "nodejs";

/**
 * Server-side verification of a Checkout session.
 * The /success page calls this to confirm payment before revealing the result.
 * Payment state is read from Stripe, never from the client.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ paid: false, error: "session_id manquant." });
  }

  // Dev mock: accept the synthetic session produced by mock checkout.
  if (sessionId.startsWith("mock") && MOCK_PAYMENT_ENABLED) {
    return NextResponse.json({ paid: true, sku: "signal_unlock", mock: true });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ paid: false, error: "Stripe non configuré." });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === "paid";
    return NextResponse.json({
      paid,
      quizResultId: session.metadata?.quiz_result_id ?? null,
      sku: session.metadata?.sku ?? "signal_unlock",
    });
  } catch {
    return NextResponse.json({ paid: false, error: "Session introuvable." });
  }
}
