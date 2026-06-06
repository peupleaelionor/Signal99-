import "server-only";
import { getSupabaseService } from "@/lib/supabase";
import type { DeliveryContact, OrderRecord } from "@/types";

/**
 * Orders / delivery store — the "never lose a payer" layer.
 *
 * When Supabase is configured, contacts persist to `delivery_orders`. Otherwise
 * they are kept in memory for the lifetime of the server instance AND emitted to
 * the server log, so an operator can still recover a payer manually. This keeps
 * SIGNAL99 sellable in 24–48h even before full automation exists.
 */

const memoryOrders = new Map<string, OrderRecord>();

function nowIso(): string {
  return new Date().toISOString();
}

export async function saveDeliveryContact(contact: DeliveryContact): Promise<void> {
  const record: OrderRecord = {
    quizResultId: contact.quizResultId,
    status: contact.paymentReference ? "paid" : "manual",
    contact: { email: contact.email, handle: contact.handle },
    paymentReference: contact.paymentReference,
    dominantSignal: contact.dominantSignal,
    secondarySignal: contact.secondarySignal,
    createdAt: contact.createdAt,
    updatedAt: nowIso(),
  };

  memoryOrders.set(contact.quizResultId, record);

  // Always leave a trace so a payer can be recovered manually.
  // eslint-disable-next-line no-console
  console.info("[signal99:order]", JSON.stringify(record));

  const db = getSupabaseService();
  if (!db) return;
  try {
    await db.from("delivery_orders").upsert(
      {
        quiz_result_id: record.quizResultId,
        status: record.status,
        email: record.contact.email ?? null,
        handle: record.contact.handle ?? null,
        payment_reference: record.paymentReference ?? null,
        dominant_signal: record.dominantSignal ?? null,
        secondary_signal: record.secondarySignal ?? null,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
      },
      { onConflict: "quiz_result_id" },
    );
  } catch {
    // Supabase optional — memory + log already captured the order.
  }
}

export async function listOrders(): Promise<OrderRecord[]> {
  const db = getSupabaseService();
  if (db) {
    try {
      const { data } = await db
        .from("delivery_orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) {
        return data.map((row: Record<string, unknown>) => ({
          quizResultId: String(row.quiz_result_id),
          status: (row.status as OrderRecord["status"]) ?? "manual",
          contact: {
            email: (row.email as string) ?? undefined,
            handle: (row.handle as string) ?? undefined,
          },
          paymentReference: (row.payment_reference as string) ?? undefined,
          dominantSignal: (row.dominant_signal as OrderRecord["dominantSignal"]) ?? undefined,
          secondarySignal: (row.secondary_signal as OrderRecord["secondarySignal"]) ?? undefined,
          createdAt: String(row.created_at),
          updatedAt: String(row.updated_at),
        }));
      }
    } catch {
      // fall through to memory
    }
  }
  return Array.from(memoryOrders.values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

/** Serialize orders to CSV for a quick export. */
export function ordersToCsv(orders: OrderRecord[]): string {
  const header = [
    "quizResultId",
    "status",
    "email",
    "handle",
    "paymentReference",
    "dominantSignal",
    "secondarySignal",
    "createdAt",
    "updatedAt",
  ].join(",");
  const escape = (v: string | undefined) =>
    v ? `"${v.replace(/"/g, '""')}"` : "";
  const rows = orders.map((o) =>
    [
      o.quizResultId,
      o.status,
      o.contact.email,
      o.contact.handle,
      o.paymentReference,
      o.dominantSignal,
      o.secondarySignal,
      o.createdAt,
      o.updatedAt,
    ]
      .map((v) => escape(v as string | undefined))
      .join(","),
  );
  return [header, ...rows].join("\n");
}
