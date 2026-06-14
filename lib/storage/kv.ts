import "server-only";
import type {
  MarkPaidInput,
  PaymentStore,
  SaveResultInput,
  StoredResult,
} from "@/lib/storage/types";
import type { SignalPersonalization } from "@/types";

/**
 * Optional in-memory KV adapter.
 *
 * Best-effort, per-instance only (state is lost on cold start and not shared
 * across serverless instances). It is NOT durable and must never be the sole
 * proof of payment in production — wire Supabase (or a real Upstash/Vercel KV
 * backend here) for that. Useful as a lightweight cache in single-instance
 * deployments and for local experimentation.
 */
const store = new Map<string, StoredResult>();

export function createKvStore(): PaymentStore {
  return {
    name: "kv-memory",
    durable: false,

    async saveResult(input: SaveResultInput): Promise<void> {
      const existing = store.get(input.id);
      store.set(input.id, {
        id: input.id,
        dominantSignal: input.dominantSignal,
        secondarySignal: input.secondarySignal,
        resultToken: input.resultToken,
        shareSlug: input.shareSlug,
        collectionSeed: input.collectionSeed,
        isPaid: existing?.isPaid ?? false,
        paymentId: existing?.paymentId ?? null,
        payload: existing?.payload ?? null,
        createdAt: existing?.createdAt ?? new Date().toISOString(),
      });
    },

    async getResult(id: string): Promise<StoredResult | null> {
      return store.get(id) ?? null;
    },

    async isResultPaid(id: string): Promise<boolean> {
      return store.get(id)?.isPaid ?? false;
    },

    async markPaid(input: MarkPaidInput): Promise<void> {
      const existing = store.get(input.resultId);
      if (!existing) return;
      existing.isPaid = true;
      existing.paymentId = input.paymentId;
    },

    async savePayload(
      id: string,
      payload: SignalPersonalization,
    ): Promise<void> {
      const existing = store.get(id);
      if (existing) existing.payload = payload;
    },

    async getPayload(id: string): Promise<SignalPersonalization | null> {
      return store.get(id)?.payload ?? null;
    },
  };
}
