"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutContainer } from "@/components/LayoutContainer";
import { PrimaryButton } from "@/components/PrimaryButton";
import { DeliveryForm } from "@/components/DeliveryForm";
import { getPendingResultId } from "@/lib/checkout-client";
import { markPaid, getResult } from "@/lib/storage";
import { funnel } from "@/lib/funnel-metrics";
import { UNLOCKED } from "@/lib/copy";

/**
 * Return page for the Payment Link flow.
 *
 * Recovers the pending result on this device, unlocks it, and routes to the
 * result. If the result can't be found (e.g. paid on another device), it shows
 * the contact-capture form so the payer is never lost.
 */
function PaidInner() {
  const params = useSearchParams();
  const [resolvedId, setResolvedId] = useState<string | null>(null);
  const [found, setFound] = useState<boolean | null>(null);

  useEffect(() => {
    const id =
      params.get("id") ||
      params.get("client_reference_id") ||
      getPendingResultId();
    setResolvedId(id);

    if (id && getResult(id)) {
      markPaid(id, params.get("payment_intent") || "payment_link");
      funnel.purchaseCompleted(id, "signal_unlock", "payment_link");
      setFound(true);
      window.setTimeout(() => {
        window.location.href = `/result/${id}`;
      }, 900);
    } else {
      setFound(false);
    }
  }, [params]);

  return (
    <main className="flex min-h-[100dvh] items-center bg-radial-aura">
      <LayoutContainer narrow className="py-12 text-center">
        <p className="animate-aura-pulse text-sm tracking-[0.3em] text-muted">
          PAYMENT RECEIVED
        </p>

        {found === true && (
          <>
            <h1 className="mt-4 font-serif text-3xl text-ink">
              {UNLOCKED.afterPayment[0]}
            </h1>
            <p className="mt-3 text-muted">Revealing your Signal…</p>
            {resolvedId && (
              <div className="mt-8 flex justify-center">
                <PrimaryButton href={`/result/${resolvedId}`}>
                  View my result
                </PrimaryButton>
              </div>
            )}
          </>
        )}

        {found === false && (
          <>
            <h1 className="mt-4 font-serif text-3xl text-ink">
              Your card is being prepared.
            </h1>
            <p className="mx-auto mt-3 max-w-md text-muted">
              If the automatic unlock fails, enter your email or handle and we’ll
              send your Signal card.
            </p>
            <div className="mt-8 text-left">
              <DeliveryForm quizResultId={resolvedId || "unknown"} />
            </div>
          </>
        )}
      </LayoutContainer>
    </main>
  );
}

export default function PaidPage() {
  return (
    <Suspense>
      <PaidInner />
    </Suspense>
  );
}
