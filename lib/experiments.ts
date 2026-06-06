/**
 * Lightweight A/B configuration.
 *
 * Variants are deterministic per-visitor (stable bucketing), so a user always
 * sees the same hero/CTA. Wire a real experimentation tool later; for now this
 * centralizes the copy under test.
 */

export interface Variant {
  heroTitle: string;
  heroSubtitle: string;
  ctaLabel: string;
}

export const VARIANTS: Record<"A" | "B", Variant> = {
  A: {
    heroTitle: "What’s your Signal?",
    heroSubtitle:
      "Your energy speaks before you do. Answer 7 questions and reveal the card that reflects your presence.",
    ctaLabel: "Reveal my Signal",
  },
  B: {
    heroTitle: "Reveal the energy people feel before you speak.",
    heroSubtitle:
      "7 questions are enough to reveal your dominant Signal and your personal card.",
    ctaLabel: "Reveal my Signal",
  },
};

/** Stable hash → bucket. Falls back to A on the server / first paint. */
export function getVariant(seed?: string): Variant {
  if (!seed) return VARIANTS.A;
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return h % 2 === 0 ? VARIANTS.A : VARIANTS.B;
}
