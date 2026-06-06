import type { Signal } from "@/types";
import { CardShell } from "@/components/CardShell";
import { UNLOCKED } from "@/lib/copy";

/**
 * "What should you do with your Signal?" — turns the archetype into a direction:
 * what to do today, this week, what to avoid, what to explore.
 */
export function SignalGuidance({ signal }: { signal: Signal }) {
  const g = signal.guidance;
  return (
    <section className="mt-10">
      <h2 className="text-center font-serif text-2xl text-ink sm:text-3xl">
        {UNLOCKED.guidanceTitle}
      </h2>
      <p className="mt-2 text-center text-sm text-muted">
        {UNLOCKED.guidanceSubtitle}
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <GuidanceRow label="Today" value={g.todayAction} accent={signal.colors.aura} />
        <GuidanceRow label="This week" value={g.weekFocus} accent={signal.colors.aura} />
        <GuidanceRow label="Avoid" value={g.avoid} accent={signal.colors.aura} />
      </div>

      <CardShell className="mt-3">
        <p className="text-xs uppercase tracking-wider text-muted">Explore</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {g.explore.map((item) => (
            <span
              key={item}
              className="rounded-full border-hairline px-3 py-1 text-xs text-ink/80"
            >
              {item}
            </span>
          ))}
        </div>
      </CardShell>
    </section>
  );
}

function GuidanceRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-line bg-card p-4">
      <span
        className="mt-1 h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
      <div>
        <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
        <p className="mt-1 leading-relaxed text-ink/90">{value}</p>
      </div>
    </div>
  );
}
