import { getSignal } from "@/data/signals";
import type { QuizOutcome, RarityLabel, ResultMeta } from "@/types";

/**
 * Derives a symbolic rarity + combo from the outcome.
 *
 * IMPORTANT: no invented percentages. Rarity here is a qualitative reading of
 * how the answers cluster, not a statistical claim. Real frequencies can be
 * surfaced later once we have data.
 */

// Duos that read as especially evocative together.
const NOTABLE_DUOS: Record<string, true> = {
  "visionary+oracle": true,
  "oracle+visionary": true,
  "king_queen+rebel": true,
  "rebel+king_queen": true,
  "strategist+oracle": true,
  "oracle+strategist": true,
  "builder+protector": true,
  "protector+builder": true,
};

export function buildResultMeta(outcome: QuizOutcome): ResultMeta {
  const { scores, dominant, secondary } = outcome;
  const top = scores[dominant];
  const second = scores[secondary];
  const margin = top - second;

  const duoKey = `${dominant}+${secondary}`;
  const isNotableDuo = Boolean(NOTABLE_DUOS[duoKey]);

  let rarityLabel: RarityLabel = "Common";
  if (isNotableDuo) {
    rarityLabel = margin <= 2 ? "Very rare" : "Rare";
  } else if (margin >= 5) {
    rarityLabel = "Strong";
  } else if (margin <= 1) {
    rarityLabel = "Rare";
  }

  const comboLabel = isNotableDuo
    ? `${getSignal(dominant).shortLabel} + ${getSignal(secondary).shortLabel}`
    : null;

  const shareHook = comboLabel
    ? "Rare combination detected."
    : `${getSignal(dominant).shortLabel} Signal confirmed.`;

  return { rarityLabel, comboLabel, shareHook };
}
