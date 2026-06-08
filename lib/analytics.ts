import type { AnalyticsEvent } from "@/types";
import { PAYMENT_MODE, PLAUSIBLE_DOMAIN, POSTHOG_KEY } from "@/lib/config";

/**
 * Analytics with real sinks (optional) behind one chokepoint.
 *
 * Providers (auto-detected from env, wired by <Analytics /> in the layout):
 *   - Plausible  → NEXT_PUBLIC_PLAUSIBLE_DOMAIN
 *   - PostHog    → NEXT_PUBLIC_POSTHOG_KEY
 * With neither configured, events log to the dev console only (never in prod).
 *
 * Every event is enriched with shared context (language, device, payment_mode,
 * variant, source) so the funnel is analyzable without per-call boilerplate.
 */

type Props = Record<string, string | number | boolean | null | undefined>;

interface PlausibleFn {
  (event: string, opts?: { props?: Props }): void;
}
interface PostHogFn {
  capture: (event: string, props?: Props) => void;
}

function deviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/Mobi|Android|iPhone/i.test(ua)) return "mobile";
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  return "desktop";
}

function baseContext(): Props {
  const ctx: Props = { payment_mode: PAYMENT_MODE };
  if (typeof navigator !== "undefined") {
    ctx.language = navigator.language;
    ctx.device = deviceType();
  }
  if (typeof window !== "undefined") {
    try {
      const p = new URLSearchParams(window.location.search);
      const source = p.get("utm_source") || p.get("ref") || p.get("source");
      const variant = p.get("v") || p.get("variant");
      if (source) ctx.source = source;
      if (variant) ctx.variant = variant;
    } catch {
      // ignore URL parsing issues
    }
  }
  return ctx;
}

function dispatch(event: AnalyticsEvent, props: Props): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    plausible?: PlausibleFn;
    posthog?: PostHogFn;
  };

  let delivered = false;
  if (PLAUSIBLE_DOMAIN && typeof w.plausible === "function") {
    w.plausible(event, { props });
    delivered = true;
  }
  if (POSTHOG_KEY && w.posthog && typeof w.posthog.capture === "function") {
    w.posthog.capture(event, props);
    delivered = true;
  }

  if (!delivered && process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.info(`[analytics] ${event}`, props);
  }
}

export function track(event: AnalyticsEvent, props?: Props): void {
  try {
    dispatch(event, { ...baseContext(), ...(props ?? {}) });
  } catch {
    // analytics must never break the UX
  }
}
