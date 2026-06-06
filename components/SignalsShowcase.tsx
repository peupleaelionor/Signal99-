import { ALL_SIGNALS } from "@/data/signals";
import { SignalEmblem } from "@/components/SignalEmblem";

/**
 * "The 7 Signals" — presents the archetypes without revealing detailed premium
 * content. Builds curiosity ("which one am I?").
 */
export function SignalsShowcase() {
  return (
    <section className="py-14">
      <h2 className="text-center font-serif text-3xl text-ink">The 7 Signals</h2>
      <p className="mt-2 text-center text-sm text-muted">
        Seven energies. One of them is yours.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {ALL_SIGNALS.map((signal) => (
          <div
            key={signal.id}
            className="overflow-hidden rounded-2xl border-hairline bg-surface"
          >
            <SignalEmblem signal={signal} />
          </div>
        ))}
      </div>
    </section>
  );
}
