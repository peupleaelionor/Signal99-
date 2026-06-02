import type { Signal } from "@/types";
import { cn } from "@/lib/cn";
import { SignalEmblem } from "@/components/SignalEmblem";

interface SignalCardProps {
  signal: Signal;
  /** Optional first name to personalize the card. */
  name?: string;
  className?: string;
}

/**
 * The shareable vertical card (story ratio 9:16).
 * Uses the premium brand emblem (which already carries the archetype name),
 * then layers SIGNAL99 branding, tagline, power phrase and the share URL.
 * A matching PNG is generated server-side at /api/card for download/OG.
 */
export function SignalCard({ signal, name, className }: SignalCardProps) {
  return (
    <div
      className={cn(
        "relative mx-auto flex aspect-[9/16] w-full max-w-[320px] flex-col items-center overflow-hidden rounded-3xl border-hairline bg-background px-6 py-8 text-center",
        className,
      )}
      style={{ boxShadow: `0 0 90px -30px ${signal.colors.aura}66` }}
    >
      {/* aura */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-2/3 opacity-50"
        style={{
          background: `radial-gradient(70% 55% at 50% 10%, ${signal.colors.aura}33 0%, rgba(5,5,5,0) 70%)`,
        }}
      />

      <div className="relative z-10 flex w-full flex-1 flex-col items-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-muted">
          Signal99
        </p>

        {name ? (
          <p className="mt-3 text-xs text-muted">Le Signal de {name}</p>
        ) : null}

        <div className="mt-2 w-full max-w-[230px]">
          <SignalEmblem signal={signal} priority />
        </div>

        <p className="mt-1 px-2 text-sm leading-relaxed text-muted">
          {signal.tagline}
        </p>

        <p
          className="mt-auto pt-6 font-serif text-base italic leading-snug"
          style={{ color: signal.colors.aura }}
        >
          “{signal.powerPhrase}”
        </p>
      </div>

      <div className="relative z-10 mt-5 w-full border-t border-line pt-4">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted">
          Découvre ton Signal
        </p>
        <p className="mt-1 text-xs text-ink/70">signal99.com</p>
      </div>
    </div>
  );
}
