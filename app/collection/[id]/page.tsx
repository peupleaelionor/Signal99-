"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { CardCategory, CardRarity, SignalId } from "@/types";
import { getResult, getSessionHint } from "@/lib/local-store";
import { getSignal } from "@/data/signals";
import { LayoutContainer } from "@/components/LayoutContainer";
import { PrimaryButton } from "@/components/PrimaryButton";
import { CardTile } from "@/components/CardTile";
import { ProgressBar } from "@/components/ProgressBar";
import { startCheckout } from "@/lib/checkout-client";
import { funnel } from "@/lib/funnel-metrics";

interface ApiCard {
  cardNumber: number;
  rarity: CardRarity;
  category: CardCategory;
  symbol: string;
  name: string;
  publicCopy?: string;
  premiumCopy?: string;
  lockedCopy: string;
}
interface ApiEntry {
  card: ApiCard;
  user: { unlocked: boolean; rarityRoll: number };
}
interface ApiResponse {
  signal: SignalId;
  total: number;
  unlockedCount: number;
  entries: ApiEntry[];
}

function Loading() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-radial-aura">
      <p className="animate-aura-pulse text-sm tracking-[0.3em] text-muted">
        SIGNAL99
      </p>
    </main>
  );
}

export default function CollectionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;
  const [data, setData] = useState<ApiResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "locked" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    if (!id) return;
    const record = getResult(id);
    if (!record) {
      setStatus("error");
      return;
    }
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/collection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resultId: id,
            sessionId: record.paymentId ?? getSessionHint(id) ?? undefined,
            collectionSeed: record.collectionSeed,
            answers: record.answers,
          }),
        });
        if (cancelled) return;
        if (res.status === 402) {
          setStatus("locked");
          return;
        }
        if (!res.ok) {
          setStatus("error");
          return;
        }
        const json = (await res.json()) as ApiResponse;
        setData(json);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Redirect unpaid users back to the locked result.
  useEffect(() => {
    if (status === "locked" && id) router.replace(`/result/${id}`);
  }, [status, id, router]);

  if (status === "loading" || status === "locked") return <Loading />;

  if (status === "error" || !data) {
    return (
      <main className="flex min-h-[100dvh] items-center bg-radial-aura">
        <LayoutContainer narrow className="text-center">
          <h1 className="font-serif text-3xl text-ink">Collection introuvable</h1>
          <p className="mt-3 text-muted">
            Refais le test pour révéler ton Signal et ta collection.
          </p>
          <div className="mt-8 flex justify-center">
            <PrimaryButton href="/test">Refaire le test</PrimaryButton>
          </div>
        </LayoutContainer>
      </main>
    );
  }

  const signal = getSignal(data.signal);

  return (
    <main className="min-h-[100dvh] bg-radial-aura">
      <LayoutContainer className="py-10">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Ta collection
          </p>
          <h1 className="mt-2 font-serif text-3xl text-ink">
            Signal {signal.shortLabel}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {data.unlockedCount} / {data.total} cartes révélées
          </p>
          <div className="mx-auto mt-4 max-w-xs">
            <ProgressBar current={data.unlockedCount} total={data.total} />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {data.entries.map((e) => (
            <CardTile
              key={e.card.cardNumber}
              name={e.user.unlocked ? e.card.name : "Carte verrouillée"}
              cardNumber={e.card.cardNumber}
              rarity={e.card.rarity}
              category={e.card.category}
              symbol={e.card.symbol}
              copy={
                e.user.unlocked
                  ? e.card.premiumCopy || e.card.publicCopy || ""
                  : e.card.lockedCopy
              }
              unlocked={e.user.unlocked}
              rarityRoll={e.user.rarityRoll}
              auraColor={signal.colors.aura}
            />
          ))}
        </div>

        {data.unlockedCount < data.total && (
          <div className="mt-10 rounded-2xl border border-gold/30 bg-surface p-5 text-center">
            <h2 className="font-serif text-2xl text-ink">
              Complète ta collection.
            </h2>
            <p className="mt-2 text-sm text-muted">
              Débloque tes 99 cartes, tes cartes rares et le comparateur ami.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <UpsellButton id={id!} />
            </div>
          </div>
        )}
      </LayoutContainer>
    </main>
  );
}

function UpsellButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  async function go() {
    setLoading(true);
    const record = getResult(id);
    if (!record) {
      setLoading(false);
      return;
    }
    funnel.checkoutStarted(id, "collection_99");
    const res = await startCheckout(id, record.resultToken, "collection_99");
    if (res.error) setLoading(false);
  }
  return (
    <PrimaryButton onClick={go} fullWidth disabled={loading}>
      {loading ? "Un instant…" : "Compléter ma Collection 99 — 9,99 €"}
    </PrimaryButton>
  );
}
