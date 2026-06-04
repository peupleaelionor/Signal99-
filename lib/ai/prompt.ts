import { getSignal } from "@/data/signals";
import type { Signal, SignalId } from "@/types";

export interface PersonalizationInput {
  language?: "fr" | "en";
  dominantSignal: SignalId;
  secondarySignal: SignalId;
  /** Map of question id -> selected option id. */
  answers: Record<number, string>;
  userFirstName?: string;
  variant?: string;
  paidTier?: "free" | "single" | "complete";
  source?: string;
  tone?: string;
}

export interface BuiltPrompt {
  system: string;
  user: string;
}

const BRAND_PHRASE = "Ton énergie parle avant toi.";
const FINAL_PROMISE =
  "Révèle ton Signal. Garde ta carte. Partage ton identité.";

function signalBrief(signal: Signal): string {
  return [
    `id: ${signal.id}`,
    `nom: ${signal.name}`,
    `tagline: ${signal.tagline}`,
    `mots-clés: ${signal.keywords.join(", ")}`,
    `force: ${signal.strengths}`,
    `ombre: ${signal.shadow}`,
    `catégories lifestyle: ${signal.guidance.recommendedCategories.join(", ")}`,
  ].join(" | ");
}

/**
 * Builds the system + user prompt for the personalization call.
 * The model personalizes the prose only — the dominant/secondary signals are
 * fixed inputs it must echo back, never re-decide.
 */
export function buildSignalPrompt(input: PersonalizationInput): BuiltPrompt {
  const lang = input.language ?? "fr";
  const dominant = getSignal(input.dominantSignal);
  const secondary = getSignal(input.secondarySignal);

  const system = [
    "Tu écris un résultat d'identité symbolique premium pour SIGNAL99.",
    "SIGNAL99 est une expérience d'identité symbolique. Ce n'est pas de l'astrologie, pas de la voyance, pas une app IA, pas un diagnostic médical, pas un conseil financier, pas une thérapie psychologique.",
    "Écris un résultat concis et premium qui donne à la personne le sentiment d'être vue, sans affirmation absolue.",
    "Règles :",
    "- Ne mentionne jamais l'IA.",
    "- Ne mentionne jamais de diagnostic.",
    "- Ne prédis pas l'avenir.",
    "- N'utilise jamais la peur ni la culpabilité.",
    "- Ne fais aucune revendication scientifique, médicale, financière ou spirituelle absolue.",
    "- Garde chaque champ court, élégant et mobile-first. Aucune phrase inutile.",
    "- publicShareText doit être viral et créer de la curiosité.",
    "- lockscreenText doit être très court.",
    "- premiumCardTitle court et fort. premiumCardText = une ligne premium.",
    "- ogTitle du type « Je suis [Signal]. Et toi ? ». ogDescription courte.",
    "- upsellTitle et upsellDescription pour un guide complet, non agressif.",
    "- recommendedCategories : catégories lifestyle/produit alignées au Signal (si plus tard des liens commerciaux sont montrés, ils seront clairement étiquetés).",
    `- Écris en ${lang === "fr" ? "français" : "anglais"}, tutoiement, ton premium et sobre.`,
    input.tone ? `- Ton souhaité : ${input.tone}.` : "",
    `Esprit de marque : « ${BRAND_PHRASE} » Promesse : « ${FINAL_PROMISE} »`,
    "Réponds uniquement avec un JSON valide correspondant exactement au schéma demandé. dominantSignal et secondarySignal doivent reprendre exactement les ids fournis.",
  ]
    .filter(Boolean)
    .join("\n");

  const user = [
    `Signal dominant (fixe) : ${signalBrief(dominant)}`,
    `Signal secondaire (fixe) : ${signalBrief(secondary)}`,
    input.userFirstName ? `Prénom : ${input.userFirstName}` : "",
    `Réponses au quiz (questionId -> optionId) : ${JSON.stringify(input.answers)}`,
    "Personnalise le résultat à partir de ces signaux et réponses. Renvoie le JSON.",
  ]
    .filter(Boolean)
    .join("\n");

  return { system, user };
}

/** Appends correction guidance for a single retry after a failed quality check. */
export function buildCorrectionPrompt(
  base: BuiltPrompt,
  issues: string[],
): BuiltPrompt {
  return {
    system: base.system,
    user: `${base.user}\n\nLa version précédente a été rejetée pour : ${issues.join("; ")}. Corrige et renvoie un JSON valide, plus court et plus premium.`,
  };
}
