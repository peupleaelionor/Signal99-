"use client";

import { useEffect, useState } from "react";
import type { QuizResultRecord } from "@/types";
import { CardShell } from "@/components/CardShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { startCheckout } from "@/lib/checkout-client";
import { funnel } from "@/lib/funnel-metrics";
import { COMPLETE_PACK_CENTS, UPSELL_ENABLED, formatPrice } from "@/lib/config";

const PERKS = [
  "Day-by-day guidance",
  "Love, money and career direction",
  "Resources recommended for your Signal",
  "3 premium cards (story, lockscreen, duo)",
];

/**
 * Post-purchase upsell to the Full Signal Guide.
 * Shown as a teaser by default; becomes a live checkout when
 * NEXT_PUBLIC_ENABLE_UPSELL=true and the guide content has shipped.
 */
export function UpsellPack({ record }: { record: QuizResultRecord }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    funnel.upsellSeen(record.id);
  }, [record.id]);

  async function handleUpsell() {
    setLoading(true);
    funnel.upsellPurchased(record.id);
    const res = await startCheckout(record.id, record.resultToken, "complete_pack");
    if (res.error) setLoading(false);
  }

  return (
    <CardShell className="border-copper/40">
      <div className="flex items-center justify-between">
        <p className="font-serif text-xl text-ink">Full Signal Guide</p>
        <p className="font-serif text-xl text-gold">
          {formatPrice(COMPLETE_PACK_CENTS)}
        </p>
      </div>
      <ul className="mt-4 flex flex-col gap-2 text-sm text-muted">
        {PERKS.map((p) => (
          <li key={p} className="flex items-start gap-2">
            <span className="mt-0.5 text-gold">✓</span>
            {p}
          </li>
        ))}
      </ul>
      <div className="mt-5">
        {UPSELL_ENABLED ? (
          <PrimaryButton onClick={handleUpsell} fullWidth disabled={loading}>
            {loading ? "Redirecting…" : "Unlock my full guide"}
          </PrimaryButton>
        ) : (
          <div className="rounded-full border border-line bg-surface px-6 py-3 text-center text-sm text-muted">
            Coming soon
          </div>
        )}
      </div>
    </CardShell>
  );
}
