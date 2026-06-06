import "server-only";
import type { PersonalizedResult } from "@/types";

/**
 * Personalization cache abstraction.
 *
 * Default: in-memory (per server instance). This is enough to avoid
 * regenerating within a session and to keep the API fast. A DB-backed
 * implementation (Supabase `quiz_results.result_payload`) can be swapped in
 * later without touching call sites.
 *
 * Keyed by quiz result id.
 */

const memory = new Map<string, PersonalizedResult>();

export async function getCached(id: string): Promise<PersonalizedResult | null> {
  return memory.get(id) ?? null;
}

export async function setCached(id: string, result: PersonalizedResult): Promise<void> {
  memory.set(id, result);
}

export async function hasCached(id: string): Promise<boolean> {
  return memory.has(id);
}
