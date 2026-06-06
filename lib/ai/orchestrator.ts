import "server-only";
import type {
  AiStatus,
  PersonalizationResponse,
  PersonalizedResult,
  SignalId,
} from "@/types";
import { buildFallbackResult } from "@/lib/ai/fallback";
import { buildPrompt, SYSTEM_PROMPT } from "@/lib/ai/prompt";
import { validatePersonalizedResult } from "@/lib/ai/validate";
import { getCached, setCached } from "@/lib/ai/cache";

/**
 * The invisible AI orchestrator.
 *
 * Pipeline (pack `04_AI/ai-brief.md`):
 *   cache → AI (if configured) → JSON validation → safety validation → fallback
 *
 * Guarantees:
 *   - never throws
 *   - never returns an "AI error" — always a clean PersonalizedResult
 *   - deterministic Signal (AI only writes the text, never picks the Signal)
 */

const AI_TIMEOUT_MS = 12_000;

interface GenerateInput {
  id: string;
  dominant: SignalId;
  secondary: SignalId;
  answers: Record<number, string>;
  language?: string;
}

function aiEnabled(): boolean {
  return Boolean(
    process.env.ANTHROPIC_API_KEY ||
      process.env.OPENAI_API_KEY ||
      process.env.OPENROUTER_API_KEY,
  );
}

/** Extract the first JSON object from a model's text response. */
function extractJson(text: string): unknown | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

async function callProvider(prompt: string): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  try {
    if (process.env.ANTHROPIC_API_KEY) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL || "claude-haiku-4-5-20251001",
          max_tokens: 1200,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: prompt }],
        }),
        signal: controller.signal,
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.content?.[0]?.text ?? null;
    }

    const openaiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
    if (openaiKey) {
      const base = process.env.OPENAI_API_KEY
        ? "https://api.openai.com/v1"
        : "https://openrouter.ai/api/v1";
      const res = await fetch(`${base}/chat/completions`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL || "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt },
          ],
        }),
        signal: controller.signal,
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.choices?.[0]?.message?.content ?? null;
    }

    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Generate (or retrieve) the personalized result. Always succeeds.
 */
export async function generatePersonalization(
  input: GenerateInput,
): Promise<PersonalizationResponse> {
  const { id, dominant, secondary, answers, language } = input;

  const cached = await getCached(id);
  if (cached) {
    return { result: cached, status: "completed" };
  }

  let result: PersonalizedResult | null = null;
  let status: AiStatus = "fallback";

  if (aiEnabled()) {
    const raw = await callProvider(buildPrompt({ dominant, secondary, answers, language }));
    if (raw) {
      const parsed = extractJson(raw);
      const validated = validatePersonalizedResult(parsed);
      if (validated) {
        // The AI personalizes text only — keep the deterministic Signal ids.
        result = { ...validated, dominantSignal: dominant, secondarySignal: secondary };
        status = "completed";
      }
    }
  }

  if (!result) {
    result = buildFallbackResult(dominant, secondary);
    status = "fallback";
  }

  await setCached(id, result);
  return { result, status };
}
