import { NextResponse } from "next/server";
import { verifyResultPaid } from "@/lib/payments/verify";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Server-side verification of a Checkout session, strictly bound to a result id.
 *
 * The /success page calls this to confirm payment before revealing the result.
 * Payment state is read from Stripe (and persisted to the store), never from the
 * client. A session only ever unlocks the single `id` it was created for, so one
 * payment can never unlock multiple results.
 */
export async function GET(req: Request) {
  const limit = rateLimit(req, "verify", { limit: 30, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { paid: false, error: "Trop de requêtes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");
  const id = searchParams.get("id");

  if (!sessionId) {
    return NextResponse.json({ paid: false, error: "session_id manquant." });
  }
  if (!id) {
    return NextResponse.json({ paid: false, error: "id manquant." });
  }

  const check = await verifyResultPaid({ quizResultId: id, sessionId });

  return NextResponse.json({
    paid: check.paid,
    quizResultId: check.paid ? id : null,
    sku: check.sku,
  });
}
