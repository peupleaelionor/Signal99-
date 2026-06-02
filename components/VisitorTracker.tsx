"use client";

import { useEffect } from "react";
import { funnel } from "@/lib/funnel-metrics";

/** Fires visitor_landed once per mount for the given page. */
export function VisitorTracker({ page }: { page: string }) {
  useEffect(() => {
    funnel.visitorLanded(page);
  }, [page]);
  return null;
}
