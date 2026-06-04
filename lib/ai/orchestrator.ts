import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import {
  AI_ENABLED,
  AI_MODEL,
  AI_TIMEOUT_MS,
  ANTHROPIC_API_KEY,
} from "@/lib/config";
import type { AiStatus, SignalPersonalization } from "@/types";
import { PersonalizationSchema, personalizationJsonSchema } from "@/lib/ai/schema";
import {
  buildCorrectionPrompt,
  buildSignalPrompt,
  type BuiltPrompt,
  type PersonalizationInput,
} from "@/lib/ai/prompt";
import { qualityCheckResult } from "@/lib/ai/validate";
import { buildFallbackPersonalization } from "@/lib/ai/fallback";
import { cacheKey, getCached, setCached } from "@/lib/ai/cache";

export interface OrchestratorResult {
  personalization: SignalPersonalization;
  status: AiStatus;
}

let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (!ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  return client;
}

/** Single AI round-trip → text. Throws on any API/timeout error. */
async function callModel(
  anthropic: Anthropic,
  prompt: BuiltPrompt,
): Promise<string> {
  const params = {
    model: AI_MODEL,
    max_tokens: 1400,
    system: prompt.system,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "low",
      format: { type: "json_schema", schema: personalizationJsonSchema },
    },
    messages: [{ role: "user", content: prompt.user }],
  } as unknown as Anthropic.MessageCreateParamsNonStreaming;

  const message = await anthropic.messages.create(params, {
    timeout: AI_TIMEOUT_MS,
  });
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
}

/**
 * Three-layer pipeline: deterministic scoring (already done, passed in) → AI
 * personalization → schema + quality validation. One correction retry, then a
 * guaranteed premium template fallback. The user never sees an error.
 */
export async function getPersonalization(
  input: PersonalizationInput,
): Promise<OrchestratorResult> {
  const fallback = buildFallbackPersonalization(
    input.dominantSignal,
    input.secondarySignal,
  );

  const anthropic = getClient();
  if (!AI_ENABLED || !anthropic) {
    return { personalization: fallback, status: "fallback" };
  }

  const key = cacheKey(input);
  const cached = getCached(key);
  if (cached) return { personalization: cached, status: "completed" };

  const base = buildSignalPrompt(input);

  try {
    // Attempt 1
    let prompt = base;
    for (let attempt = 0; attempt < 2; attempt++) {
      const text = await callModel(anthropic, prompt);
      const parsed = PersonalizationSchema.safeParse(JSON.parse(text));

      if (parsed.success) {
        const quality = qualityCheckResult(parsed.data);
        if (quality.ok) {
          const personalization: SignalPersonalization = {
            ...parsed.data,
            // Never let the model override the deterministic archetype.
            dominantSignal: input.dominantSignal,
            secondarySignal: input.secondarySignal,
            source: "ai",
          };
          setCached(key, personalization);
          return { personalization, status: "completed" };
        }
        // Retry once with correction guidance.
        prompt = buildCorrectionPrompt(base, quality.issues);
      } else {
        prompt = buildCorrectionPrompt(base, ["JSON invalide"]);
      }
    }
  } catch {
    // fall through to template
  }

  return { personalization: fallback, status: "fallback" };
}
