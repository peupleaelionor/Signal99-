"use client";

import { randomId, shareSlug } from "@/lib/ids";
import { scoreQuiz } from "@/lib/scoring";
import { buildResultMeta } from "@/lib/rarity";
import type { QuizResultRecord } from "@/types";

/**
 * Client-side result store (localStorage).
 *
 * In the MVP there is no mandatory account, so the freshly computed result is
 * persisted locally and referenced by a non-guessable id. Payment is verified
 * server-side via Stripe; the unlock flag here is only a UX convenience and is
 * never trusted to grant the paid content on its own server round-trip.
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
  };
  saveResult(record);
  if (record.shareSlug) {
    indexSlug(record.shareSlug, record.id);
  }
  return record;
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

export function markPaid(id: string, paymentId: string): QuizResultRecord | null {
  const record = getResult(id);
  if (!record) return null;
  record.isPaid = true;
  record.paymentId = paymentId;
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
