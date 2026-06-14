import { NextResponse } from "next/server";
import { z } from "zod";
import { scoreQuiz } from "@/lib/scoring";
import { buildResultMeta } from "@/lib/rarity";
import { getPaymentStore } from "@/lib/storage";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const BodySchema = z.object({
  id: z.string().min(8).max(100),
  answers: z.record(z.string(), z.string().max(40)),
  resultToken: z.string().min(8).max(100),
  shareSlug: z.string().min(3).max(40).nullable().optional(),
  collectionSeed: z.string().min(8).max(100),
  locale: z.enum(["fr", "en"]).optional(),
});

/**
 * Server-authoritative result creation.
 *
 * The SERVER computes the Signal from the answers (the client never decides it)
 * and persists the result. The response is deliberately NON-revealing: it
 * returns only a rarity teaser, never the Signal — that stays hidden until the
 * paid /api/personalize call.
 */
export async function POST(req: Request) {
  const limit = rateLimit(req, "result-create", { limit: 20, windowMs: 60_000 });
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

  // Normalize answers to numeric keys for deterministic server scoring.
  const answers: Record<number, string> = {};
  for (const [k, v] of Object.entries(body.answers)) {
    const n = Number(k);
    if (Number.isInteger(n)) answers[n] = v;
  }

  const outcome = scoreQuiz(answers);
  const meta = buildResultMeta(outcome);

  await getPaymentStore().saveResult({
    id: body.id,
    dominantSignal: outcome.dominant,
    secondarySignal: outcome.secondary,
    resultToken: body.resultToken,
    shareSlug: body.shareSlug ?? null,
    collectionSeed: body.collectionSeed,
    answers,
    scores: outcome.scores,
  });

  // Non-revealing teaser only.
  return NextResponse.json({
    rarityLabel: meta.rarityLabel,
    hasCombo: meta.comboLabel !== null,
  });
}
