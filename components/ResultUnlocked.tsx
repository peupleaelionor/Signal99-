"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { QuizResultRecord, SignalPersonalization } from "@/types";
import { getSignal } from "@/data/signals";
import { ensurePersonalization } from "@/lib/personalize-client";
import { startCheckout } from "@/lib/checkout-client";
import { SignalCard } from "@/components/SignalCard";
import { SignalEmblem } from "@/components/SignalEmblem";
import { SignalGuidance } from "@/components/SignalGuidance";
import { RecommendedForYourSignal } from "@/components/RecommendedForYourSignal";
import { ShareButtons } from "@/components/ShareButtons";
import { UpsellPack } from "@/components/UpsellPack";
import { CardShell } from "@/components/CardShell";
import { LayoutContainer } from "@/components/LayoutContainer";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SignalGlyph } from "@/components/SignalGlyph";
import { funnel } from "@/lib/funnel-metrics";
import { DISCLAIMER } from "@/components/Footer";

interface ResultUnlockedProps {
  record: QuizResultRecord;
}

export function ResultUnlocked({ record }: ResultUnlockedProps) {
  const [perso, setPerso] = useState<SignalPersonalization | null>(
    record.personalization ?? null,
  );

  // The Signal is revealed by the (paid) personalization payload — never from
  // localStorage alone. Fetch once, then render.
  useEffect(() => {
    if (perso) return;
    let cancelled = false;
    ensurePersonalization(record).then((result) => {
      if (!cancelled && result) setPerso(result);
    });
    return () => {
      cancelled = true;
    };
  }, [perso, record]);

  useEffect(() => {
    if (perso) funnel.unlockedResultSeen(record.id, perso.dominantSignal);
  }, [perso, record.id]);

  // Révélation loader while the Signal is being revealed.
  if (!perso) {
    return (
      <LayoutContainer narrow className="flex min-h-[60vh] items-center">
        <div className="mx-auto text-center">
          <p className="animate-aura-pulse text-sm tracking-[0.3em] text-muted">
            RÉVÉLATION DE TON SIGNAL…
          </p>
          <p className="mt-4 text-muted">Un instant, on révèle ta carte.</p>
        </div>
      </LayoutContainer>
    );
  }

  const dominant = getSignal(perso.dominantSignal);
  const secondary = getSignal(perso.secondarySignal);
  const comboLabel = record.hasCombo
    ? `${dominant.shortLabel} + ${secondary.shortLabel}`
    : null;

  const mirrorPhrase = perso.mirrorPhrase ?? dominant.description;
  const hiddenStrength = perso.hiddenStrength ?? dominant.strengths;
  const softShadow = perso.softShadow ?? dominant.shadow;
  const socialEnergy = perso.socialEnergy ?? dominant.socialEnergy;
  const powerPhrase = perso.powerPhrase ?? dominant.powerPhrase;

  return (
    <LayoutContainer narrow className="py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          Ton Signal dominant
        </p>

        <div className="mx-auto mt-4 w-full max-w-[260px]">
          <SignalEmblem signal={dominant} priority />
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {record.rarityLabel && (
            <span
              className="rounded-full border px-3 py-1 text-[11px] uppercase tracking-widest"
              style={{
                color: dominant.colors.aura,
                borderColor: `${dominant.colors.aura}55`,
              }}
            >
              {record.rarityLabel}
            </span>
          )}
          {comboLabel && (
            <span className="rounded-full border border-line px-3 py-1 text-[11px] uppercase tracking-widest text-muted">
              {comboLabel}
            </span>
          )}
        </div>

        <p className="mt-4 leading-relaxed text-ink/90">{mirrorPhrase}</p>
      </motion.div>

      {/* Secondary */}
      <div className="mt-8 flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
        <span style={{ color: secondary.colors.aura }}>
          <SignalGlyph name={secondary.symbol} size={26} />
        </span>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">
            Ton Signal secondaire
          </p>
          <p className="text-ink">{secondary.name}</p>
        </div>
      </div>

      {/* Detail blocks */}
      <div className="mt-6 flex flex-col gap-3">
        <DetailBlock label="Ta force cachée" value={hiddenStrength} />
        <DetailBlock label="Ton danger intérieur" value={softShadow} />
        <DetailBlock label="Ton énergie sociale" value={socialEnergy} />
        <DetailBlock label="Ton conseil du jour" value={dominant.advice} />
      </div>

      {/* Power phrase */}
      <CardShell glow className="mt-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          Ta phrase de pouvoir
        </p>
        <p
          className="mt-3 font-serif text-2xl italic leading-snug"
          style={{ color: dominant.colors.aura }}
        >
          “{powerPhrase}”
        </p>
      </CardShell>

      <SignalGuidance signal={dominant} personalization={perso} />

      <RecommendedForYourSignal signal={dominant} personalization={perso} />

      {/* Shareable card */}
      <div className="mt-10">
        <p className="mb-4 text-center text-xs uppercase tracking-[0.3em] text-muted">
          Ta carte personnelle
        </p>
        <SignalCard signal={dominant} />
      </div>

      <div className="mt-8">
        <ShareButtons signal={dominant} slug={record.shareSlug} />
      </div>

      {/* Collection entry point */}
      <CollectionTeaser record={record} />

      {/* Upsell */}
      <div className="mt-10">
        <UpsellPack record={record} />
      </div>

      <p className="mt-10 text-center text-[11px] leading-relaxed text-muted/70">
        {DISCLAIMER}
      </p>
    </LayoutContainer>
  );
}

function CollectionTeaser({ record }: { record: QuizResultRecord }) {
  const [loading, setLoading] = useState(false);

  async function unlockBonus() {
    setLoading(true);
    funnel.checkoutStarted(record.id, "bonus_pack");
    const res = await startCheckout(record.id, record.resultToken, "bonus_pack");
    if (res.error) setLoading(false);
  }

  return (
    <div className="mt-10 rounded-2xl border border-gold/30 bg-surface p-5 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">
        Collection 1 / 99
      </p>
      <h2 className="mt-2 font-serif text-2xl text-ink">
        3 cartes rares dorment dans ton Signal.
      </h2>
      <p className="mt-2 text-sm text-muted">
        Chaque carte révèle une facette de plus de ton énergie.
      </p>
      <div className="mt-5 flex flex-col gap-3">
        <PrimaryButton onClick={unlockBonus} fullWidth disabled={loading}>
          {loading ? "Un instant…" : "Débloquer mes 3 cartes bonus — 2,99 €"}
        </PrimaryButton>
        <PrimaryButton href={`/collection/${record.id}`} variant="secondary">
          Voir ma collection
        </PrimaryButton>
      </div>
    </div>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1.5 leading-relaxed text-ink/90">{value}</p>
    </div>
  );
}
