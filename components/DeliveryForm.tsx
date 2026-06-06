"use client";

import { useState } from "react";
import { CardShell } from "@/components/CardShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { track } from "@/lib/analytics";
import { CONTACT_EMAIL } from "@/lib/config";
import { DELIVERY } from "@/lib/copy";

interface DeliveryFormProps {
  quizResultId: string;
  dominantSignal?: string;
  secondarySignal?: string;
}

/**
 * "Never lose a payer" contact capture. Posts to /api/orders so an operator can
 * deliver the card manually if the automatic unlock fails. A mailto fallback is
 * offered when a public contact email is configured.
 */
export function DeliveryForm({
  quizResultId,
  dominantSignal,
  secondarySignal,
}: DeliveryFormProps) {
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [reference, setReference] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email && !handle) {
      setError("Add an email or a handle so we can reach you.");
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizResultId,
          email,
          handle,
          paymentReference: reference,
          dominantSignal,
          secondarySignal,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || "Could not save.");
      }
      track("delivery_submitted", { id: quizResultId });
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not save.");
    }
  }

  if (status === "done") {
    return (
      <CardShell glow className="text-center">
        <p className="font-serif text-xl text-ink">{DELIVERY.success}</p>
        <p className="mt-2 text-sm text-muted">
          Keep an eye on your inbox or DMs.
        </p>
      </CardShell>
    );
  }

  const mailto =
    CONTACT_EMAIL &&
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      "SIGNAL99 card — " + quizResultId,
    )}&body=${encodeURIComponent(
      `My result id: ${quizResultId}\nEmail: ${email}\nHandle: ${handle}\nPayment reference: ${reference}`,
    )}`;

  return (
    <form onSubmit={handleSubmit}>
      <CardShell>
        <div className="flex flex-col gap-4">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted">
              {DELIVERY.emailLabel}
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none focus:border-gold/60"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted">
              {DELIVERY.handleLabel}
            </span>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@yourhandle"
              className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none focus:border-gold/60"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted">
              {DELIVERY.refLabel}
            </span>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Stripe / PayPal receipt id"
              className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none focus:border-gold/60"
            />
          </label>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <PrimaryButton type="submit" fullWidth disabled={status === "loading"}>
            {status === "loading" ? "Sending…" : DELIVERY.cta}
          </PrimaryButton>

          {mailto && (
            <a href={mailto} className="text-center text-xs text-muted underline hover:text-ink">
              Or email us directly
            </a>
          )}
        </div>
      </CardShell>
    </form>
  );
}
