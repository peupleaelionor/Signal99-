import "server-only";
import type {
  MarkPaidInput,
  PaymentStore,
  SaveResultInput,
  StoredResult,
} from "@/lib/storage/types";
import type { SignalPersonalization } from "@/types";

/**
 * Stripe-only adapter — the fast "ship today" path with no database.
 *
 * Nothing is persisted: `isResultPaid` always returns false so the verification
 * layer is forced to confirm payment LIVE against Stripe (session paid +
 * metadata.quiz_result_id match + amount + currency) on every request. This is
 * still fully secure — localStorage is never trusted — it just can't recover a
 * purchase across devices the way the Supabase adapter can.
 */
export function createStripeOnlyStore(): PaymentStore {
  return {
    name: "stripe-only",
    durable: false,
    async saveResult(_input: SaveResultInput): Promise<void> {
      // no-op: no persistence in stripe-only mode
    },
    async getResult(_id: string): Promise<StoredResult | null> {
      return null;
    },
    async isResultPaid(_id: string): Promise<boolean> {
      // Payment is proven live via Stripe in the verification layer, never here.
      return false;
    },
    async markPaid(_input: MarkPaidInput): Promise<void> {
      // no-op
    },
    async savePayload(
      _id: string,
      _payload: SignalPersonalization,
    ): Promise<void> {
      // no-op
    },
    async getPayload(_id: string): Promise<SignalPersonalization | null> {
      return null;
    },
  };
}
