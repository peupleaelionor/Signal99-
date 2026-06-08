"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import type { QuizResultRecord } from "@/types";
import { getResult, getSessionHint } from "@/lib/local-store";
import { ResultLocked } from "@/components/ResultLocked";
import { ResultUnlocked } from "@/components/ResultUnlocked";
import { LayoutContainer } from "@/components/LayoutContainer";
import { PrimaryButton } from "@/components/PrimaryButton";

function Loading() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-radial-aura">
      <p className="animate-aura-pulse text-sm tracking-[0.3em] text-muted">
        SIGNAL99
      </p>
    </main>
  );
}

function ResultInner() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const id = params?.id;

  const [record, setRecord] = useState<QuizResultRecord | null | undefined>(
    undefined,
  );
  // null = still checking with the server; true/false = server verdict.
  const [paid, setPaid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!id) return;
    setRecord(getResult(id));
  }, [id]);

  // SECURITY: the unlock decision is made by the server, never by localStorage.
  // We re-verify payment on every load (durable store or live Stripe session).
  useEffect(() => {
    if (!id || record === null || record === undefined) return;
    let cancelled = false;

    async function check(resultId: string) {
      const sessionHint =
        search.get("session_id") || getSessionHint(resultId) || "";
      try {
        const url = `/api/result-status?id=${encodeURIComponent(resultId)}${
          sessionHint ? `&session_id=${encodeURIComponent(sessionHint)}` : ""
        }`;
        const res = await fetch(url, { cache: "no-store" });
        const data = (await res.json()) as { paid?: boolean };
        if (!cancelled) setPaid(Boolean(data.paid));
      } catch {
        if (!cancelled) setPaid(false);
      }
    }

    void check(id);
    return () => {
      cancelled = true;
    };
  }, [id, record, search]);

  if (record === undefined) return <Loading />;

  if (record === null) {
    return (
      <main className="flex min-h-[100dvh] items-center bg-radial-aura">
        <LayoutContainer narrow className="text-center">
          <h1 className="font-serif text-3xl text-ink">Résultat introuvable</h1>
          <p className="mt-3 text-muted">
            Ce résultat n&apos;a pas été trouvé sur cet appareil. Refais le test
            pour révéler ton Signal.
          </p>
          <div className="mt-8 flex justify-center">
            <PrimaryButton href="/test">Refaire le test</PrimaryButton>
          </div>
          <p className="mt-6 text-sm text-muted">
            <Link href="/" className="underline hover:text-ink">
              Retour à l&apos;accueil
            </Link>
          </p>
        </LayoutContainer>
      </main>
    );
  }

  // Still confirming payment with the server.
  if (paid === null) return <Loading />;

  return (
    <main className="min-h-[100dvh] bg-radial-aura">
      {paid ? (
        <ResultUnlocked record={record} />
      ) : (
        <ResultLocked record={record} />
      )}
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResultInner />
    </Suspense>
  );
}
