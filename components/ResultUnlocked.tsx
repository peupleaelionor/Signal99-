"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { PersonalizedResult, QuizResultRecord } from "@/types";
import { getSignal } from "@/data/signals";
import { buildFallbackResult } from "@/lib/ai/fallback";
import { SignalCard } from "@/components/SignalCard";
import { SignalEmblem } from "@/components/SignalEmblem";
import { SignalGuidance } from "@/components/SignalGuidance";
import { RecommendedForYourSignal } from "@/components/RecommendedForYourSignal";
import { ShareButtons } from "@/components/ShareButtons";
import { UpsellPack } from "@/components/UpsellPack";
import { CardShell } from "@/components/CardShell";
import { LayoutContainer } from "@/components/LayoutContainer";
import { SignalGlyph } from "@/components/SignalGlyph";
import { funnel } from "@/lib/funnel-metrics";
import { track } from "@/lib/analytics";
import { UNLOCKED } from "@/lib/copy";
import { DISCLAIMER } from "@/components/Footer";

interface ResultUnlockedProps {
  record: QuizResultRecord;
}

export function ResultUnlocked({ record }: ResultUnlockedProps) {
  const dominant = getSignal(record.dominantSignal);
  const secondary = getSignal(record.secondarySignal);
  const { meta } = record;

  // Start with the premium deterministic fallback so the page is instant and
  // never blank. The invisible AI (if configured) upgrades it in place.
  const [p, setP] = useState<PersonalizedResult>(() =>
    buildFallbackResult(record.dominantSignal, record.secondarySignal),
  );

  useEffect(() => {
    funnel.unlockedResultSeen(record.id, record.dominantSignal);
    track("ai_generation_started", { id: record.id });

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/personalize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: record.id,
            dominant: record.dominantSignal,
            secondary: record.secondarySignal,
            answers: record.answers,
          }),
        });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { result: PersonalizedResult; status: string };
        if (cancelled) return;
        setP(data.result);
        track(
          data.status === "completed" ? "ai_generation_completed" : "ai_generation_fallback",
          { id: record.id },
        );
      } catch {
        // Keep the premium fallback already on screen — user sees no error.
        track("ai_generation_fallback", { id: record.id });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [record]);

  return (
    <LayoutContainer narrow className="py-10">
      {/* 1–3. Reveal moment + name + mirror */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          {UNLOCKED.revealLead}
        </p>

        <div className="mx-auto mt-4 w-full max-w-[260px]">
          <SignalEmblem signal={dominant} priority />
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <span
            className="rounded-full border px-3 py-1 text-[11px] uppercase tracking-widest"
            style={{ color: dominant.colors.aura, borderColor: `${dominant.colors.aura}55` }}
          >
            {meta.rarityLabel}
          </span>
          {meta.comboLabel && (
            <span className="rounded-full border border-line px-3 py-1 text-[11px] uppercase tracking-widest text-muted">
              {meta.comboLabel}
            </span>
          )}
        </div>

        <p
          className="mt-5 font-serif text-2xl italic leading-snug"
          style={{ color: dominant.colors.aura }}
        >
          “{p.mirrorPhrase}”
        </p>
      </motion.div>

      {/* 4. Secondary */}
      <div className="mt-8 flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
        <span style={{ color: secondary.colors.aura }}>
          <SignalGlyph name={secondary.symbol} size={26} />
        </span>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">
            Your secondary Signal
          </p>
          <p className="text-ink">{secondary.name}</p>
        </div>
      </div>

      {/* 5–7. Social energy, hidden strength, soft shadow, direction */}
      <div className="mt-6 flex flex-col gap-3">
        <DetailBlock label="Social energy" value={p.socialEnergy} />
        <DetailBlock label="Hidden strength" value={p.hiddenStrength} />
        <DetailBlock label="Soft shadow" value={p.softShadow} />
        <DetailBlock label="Your direction" value={p.todayAction} />
      </div>

      {/* 8. Power phrase */}
      <CardShell glow className="mt-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          Your power phrase
        </p>
        <p
          className="mt-3 font-serif text-2xl italic leading-snug"
          style={{ color: dominant.colors.aura }}
        >
          “{p.powerPhrase}”
        </p>
      </CardShell>

      {/* Guidance — what to do with your Signal */}
      <SignalGuidance signal={dominant} />

      {/* Lifestyle recommendations (transparent, labeled if commercial) */}
      <RecommendedForYourSignal signal={dominant} />

      {/* 9. Cards — premium personal, plus public + lockscreen to keep/share */}
      <div className="mt-10">
        <p className="mb-4 text-center text-xs uppercase tracking-[0.3em] text-muted">
          Your personal card
        </p>
        <SignalCard
          signal={dominant}
          variant="premium"
          mirrorPhrase={p.mirrorPhrase}
          hiddenStrength={p.hiddenStrength}
          softShadow={p.softShadow}
          powerPhrase={p.powerPhrase}
        />

        <p className="mb-3 mt-8 text-center text-xs uppercase tracking-[0.3em] text-muted">
          Share & keep
        </p>
        <div className="flex snap-x gap-4 overflow-x-auto pb-2">
          <div className="min-w-[220px] max-w-[240px] shrink-0">
            <SignalCard signal={dominant} variant="public" mirrorPhrase={p.mirrorPhrase} />
          </div>
          <div className="min-w-[220px] max-w-[240px] shrink-0">
            <SignalCard signal={dominant} variant="lockscreen" powerPhrase={p.powerPhrase} />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ShareButtons signal={dominant} slug={record.shareSlug} />
      </div>

      <p className="mt-6 text-center text-sm text-muted">{UNLOCKED.shareInvite}</p>

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

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1.5 leading-relaxed text-ink/90">{value}</p>
    </div>
  );
}
