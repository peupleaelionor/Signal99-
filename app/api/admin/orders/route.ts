import { NextResponse } from "next/server";
import { ADMIN_SECRET } from "@/lib/config";
import { listOrders, ordersToCsv } from "@/lib/orders";

export const runtime = "nodejs";

/**
 * Lightweight admin export of captured orders/contacts.
 *
 * Protected by ADMIN_SECRET (passed as `?secret=` or `x-admin-secret` header).
 * Returns JSON by default, or CSV with `?format=csv`. If ADMIN_SECRET is unset,
 * the endpoint is disabled (404-style) so it can never leak in production.
 */
export async function GET(req: Request) {
  if (!ADMIN_SECRET) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const url = new URL(req.url);
  const provided =
    url.searchParams.get("secret") || req.headers.get("x-admin-secret") || "";

  if (provided !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const orders = await listOrders();

  if (url.searchParams.get("format") === "csv") {
    return new NextResponse(ordersToCsv(orders), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="signal99-orders.csv"',
      },
    });
  }

  return NextResponse.json({ count: orders.length, orders });
}
