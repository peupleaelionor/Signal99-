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
        setError("Payment session missing.");
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
          setError("We couldn’t confirm the payment automatically.");
        }
      } catch {
        if (!cancelled) setError("We couldn’t confirm the payment automatically.");
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
            <h1 className="font-serif text-3xl text-ink">Your card is being prepared.</h1>
            <p className="mt-3 text-muted">{error}</p>
            <p className="mt-2 text-sm text-muted">
              If the automatic unlock fails, leave your email or handle and we’ll
              send your Signal card.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {id && (
                <PrimaryButton href={`/result/${id}`}>View my result</PrimaryButton>
              )}
              <PrimaryButton
                href={id ? `/delivery?id=${encodeURIComponent(id)}` : "/delivery"}
                variant="secondary"
              >
                Send me my card
              </PrimaryButton>
            </div>
          </>
        ) : (
          <>
            <p className="animate-aura-pulse text-sm tracking-[0.3em] text-muted">
              PAYMENT CONFIRMED
            </p>
            <h1 className="mt-4 font-serif text-3xl text-ink">
              Revealing your Signal…
            </h1>
            <p className="mt-3 text-muted">One moment — unlocking your card.</p>
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
