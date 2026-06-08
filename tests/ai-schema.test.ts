import { describe, it, expect } from "vitest";
import { PersonalizationSchema } from "@/lib/ai/schema";

const VALID = {
  dominantSignal: "visionary",
  secondarySignal: "oracle",
  mirrorPhrase: "Tu sens l'ouverture avant qu'elle existe.",
  hiddenStrength: "Voir des portes là où d'autres voient des murs.",
  softShadow: "Vivre dans trop de futurs à la fois.",
  socialEnergy: "On sent une possibilité autour de toi.",
  todayAction: "Donne une forme visible à une seule vision.",
  weekFocus: "Choisis une direction et avance.",
  avoid: "Te disperser entre dix idées.",
  explore: ["vision", "design", "création"],
  recommendedCategories: ["outils créatifs", "journal", "moodboard"],
  productPlacementTone: "Discret, utile, jamais intrusif.",
  powerPhrase: "Je n'attends pas qu'on comprenne. Je construis.",
  publicShareText: "Mon Signal est le Visionnaire.",
  premiumCardTitle: "Le Visionnaire",
  premiumCardText: "Tu vois avant les autres.",
  lockscreenText: "Visionnaire",
  ogTitle: "Je suis le Visionnaire.",
  ogDescription: "Découvre ton Signal en 7 questions.",
  upsellTitle: "Va plus loin",
  upsellDescription: "Débloque ta direction complète.",
};

describe("PersonalizationSchema", () => {
  it("accepts a complete, well-formed payload", () => {
    const parsed = PersonalizationSchema.safeParse(VALID);
    expect(parsed.success).toBe(true);
  });

  it("rejects an empty object", () => {
    expect(PersonalizationSchema.safeParse({}).success).toBe(false);
  });

  it("rejects an invalid signal id", () => {
    const parsed = PersonalizationSchema.safeParse({
      ...VALID,
      dominantSignal: "wizard",
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects too few explore items", () => {
    const parsed = PersonalizationSchema.safeParse({
      ...VALID,
      explore: ["one", "two"],
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects an over-long power phrase", () => {
    const parsed = PersonalizationSchema.safeParse({
      ...VALID,
      powerPhrase: "x".repeat(200),
    });
    expect(parsed.success).toBe(false);
  });
});
