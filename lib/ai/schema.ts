import type { PersonalizedResult } from "@/types";

/**
 * Shape of the personalized result, matching the pack `04_AI/ai-schema.json`.
 * Dependency-free validation (no zod) keeps the bundle lean.
 */

export const REQUIRED_STRING_FIELDS: (keyof PersonalizedResult)[] = [
  "dominantSignal",
  "secondarySignal",
  "mirrorPhrase",
  "hiddenStrength",
  "softShadow",
  "socialEnergy",
  "todayAction",
  "weekFocus",
  "avoid",
  "productPlacementTone",
  "powerPhrase",
  "publicShareText",
  "premiumCardTitle",
  "premiumCardText",
  "lockscreenText",
  "ogTitle",
  "ogDescription",
  "upsellTitle",
  "upsellDescription",
];

export const REQUIRED_ARRAY_FIELDS: (keyof PersonalizedResult)[] = [
  "explore",
  "recommendedCategories",
];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);
}

/** Structural check only (presence + types). Quality is checked separately. */
export function isPersonalizedResultShape(data: unknown): data is PersonalizedResult {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;

  for (const field of REQUIRED_STRING_FIELDS) {
    if (!isNonEmptyString(obj[field])) return false;
  }
  for (const field of REQUIRED_ARRAY_FIELDS) {
    if (!isStringArray(obj[field])) return false;
  }
  return true;
}
