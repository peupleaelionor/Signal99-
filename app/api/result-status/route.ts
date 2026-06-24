import { NextResponse } from "next/server";
import { verifyResultPaid } from "@/lib/payments/verify";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Server-authoritative "is this result unlocked?" check used by /result/[id].
 *
 * The result page renders the locked teaser until THIS endpoint confirms a
 * verified payment. The client may pass a session id hint, but it is always
 * re-verified against Stripe / the durable store. localStorage is never trusted.
 */
export async function GET(req: Request) {
  const limit = await checkRateLimit(req, "status", { limit: 60, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { paid: false, error: "Trop de requêtes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const sessionId = searchParams.get("session_id");

  if (!id) {
    return NextResponse.json({ paid: false, error: "id manquant." });
  }

  const check = await verifyResultPaid({
    quizResultId: id,
    sessionId,
  });

  return NextResponse.json({ paid: check.paid, sku: check.sku });
}
