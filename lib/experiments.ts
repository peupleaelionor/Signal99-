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
    heroTitle: "Quel est ton Signal ?",
    heroSubtitle:
      "Réponds à 7 questions et découvre l'énergie dominante que les autres ressentent chez toi.",
    ctaLabel: "Commencer le test",
  },
  B: {
    heroTitle: "Découvre l'énergie que les autres ressentent chez toi.",
    heroSubtitle:
      "7 questions suffisent pour révéler ton Signal dominant et ta carte personnelle.",
    ctaLabel: "Révéler mon Signal",
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
