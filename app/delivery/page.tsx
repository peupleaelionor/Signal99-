"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutContainer } from "@/components/LayoutContainer";
import { PrimaryButton } from "@/components/PrimaryButton";
import { track } from "@/lib/analytics";

function DeliveryInner() {
  const search = useSearchParams();
  const quizResultId = search.get("id") || "";

  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, handle, paymentReference, quizResultId }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        track("delivery_submitted");
        setStatus("done");
      } else {
        setStatus("error");
        setError(data.error || "Envoi impossible.");
      }
    } catch {
      setStatus("error");
      setError("Connexion impossible. Réessaie.");
    }
  }

  return (
    <main className="flex min-h-[100dvh] items-center bg-radial-aura">
      <LayoutContainer narrow className="py-12">
        {status === "done" ? (
          <div className="text-center">
            <h1 className="font-serif text-3xl text-ink">Bien reçu.</h1>
            <p className="mt-3 text-muted">
              Ta carte Signal est en préparation. Si le déblocage automatique
              n&apos;a pas eu lieu, nous t&apos;enverrons ton résultat
              rapidement.
            </p>
            <div className="mt-8 flex justify-center">
              <PrimaryButton href="/">Retour à l&apos;accueil</PrimaryButton>
            </div>
          </div>
        ) : (
          <>
            <h1 className="font-serif text-3xl text-ink">
              Ta carte est en préparation.
            </h1>
            <p className="mt-3 text-muted">
              Si le déblocage automatique échoue, laisse un email ou un
              identifiant Instagram/TikTok et nous t&apos;envoyons ta carte
              Signal.
            </p>

            <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
              <label className="text-sm text-muted">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="toi@exemple.com"
                  className="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none focus:border-gold/60"
                />
              </label>
              <label className="text-sm text-muted">
                Instagram / TikTok (optionnel)
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@ton_identifiant"
                  className="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none focus:border-gold/60"
                />
              </label>
              <label className="text-sm text-muted">
                Référence de paiement (optionnel)
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="reçu Stripe, email de paiement…"
                  className="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none focus:border-gold/60"
                />
              </label>

              {error && (
                <p className="text-sm text-red-400" role="alert">
                  {error}
                </p>
              )}

              <PrimaryButton
                type="submit"
                fullWidth
                disabled={status === "sending"}
              >
                {status === "sending" ? "Envoi…" : "Envoyer ma demande"}
              </PrimaryButton>
            </form>
          </>
        )}
      </LayoutContainer>
    </main>
  );
}

export default function DeliveryPage() {
  return (
    <Suspense>
      <DeliveryInner />
    </Suspense>
  );
}
