import { NextResponse } from "next/server";
import { isSignalId } from "@/data/signals";
import { getPersonalization } from "@/lib/ai/orchestrator";
import { verifyResultPaid } from "@/lib/payments/verify";
import { getPaymentStore } from "@/lib/storage";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
// Personalization can take a few seconds when the AI layer is enabled.
export const maxDuration = 30;

interface Body {
  resultId?: string;
  sessionId?: string;
  dominantSignal?: string;
  secondarySignal?: string;
  answers?: Record<string, string>;
  firstName?: string;
}

/**
 * Returns the personalized PREMIUM payload for an already-scored quiz.
 *
 * Hard paywall: this route NEVER returns premium content unless the payment is
 * verified server-side (durable store or live Stripe session bound to this
 * result id). localStorage cannot unlock it. Unpaid callers get 402.
 */
export async function POST(req: Request) {
  const limit = rateLimit(req, "personalize", { limit: 20, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessaie dans un instant." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const resultId = (body.resultId || "").trim();
  const dominantSignal = body.dominantSignal ?? "";
  const secondarySignal = body.secondarySignal ?? "";

  if (!resultId) {
    return NextResponse.json({ error: "resultId manquant." }, { status: 400 });
  }
  if (!isSignalId(dominantSignal) || !isSignalId(secondarySignal)) {
    return NextResponse.json({ error: "Signaux invalides." }, { status: 400 });
  }

  // ── Paywall gate ─────────────────────────────────────────────────────────
  const paid = await verifyResultPaid({
    quizResultId: resultId,
    sessionId: body.sessionId,
  });
  if (!paid.paid) {
    return NextResponse.json(
      { error: "Paiement requis.", paid: false },
      { status: 402 },
    );
  }

  const store = getPaymentStore();

  // Reuse a previously generated payload when persisted (no regeneration cost).
  const existing = await store.getPayload(resultId);
  if (existing) {
    return NextResponse.json({ personalization: existing, status: "cached" });
  }

  // Normalize answers to numeric keys.
  const answers: Record<number, string> = {};
  if (body.answers) {
    for (const [k, v] of Object.entries(body.answers)) {
      const n = Number(k);
      if (Number.isInteger(n) && typeof v === "string") answers[n] = v;
    }
  }

  const { personalization, status } = await getPersonalization({
    language: "fr",
    dominantSignal,
    secondarySignal,
    answers,
    userFirstName: body.firstName?.slice(0, 40),
  });

  // Cache server-side (no-op without a durable store) to avoid regeneration.
  await store.savePayload(resultId, personalization);

  // `status` is internal telemetry; the payload always renders.
  return NextResponse.json({ personalization, status });
}
