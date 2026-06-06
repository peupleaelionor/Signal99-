import type { Signal } from "@/types";
import { cn } from "@/lib/cn";
import { SignalEmblem } from "@/components/SignalEmblem";
import { SignalGlyph } from "@/components/SignalGlyph";

export type CardVariant = "premium" | "public" | "lockscreen";

interface SignalCardProps {
  signal: Signal;
  /** Optional first name to personalize the card. */
  name?: string;
  /** Which of the 3 card types to render. Defaults to the premium personal card. */
  variant?: CardVariant;
  /** Personalized lines (AI or fallback). Falls back to signal data. */
  mirrorPhrase?: string;
  hiddenStrength?: string;
  softShadow?: string;
  powerPhrase?: string;
  className?: string;
}

/**
 * The shareable vertical card (story ratio 9:16) in three flavors:
 *   - public     : viral status card — "I’m [Signal]. … What’s your Signal?"
 *   - premium    : personal card with mirror / strength / shadow / power
 *   - lockscreen : minimal — Signal + power phrase + SIGNAL99
 *
 * A matching PNG is generated server-side at /api/card for download/OG.
 */
export function SignalCard({
  signal,
  name,
  variant = "premium",
  mirrorPhrase,
  hiddenStrength,
  softShadow,
  powerPhrase,
  className,
}: SignalCardProps) {
  const aura = signal.colors.aura;
  const power = powerPhrase || signal.powerPhrase;
  const mirror = mirrorPhrase || signal.mirrorPhrase;

  return (
    <div
      className={cn(
        "relative mx-auto flex aspect-[9/16] w-full max-w-[320px] flex-col items-center overflow-hidden rounded-3xl border-hairline bg-background px-6 py-8 text-center",
        className,
      )}
      style={{ boxShadow: `0 0 90px -30px ${aura}66` }}
    >
      {/* aura */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-2/3 opacity-50"
        style={{
          background: `radial-gradient(70% 55% at 50% 10%, ${aura}33 0%, rgba(5,5,5,0) 70%)`,
        }}
      />

      <div className="relative z-10 flex w-full flex-1 flex-col items-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-muted">Signal99</p>

        {variant === "lockscreen" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <span style={{ color: aura }}>
              <SignalGlyph name={signal.symbol} size={56} />
            </span>
            <h3 className="font-serif text-3xl text-ink">{signal.name}</h3>
            <p className="font-serif text-lg italic leading-snug" style={{ color: aura }}>
              “{power}”
            </p>
          </div>
        ) : variant === "public" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5">
            <span style={{ color: aura }}>
              <SignalGlyph name={signal.symbol} size={48} />
            </span>
            <h3 className="font-serif text-3xl leading-tight text-ink">
              I’m {signal.name}.
            </h3>
            <p className="px-2 text-base leading-relaxed text-ink/85">{mirror}</p>
            <p className="mt-2 font-serif text-xl text-gradient">What’s your Signal?</p>
          </div>
        ) : (
          <>
            {name ? <p className="mt-3 text-xs text-muted">{name}’s Signal</p> : null}

            <div className="mt-2 w-full max-w-[210px]">
              <SignalEmblem signal={signal} priority />
            </div>

            <div className="mt-1 space-y-2 px-1">
              <p className="text-sm leading-relaxed text-ink/85">{mirror}</p>
              <p className="text-xs leading-relaxed text-muted">
                {hiddenStrength || signal.strengths}
              </p>
              <p className="text-xs leading-relaxed text-muted">
                {softShadow || signal.shadow}
              </p>
            </div>

            <p
              className="mt-auto pt-5 font-serif text-base italic leading-snug"
              style={{ color: aura }}
            >
              “{power}”
            </p>
          </>
        )}
      </div>

      <div className="relative z-10 mt-5 w-full border-t border-line pt-4">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted">
          Discover your Signal
        </p>
        <p className="mt-1 text-xs text-ink/70">signal99.com</p>
      </div>
    </div>
  );
}
