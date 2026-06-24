import type { Dictionary } from "@/locales/fr";

/**
 * English dictionary. Mirrors the shape of fr.ts. EN is the scale-target locale;
 * FR ships first. Copy must follow docs/COPY_GUIDE.md.
 */
export const en: Dictionary = {
  brand: {
    tagline: "Your energy speaks before you do.",
    promise: "Reveal your Signal. Unlock your cards. Collect your identity.",
    collectionLine: "99 cards. 1 Signal. An identity to collect.",
  },
  home: {
    heroSub: "Answer 7 questions. Reveal your Signal. Unlock your first card.",
    ctaPrimary: "Reveal my Signal",
    ctaSecondary: "See the cards",
    exampleNote: "An example card — yours will be unique.",
    steps: [
      { title: "Answer", text: "7 quick questions, one per screen. No sign-up." },
      { title: "Reveal your card", text: "Your dominant Signal and the energy others feel in you." },
      { title: "Collect", text: "Keep your card, complete your collection and share your identity." },
    ],
    howTitle: "How it works",
    finalTitle: "So — what's your Signal?",
  },
  cards: {
    kicker: "SIGNAL99 CARDS",
    title: "1 Signal. 99 cards.",
    sub: "An identity to collect. Each card reveals a facet of your energy — aura, power, shadow, vision, relationship.",
    rarities: ["Common", "Rare", "Epic", "Mythic", "Legendary", "Prime", "Divine"],
    cta: "Reveal my Signal",
  },
  quiz: {
    microcopy: [
      "Follow your first instinct.",
      "No wrong answer.",
      "Your Signal is forming.",
      "Your pattern is becoming clearer.",
      "One more answer.",
      "Your card is almost ready.",
    ],
    footer: "No sign-up. 7 questions. 60 seconds.",
  },
  locked: {
    title: "Your Signal is ready.",
    body: "A unique card has been generated for you.",
    body2: "Unlock it to discover what your energy reveals.",
    cta: "Unlock my card — $0.99",
    trust: "Instant result. Secure payment. No account needed.",
    comboDetected: "Special combination detected",
    alreadyPaid: "Already paid?",
    recover: "Recover my card",
  },
  result: {
    dominant: "Your dominant Signal",
    secondary: "Your secondary Signal",
    hiddenStrength: "Your hidden strength",
    shadow: "Your soft shadow",
    socialEnergy: "Your social energy",
    advice: "Your advice for today",
    powerPhrase: "Your power phrase",
    yourCard: "Your personal card",
    revealing: "Revealing your Signal…",
  },
  collection: {
    title: "Your collection",
    revealed: "cards revealed",
    locked: "Locked",
    complete: "Complete your collection.",
    completeSub: "Unlock your 99 cards, your rare cards and the friend comparator.",
    bonusCta: "Unlock my 3 bonus cards — $2.99",
    seeCollection: "See my collection",
    collection99Cta: "Complete my Collection 99 — $9.99",
  },
  share: {
    cta: "Reveal my Signal",
    foundSignal: (signal: string) => `Someone discovered their Signal: ${signal}.`,
    whatsYours: "What's yours?",
  },
  compare: {
    cta: "Compare with a friend",
    invite: "I found my Signal. Take the test and compare with me.",
  },
};
