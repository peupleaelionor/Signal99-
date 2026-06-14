"use client";

import {
  cacheRevealedSignal,
  getResult,
  savePersonalization,
} from "@/lib/local-store";
import { funnel } from "@/lib/funnel-metrics";
import type { QuizResultRecord, SignalPersonalization } from "@/types";

/**
 * Fetches the paid premium payload (which also carries the server-revealed
 * Signal) once, caching it on the local record. De-duplicated per result id.
 *
 * Sends the raw answers + a session hint; the SERVER verifies payment and
 * computes the Signal. Returns null on failure or when unpaid (402).
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
          // Session hint for server-side re-verification. Authorizes nothing on
          // its own — the server re-checks payment against Stripe / the store.
          sessionId: record.paymentId ?? undefined,
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
      // Cache the revealed Signal + payload locally (UX only).
      cacheRevealedSignal(
        record.id,
        data.personalization.dominantSignal,
        data.personalization.secondarySignal,
      );
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
