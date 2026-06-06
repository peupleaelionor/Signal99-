import type { Signal, SignalId } from "@/types";

/**
 * The 7 Signals — central source of truth.
 *
 * Copy follows the SIGNAL99 pack (02_PRODUCT/signals.json) and the Premium
 * Psychological Copy Engine. Texts are written as introspective / symbolic
 * mirrors — never astrology, fortune-telling, diagnosis, medical, financial or
 * absolute claims. Short, dense, premium, shareable.
 */
export const SIGNALS: Record<SignalId, Signal> = {
  king_queen: {
    id: "king_queen",
    name: "King / Queen",
    shortLabel: "King / Queen",
    tagline: "You don’t force your place. People feel when you enter.",
    description:
      "When you arrive, something realigns. You carry a presence that makes people adjust before you speak.",
    keywords: ["Presence", "Authority", "Magnetism"],
    strengths: "You know how to become the center without asking for permission.",
    shadow: "Your risk is carrying the crown alone.",
    socialEnergy:
      "You carry a presence that makes people adjust, even before you speak.",
    advice: "Choose where your presence is needed. Then take your place calmly.",
    mirrorPhrase: "You don’t force your place. People feel when you enter.",
    powerPhrase: "I don’t chase the center. I become it.",
    colors: { aura: "#D8B46A", accent: "#C17D3C" },
    symbol: "crown",
    image: "/signals/king-queen.png",
    shareText:
      "I’m King / Queen. People feel when I enter. What’s your Signal?",
    cardTemplateData: {
      glyph: "crown",
      keywords: ["Presence", "Authority", "Magnetism"],
    },
    guidance: {
      todayAction: "Claim one position clearly today.",
      weekFocus: "Refine your image, voice and presence.",
      avoid: "Trying to carry everything alone.",
      explore: [
        "style",
        "fragrance",
        "public speaking",
        "leadership books",
        "premium accessories",
      ],
      recommendedCategories: [
        "Style",
        "Fragrance",
        "Leadership",
        "Public speaking",
        "Premium accessories",
      ],
      productPlacementTone: "Your Signal speaks through presence.",
    },
  },
  strategist: {
    id: "strategist",
    name: "Strategist",
    shortLabel: "Strategist",
    tagline: "You read what others miss.",
    description:
      "You observe before you act. You see the hidden structure behind a situation while others only react.",
    keywords: ["Lucidity", "Patience", "Vision"],
    strengths: "You can see the hidden structure behind a situation.",
    shadow:
      "Your risk is waiting so long for the right move that the moment passes.",
    socialEnergy:
      "People may think you are quiet, but you are mapping everything.",
    advice: "Name the real objective. Then make one precise move.",
    mirrorPhrase: "You don’t react fast. You read what others miss.",
    powerPhrase: "I don’t move fast. I move right.",
    colors: { aura: "#3A8DFF", accent: "#14213D" },
    symbol: "compass",
    image: "/signals/strategist.png",
    shareText: "I’m Strategist. I read what others miss. What’s your Signal?",
    cardTemplateData: {
      glyph: "compass",
      keywords: ["Lucidity", "Patience", "Vision"],
    },
    guidance: {
      todayAction: "Pause before answering and define the real objective.",
      weekFocus: "Create a simple plan for one important decision.",
      avoid: "Thinking so much that movement disappears.",
      explore: [
        "planning tools",
        "strategy books",
        "productivity apps",
        "dashboards",
        "financial education",
      ],
      recommendedCategories: [
        "Productivity",
        "Strategy",
        "Finance education",
        "Dashboards",
        "Planning",
      ],
      productPlacementTone: "Your Signal speaks through clarity.",
    },
  },
  visionary: {
    id: "visionary",
    name: "Visionary",
    shortLabel: "Visionary",
    tagline: "You feel the future before it becomes obvious.",
    description:
      "You see openings where others only see walls. You make another future feel possible.",
    keywords: ["Vision", "Instinct", "Creation"],
    strengths: "You see openings where others only see walls.",
    shadow: "Your risk is living inside too many futures at once.",
    socialEnergy:
      "People feel possibility around you, even when they don’t understand your vision yet.",
    advice: "Choose one vision. Give it a visible shape today.",
    mirrorPhrase: "You feel the future before it becomes obvious.",
    powerPhrase: "I don’t wait for the world to understand. I build.",
    colors: { aura: "#B47AE0", accent: "#2B183F" },
    symbol: "horizon",
    image: "/signals/visionary.png",
    shareText:
      "I’m Visionary. I feel the future before it becomes obvious. What’s your Signal?",
    cardTemplateData: {
      glyph: "horizon",
      keywords: ["Vision", "Instinct", "Creation"],
    },
    guidance: {
      todayAction: "Choose one idea and write the next three steps.",
      weekFocus: "Turn one vision into something visible.",
      avoid: "Starting five projects before shaping one.",
      explore: [
        "vision journal",
        "AI tools",
        "moodboard tools",
        "creative courses",
        "design software",
      ],
      recommendedCategories: [
        "Journaling",
        "Creative tools",
        "Moodboards",
        "Creative courses",
        "Design",
      ],
      productPlacementTone: "Your Signal speaks through vision.",
    },
  },
  builder: {
    id: "builder",
    name: "Builder",
    shortLabel: "Builder",
    tagline: "You turn ideas into something real.",
    description:
      "You make people believe something can actually be built. You transform pressure into progress.",
    keywords: ["Structure", "Endurance", "Form"],
    strengths: "You can transform pressure into progress.",
    shadow: "Your risk is building so much that you forget to look up.",
    socialEnergy:
      "People feel stability around you because you know how to create structure.",
    advice: "Choose one foundation. Strengthen it before adding more.",
    mirrorPhrase: "You turn ideas into something real.",
    powerPhrase: "What I begin, I can raise.",
    colors: { aura: "#C17D3C", accent: "#8A5A2B" },
    symbol: "pillar",
    image: "/signals/builder.png",
    shareText: "I’m Builder. I turn ideas into something real. What’s your Signal?",
    cardTemplateData: {
      glyph: "pillar",
      keywords: ["Structure", "Endurance", "Form"],
    },
    guidance: {
      todayAction: "Turn one idea into a concrete task today.",
      weekFocus: "Build a repeatable system instead of relying on motivation.",
      avoid: "Confusing effort with structure.",
      explore: [
        "project tools",
        "skill courses",
        "workspace equipment",
        "finance tools",
        "productivity systems",
      ],
      recommendedCategories: [
        "Project management",
        "Courses",
        "Workspace",
        "Finance tools",
        "Systems",
      ],
      productPlacementTone: "Your Signal speaks through what you build.",
    },
  },
  rebel: {
    id: "rebel",
    name: "Rebel",
    shortLabel: "Rebel",
    tagline: "You are not hard to understand. You simply refuse cages.",
    description:
      "You make fixed things feel breakable. You open doors others were taught not to touch.",
    keywords: ["Freedom", "Audacity", "Movement"],
    strengths: "You can open doors others were taught not to touch.",
    shadow: "Your risk is confusing freedom with escape.",
    socialEnergy:
      "People feel movement around you. You make fixed things feel breakable.",
    advice: "Break one false rule. Keep one true commitment.",
    mirrorPhrase: "You are not hard to understand. You simply refuse cages.",
    powerPhrase: "I wasn’t born to fit the frame.",
    colors: { aura: "#FF6B4A", accent: "#C1432C" },
    symbol: "bolt",
    image: "/signals/rebel.png",
    shareText: "I’m Rebel. I refuse cages. What’s your Signal?",
    cardTemplateData: {
      glyph: "bolt",
      keywords: ["Freedom", "Audacity", "Movement"],
    },
    guidance: {
      todayAction: "Name one rule you no longer need to obey.",
      weekFocus: "Channel your freedom into one creative move.",
      avoid: "Breaking everything without building your path.",
      explore: [
        "creator gear",
        "fashion",
        "travel",
        "independent work tools",
        "music tools",
      ],
      recommendedCategories: [
        "Creator gear",
        "Fashion",
        "Travel",
        "Music",
        "Independence",
      ],
      productPlacementTone: "Your Signal speaks through movement.",
    },
  },
  protector: {
    id: "protector",
    name: "Protector",
    shortLabel: "Protector",
    tagline: "Your strength is not always loud. It shows in what you protect.",
    description:
      "You make people feel safe without needing to dominate. You hold space without needing attention.",
    keywords: ["Loyalty", "Calm", "Courage"],
    strengths: "You can hold space without needing attention.",
    shadow: "Your risk is protecting everyone while abandoning yourself.",
    socialEnergy: "People feel safer around you, even when you say little.",
    advice: "Protect one boundary today. Your peace also matters.",
    mirrorPhrase:
      "Your strength is not always loud. It shows in what you protect.",
    powerPhrase: "My softness does not cancel my power.",
    colors: { aura: "#5BC0A8", accent: "#2E7D6B" },
    symbol: "shield",
    image: "/signals/protector.png",
    shareText:
      "I’m Protector. My softness does not cancel my power. What’s your Signal?",
    cardTemplateData: {
      glyph: "shield",
      keywords: ["Loyalty", "Calm", "Courage"],
    },
    guidance: {
      todayAction: "Protect one boundary today.",
      weekFocus: "Give without abandoning yourself.",
      avoid: "Carrying everyone’s emotions as your duty.",
      explore: [
        "wellness",
        "sleep",
        "home comfort",
        "relationship books",
        "digital security",
      ],
      recommendedCategories: [
        "Wellness",
        "Sleep",
        "Home",
        "Relationships",
        "Security",
      ],
      productPlacementTone: "Your Signal speaks through what you protect.",
    },
  },
  oracle: {
    id: "oracle",
    name: "Oracle",
    shortLabel: "Oracle",
    tagline: "You often feel what others understand too late.",
    description:
      "You bring depth and make the invisible feel present. You read silence, shifts and unspoken tension.",
    keywords: ["Perception", "Depth", "Silence"],
    strengths: "You can read silence, shifts and invisible tension.",
    shadow: "Your risk is staying too long in the invisible.",
    socialEnergy:
      "People sense depth around you, even when they cannot name it.",
    advice:
      "Write what you feel. Then turn one intuition into a clear decision.",
    mirrorPhrase: "You often feel what others understand too late.",
    powerPhrase: "What I feel already carries a form of truth.",
    colors: { aura: "#7A8DFF", accent: "#2B183F" },
    symbol: "moon",
    image: "/signals/oracle.png",
    shareText:
      "I’m Oracle. I feel what others understand too late. What’s your Signal?",
    cardTemplateData: {
      glyph: "moon",
      keywords: ["Perception", "Depth", "Silence"],
    },
    guidance: {
      todayAction: "Write down what you feel before trying to explain it.",
      weekFocus: "Turn one intuition into a clear decision.",
      avoid: "Mistaking silence for clarity when action is needed.",
      explore: [
        "journaling",
        "meditation",
        "ambient music",
        "writing courses",
        "symbolic objects",
      ],
      recommendedCategories: [
        "Journaling",
        "Meditation",
        "Writing",
        "Ambient music",
        "Symbolic objects",
      ],
      productPlacementTone: "Your Signal speaks through depth.",
    },
  },
};

/**
 * Canonical priority order. Used as the final, stable tie-breaker so identical
 * answers always resolve to the same Signal (pack scoring-logic.md).
 */
export const SIGNAL_ORDER: SignalId[] = [
  "king_queen",
  "strategist",
  "visionary",
  "builder",
  "rebel",
  "protector",
  "oracle",
];

export const ALL_SIGNALS: Signal[] = SIGNAL_ORDER.map((id) => SIGNALS[id]);

export function getSignal(id: SignalId): Signal {
  return SIGNALS[id];
}

/** Type guard / safe lookup for untrusted string ids. */
export function isSignalId(value: string): value is SignalId {
  return value in SIGNALS;
}
