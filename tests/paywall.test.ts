import { describe, it, expect } from "vitest";
import {
  validatePaidSession,
  type CheckoutSessionLike,
} from "@/lib/payments/validate";
import { PRODUCTS, SIGNAL_CURRENCY } from "@/lib/config";

const RESULT_ID = "result-123";

function paidSession(
  over: Partial<CheckoutSessionLike> = {},
): CheckoutSessionLike {
  return {
    payment_status: "paid",
    amount_total: PRODUCTS.signal_unlock.amount,
    currency: SIGNAL_CURRENCY,
    metadata: { quiz_result_id: RESULT_ID, sku: "signal_unlock" },
    ...over,
  };
}

describe("validatePaidSession", () => {
  it("accepts a fully valid paid session bound to the result", () => {
    const res = validatePaidSession(paidSession(), RESULT_ID);
    expect(res.valid).toBe(true);
    expect(res.sku).toBe("signal_unlock");
  });

  it("rejects an unpaid session", () => {
    const res = validatePaidSession(
      paidSession({ payment_status: "unpaid" }),
      RESULT_ID,
    );
    expect(res.valid).toBe(false);
    expect(res.reason).toBe("not_paid");
  });

  it("rejects a session created for a different result (no reuse)", () => {
    const res = validatePaidSession(paidSession(), "different-result");
    expect(res.valid).toBe(false);
    expect(res.reason).toBe("result_mismatch");
  });

  it("rejects when the requested result id is empty", () => {
    const res = validatePaidSession(paidSession(), "");
    expect(res.valid).toBe(false);
    expect(res.reason).toBe("result_mismatch");
  });

  it("rejects an unknown sku", () => {
    const res = validatePaidSession(
      paidSession({ metadata: { quiz_result_id: RESULT_ID, sku: "hack" } }),
      RESULT_ID,
    );
    expect(res.valid).toBe(false);
    expect(res.reason).toBe("unknown_sku");
  });

  it("rejects a tampered amount", () => {
    const res = validatePaidSession(
      paidSession({ amount_total: 1 }),
      RESULT_ID,
    );
    expect(res.valid).toBe(false);
    expect(res.reason).toBe("amount_mismatch");
  });

  it("rejects a wrong currency", () => {
    const res = validatePaidSession(
      paidSession({ currency: "usd" }),
      RESULT_ID,
    );
    expect(res.valid).toBe(false);
    expect(res.reason).toBe("currency_mismatch");
  });

  it("validates the complete_pack price independently", () => {
    const res = validatePaidSession(
      paidSession({
        amount_total: PRODUCTS.complete_pack.amount,
        metadata: { quiz_result_id: RESULT_ID, sku: "complete_pack" },
      }),
      RESULT_ID,
    );
    expect(res.valid).toBe(true);
    expect(res.sku).toBe("complete_pack");
  });
});
