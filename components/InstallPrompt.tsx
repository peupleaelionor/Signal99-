"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "signal99:pwaDismissed";

/**
 * Discreet, dismissible "install app" bar. Only appears when the browser offers
 * installation and the user hasn't dismissed it. Never blocks content.
 */
export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      dismissed = false;
    }
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    dismiss();
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-2xl border border-line bg-card/95 p-4 shadow-card backdrop-blur">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/app-icon.png"
          alt=""
          className="h-10 w-10 rounded-xl"
          aria-hidden
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-ink">Installer SIGNAL99</p>
          <p className="text-xs text-muted">Accès instantané, comme une app.</p>
        </div>
        <button
          onClick={install}
          className="rounded-full bg-copper-gold px-4 py-2 text-sm font-semibold text-background"
        >
          Installer
        </button>
        <button
          onClick={dismiss}
          aria-label="Fermer"
          className="px-1 text-muted hover:text-ink"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
