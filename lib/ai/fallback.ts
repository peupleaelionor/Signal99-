import { getSignal } from "@/data/signals";
import type { PersonalizedResult, SignalId } from "@/types";

/**
 * Premium deterministic fallback.
 *
 * Builds a complete, premium-quality result purely from `signals.ts` — no AI.
 * This is what ships when `AI_PREGENERATE=false` and no provider is configured
 * (the revenue-first default), or whenever the AI is slow / invalid / down.
 * The user never sees an "AI error" — they always get a clean, premium result.
 */
export function buildFallbackResult(
  dominant: SignalId,
  secondary: SignalId,
): PersonalizedResult {
  const d = getSignal(dominant);
  const s = getSignal(secondary);

  return {
    dominantSignal: dominant,
    secondarySignal: secondary,
    mirrorPhrase: d.mirrorPhrase,
    hiddenStrength: d.strengths,
    softShadow: d.shadow,
    socialEnergy: d.socialEnergy,
    todayAction: d.guidance.todayAction,
    weekFocus: d.guidance.weekFocus,
    avoid: d.guidance.avoid,
    explore: d.guidance.explore,
    recommendedCategories: d.guidance.recommendedCategories,
    productPlacementTone: d.guidance.productPlacementTone,
    powerPhrase: d.powerPhrase,
    publicShareText: d.shareText,
    premiumCardTitle: d.name,
    premiumCardText: `${d.mirrorPhrase} ${d.powerPhrase}`,
    lockscreenText: d.powerPhrase,
    ogTitle: `I’m ${d.name}. What’s your Signal?`,
    ogDescription: "Discover your Signal in 7 questions.",
    upsellTitle: "Your full Signal guide",
    upsellDescription: `Go deeper into your ${d.shortLabel} energy — with your ${s.shortLabel} side, daily direction and premium cards.`,
  };
}
