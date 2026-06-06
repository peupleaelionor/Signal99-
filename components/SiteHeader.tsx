import Link from "next/link";
import { PrimaryButton } from "@/components/PrimaryButton";

/** Minimal top bar with the SIGNAL99 wordmark logo. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Link href="/" aria-label="SIGNAL99 — home" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-horizontal.png"
            alt="SIGNAL99"
            height={28}
            className="h-7 w-auto"
          />
        </Link>
        <PrimaryButton href="/test" className="px-5 py-2 text-sm">
          Reveal my Signal
        </PrimaryButton>
      </div>
    </header>
  );
}
