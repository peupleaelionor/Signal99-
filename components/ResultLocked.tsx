"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { QuizResultRecord } from "@/types";
import { CardShell } from "@/components/CardShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { PricingBlock } from "@/components/PricingBlock";
import { CreditUpsell } from "@/components/CreditUpsell";
import { LayoutContainer } from "@/components/LayoutContainer";
import { SignalGlyph } from "@/components/SignalGlyph";
import { startCheckout } from "@/lib/checkout-client";
import { markPaid } from "@/lib/storage";
import { funnel } from "@/lib/funnel-metrics";
import { MOCK_PAYMENT_ENABLED } from "@/lib/config";
import { DISCLAIMER } from "@/components/Footer";

interface ResultLockedProps {
  record: QuizResultRecord;
}

/**
 * Teaser shown before payment. Reveals that a dominant was detected and a
 * silhouette of the card, but never the archetype name or premium content.
 */
export function ResultLocked({ record }: ResultLockedProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    funnel.lockedResultSeen(record.id);
  }, [record.id]);

  async function handleUnlock() {
    setLoading(true);
    setError(null);
    funnel.checkoutStarted(record.id, "signal_unlock");
    const res = await startCheckout(record.id, record.resultToken);
    if (res.mock) {
      // Dev-only: simulate a successful payment and reveal the result.
      markPaid(record.id, "mock_payment");
      funnel.purchaseCompleted(record.id, "signal_unlock", "mock");
      router.refresh();
      window.location.reload();
      return;
    }
    if (res.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <LayoutContainer narrow className="py-12">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          Signal99
        </p>
        <h1 className="mt-4 font-serif text-3xl text-ink sm:text-4xl">
          Ton Signal est prêt.
        </h1>
        <p className="mt-3 text-muted">
          Nous avons détecté une dominante claire dans tes réponses.
        </p>
        <p className="mt-2 text-sm text-muted/80">
          Ton profil révèle une énergie liée à la vision, au contrôle ou à
          l&apos;intuition.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full border border-gold/40 px-3 py-1 text-[11px] uppercase tracking-widest text-gold">
            {record.meta.rarityLabel}
          </span>
          {record.meta.comboLabel && (
            <span className="rounded-full border border-line px-3 py-1 text-[11px] uppercase tracking-widest text-muted">
              {record.meta.shareHook}
            </span>
          )}
        </div>
      </div>

      {/* Locked card silhouette */}
      <div className="relative mx-auto mt-10 max-w-[280px]">
        <CardShell glow className="aspect-[9/16] overflow-hidden p-0">
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 text-gold/40">
              <SignalGlyph name="compass" size={40} />
            </div>
            <div className="h-3 w-32 rounded-full bg-line" />
            <div className="h-2 w-40 rounded-full bg-line/70" />
            <div className="mt-2 rounded-full border border-gold/40 px-4 py-1.5 text-xs uppercase tracking-widest text-gold">
              Verrouillé
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 backdrop-blur-[2px]" />
        </CardShell>
      </div>

      <div className="mt-10">
        <p className="mb-4 text-center text-sm text-muted">
          Débloque ton résultat complet et ta carte personnelle.
        </p>
        <PricingBlock />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <PrimaryButton onClick={handleUnlock} fullWidth disabled={loading}>
          {loading ? "Redirection…" : "Débloquer pour 0,99 €"}
        </PrimaryButton>

        <CreditUpsell balance={0} />

        {MOCK_PAYMENT_ENABLED && (
          <button
            type="button"
            onClick={handleUnlock}
            className="text-center text-xs text-muted underline hover:text-ink"
          >
            [dev] Simuler le paiement
          </button>
        )}

        {error && (
          <p className="text-center text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>

      <p className="mt-8 text-center text-[11px] leading-relaxed text-muted/70">
        {DISCLAIMER}
      </p>
    </LayoutContainer>
  );
}
