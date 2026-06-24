import "server-only";
import { SITE_URL } from "@/lib/config";

/**
 * Minimal email sender (Resend REST API, no SDK dependency).
 *
 * Optional: when RESEND_API_KEY is unset it no-ops and returns false, so the
 * delivery flow degrades gracefully (the request is still recorded/logged).
 * Never throws to the caller.
 */
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const RESEND_FROM =
  process.env.RESEND_FROM || "SIGNAL99 <onboarding@resend.dev>";

export const EMAIL_ENABLED = Boolean(RESEND_API_KEY);

interface SendArgs {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendArgs): Promise<boolean> {
  if (!RESEND_API_KEY) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: RESEND_FROM, to, subject, html }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Sends the "your card is ready" recovery email. Returns true if dispatched. */
export async function sendDeliveryEmail(
  to: string,
  resultId: string | null,
): Promise<boolean> {
  const link = resultId
    ? `${SITE_URL}/result/${encodeURIComponent(resultId)}`
    : SITE_URL;

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#050505;color:#F5F0E8;padding:32px;border-radius:16px;max-width:480px;margin:auto">
      <p style="letter-spacing:8px;color:#A8A095;font-size:12px;margin:0 0 16px">SIGNAL99</p>
      <h1 style="font-size:24px;margin:0 0 12px">Ta carte SIGNAL99 est prête</h1>
      <p style="color:#C9C2B6;line-height:1.6;margin:0 0 24px">
        Ton Signal est débloqué. Garde ta carte, partage-la, puis découvre les
        autres facettes de ton énergie.
      </p>
      <a href="${link}" style="display:inline-block;background:#C17D3C;color:#050505;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:999px">
        Voir ma carte
      </a>
      <p style="color:#6f6a61;font-size:12px;margin-top:28px;line-height:1.5">
        SIGNAL99 est une expérience symbolique et introspective, à but de
        divertissement et de réflexion.
      </p>
    </div>`;

  return sendEmail({
    to,
    subject: "Ta carte SIGNAL99 est prête",
    html,
  });
}
