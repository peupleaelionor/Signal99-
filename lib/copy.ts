/**
 * SIGNAL99 — central copy.
 *
 * English-primary, premium, mobile-first. Short lines, rhythm, space.
 * Follows the Premium Psychological Copy Engine + the pack `05_COPY/*`.
 * The AI is invisible: nothing here ever mentions AI, prediction, diagnosis,
 * astrology or fortune-telling.
 */

export const BRAND = {
  name: "SIGNAL99",
  handle: "@signal99vibes",
  centralPhrase: "Your energy speaks before you do.",
  promise: "What’s your Signal?",
  finalPromise: "Reveal your Signal. Keep your card. Share your identity.",
  themeColor: "#050505",
} as const;

export const LANDING = {
  title: "What’s your Signal?",
  subtitle:
    "Your energy speaks before you do. Answer 7 questions and reveal the card that reflects your presence.",
  cta: "Reveal my Signal",
  secondaryCta: "See the 7 Signals",
  trustBar: ["60 seconds", "Unique card", "Secure payment", "No account needed"],
  emotional:
    "People feel something from you before you even speak. SIGNAL99 turns that invisible presence into a personal card.",
  howItWorks: ["Answer 7 questions.", "Unlock your Signal.", "Share your card."],
  signalsTitle: "The 7 Signals. One of them is yours.",
} as const;

export const QUIZ_MICROCOPY = {
  instinct: "Follow your first instinct.",
  noWrong: "No wrong answer.",
  forming: "Your Signal is forming.",
  reading: ["Reading your pattern…", "Your Signal is taking shape…", "Your card is almost ready…"],
} as const;

export const LOCKED = {
  title: "Your Signal is ready.",
  subtitle:
    "Your answers reveal a clear dominant presence. Something in your energy leaves a trace before you explain yourself.",
  body:
    "Unlock your Signal to reveal your hidden strength, your soft shadow, your direction, and your personal card.",
  cta: "Unlock my card — $0.99",
  trust: "Instant result. Secure payment. No account needed.",
} as const;

export const UNLOCKED = {
  revealLead: "Your Signal is…",
  guidanceTitle: "What should you do with your Signal?",
  guidanceSubtitle: "Your Signal is not only who you are. It is a direction.",
  guidanceBlocks: {
    today: "One precise action aligned with your energy.",
    week: "One focus to strengthen your Signal.",
    avoid: "One pattern that weakens your presence.",
    explore: "Resources that fit the way you move.",
  },
  afterPayment: ["Your card is unlocked.", "Your Signal is now yours.", "Keep it. Share it. Compare it."],
  shareInvite: "Send this to someone and ask: What’s yours?",
} as const;

export const DELIVERY = {
  title: "Your card is being prepared.",
  body:
    "If the automatic unlock fails, enter your email or Instagram handle and we’ll send your Signal card.",
  emailLabel: "Email (optional)",
  handleLabel: "Instagram / TikTok handle (optional)",
  refLabel: "Payment reference (optional)",
  cta: "Send me my card",
  success: "Saved. Your Signal card is on its way.",
} as const;

export const CTA = {
  reveal: "Reveal my Signal",
  unlock: "Unlock my card",
  share: "Share my Signal",
  download: "Download my card",
  compare: "Compare with a friend",
  seeSignals: "See the 7 Signals",
  fullGuide: "Unlock my full guide",
} as const;

export const LEGAL_DISCLAIMER =
  "SIGNAL99 is a symbolic and introspective experience for entertainment and self-reflection. Results are not scientific, medical, psychological, financial, or spiritual advice.";

export const LEGAL_DISCLAIMER_FR =
  "SIGNAL99 est une expérience symbolique et introspective destinée au divertissement et au développement personnel. Les résultats ne constituent pas une vérité scientifique, médicale, psychologique, financière ou spirituelle.";
