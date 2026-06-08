import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

interface Body {
  email?: string;
  handle?: string;
  paymentReference?: string;
  quizResultId?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Manual delivery fallback — "never lose someone who paid".
 *
 * If automatic unlock fails (e.g. payment_link mode, webhook lag, cleared
 * cache), the user can leave an email / social handle + payment reference. We
 * record the request so the Signal card can be delivered manually. This never
 * grants premium access by itself.
 */
export async function POST(req: Request) {
  const limit = rateLimit(req, "delivery", { limit: 5, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Trop de demandes. Réessaie dans un instant." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const email = (body.email || "").trim().slice(0, 200);
  const handle = (body.handle || "").trim().slice(0, 120);
  const paymentReference = (body.paymentReference || "").trim().slice(0, 200);
  const quizResultId = (body.quizResultId || "").trim().slice(0, 100);

  if (!email && !handle) {
    return NextResponse.json(
      { ok: false, error: "Indique un email ou un identifiant." },
      { status: 400 },
    );
  }
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Email invalide." },
      { status: 400 },
    );
  }

  // Persist when Supabase is available; otherwise log so it isn't silently lost.
  const db = getSupabaseService();
  if (db) {
    try {
      await db.from("delivery_requests").insert({
        email: email || null,
        handle: handle || null,
        payment_reference: paymentReference || null,
        quiz_result_id: quizResultId || null,
      });
    } catch {
      // Table may not exist yet — fall through to the log path.
      // eslint-disable-next-line no-console
      console.warn("[delivery] could not persist request", {
        hasEmail: Boolean(email),
        quizResultId,
      });
    }
  } else {
    // eslint-disable-next-line no-console
    console.info("[delivery] request received", {
      hasEmail: Boolean(email),
      hasHandle: Boolean(handle),
      quizResultId,
    });
  }

  return NextResponse.json({ ok: true });
}
