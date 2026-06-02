import type { Signal } from "@/types";
import { cn } from "@/lib/cn";

interface SignalEmblemProps {
  signal: Signal;
  className?: string;
  /** Pixel size of the square emblem. */
  size?: number;
  priority?: boolean;
}

/**
 * Premium brand badge for an archetype (the designed PNG emblems).
 * Plain <img> keeps it usable everywhere without next/image config; the assets
 * live in /public/brand/signals.
 */
export function SignalEmblem({
  signal,
  className,
  size = 240,
  priority,
}: SignalEmblemProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={signal.image}
      alt={`Signal ${signal.name}`}
      width={size}
      height={size}
      loading={priority ? "eager" : "lazy"}
      className={cn("h-auto w-full select-none", className)}
      draggable={false}
    />
  );
}
