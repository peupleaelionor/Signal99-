/**
 * Central type definitions for SIGNAL99.
 * Kept framework-agnostic so they can be shared between client, server and API.
 */

export type SignalId =
  | "king_queen"
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

/** Actionable guidance: "What should you do with your Signal?" */
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
  /** Full display name, e.g. "King / Queen". */
  name: string;
  /** Compact label for chips / secondary mentions. */
  shortLabel: string;
  /** One emotional line summarizing the archetype. */
  tagline: string;
  /** Long introspective description. */
  description: string;
  /** Keywords describing the archetype. */
  keywords: string[];
  /** Hidden strength. */
  strengths: string;
  /** Soft shadow — the inner risk. */
  shadow: string;
  /** Social energy — how the archetype shows up around others. */
  socialEnergy: string;
  /** A short actionable line (today action). */
  advice: string;
  /** A reflective "mirror" line that makes the user feel seen. */
  mirrorPhrase: string;
  /** A punchy first-person power line. */
  powerPhrase: string;
  colors: SignalColors;
  /** Simple symbolic mark for the archetype (SVG glyph name fallback). */
  symbol: string;
  /** Path to the premium signal image for this archetype. */
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

/**
 * Personalized result content.
 *
 * Produced by the invisible AI layer after payment, OR by the premium
 * deterministic fallback. The shape matches `04_AI/ai-schema.json` so the AI
 * and the fallback are interchangeable. The user never knows which one ran.
 */
export interface PersonalizedResult {
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
}

/** Internal-only generation status. Never shown to the user. */
export type AiStatus = "pending" | "completed" | "fallback" | "failed";

export interface PersonalizationResponse {
  result: PersonalizedResult;
  /** Internal only — for analytics / debugging. */
  status: AiStatus;
}

/** Stock-keeping units for the products we sell. */
export type Sku = "signal_unlock" | "complete_pack";

/** How payment is taken. Revenue-first: payment_link ships fastest. */
export type PaymentMode = "stripe_checkout" | "payment_link" | "mock_dev";

/** Manual / semi-automatic delivery so a payer is never lost. */
export interface DeliveryContact {
  quizResultId: string;
  /** Optional — at least one of email / handle should be present. */
  email?: string;
  /** Instagram / TikTok handle. */
  handle?: string;
  /** Free-form payment reference (Stripe receipt, PayPal id...). */
  paymentReference?: string;
  dominantSignal?: SignalId;
  secondarySignal?: SignalId;
  createdAt: string;
}

/** A sellable order record, used by the admin export. */
export interface OrderRecord {
  quizResultId: string;
  status: "pending" | "manual" | "paid";
  contact: { email?: string; handle?: string };
  paymentReference?: string;
  dominantSignal?: SignalId;
  secondarySignal?: SignalId;
  createdAt: string;
  updatedAt: string;
}

/** Analytics event names used across the funnel (pack `11_ANALYTICS/events.md`). */
export type AnalyticsEvent =
  | "visitor_landed"
  | "quiz_started"
  | "question_answered"
  | "quiz_completed"
  | "locked_result_seen"
  | "result_locked_viewed"
  | "checkout_started"
  | "purchase_completed"
  | "result_unlocked_viewed"
  | "ai_generation_started"
  | "ai_generation_completed"
  | "ai_generation_fallback"
  | "card_downloaded"
  | "share_clicked"
  | "compare_clicked"
  | "share_page_viewed"
  | "referral_started"
  | "delivery_submitted"
  | "upsell_seen"
  | "upsell_clicked"
  | "upsell_purchased"
  | "test_restarted";

/** Symbolic rarity attached to a result (no fake percentages until real data). */
export type RarityLabel = "Common" | "Strong" | "Rare" | "Very rare";

export interface ResultMeta {
  rarityLabel: RarityLabel;
  /** e.g. "Visionary + Oracle" when dominant/secondary form a notable duo. */
  comboLabel: string | null;
  /** Short viral hook used on the share card / OG. */
  shareHook: string;
}
