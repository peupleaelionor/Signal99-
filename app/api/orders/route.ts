import { NextResponse } from "next/server";
import { isSignalId } from "@/data/signals";
import { saveDeliveryContact } from "@/lib/orders";
import type { DeliveryContact } from "@/types";

export const runtime = "nodejs";

interface Body {
  quizResultId?: string;
  email?: string;
  handle?: string;
  paymentReference?: string;
  dominantSignal?: string;
  secondarySignal?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Capture a delivery contact so a payer is never lost. Used by /delivery and by
 * the post-payment fallback form. At least one of email / handle is required.
 */
export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const quizResultId = (body.quizResultId || "").trim();
  const email = (body.email || "").trim();
  const handle = (body.handle || "").trim();

  if (!quizResultId) {
    return NextResponse.json({ error: "Missing result id." }, { status: 400 });
  }
  if (!email && !handle) {
    return NextResponse.json(
      { error: "Add an email or a handle so we can reach you." },
      { status: 400 },
    );
  }
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const contact: DeliveryContact = {
    quizResultId,
    email: email || undefined,
    handle: handle || undefined,
    paymentReference: (body.paymentReference || "").trim() || undefined,
    dominantSignal: isSignalId(body.dominantSignal || "") ? (body.dominantSignal as DeliveryContact["dominantSignal"]) : undefined,
    secondarySignal: isSignalId(body.secondarySignal || "") ? (body.secondarySignal as DeliveryContact["secondarySignal"]) : undefined,
    createdAt: new Date().toISOString(),
  };

  await saveDeliveryContact(contact);
  return NextResponse.json({ ok: true });
}
