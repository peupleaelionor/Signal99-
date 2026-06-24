"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Signal } from "@/types";
import { track } from "@/lib/analytics";
import {
  buildResultText,
  buildSharePayload,
  cardImageUrl,
  shareUrl,
} from "@/lib/share";
import { cn } from "@/lib/cn";

interface ShareButtonsProps {
  signal: Signal;
  slug?: string | null;
  name?: string;
}

export function ShareButtons({ signal, slug, name }: ShareButtonsProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    track("card_downloaded", { signal: signal.id });
    setDownloading(true);
    try {
      const res = await fetch(
        cardImageUrl(signal.id, { name, download: true }),
      );
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `signal99-${signal.id}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // fallback: open the image in a new tab
      window.open(cardImageUrl(signal.id, { name }), "_blank");
    } finally {
      setDownloading(false);
    }
  }

  async function handleShare() {
    track("share_clicked", { signal: signal.id, channel: "native" });
    const payload = buildSharePayload(signal, slug ?? undefined);
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch {
        // user cancelled — fall through to copy
      }
    }
    await copyText(buildResultText(signal, slug ?? undefined));
  }

  async function handleCopy() {
    track("share_clicked", { signal: signal.id, channel: "copy" });
    await copyText(buildResultText(signal, slug ?? undefined));
  }

  function handleInvite() {
    track("referral_started", { signal: signal.id, channel: "invite" });
    const link = slug ? shareUrl(slug, signal.id) : undefined;
    const text = encodeURIComponent(
      `Fais le test SIGNAL99 et découvre ton Signal. ${link ?? ""}`.trim(),
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  function handleCompare() {
    track("compare_clicked", { signal: signal.id });
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const link = slug
      ? `${origin}/compare/${slug}?s=${signal.id}`
      : undefined;
    const text = encodeURIComponent(
      `J'ai trouvé mon Signal. Fais le test et compare avec moi. ${link ?? ""}`.trim(),
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <ActionButton onClick={handleDownload} primary>
        {downloading ? "Préparation…" : "Télécharger ma carte"}
      </ActionButton>
      <ActionButton onClick={handleShare}>Partager en story</ActionButton>
      <ActionButton onClick={handleCopy}>
        {copied ? "Copié ✓" : "Copier mon résultat"}
      </ActionButton>
      <ActionButton onClick={handleInvite}>Inviter un ami</ActionButton>
      <ActionButton onClick={() => router.push("/test")}>
        Refaire le test
      </ActionButton>
      <ActionButton onClick={handleCompare}>Comparer nos Signaux</ActionButton>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  primary,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 active:scale-[0.98]",
        primary
          ? "bg-copper-gold text-background font-semibold"
          : "border border-line bg-surface text-ink hover:border-copper/60 hover:text-gold",
      )}
    >
      {children}
    </button>
  );
}
