interface ProgressBarProps {
  current: number;
  total: number;
}

/** Slim premium progress indicator: "current / total" + animated fill. */
export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs tracking-widest text-muted">
        <span className="uppercase">Signal</span>
        <span className="tabular-nums">
          {current} / {total}
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-copper-gold transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
