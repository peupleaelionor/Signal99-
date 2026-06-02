import type { AnalyticsEvent } from "@/types";

/**
 * Tiny analytics abstraction.
 * No third-party tool is wired in the MVP, so events are logged through a
 * single chokepoint. Swap the `sink` implementation later (PostHog, GA, etc.)
 * without touching call sites.
 */

type Props = Record<string, string | number | boolean | null | undefined>;

function sink(event: AnalyticsEvent, props?: Props): void {
  // Centralized dispatch. Replace with a real provider when available.
  if (typeof window !== "undefined" && (window as unknown as { plausible?: (e: string, o?: unknown) => void }).plausible) {
    (window as unknown as { plausible: (e: string, o?: unknown) => void }).plausible(
      event,
      { props },
    );
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.info(`[analytics] ${event}`, props ?? {});
  }
}

export function track(event: AnalyticsEvent, props?: Props): void {
  try {
    sink(event, props);
  } catch {
    // analytics must never break the UX
  }
}
