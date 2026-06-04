import { getSignal } from "@/data/signals";
import { PRODUCTS } from "@/lib/config";
import type { SignalId, SignalPersonalization } from "@/types";

/**
 * Deterministic, premium fallback built from the curated templates in
 * /data/signals.ts. Always available, never fails — guarantees the user gets a
 * complete result even with no AI key, an AI timeout, or invalid AI output.
 */
export function buildFallbackPersonalization(
  dominantSignal: SignalId,
  secondarySignal: SignalId,
): SignalPersonalization {
  const dominant = getSignal(dominantSignal);
  const g = dominant.guidance;

  return {
    dominantSignal,
    secondarySignal,
    mirrorPhrase: dominant.description,
    hiddenStrength: dominant.strengths,
    softShadow: dominant.shadow,
    socialEnergy: dominant.socialEnergy,
    todayAction: g.todayAction,
    weekFocus: g.weekFocus,
    avoid: g.avoid,
    explore: g.explore,
    recommendedCategories: g.recommendedCategories,
    productPlacementTone: g.productPlacementTone,
    powerPhrase: dominant.powerPhrase,
    publicShareText: dominant.shareText,
    premiumCardTitle: dominant.name,
    premiumCardText: dominant.tagline,
    lockscreenText: dominant.powerPhrase,
    ogTitle: `Je suis ${dominant.shortLabel}. Et toi ?`,
    ogDescription: "Découvre ton Signal en 7 questions.",
    upsellTitle: PRODUCTS.complete_pack.label,
    upsellDescription: PRODUCTS.complete_pack.description,
    source: "template",
  };
}
