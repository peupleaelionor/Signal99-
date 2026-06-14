import { NextResponse } from "next/server";
import { z } from "zod";
import { scoreQuiz } from "@/lib/scoring";
import { buildResultMeta } from "@/lib/rarity";
import { getPersonalization } from "@/lib/ai/orchestrator";
import { verifyResultPaid } from "@/lib/payments/verify";
import { getPaymentStore } from "@/lib/storage";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
// Personalization can take a few seconds when the AI layer is enabled.
export const maxDuration = 30;

const BodySchema = z.object({
  resultId: z.string().min(8).max(100),
  sessionId: z.string().max(200).optional(),
  answers: z.record(z.string(), z.string().max(40)).optional(),
  firstName: z.string().max(40).optional(),
});

/**
 * Returns the personalized PREMIUM payload — and the revealed Signal — for a
 * paid result.
 *
 * Hard paywall: never returns premium content (or the Signal) unless payment is
 * verified server-side (durable store or live Stripe session bound to this
 * result id). The Signal is computed SERVER-side from the answers; the client
 * never decides it. Unpaid callers get 402.
 */
export async function POST(req: Request) {
  const limit = rateLimit(req, "personalize", { limit: 20, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessaie dans un instant." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }
  const body = parsed.data;

  // ── Paywall gate ───────────────────────────────────────────────────────────
  const paid = await verifyResultPaid({
    quizResultId: body.resultId,
    sessionId: body.sessionId,
  });
  if (!paid.paid) {
    return NextResponse.json(
      { error: "Paiement requis.", paid: false },
      { status: 402 },
    );
  }

  // Normalize answers (client sends its own; server is the one that scores).
  const answers: Record<number, string> = {};
  if (body.answers) {
    for (const [k, v] of Object.entries(body.answers)) {
      const n = Number(k);
      if (Number.isInteger(n)) answers[n] = v;
    }
  }

  // SERVER computes the Signal — the client never decides it.
  const outcome = scoreQuiz(answers);
  const meta = buildResultMeta(outcome);

  const store = getPaymentStore();
  const existing = await store.getPayload(body.resultId);
  if (existing) {
    return NextResponse.json({
      personalization: existing,
      meta: { rarityLabel: meta.rarityLabel, comboLabel: meta.comboLabel },
      status: "cached",
    });
  }

  const { personalization, status } = await getPersonalization({
    language: "fr",
    dominantSignal: outcome.dominant,
    secondarySignal: outcome.secondary,
    answers,
    userFirstName: body.firstName?.slice(0, 40),
  });

  await store.savePayload(body.resultId, personalization);

  return NextResponse.json({
    personalization,
    meta: { rarityLabel: meta.rarityLabel, comboLabel: meta.comboLabel },
    status,
  });
}
