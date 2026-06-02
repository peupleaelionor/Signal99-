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

/** Stored representation of a completed quiz (client + optional DB). */
export interface QuizResultRecord {
  id: string;
  createdAt: string;
  answers: Record<number, string>;
  scores: Scores;
  dominantSignal: SignalId;
  secondarySignal: SignalId;
  isPaid: boolean;
  paymentId: string | null;
  shareSlug: string | null;
  /** Non-guessable token authorizing access to this result. */
  resultToken: string;
  /** Symbolic rarity / combo metadata (result_payload). */
  meta: ResultMeta;
}

/** Analytics event names used across the funnel. */
export type AnalyticsEvent =
  | "visitor_landed"
  | "quiz_started"
  | "question_answered"
  | "quiz_completed"
  | "result_locked_viewed"
  | "checkout_started"
  | "purchase_completed"
  | "upsell_seen"
  | "upsell_purchased"
  | "result_unlocked_viewed"
  | "card_downloaded"
  | "share_clicked"
  | "share_page_viewed"
  | "referral_started"
  | "test_restarted";

/** Symbolic rarity attached to a result (no fake percentages until real data). */
export type RarityLabel = "Commun" | "Fort" | "Rare" | "Très rare";

export interface ResultMeta {
  rarityLabel: RarityLabel;
  /** e.g. "Visionnaire + Oracle" when dominant/secondary form a notable duo. */
  comboLabel: string | null;
  /** Short viral hook used on the share card / OG. */
  shareHook: string;
}
