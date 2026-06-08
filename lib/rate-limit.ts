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
