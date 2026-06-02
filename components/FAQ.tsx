import { CardShell } from "@/components/CardShell";

const ITEMS = [
  {
    q: "C'est quoi SIGNAL99 ?",
    a: "Une expérience symbolique qui révèle ton archétype dominant à partir de 7 questions.",
  },
  {
    q: "Est-ce scientifique ?",
    a: "Non. C'est une lecture introspective et divertissante, pensée pour t'aider à te voir autrement.",
  },
  {
    q: "Pourquoi 0,99 € ?",
    a: "Pour rendre l'expérience accessible et débloquer une carte personnelle premium.",
  },
  {
    q: "Qu'est-ce que je reçois ?",
    a: "Ton résultat complet et une carte personnelle partageable.",
  },
  {
    q: "Dois-je créer un compte ?",
    a: "Non, pas pour la première version.",
  },
  {
    q: "Est-ce que je peux partager ma carte ?",
    a: "Oui. Tu peux télécharger ta carte 1080×1920, la poster en story et inviter tes amis à découvrir leur Signal.",
  },
];

export function FAQ() {
  return (
    <section className="py-16">
      <h2 className="text-center font-serif text-3xl text-ink">Questions fréquentes</h2>
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
