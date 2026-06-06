import { getSignal } from "@/data/signals";
import { QUESTIONS } from "@/data/questions";
import type { SignalId } from "@/types";

/**
 * Builds the AI prompt from the pack template (`04_AI/ai-prompt-template.md`).
 * The AI only personalizes the text — it never chooses the Signal.
 */

export interface PromptInput {
  dominant: SignalId;
  secondary: SignalId;
  answers: Record<number, string>;
  language?: string;
}

function answersToText(answers: Record<number, string>): string {
  return QUESTIONS.map((q) => {
    const opt = q.options.find((o) => o.id === answers[q.id]);
    return `Q${q.id}: ${q.prompt} -> ${opt ? opt.label : "(skipped)"}`;
  }).join("\n");
}

export const SYSTEM_PROMPT =
  "You write premium symbolic identity results for SIGNAL99. SIGNAL99 is a symbolic identity experience. It is not astrology, fortune-telling, an AI app, a medical diagnosis, financial advice, or psychological therapy. Return only valid JSON matching the schema. Never mention AI. Never mention diagnosis. Never predict the future. Never use fear. Never make scientific claims. Keep every line short, elegant and mobile-first.";

export function buildPrompt(input: PromptInput): string {
  const { dominant, secondary, answers, language = "en" } = input;
  const d = getSignal(dominant);
  const s = getSignal(secondary);

  return `Write a premium symbolic identity result for SIGNAL99.

The user’s dominant Signal is: ${d.name} (${dominant})
The secondary Signal is: ${s.name} (${secondary})
Language: ${language}

Reference voice for the dominant Signal:
- mirror: ${d.mirrorPhrase}
- hidden strength: ${d.strengths}
- soft shadow: ${d.shadow}
- social energy: ${d.socialEnergy}
- direction: ${d.advice}
- power phrase: ${d.powerPhrase}

Quiz answers:
${answersToText(answers)}

Rules:
- Make the user feel seen without absolute claims.
- Short, dense, premium lines. Rhythm and space.
- Never mention AI, diagnosis, prediction, astrology or fear.
- Make the public share text viral.
- Make the lockscreen text very short.
- Recommendations stay category-based and aligned with the Signal.

Brand phrase: "Your energy speaks before you do."
Final promise: "Reveal your Signal. Keep your card. Share your identity."

Return ONLY a JSON object with these exact keys:
dominantSignal, secondarySignal, mirrorPhrase, hiddenStrength, softShadow, socialEnergy, todayAction, weekFocus, avoid, explore (array), recommendedCategories (array), productPlacementTone, powerPhrase, publicShareText, premiumCardTitle, premiumCardText, lockscreenText, ogTitle, ogDescription, upsellTitle, upsellDescription.`;
}
