import { CardShell } from "@/components/CardShell";
import { SignalGlyph } from "@/components/SignalGlyph";
import { PrimaryButton } from "@/components/PrimaryButton";

/**
 * "1 Signal. 99 cartes." — presents the collection idea without revealing any
 * Signal. Pure presentational teaser used on the landing.
 */
const SAMPLE = [
  { glyph: "crown", rarity: "Légendaire", color: "#f0b34a" },
  { glyph: "moon", rarity: "Mythique", color: "#ff7ad1" },
  { glyph: "shield", rarity: "Rare", color: "#5aa9e6" },
];

interface CardsShowcaseProps {
  kicker: string;
  title: string;
  sub: string;
  rarities: string[];
  cta: string;
}

export function CardsShowcase({
  kicker,
  title,
  sub,
  rarities,
  cta,
}: CardsShowcaseProps) {
  return (
    <section id="cartes" className="scroll-mt-24 py-14">
      <p className="text-center text-xs uppercase tracking-[0.3em] text-muted">
        {kicker}
      </p>
      <h2 className="mt-2 text-center font-serif text-3xl text-ink sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-center text-muted">{sub}</p>

      <div className="mt-9 grid grid-cols-3 gap-3 sm:mx-auto sm:max-w-md">
        {SAMPLE.map((c) => (
          <CardShell
            key={c.glyph}
            glow
            className="flex aspect-[3/4] flex-col items-center justify-between p-3"
          >
            <span className="self-end text-[10px] uppercase tracking-widest" style={{ color: c.color }}>
              {c.rarity}
            </span>
            <span style={{ color: c.color }}>
              <SignalGlyph name={c.glyph} size={40} />
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted">
              SIGNAL99
            </span>
          </CardShell>
        ))}
      </div>

      <div className="mt-7 flex flex-wrap justify-center gap-2">
        {rarities.map((r) => (
          <span
            key={r}
            className="rounded-full border-hairline px-3 py-1 text-[11px] uppercase tracking-widest text-muted"
          >
            {r}
          </span>
        ))}
      </div>

      <div className="mt-9 flex justify-center">
        <PrimaryButton href="/test">{cta}</PrimaryButton>
      </div>
    </section>
  );
}
