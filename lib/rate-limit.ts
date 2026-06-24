/**
 * Minimal rate limiting.
 *
 * In-memory fixed-window counter keyed by client + bucket. It is per-instance
 * and best-effort — enough to blunt abuse (mass Stripe sessions, AI spam,
 * delivery spam) on a single/low-fanout deployment. Swap the `hit` internals
 * for Upstash / Vercel KV when horizontal scale demands a shared counter; the
 * call sites (`rateLimit`) stay unchanged.
 */

interface Window {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Window>();

export interface RateLimitOptions {
  /** Max requests allowed within the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  /** Seconds until the window resets (for Retry-After). */
  retryAfter: number;
}

function hit(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, remaining: opts.limit - 1, retryAfter: 0 };
  }

  existing.count += 1;
  if (existing.count > opts.limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  return {
    ok: true,
    remaining: opts.limit - existing.count,
    retryAfter: 0,
  };
}

/** Best-effort client identifier from common proxy headers. */
export function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "anonymous"
  );
}

/**
 * Rate limits a request under a named bucket. Returns `{ ok: false, retryAfter }`
 * when the caller should be throttled.
 */
export function rateLimit(
  req: Request,
  bucket: string,
  opts: RateLimitOptions,
): RateLimitResult {
  return hit(`${bucket}:${clientKey(req)}`, opts);
}

/** Occasionally evict expired windows so the map can't grow unbounded. */
export function sweep(): void {
  const now = Date.now();
  for (const [key, win] of buckets) {
    if (win.resetAt <= now) buckets.delete(key);
  }
}

// ── Distributed limiter (Upstash Redis REST) with graceful fallback ───────────

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || "";
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || "";
export const DISTRIBUTED_RATE_LIMIT = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

async function upstash(command: string[]): Promise<unknown> {
  const res = await fetch(UPSTASH_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`upstash ${res.status}`);
  const data = (await res.json()) as { result?: unknown };
  return data.result;
}

/**
 * Rate limits a request. Uses Upstash (shared across instances) when configured,
 * otherwise the in-memory window. On any Upstash error it fails OPEN (allows the
 * request) so a Redis hiccup never takes the funnel down.
 */
export async function checkRateLimit(
  req: Request,
  bucket: string,
  opts: RateLimitOptions,
): Promise<RateLimitResult> {
  if (!DISTRIBUTED_RATE_LIMIT) return rateLimit(req, bucket, opts);

  const key = `rl:${bucket}:${clientKey(req)}`;
  try {
    const count = Number(await upstash(["INCR", key]));
    if (count === 1) {
      await upstash(["PEXPIRE", key, String(opts.windowMs)]);
    }
    if (count > opts.limit) {
      const ttl = Number(await upstash(["PTTL", key]));
      return {
        ok: false,
        remaining: 0,
        retryAfter: Math.max(1, Math.ceil((ttl > 0 ? ttl : opts.windowMs) / 1000)),
      };
    }
    return { ok: true, remaining: Math.max(0, opts.limit - count), retryAfter: 0 };
  } catch {
    // fail open — never block paying users on a Redis outage
    return { ok: true, remaining: opts.limit, retryAfter: 0 };
  }
}
