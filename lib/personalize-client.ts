"use client";

import { getResult, savePersonalization } from "@/lib/storage";
import { funnel } from "@/lib/funnel-metrics";
import type { QuizResultRecord, SignalPersonalization } from "@/types";

/**
 * Ensures a personalized payload exists for a result, fetching once and caching
 * it on the local record (result_payload). De-duplicated per result id so
 * pre-generation (locked screen) and display (unlocked screen) never double-call.
 * Never throws — returns null on any failure; callers keep the template.
 */
const inflight = new Map<string, Promise<SignalPersonalization | null>>();

export function ensurePersonalization(
  record: QuizResultRecord,
): Promise<SignalPersonalization | null> {
  const cached = getResult(record.id)?.personalization;
  if (cached) return Promise.resolve(cached);

  const pending = inflight.get(record.id);
  if (pending) return pending;

  const run = (async (): Promise<SignalPersonalization | null> => {
    funnel.aiGenerationStarted(record.id);
    try {
      const res = await fetch("/api/personalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resultId: record.id,
          dominantSignal: record.dominantSignal,
          secondarySignal: record.secondarySignal,
          answers: record.answers,
        }),
      });
      if (!res.ok) {
        funnel.aiGenerationFallback(record.id);
        return null;
      }
      const data = (await res.json()) as {
        personalization?: SignalPersonalization;
        status?: string;
      };
      if (!data.personalization) {
        funnel.aiGenerationFallback(record.id);
        return null;
      }
      savePersonalization(record.id, data.personalization);
      if (data.status === "fallback" || data.status === "failed") {
        funnel.aiGenerationFallback(record.id);
      } else {
        funnel.aiGenerationCompleted(record.id, data.status ?? "completed");
      }
      return data.personalization;
    } catch {
      funnel.aiGenerationFallback(record.id);
      return null;
    } finally {
      inflight.delete(record.id);
    }
  })();

  inflight.set(record.id, run);
  return run;
}
