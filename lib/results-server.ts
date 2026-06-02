import "server-only";
import { getSupabaseService } from "@/lib/supabase";

/**
 * Server-side persistence for purchases / paid status.
 *
 * When Supabase is configured these write to the documented tables; otherwise
 * they no-op gracefully so the MVP runs without a database. The single source
 * of truth for "is this paid?" remains Stripe (verified server-side), so the
 * absence of a DB never grants access by itself.
 */

export interface PurchaseInput {
  stripeSessionId: string;
  amount: number;
  currency: string;
  status: string;
  quizResultId: string | null;
  email: string | null;
}

export async function recordPurchase(input: PurchaseInput): Promise<void> {
  const db = getSupabaseService();
  if (!db) return;

  await db.from("purchases").upsert(
    {
      stripe_session_id: input.stripeSessionId,
      amount: input.amount,
      currency: input.currency,
      status: input.status,
      quiz_result_id: input.quizResultId,
      email: input.email,
    },
    { onConflict: "stripe_session_id" },
  );

  if (input.quizResultId && input.status === "paid") {
    await db
      .from("quiz_results")
      .update({ is_paid: true, payment_id: input.stripeSessionId })
      .eq("id", input.quizResultId);
  }
}
