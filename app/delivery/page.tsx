"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutContainer } from "@/components/LayoutContainer";
import { DeliveryForm } from "@/components/DeliveryForm";
import { getPendingResultId } from "@/lib/checkout-client";
import { getResult } from "@/lib/storage";
import { DELIVERY } from "@/lib/copy";

function DeliveryInner() {
  const params = useSearchParams();
  const [id, setId] = useState<string>("");
  const [dominant, setDominant] = useState<string | undefined>();
  const [secondary, setSecondary] = useState<string | undefined>();

  useEffect(() => {
    const resolved = params.get("id") || getPendingResultId() || "";
    setId(resolved);
    if (resolved) {
      const record = getResult(resolved);
      if (record) {
        setDominant(record.dominantSignal);
        setSecondary(record.secondarySignal);
      }
    }
  }, [params]);

  return (
    <main className="flex min-h-[100dvh] items-center bg-radial-aura">
      <LayoutContainer narrow className="py-12">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Signal99</p>
          <h1 className="mt-4 font-serif text-3xl text-ink">{DELIVERY.title}</h1>
          <p className="mx-auto mt-3 max-w-md text-muted">{DELIVERY.body}</p>
        </div>
        <div className="mt-8">
          <DeliveryForm
            quizResultId={id || "unknown"}
            dominantSignal={dominant}
            secondarySignal={secondary}
          />
        </div>
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
