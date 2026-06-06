"use client";

import { useEffect } from "react";

/**
 * Registers the service worker (production only) so SIGNAL99 installs and works
 * offline. Failures are swallowed — the SW is an enhancement, never required.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // ignore — offline support is optional
      });
    };

    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
