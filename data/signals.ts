import type { Signal, SignalId } from "@/types";

/**
 * The 7 Signals — central source of truth.
 * Copy follows the SIGNAL99 product pack. Texts are written as introspective /
 * symbolic readings (no medical, scientific, spiritual-absolute or predictive
 * claims).
 */
export const SIGNALS: Record<SignalId, Signal> = {
  sovereign: {
    id: "sovereign",
    name: "Le Roi / La Reine",
    shortLabel: "Roi / Reine",
    tagline: "Tu imposes sans forcer.",
    description:
      "Quand tu entres quelque part, quelque chose se réaligne. Tu portes une autorité naturelle — pas celle qui crie, celle qui rassure et qui ordonne le chaos. Ton énergie prend de la place avant même que tu parles.",
    keywords: ["présence", "autorité", "ambition", "leadership", "magnétisme"],
    strengths: "Ta présence prend de la place avant même que tu ouvres la bouche.",
    shadow: "Vouloir tout porter seul.",
    socialEnergy:
      "Tu deviens vite le centre de gravité d'un groupe, sans avoir à le demander.",
    advice: "Aujourd'hui, délègue une seule chose que tu aurais gardée pour toi.",
    powerPhrase: "Je ne cherche pas la place. Je deviens le centre.",
    colors: { aura: "#D8B46A", accent: "#C17D3C" },
    symbol: "crown",
    image: "/brand/signals/sovereign.png",
    shareText:
      "Mon Signal est Le Roi / La Reine : présence, autorité, magnétisme. Et toi, quel est ton Signal ?",
    cardTemplateData: {
      glyph: "crown",
      keywords: ["Présence", "Autorité", "Ambition"],
    },
  },
  strategist: {
    id: "strategist",
    name: "Le Stratège",
    shortLabel: "Stratège",
    tagline: "Tu vois les coups avant les autres.",
    description:
      "Tu observes avant d'agir. Là où d'autres réagissent, tu lis la pièce, tu attends, tu choisis ton moment. Ta patience n'est pas de la lenteur : c'est une arme.",
    keywords: ["lucidité", "intelligence", "patience", "vision", "calcul"],
    strengths: "Tu vois la mécanique cachée derrière les situations.",
    shadow: "Trop calculer au lieu d'agir.",
    socialEnergy:
      "Tu es celui ou celle qu'on vient consulter quand la situation se complique.",
    advice: "Pose une action imparfaite aujourd'hui, sans tout recalculer.",
    powerPhrase: "Je n'avance pas vite. J'avance juste.",
    colors: { aura: "#8FA9C4", accent: "#5E7C9E" },
    symbol: "compass",
    image: "/brand/signals/strategist.png",
    shareText:
      "Mon Signal est Le Stratège : lucidité, patience, vision. Et toi, quel est ton Signal ?",
    cardTemplateData: {
      glyph: "compass",
      keywords: ["Lucidité", "Patience", "Vision"],
    },
  },
  visionary: {
    id: "visionary",
    name: "Le Visionnaire",
    shortLabel: "Visionnaire",
    tagline: "Tu ressens le futur avant qu'il arrive.",
    description:
      "Tu ne regardes pas seulement ce qui existe. Tu ressens ce qui peut arriver. Ton énergie avance souvent plus vite que le monde autour de toi — et parfois, c'est ça qui te fatigue.",
    keywords: ["intuition", "création", "imagination", "avance", "futur"],
    strengths: "Tu vois les possibilités avant les autres.",
    shadow: "Te perdre dans trop d'idées sans en choisir une.",
    socialEnergy:
      "Tu donnes aux autres l'impression qu'un autre futur est possible.",
    advice: "Choisis une seule vision et pose une action concrète aujourd'hui.",
    powerPhrase: "Je n'attends pas que le monde comprenne. Je construis.",
    colors: { aura: "#B79CE0", accent: "#8A6FC0" },
    symbol: "horizon",
    image: "/brand/signals/visionary.png",
    shareText:
      "Mon Signal est Le Visionnaire : intuition, création, avance. Et toi, quel est ton Signal ?",
    cardTemplateData: {
      glyph: "horizon",
      keywords: ["Intuition", "Création", "Avance"],
    },
  },
  builder: {
    id: "builder",
    name: "Le Bâtisseur",
    shortLabel: "Bâtisseur",
    tagline: "Tu transformes l'idée en réalité.",
    description:
      "Tu ne crois pas aux raccourcis. Tu crois à l'effort répété, à la solidité, à ce qui dure. Pendant que d'autres parlent, tu poses les fondations, pierre après pierre.",
    keywords: ["discipline", "solidité", "endurance", "fiabilité", "construction"],
    strengths: "Ta capacité à recommencer sans jamais vraiment abandonner.",
    shadow: "Oublier de rêver pendant que tu construis.",
    socialEnergy:
      "Tu es le socle : celui ou celle sur qui un groupe sait qu'il peut compter.",
    advice:
      "Accorde-toi un moment pour rêver plus grand que la prochaine étape.",
    powerPhrase: "Ce que je commence, je peux l'élever.",
    colors: { aura: "#C7A36B", accent: "#9A7B43" },
    symbol: "pillar",
    image: "/brand/signals/builder.png",
    shareText:
      "Mon Signal est Le Bâtisseur : discipline, solidité, fiabilité. Et toi, quel est ton Signal ?",
    cardTemplateData: {
      glyph: "pillar",
      keywords: ["Discipline", "Solidité", "Fiabilité"],
    },
  },
  rebel: {
    id: "rebel",
    name: "Le Rebelle",
    shortLabel: "Rebelle",
    tagline: "Tu refuses les cages invisibles.",
    description:
      "Tu portes un feu. Quand on te dit que c'est impossible, quelque chose en toi s'allume. Tu n'as jamais vraiment aimé les cages — même quand elles étaient dorées.",
    keywords: ["liberté", "feu", "audace", "indépendance", "rupture"],
    strengths: "Ton courage de partir là où les autres restent par peur.",
    shadow: "Confondre liberté et fuite.",
    socialEnergy:
      "Tu débloques les groupes figés en disant tout haut ce que les autres pensent tout bas.",
    advice: "Choisis un combat qui en vaut vraiment la peine, et lâche les autres.",
    powerPhrase: "Je ne suis pas né pour rentrer dans le cadre.",
    colors: { aura: "#E0795B", accent: "#C2492C" },
    symbol: "bolt",
    image: "/brand/signals/rebel.png",
    shareText:
      "Mon Signal est Le Rebelle : liberté, feu, audace. Et toi, quel est ton Signal ?",
    cardTemplateData: {
      glyph: "bolt",
      keywords: ["Liberté", "Feu", "Audace"],
    },
  },
  protector: {
    id: "protector",
    name: "Le Protecteur",
    shortLabel: "Protecteur",
    tagline: "Ta force calme rassure les autres.",
    description:
      "Tu n'as pas besoin de hausser la voix pour qu'on te sente. Ta force est tranquille, mais quand on touche à ce que tu aimes, elle se réveille entière. La loyauté est ta colonne vertébrale.",
    keywords: ["loyauté", "stabilité", "cœur", "courage silencieux", "défense"],
    strengths: "Ta présence rassure et stabilise tout ce qui t'entoure.",
    shadow: "Protéger les autres en t'oubliant.",
    socialEnergy:
      "Tu es le refuge : on vient vers toi quand le monde devient trop dur.",
    advice:
      "Aujourd'hui, protège-toi avec la même intensité que tu protèges les autres.",
    powerPhrase: "Ma douceur n'annule pas ma puissance.",
    colors: { aura: "#7FB29A", accent: "#4E8970" },
    symbol: "shield",
    image: "/brand/signals/protector.png",
    shareText:
      "Mon Signal est Le Protecteur : loyauté, force calme, cœur. Et toi, quel est ton Signal ?",
    cardTemplateData: {
      glyph: "shield",
      keywords: ["Loyauté", "Stabilité", "Cœur"],
    },
  },
  oracle: {
    id: "oracle",
    name: "L'Oracle",
    shortLabel: "Oracle",
    tagline: "Tu perçois ce que les autres évitent.",
    description:
      "Il y a en toi une profondeur que peu de gens atteignent. Tu lis les silences, tu ressens les non-dits. Tu ressens souvent avant de comprendre — et parfois, tu avais raison trop tôt.",
    keywords: ["profondeur", "silence", "perception", "intuition", "mystère"],
    strengths: "Ton intuition qui voit juste avant même de pouvoir l'expliquer.",
    shadow: "Rester trop longtemps dans ton monde intérieur.",
    socialEnergy:
      "Tu parles peu, mais quand tu parles, on s'arrête pour écouter.",
    advice: "Partage une intuition aujourd'hui, même sans pouvoir la justifier.",
    powerPhrase: "Ce que je ressens a déjà une forme de vérité.",
    colors: { aura: "#9B8FC4", accent: "#6B5E9E" },
    symbol: "moon",
    image: "/brand/signals/oracle.png",
    shareText:
      "Mon Signal est L'Oracle : profondeur, perception, intuition. Et toi, quel est ton Signal ?",
    cardTemplateData: {
      glyph: "moon",
      keywords: ["Profondeur", "Perception", "Intuition"],
    },
  },
};

/** Ordered list — used as the stable tie-break order for scoring. */
export const SIGNAL_ORDER: SignalId[] = [
  "sovereign",
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
