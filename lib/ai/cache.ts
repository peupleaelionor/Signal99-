import "server-only";
import type { SignalPersonalization } from "@/types";
import type { PersonalizationInput } from "@/lib/ai/prompt";

/**
 * Lightweight in-process cache to avoid duplicate AI calls for identical
 * inputs (e.g. double-fetch on mount, retries). It is per-instance and
 * ephemeral by design — the durable cache is the client record
 * (result_payload) and, when configured, Supabase. This only dedupes work.
 */

interface Entry {
  value: SignalPersonalization;
  expires: number;
}

const TTL_MS = 1000 * 60 * 30;
const store = new Map<string, Entry>();

export function cacheKey(input: PersonalizationInput): string {
  const answers = Object.entries(input.answers)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([q, o]) => `${q}:${o}`)
    .join(",");
  return [
    input.language ?? "fr",
    input.dominantSignal,
    input.secondarySignal,
    input.variant ?? "_",
    answers,
  ].join("|");
}

export function getCached(key: string): SignalPersonalization | null {
  const hit = store.get(key);
  if (!hit) return null;
  if (hit.expires < Date.now()) {
    store.delete(key);
    return null;
  }
  return hit.value;
}

export function setCached(key: string, value: SignalPersonalization): void {
  store.set(key, { value, expires: Date.now() + TTL_MS });
}
