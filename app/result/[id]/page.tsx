"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { QuizResultRecord } from "@/types";
import { getResult } from "@/lib/storage";
import { ResultLocked } from "@/components/ResultLocked";
import { ResultUnlocked } from "@/components/ResultUnlocked";
import { LayoutContainer } from "@/components/LayoutContainer";
import { PrimaryButton } from "@/components/PrimaryButton";

export default function ResultPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [record, setRecord] = useState<QuizResultRecord | null | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!id) return;
    setRecord(getResult(id));
  }, [id]);

  // Loading
  if (record === undefined) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-radial-aura">
        <p className="animate-aura-pulse text-sm tracking-[0.3em] text-muted">
          SIGNAL99
        </p>
      </main>
    );
  }

  // Not found on this device
  if (record === null) {
    return (
      <main className="flex min-h-[100dvh] items-center bg-radial-aura">
        <LayoutContainer narrow className="text-center">
          <h1 className="font-serif text-3xl text-ink">Result not found</h1>
          <p className="mt-3 text-muted">
            This result wasn’t found on this device. Take the test again to reveal
            your Signal.
          </p>
          <div className="mt-8 flex justify-center">
            <PrimaryButton href="/test">Reveal my Signal</PrimaryButton>
          </div>
          <p className="mt-6 text-sm text-muted">
            <Link href="/" className="underline hover:text-ink">
              Back to home
            </Link>
          </p>
        </LayoutContainer>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-radial-aura">
      {record.isPaid ? (
        <ResultUnlocked record={record} />
      ) : (
        <ResultLocked record={record} />
      )}
    </main>
  );
}
