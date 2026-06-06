import { CardShell } from "@/components/CardShell";

const ITEMS = [
  {
    q: "What is SIGNAL99?",
    a: "A symbolic experience that reveals your dominant archetype from 7 questions.",
  },
  {
    q: "Is it scientific?",
    a: "No. It’s an introspective, entertaining reading — made to help you see yourself differently.",
  },
  {
    q: "Why $0.99?",
    a: "To keep the experience accessible and unlock a premium personal card.",
  },
  {
    q: "What do I get?",
    a: "Your full result and a shareable personal card.",
  },
  {
    q: "Do I need an account?",
    a: "No — not for this version.",
  },
  {
    q: "Can I share my card?",
    a: "Yes. Download your 1080×1920 card, post it to your story and invite friends to find their Signal.",
  },
];

export function FAQ() {
  return (
    <section className="py-16">
      <h2 className="text-center font-serif text-3xl text-ink">
        Frequently asked
      </h2>
      <div className="mt-8 flex flex-col gap-3">
        {ITEMS.map((item) => (
          <CardShell key={item.q} className="p-5">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium text-ink">
                {item.q}
                <span className="ml-4 text-muted transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          </CardShell>
        ))}
      </div>
    </section>
  );
}
