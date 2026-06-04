import { z } from "zod";
import { SIGNAL_ORDER } from "@/data/signals";
import type { SignalId } from "@/types";

const signalEnum = z.enum(SIGNAL_ORDER as [SignalId, ...SignalId[]]);

/**
 * Zod schema validating the AI (or fallback) personalization payload.
 * Short, premium fields suitable for a mobile result page + shareable cards.
 */
export const PersonalizationSchema = z.object({
  dominantSignal: signalEnum,
  secondarySignal: signalEnum,
  mirrorPhrase: z.string().min(1).max(400),
  hiddenStrength: z.string().min(1).max(280),
  softShadow: z.string().min(1).max(280),
  socialEnergy: z.string().min(1).max(280),
  todayAction: z.string().min(1).max(240),
  weekFocus: z.string().min(1).max(240),
  avoid: z.string().min(1).max(240),
  explore: z.array(z.string().min(1).max(40)).min(3).max(8),
  recommendedCategories: z.array(z.string().min(1).max(60)).min(3).max(6),
  productPlacementTone: z.string().min(1).max(200),
  powerPhrase: z.string().min(1).max(160),
  publicShareText: z.string().min(1).max(200),
  premiumCardTitle: z.string().min(1).max(80),
  premiumCardText: z.string().min(1).max(200),
  lockscreenText: z.string().min(1).max(80),
  ogTitle: z.string().min(1).max(80),
  ogDescription: z.string().min(1).max(160),
  upsellTitle: z.string().min(1).max(80),
  upsellDescription: z.string().min(1).max(240),
});

export type PersonalizationModel = z.infer<typeof PersonalizationSchema>;

const STRING_FIELDS = [
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
] as const;

/**
 * JSON Schema sent to the Messages API via `output_config.format`.
 * Kept in sync with the zod schema above. Structured outputs require every
 * property in `required` and `additionalProperties: false`; length constraints
 * are omitted (unsupported there) and enforced by zod after parsing.
 */
export const personalizationJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dominantSignal: { type: "string", enum: SIGNAL_ORDER },
    secondarySignal: { type: "string", enum: SIGNAL_ORDER },
    explore: { type: "array", items: { type: "string" } },
    recommendedCategories: { type: "array", items: { type: "string" } },
    ...Object.fromEntries(STRING_FIELDS.map((f) => [f, { type: "string" }])),
  },
  required: [
    "dominantSignal",
    "secondarySignal",
    "explore",
    "recommendedCategories",
    ...STRING_FIELDS,
  ],
} as const;
