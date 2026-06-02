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
  "sovereign+rebel": true,
  "rebel+sovereign": true,
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

  let rarityLabel: RarityLabel = "Commun";
  if (isNotableDuo) {
    rarityLabel = margin <= 2 ? "Très rare" : "Rare";
  } else if (margin >= 5) {
    rarityLabel = "Fort";
  } else if (margin <= 1) {
    rarityLabel = "Rare";
  }

  const comboLabel = isNotableDuo
    ? `${getSignal(dominant).shortLabel} + ${getSignal(secondary).shortLabel}`
    : null;

  const shareHook = comboLabel
    ? "Combinaison spéciale détectée."
    : `Signal ${getSignal(dominant).shortLabel} confirmé.`;

  return { rarityLabel, comboLabel, shareHook };
}
