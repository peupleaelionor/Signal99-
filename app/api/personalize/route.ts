import { NextResponse } from "next/server";
import { isSignalId } from "@/data/signals";
import { getPersonalization } from "@/lib/ai/orchestrator";

export const runtime = "nodejs";
// Personalization can take a few seconds when the AI layer is enabled.
export const maxDuration = 30;

interface Body {
  dominantSignal?: string;
  secondarySignal?: string;
  answers?: Record<string, string>;
  firstName?: string;
}

/**
 * Returns a personalized result payload for an already-scored quiz.
 * Always responds with a complete payload (AI when configured, otherwise the
 * curated template) — it never errors out the result page.
 */
export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const dominantSignal = body.dominantSignal ?? "";
  const secondarySignal = body.secondarySignal ?? "";

  if (!isSignalId(dominantSignal) || !isSignalId(secondarySignal)) {
    return NextResponse.json({ error: "Signaux invalides." }, { status: 400 });
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

  // `status` is internal telemetry; the payload always renders.
  return NextResponse.json({ personalization, status });
}
