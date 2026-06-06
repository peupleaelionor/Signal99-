import { SITE_URL } from "@/lib/config";
import type { Signal, SignalId } from "@/types";

/** Absolute URL to the dynamically generated PNG story card. */
export function cardImageUrl(
  signalId: string,
  opts?: { name?: string; download?: boolean },
): string {
  const params = new URLSearchParams({ signal: signalId });
  if (opts?.name) params.set("name", opts.name);
  if (opts?.download) params.set("dl", "1");
  return `${SITE_URL}/api/card?${params.toString()}`;
}

/**
 * Public share page URL for a given slug.
 * The dominant signal is carried as a query param so the page + OG render the
 * right teaser without a DB lookup (the slug stays as a forward-compat id).
 */
export function shareUrl(slug: string, signalId?: SignalId): string {
  const base = `${SITE_URL}/share/${slug}`;
  return signalId ? `${base}?s=${signalId}` : base;
}

/** Build the copy-to-clipboard result text. */
export function buildResultText(signal: Signal, slug?: string | null): string {
  const link = slug ? shareUrl(slug, signal.id) : SITE_URL;
  return `${signal.shareText}\n\nTake the test: ${link}`;
}

/** Web Share API payload. */
export function buildSharePayload(signal: Signal, slug?: string | null) {
  return {
    title: "SIGNAL99",
    text: signal.shareText,
    url: slug ? shareUrl(slug, signal.id) : SITE_URL,
  };
}
