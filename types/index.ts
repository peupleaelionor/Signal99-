/**
 * Central type definitions for SIGNAL99.
 * Kept framework-agnostic so they can be shared between client, server and API.
 */

export type SignalId =
  | "sovereign"
  | "strategist"
  | "visionary"
  | "builder"
  | "rebel"
  | "protector"
  | "oracle";

export interface SignalColors {
  /** Primary aura color (hex). */
  aura: string;
  /** Accent color used for the symbol / highlights (hex). */
  accent: string;
}

/** Data used to render the shareable vertical card. */
export interface CardTemplateData {
  /** Single glyph / emoji-free unicode symbol used as the visual mark. */
  glyph: string;
  /** Short keyword line printed under the title on the card. */
  keywords: string[];
}

/** Actionable guidance: "Que faire avec ton Signal ?" */
export interface SignalGuidance {
  /** One concrete action for today. */
  todayAction: string;
  /** Focus for the week. */
  weekFocus: string;
  /** What to avoid. */
  avoid: string;
  /** Themes worth exploring. */
  explore: string[];
  /** Lifestyle categories for recommendations. */
  recommendedCategories: string[];
  /** Tone line used to frame product placement (never deceptive). */
  productPlacementTone: string;
}

/** A recommended product/resource. Commercial ones MUST carry a disclosure. */
export interface SignalProduct {
  name: string;
  url: string;
  category: string;
  /** Commercial relationship — drives the visible disclosure label. */
  disclosure?: "affiliate" | "sponsored" | "partner";
}

export interface Signal {
  id: SignalId;
  /** Full display name, e.g. "Le Visionnaire". */
  name: string;
  /** Compact label for chips / secondary mentions. */
  shortLabel: string;
  /** One emotional line summarizing the archetype. */
  tagline: string;
  /** Long introspective description. */
  description: string;
  /** Keywords describing the archetype. */
  keywords: string[];
  /** "Force cachée" — hidden strength. */
  strengths: string;
  /** "Danger intérieur" — inner shadow. */
  shadow: string;
  /** "Énergie sociale" — how the archetype shows up around others. */
  socialEnergy: string;
  /** "Conseil du jour" — actionable advice. */
  advice: string;
  /** "Phrase de pouvoir" — a punchy first-person power line. */
  powerPhrase: string;
  colors: SignalColors;
  /** Simple symbolic mark for the archetype (SVG glyph name fallback). */
  symbol: string;
  /** Path to the premium brand emblem (badge PNG) for this archetype. */
  image: string;
  /** Ready-to-share text for social / messaging apps. */
  shareText: string;
  cardTemplateData: CardTemplateData;
  guidance: SignalGuidance;
}

export interface QuizOption {
  id: string;
  label: string;
  /** Weighted points awarded to one or more signals. */
  weights: Partial<Record<SignalId, number>>;
}

export interface QuizQuestion {
  id: number;
  prompt: string;
  options: QuizOption[];
}

export type Scores = Record<SignalId, number>;

export interface QuizOutcome {
  scores: Scores;
  dominant: SignalId;
  secondary: SignalId;
}

/**
 * Client-side representation of a completed quiz.
 *
 * SECURITY: this NEVER contains the dominant Signal or raw scores before
 * payment — those are computed and held server-side, and only revealed through
 * the paid /api/personalize response. The client keeps the raw answers (its own
 * input), non-guessable ids, and a non-revealing rarity teaser.
 */
export interface QuizResultRecord {
  id: string;
  createdAt: string;
  answers: Record<number, string>;
  isPaid: boolean;
  paymentId: string | null;
  shareSlug: string | null;
  /** Non-guessable token authorizing access to this result. */
  resultToken: string;
  /** Deterministic seed for the card collection (foils, ordering). */
  collectionSeed: string;
  /** Non-revealing rarity label for the locked teaser (no Signal name). */
  rarityLabel: RarityLabel | null;
  /** Whether a notable duo was detected (no names — teaser only). */
  hasCombo: boolean;
  /** Revealed only after payment (cached from the server response, UX only). */
  dominantSignal: SignalId | null;
  secondarySignal: SignalId | null;
  /** Cached personalized payload (AI or template). Null until generated. */
  personalization?: SignalPersonalization | null;
}

