import { NextResponse } from "next/server";
import { isSignalId } from "@/data/signals";
import { getPaymentStore } from "@/lib/storage";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

interface Body {
  id?: string;
  dominantSignal?: string;
  secondarySignal?: string;
  resultToken?: string;
  shareSlug?: string | null;
}

/**
 * Best-effort server persistence of a freshly scored result.
 *
 * No-op with the stripe-only store; with Supabase it writes the row so a
 * purchase can later be bound to it and recovered across devices. Stores no
 * answers/scores — only what the payment + recovery flow needs.
 */
export async function POST(req: Request) {
  const limit = rateLimit(req, "results", { limit: 20, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Trop de requêtes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const id = (body.id || "").trim();
  const dominantSignal = body.dominantSignal ?? "";
  const secondarySignal = body.secondarySignal ?? "";
  const resultToken = body.resultToken ?? "";

  if (
    !id ||
    !isSignalId(dominantSignal) ||
    !isSignalId(secondarySignal) ||
    !resultToken
  ) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await getPaymentStore().saveResult({
    id,
    dominantSignal,
    secondarySignal,
    resultToken,
    shareSlug: body.shareSlug ?? null,
  });

  return NextResponse.json({ ok: true });
}
