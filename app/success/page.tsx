"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutContainer } from "@/components/LayoutContainer";
import { PrimaryButton } from "@/components/PrimaryButton";
import { markPaid } from "@/lib/storage";
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
      try {
        const res = await fetch(
          `/api/verify-session?session_id=${encodeURIComponent(sessionId)}`,
        );
        const data = (await res.json()) as {
          paid: boolean;
          quizResultId?: string | null;
          sku?: string;
        };
        if (cancelled) return;

        const resultId = id || data.quizResultId || null;
        if (data.paid && resultId) {
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
              <PrimaryButton href="/test" variant="secondary">
                Refaire le test
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
