"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutContainer } from "@/components/LayoutContainer";
import { PrimaryButton } from "@/components/PrimaryButton";
import { markPaid } from "@/lib/local-store";
import { funnel } from "@/lib/funnel-metrics";

function SuccessInner() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const id = params.get("id");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!sessionId) {
        setError("Session de paiement manquante.");
        return;
      }
      // The result id is required so the server binds THIS session to THIS
      // result (one payment ⇒ one result, no reuse across results).
      const resultId = id || null;
      if (!resultId) {
        setError("Résultat introuvable pour ce paiement.");
        return;
      }
      try {
        const res = await fetch(
          `/api/verify-session?session_id=${encodeURIComponent(
            sessionId,
          )}&id=${encodeURIComponent(resultId)}`,
        );
        const data = (await res.json()) as {
          paid: boolean;
          quizResultId?: string | null;
          sku?: string;
        };
        if (cancelled) return;

        if (data.paid) {
          // Remember the session id locally as a re-verification hint (UX only).
          markPaid(resultId, sessionId);
          funnel.purchaseCompleted(resultId, data.sku || "signal_unlock", "stripe");
          router.replace(`/result/${resultId}`);
        } else {
          setError("Le paiement n'a pas pu être confirmé.");
        }
      } catch {
        if (!cancelled) setError("Vérification du paiement impossible.");
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [sessionId, id, router]);

  return (
    <main className="flex min-h-[100dvh] items-center bg-radial-aura">
      <LayoutContainer narrow className="text-center">
        {error ? (
          <>
            <h1 className="font-serif text-3xl text-ink">Un instant…</h1>
            <p className="mt-3 text-muted">{error}</p>
            <div className="mt-8 flex justify-center gap-3">
              {id && (
                <PrimaryButton href={`/result/${id}`}>
                  Voir mon résultat
                </PrimaryButton>
              )}
              <PrimaryButton
                href={`/delivery${id ? `?id=${encodeURIComponent(id)}` : ""}`}
                variant="secondary"
              >
                Récupérer ma carte
              </PrimaryButton>
            </div>
          </>
        ) : (
          <>
            <p className="animate-aura-pulse text-sm tracking-[0.3em] text-muted">
              PAIEMENT CONFIRMÉ
            </p>
            <h1 className="mt-4 font-serif text-3xl text-ink">
              Révélation de ton Signal…
            </h1>
            <p className="mt-3 text-muted">Un instant, on débloque ta carte.</p>
          </>
        )}
      </LayoutContainer>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessInner />
    </Suspense>
  );
}
