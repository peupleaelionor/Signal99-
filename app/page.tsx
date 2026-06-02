import { SiteHeader } from "@/components/SiteHeader";
import { HeroSection } from "@/components/HeroSection";
import { SignalsShowcase } from "@/components/SignalsShowcase";
import { TrustBar } from "@/components/TrustBar";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { PrimaryButton } from "@/components/PrimaryButton";
import { LayoutContainer } from "@/components/LayoutContainer";
import { CardShell } from "@/components/CardShell";
import { VisitorTracker } from "@/components/VisitorTracker";

const STEPS = [
  {
    n: "1",
    title: "Réponds",
    text: "7 questions rapides, une par écran. Aucune inscription.",
  },
  {
    n: "2",
    title: "Débloque",
    text: "Ton Signal dominant et l'énergie que les autres ressentent chez toi.",
  },
  {
    n: "3",
    title: "Partage",
    text: "Reçois ta carte personnelle et poste-la en story.",
  },
];

export default function HomePage() {
  return (
    <>
      <VisitorTracker page="home" />
      <SiteHeader />
      <main>
        <HeroSection />

        <LayoutContainer>
          <SignalsShowcase />

          {/* How it works */}
          <section className="py-12">
            <h2 className="text-center font-serif text-3xl text-ink">
              Comment ça marche
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {STEPS.map((step) => (
                <CardShell key={step.n} className="text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 font-serif text-gold">
                    {step.n}
                  </div>
                  <p className="mt-4 text-lg font-medium text-ink">
                    {step.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.text}
                  </p>
                </CardShell>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="py-8 text-center">
            <CardShell glow className="px-6 py-12">
              <h2 className="font-serif text-3xl text-ink sm:text-4xl">
                Et toi, quel est ton Signal ?
              </h2>
              <p className="mt-3 text-muted">
                7 questions · 60 secondes · Une carte personnelle
              </p>
              <div className="mt-8 flex justify-center">
                <PrimaryButton href="/test">Commencer le test</PrimaryButton>
              </div>
              <div className="mt-6">
                <TrustBar />
              </div>
            </CardShell>
          </section>

          <FAQ />
        </LayoutContainer>

        <Footer />
      </main>
    </>
  );
}
