"use client";

import { randomId, shareSlug } from "@/lib/ids";
import { scoreQuiz } from "@/lib/scoring";
import { buildResultMeta } from "@/lib/rarity";
import type { QuizResultRecord, SignalPersonalization } from "@/types";

/**
 * Client-side result store (localStorage) — UX & session recovery ONLY.
 *
 * In the MVP there is no mandatory account, so the freshly computed result is
 * persisted locally and referenced by a non-guessable id. This lets the user
 * refresh / come back without losing their quiz or locked result.
 *
 * SECURITY: `isPaid` here is never a source of truth. Premium content is gated
 * server-side (/api/result-status, /api/personalize) which re-verifies payment
 * against Stripe / the durable store. Editing `isPaid` in localStorage does NOT
 * unlock anything. The stored `paymentId` is kept only as a hint passed back to
 * the server for re-verification.
 */

const KEY_PREFIX = "signal99:result:";
const SLUG_INDEX_KEY = "signal99:slugIndex";

function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // storage may be unavailable (private mode) — fail silently
  }
}

export function createResult(answers: Record<number, string>): QuizResultRecord {
  const outcome = scoreQuiz(answers);
  const record: QuizResultRecord = {
    id: randomId(),
    createdAt: new Date().toISOString(),
    answers,
    scores: outcome.scores,
    dominantSignal: outcome.dominant,
    secondarySignal: outcome.secondary,
    isPaid: false,
    paymentId: null,
    shareSlug: shareSlug(),
    resultToken: randomId(),
    meta: buildResultMeta(outcome),
    personalization: null,
  };
  saveResult(record);
  if (record.shareSlug) {
    indexSlug(record.shareSlug, record.id);
  }
  // Best-effort server persistence (no-op with the stripe-only store; enables
  // durable cross-device recovery with Supabase). Never blocks the funnel.
  void persistResultServerSide(record);
  return record;
}

function persistResultServerSide(record: QuizResultRecord): void {
  try {
    void fetch("/api/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        id: record.id,
        dominantSignal: record.dominantSignal,
        secondarySignal: record.secondarySignal,
        resultToken: record.resultToken,
        shareSlug: record.shareSlug,
      }),
    }).catch(() => {});
  } catch {
    // never block result creation on persistence
  }
}

export function saveResult(record: QuizResultRecord): void {
  safeSet(`${KEY_PREFIX}${record.id}`, JSON.stringify(record));
}

export function getResult(id: string): QuizResultRecord | null {
  const raw = safeGet(`${KEY_PREFIX}${id}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuizResultRecord;
  } catch {
    return null;
  }
}

/**
 * Returns the locally-remembered Stripe session id for a result, if any.
 * Used purely as a hint for server-side re-verification — it authorizes nothing
 * on its own.
 */
export function getSessionHint(id: string): string | null {
  return getResult(id)?.paymentId ?? null;
}

export function markPaid(id: string, paymentId: string): QuizResultRecord | null {
  const record = getResult(id);
  if (!record) return null;
  record.isPaid = true;
  record.paymentId = paymentId;
  saveResult(record);
  return record;
}

export function savePersonalization(
  id: string,
  personalization: SignalPersonalization,
): QuizResultRecord | null {
  const record = getResult(id);
  if (!record) return null;
  record.personalization = personalization;
  saveResult(record);
  return record;
}

function indexSlug(slug: string, id: string): void {
  let index: Record<string, string> = {};
  const raw = safeGet(SLUG_INDEX_KEY);
  if (raw) {
    try {
      index = JSON.parse(raw) as Record<string, string>;
    } catch {
      index = {};
    }
  }
  index[slug] = id;
  safeSet(SLUG_INDEX_KEY, JSON.stringify(index));
}

export function getResultBySlug(slug: string): QuizResultRecord | null {
  const raw = safeGet(SLUG_INDEX_KEY);
  if (!raw) return null;
  try {
    const index = JSON.parse(raw) as Record<string, string>;
    const id = index[slug];
    return id ? getResult(id) : null;
  } catch {
    return null;
  }
}
