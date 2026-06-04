"use client";

import { useEffect } from "react";

/**
 * Registers the service worker (production only). Keeps the app installable and
 * provides the offline fallback. Failures are swallowed — never block the UX.
 */
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // ignore — SW is an enhancement, not a requirement
      });
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
