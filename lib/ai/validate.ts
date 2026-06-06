import type { PersonalizationModel } from "@/lib/ai/schema";

/**
 * Premium quality bar applied after schema validation.
 * Catches forbidden claims, AI self-references, fear/manipulation, and obvious
 * low-quality output before anything reaches the user.
 */

export interface QualityResult {
  ok: boolean;
  issues: string[];
}

// Forbidden topics / claims (case-insensitive, French + English markers).
const FORBIDDEN_PATTERNS: Array<{ re: RegExp; label: string }> = [
  { re: /\b(IA|A\.?I\.?|intelligence artificielle|chatgpt|claude|gpt|llm|généré par)\b/i, label: "mention IA" },
  { re: /\b(diagnos(tic|tique|e|is)|trouble mental|maladie|symptôme|médic)/i, label: "claim médical" },
  { re: /\b(garanti|promet|assure|rendement|profit|investiss|gagner de l'argent|riche)\b/i, label: "promesse financière" },
  { re: /\b(avenir|futur proche|tu vas|il arrivera|destin scellé|prédiction|prédire)\b/i, label: "prédiction" },
  { re: /\b(peur|danger|menace|tu risques|culpab|honte)\b/i, label: "peur/culpabilité" },
  { re: /\b(sexe|sexuel|nu|porn)/i, label: "contenu sexuel" },
];

const REQUIRED_STRING_FIELDS: Array<keyof PersonalizationModel> = [
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
];

function repeatsExcessively(text: string): boolean {
  const words = text.toLowerCase().match(/[a-zà-ÿ]{4,}/g) ?? [];
  if (words.length < 6) return false;
  const counts = new Map<string, number>();
  for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1);
  return [...counts.values()].some((c) => c >= 4);
}

export function qualityCheckResult(result: PersonalizationModel): QualityResult {
  const issues: string[] = [];

  for (const field of REQUIRED_STRING_FIELDS) {
    const value = result[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      issues.push(`champ vide: ${field}`);
    }
  }

  // Aggregate all prose for forbidden-content scanning.
  const blob = [
    ...REQUIRED_STRING_FIELDS.map((f) => String(result[f] ?? "")),
    ...(result.explore ?? []),
    ...(result.recommendedCategories ?? []),
  ].join(" \n ");

  for (const { re, label } of FORBIDDEN_PATTERNS) {
    if (re.test(blob)) issues.push(`contenu interdit (${label})`);
  }

  if (result.lockscreenText && result.lockscreenText.length > 80) {
    issues.push("lockscreenText trop long");
  }
  if (result.mirrorPhrase && repeatsExcessively(result.mirrorPhrase)) {
    issues.push("répétition excessive");
  }

  return { ok: issues.length === 0, issues };
}
