import { NextResponse } from "next/server";
import { z } from "zod";
import { scoreQuiz } from "@/lib/scoring";
import { verifyResultPaid } from "@/lib/payments/verify";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  buildCollection,
  publicCardShape,
  unlockedCountForSku,
} from "@/lib/cards";

export const runtime = "nodejs";

const BodySchema = z.object({
  resultId: z.string().min(8).max(100),
  sessionId: z.string().max(200).optional(),
  collectionSeed: z.string().min(4).max(100),
  answers: z.record(z.string(), z.string().max(40)),
});

/**
 * Returns the card collection for a paid result.
 *
 * The Signal is computed server-side; locked cards are returned with their
 * premium copy stripped (teaser only) so the grid is desirable without leaking
 * paid content. Unpaid callers get 402.
 */
export async function POST(req: Request) {
  const limit = await checkRateLimit(req, "collection", { limit: 30, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Trop de requêtes." },
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

  const paid = await verifyResultPaid({
    quizResultId: body.resultId,
    sessionId: body.sessionId,
  });
  if (!paid.paid) {
    return NextResponse.json({ error: "Paiement requis.", paid: false }, { status: 402 });
  }

  const answers: Record<number, string> = {};
  for (const [k, v] of Object.entries(body.answers)) {
    const n = Number(k);
    if (Number.isInteger(n)) answers[n] = v;
  }

  const outcome = scoreQuiz(answers);
  const unlockedCount = unlockedCountForSku(paid.sku);
  const view = buildCollection(
    outcome.dominant,
    body.collectionSeed,
    unlockedCount,
    paid.sku,
  );

  // Strip premium copy from locked cards.
  const entries = view.entries.map((e) =>
    e.user.unlocked
      ? { card: e.card, user: e.user }
      : { card: publicCardShape(e.card), user: e.user },
  );

  return NextResponse.json({
    signal: view.signal,
    total: view.total,
    unlockedCount: view.unlockedCount,
    sku: paid.sku,
    entries,
  });
}
