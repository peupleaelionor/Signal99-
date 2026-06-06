import type { PersonalizedResult } from "@/types";
import { isPersonalizedResultShape } from "@/lib/ai/schema";

/**
 * Copy quality + safety filter.
 *
 * Rejects text that sounds cheap, generic, fear-based, predictive, medical,
 * financial, or that breaks the brand voice. Used to validate AI output before
 * it is ever shown — if it fails, the premium fallback is used instead.
 */

const BANNED_PATTERNS: RegExp[] = [
  /\bmagic\b/i,
  /\bprediction(s)?\b/i,
  /\bpredict(s|ed|ing)?\b/i,
  /\bdestiny\s+guaranteed\b/i,
  /\bguarantee(d|s)?\b/i,
  /\bdiagnos(is|e|ed|tic)\b/i,
  /\btrauma\b/i,
  /\b(mental\s+)?disorder\b/i,
  /\btherapy\b/i,
  /\bsoulmate\b/i,
  /\bfate\b/i,
  /\bcurse(d)?\b/i,
  /\bhoroscope\b/i,
  /\bfortune[-\s]?telling\b/i,
  /\bwealth\s+guaranteed\b/i,
];

// Commercial verbs that must never appear in the user-facing copy itself.
const BANNED_CTA_WORDS: RegExp[] = [/\bbuy\b/i, /\bpurchase\b/i, /\bgenerate(d|s)?\b/i];

const MAX_LINE_LENGTH = 200;

export interface QualityCheck {
  ok: boolean;
  reasons: string[];
}

/** Quality filter for a single piece of copy. */
export function qualityCheckCopy(text: string): QualityCheck {
  const reasons: string[] = [];

  if (!text || !text.trim()) {
    return { ok: false, reasons: ["empty"] };
  }
  if (text.length > MAX_LINE_LENGTH) {
    reasons.push("too_long");
  }
  for (const pattern of BANNED_PATTERNS) {
    if (pattern.test(text)) reasons.push(`banned:${pattern.source}`);
  }
  for (const pattern of BANNED_CTA_WORDS) {
    if (pattern.test(text)) reasons.push(`cta:${pattern.source}`);
  }

  return { ok: reasons.length === 0, reasons };
}

// Fields whose length should stay tight (mobile-first, readable in <5s).
const QUALITY_CHECKED_FIELDS: (keyof PersonalizedResult)[] = [
  "mirrorPhrase",
  "hiddenStrength",
  "softShadow",
  "socialEnergy",
  "todayAction",
  "weekFocus",
  "avoid",
  "powerPhrase",
  "publicShareText",
  "premiumCardText",
  "lockscreenText",
];

/**
 * Validate a candidate personalized result (shape + quality).
 * Returns the typed result if valid, otherwise null so the caller can fall back.
 */
export function validatePersonalizedResult(data: unknown): PersonalizedResult | null {
  if (!isPersonalizedResultShape(data)) return null;

  for (const field of QUALITY_CHECKED_FIELDS) {
    const value = data[field];
    if (typeof value === "string" && !qualityCheckCopy(value).ok) {
      return null;
    }
  }
  return data;
}
