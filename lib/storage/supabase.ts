import "server-only";
import { getSupabaseService } from "@/lib/supabase";
import { isSignalId } from "@/data/signals";
import type {
  MarkPaidInput,
  PaymentStore,
  SaveResultInput,
  StoredResult,
} from "@/lib/storage/types";
import type { SignalPersonalization } from "@/types";

/**
 * Supabase adapter — durable persistence + cross-device purchase recovery.
 *
 * `isResultPaid` answers from the `quiz_results.is_paid` column, so a paid result
 * survives a cleared browser cache or a device switch. Writes go through the
 * service-role client (server-only). Every method swallows errors and degrades
 * gracefully — a transient DB issue must never crash the funnel.
 */
export function createSupabaseStore(): PaymentStore {
  return {
    name: "supabase",
    durable: true,

    async saveResult(input: SaveResultInput): Promise<void> {
      const db = getSupabaseService();
      if (!db) return;
      try {
        await db.from("quiz_results").upsert(
          {
            id: input.id,
            dominant_signal: input.dominantSignal,
            secondary_signal: input.secondarySignal,
            result_token: input.resultToken,
            share_slug: input.shareSlug,
          },
          { onConflict: "id" },
        );
      } catch {
        // degrade gracefully
      }
    },

    async getResult(id: string): Promise<StoredResult | null> {
      const db = getSupabaseService();
      if (!db) return null;
      try {
        const { data } = await db
          .from("quiz_results")
          .select(
            "id, dominant_signal, secondary_signal, result_token, share_slug, is_paid, payment_id, result_payload, created_at",
          )
          .eq("id", id)
          .maybeSingle();
        if (!data) return null;
        const dominant = data.dominant_signal as string;
        const secondary = data.secondary_signal as string;
        if (!isSignalId(dominant) || !isSignalId(secondary)) return null;
        return {
          id: data.id as string,
          dominantSignal: dominant,
          secondarySignal: secondary,
          resultToken: (data.result_token as string) ?? "",
          shareSlug: (data.share_slug as string | null) ?? null,
          isPaid: Boolean(data.is_paid),
          paymentId: (data.payment_id as string | null) ?? null,
          payload:
            (data.result_payload as SignalPersonalization | null) ?? null,
          createdAt: (data.created_at as string) ?? new Date().toISOString(),
        };
      } catch {
        return null;
      }
    },

    async isResultPaid(id: string): Promise<boolean> {
      const db = getSupabaseService();
      if (!db) return false;
      try {
        const { data } = await db
          .from("quiz_results")
          .select("is_paid")
          .eq("id", id)
          .maybeSingle();
        return Boolean(data?.is_paid);
      } catch {
        return false;
      }
    },

    async markPaid(input: MarkPaidInput): Promise<void> {
      const db = getSupabaseService();
      if (!db) return;
      try {
        await db.from("purchases").upsert(
          {
            stripe_session_id: input.paymentId,
            amount: input.amount,
            currency: input.currency,
            status: "paid",
            quiz_result_id: input.resultId,
            email: input.email ?? null,
          },
          { onConflict: "stripe_session_id" },
        );
        await db
          .from("quiz_results")
          .update({ is_paid: true, payment_id: input.paymentId })
          .eq("id", input.resultId);
      } catch {
        // degrade gracefully
      }
    },

    async savePayload(
      id: string,
      payload: SignalPersonalization,
    ): Promise<void> {
      const db = getSupabaseService();
      if (!db) return;
      try {
        await db
          .from("quiz_results")
          .update({ result_payload: payload })
          .eq("id", id);
      } catch {
        // degrade gracefully
      }
    },

    async getPayload(id: string): Promise<SignalPersonalization | null> {
      const db = getSupabaseService();
      if (!db) return null;
      try {
        const { data } = await db
          .from("quiz_results")
          .select("result_payload")
          .eq("id", id)
          .maybeSingle();
        return (data?.result_payload as SignalPersonalization | null) ?? null;
      } catch {
        return null;
      }
    },
  };
}
