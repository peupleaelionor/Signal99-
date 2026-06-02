"use client";

import { useEffect } from "react";
import { funnel } from "@/lib/funnel-metrics";

/** Fires the share_page_viewed event for /share/[slug]. */
export function SharePageTracker({
  slug,
  signalId,
}: {
  slug: string;
  signalId: string | null;
}) {
  useEffect(() => {
    funnel.sharePageViewed(slug, signalId ?? "unknown");
  }, [slug, signalId]);
  return null;
}
