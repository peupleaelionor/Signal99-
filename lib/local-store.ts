"use client";

import { randomId, shareSlug } from "@/lib/ids";
import type {
  QuizResultRecord,
  RarityLabel,
  SignalId,
  SignalPersonalization,
} from "@/types";

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

/**
 * Creates a result WITHOUT computing the Signal client-side.
 *
 * Ids + seed are generated locally (non-guessable); the raw answers are kept for
 * the user's own session. The Signal/scores are computed server-side via
 * /api/result/create (which also persists durably and returns a non-revealing
 * rarity teaser). If the server is unreachable, the local record still works and
 * the teaser falls back to generic copy — the Signal is revealed later, after
 * payment, by /api/personalize.
 */
export async function createResult(
  answers: Record<number, string>,
  locale = "fr",
): Promise<QuizResultRecord> {
  const record: QuizResultRecord = {
    id: randomId(),
    createdAt: new Date().toISOString(),
    answers,
    isPaid: false,
    paymentId: null,
    shareSlug: shareSlug(),
    resultToken: randomId(),
    collectionSeed: randomId(),
    rarityLabel: null,
    hasCombo: false,
    dominantSignal: null,
    secondarySignal: null,
    personalization: null,
  };
  saveResult(record);
  if (record.shareSlug) indexSlug(record.shareSlug, record.id);

  // Server scores + persists; returns only a non-revealing teaser.
  try {
    const res = await fetch("/api/result/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: record.id,
        answers,
        resultToken: record.resultToken,
        shareSlug: record.shareSlug,
        collectionSeed: record.collectionSeed,
        locale,
      }),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        rarityLabel?: RarityLabel;
        hasCombo?: boolean;
      };
      record.rarityLabel = data.rarityLabel ?? null;
      record.hasCombo = Boolean(data.hasCombo);
      saveResult(record);
    }
  } catch {
    // never block the funnel on the network — generic teaser is used
  }

  return record;
}

/** Caches the revealed Signal locally (UX only) after a verified unlock. */
export function cacheRevealedSignal(
  id: string,
  dominantSignal: SignalId,
  secondarySignal: SignalId,
): void {
  const record = getResult(id);
  if (!record) return;
  record.dominantSignal = dominantSignal;
  record.secondarySignal = secondarySignal;
  saveResult(record);
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