/** Analytics event names used across the funnel. */
export type AnalyticsEvent =
  | "visitor_landed"
  | "quiz_started"
  | "question_answered"
  | "quiz_completed"
  | "ai_generation_started"
  | "ai_generation_completed"
  | "ai_generation_fallback"
  | "ai_pregenerate_enabled"
  | "result_locked_viewed"
  | "checkout_started"
  | "purchase_completed"
  | "upsell_seen"
  | "upsell_clicked"
  | "upsell_purchased"
  | "result_unlocked_viewed"
  | "card_downloaded"
  | "share_clicked"
  | "compare_clicked"
  | "share_page_viewed"
  | "referral_started"
  | "delivery_submitted"
  | "test_restarted";

/** Symbolic rarity attached to a result (no fake percentages until real data). */
export type RarityLabel = "Commun" | "Fort" | "Rare" | "Très rare";

/**
 * Personalized result payload.
 * Produced by the (invisible) AI layer, or by the deterministic template
 * fallback. The dominant/secondary signals are ALWAYS set from the fixed quiz
 * scoring — the AI only personalizes the prose, never the archetype.
 */
export interface SignalPersonalization {
  dominantSignal: SignalId;
  secondarySignal: SignalId;
  mirrorPhrase: string;
  hiddenStrength: string;
  softShadow: string;
  socialEnergy: string;
  todayAction: string;
  weekFocus: string;
  avoid: string;
  explore: string[];
  recommendedCategories: string[];
  productPlacementTone: string;
  powerPhrase: string;
  publicShareText: string;
  premiumCardTitle: string;
  premiumCardText: string;
  lockscreenText: string;
  ogTitle: string;
  ogDescription: string;
  upsellTitle: string;
  upsellDescription: string;
  /** Where this came from — never shown to the user. */
  source: "ai" | "template";
}

/** Internal AI lifecycle status. Never displayed to the user. */
export type AiStatus = "pending" | "completed" | "fallback" | "failed";

export interface ResultMeta {
  rarityLabel: RarityLabel;
  /** e.g. "Visionnaire + Oracle" when dominant/secondary form a notable duo. */
  comboLabel: string | null;
  /** Short viral hook used on the share card / OG. */
  shareHook: string;
}

// ── Cards system ───────────────────────────────────────────────────────────

/** Collectible rarity tiers (rarest last). */
export type CardRarity =
  | "commune"
  | "rare"
  | "epique"
  | "mythique"
  | "legendaire"
  | "prime"
  | "divine";

export const CARD_RARITIES: CardRarity[] = [
  "commune",
  "rare",
  "epique",
  "mythique",
  "legendaire",
  "prime",
  "divine",
];

/** Card facet categories. */
export type CardCategory =
  | "identite"
  | "aura"
  | "pouvoir"
  | "ombre"
  | "destin"
  | "relation"
  | "argent"
  | "charisme"
  | "discipline"
  | "vision"
  | "protection"
  | "comparaison"
  | "lockscreen"
  | "edition_speciale";

/**
 * A collectible card. Part of a 99-card deck attached to a Signal.
 * Three copy layers: public (viral), premium (paid depth), lockscreen (keepsake).
 */
export interface Card {
  id: string;
  signal: SignalId;
  /** Position in the Signal deck, 1..99. */
  cardNumber: number;
  name: string;
  slug: string;
  category: CardCategory;
  rarity: CardRarity;
  edition: string;
  /** Abstract glyph mark name (original, never a real brand/logo). */
  symbol: string;
  /** Short, shareable, not too intimate. */
  publicCopy: string;
  /** Deeper reading, revealed after payment. */
  premiumCopy: string;
  /** Teaser shown while the card is locked. */
  lockedCopy: string;
  /** Ready-to-share line. */
  shareCopy: string;
  /** Very short vertical-card keepsake line. */
  lockscreenCopy: string;
  attributes?: Record<string, number>;
  compatibilityTags?: string[];
  isPublic: boolean;
  isPremium: boolean;
}

/** A card as owned by a given result (unlock state + cosmetic foil roll). */
export interface UserCard {
  cardId: string;
  cardNumber: number;
  unlocked: boolean;
  /** Cosmetic foil intensity 0..1, deterministic from the collection seed. */
  rarityRoll: number;
  source: "signal_unlock" | "bonus_pack" | "complete_pack" | "collection_99";
}
