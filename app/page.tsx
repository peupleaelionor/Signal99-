import { SiteHeader } from "@/components/SiteHeader";
import { HeroSection } from "@/components/HeroSection";
import { CardsShowcase } from "@/components/CardsShowcase";
import { SignalsShowcase } from "@/components/SignalsShowcase";
import { TrustBar } from "@/components/TrustBar";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { PrimaryButton } from "@/components/PrimaryButton";
import { LayoutContainer } from "@/components/LayoutContainer";
import { CardShell } from "@/components/CardShell";
import { VisitorTracker } from "@/components/VisitorTracker";
import { getDictionary } from "@/lib/i18n";
import { getServerLocale } from "@/lib/i18n-server";

export default function HomePage() {
  const t = getDictionary(getServerLocale());

  return (
    <>
      <VisitorTracker page="home" />
      <SiteHeader />
      <main>
        <HeroSection
          tagline={t.brand.tagline}
          sub={t.home.heroSub}
          collectionLine={t.brand.collectionLine}
          ctaPrimary={t.home.ctaPrimary}
          ctaSecondary={t.home.ctaSecondary}
          exampleNote={t.home.exampleNote}
        />

        <LayoutContainer>
          <CardsShowcase
            kicker={t.cards.kicker}
            title={t.cards.title}
            sub={t.cards.sub}
            rarities={t.cards.rarities}
            cta={t.cards.cta}
          />

          <SignalsShowcase />

          {/* How it works */}
          <section className="py-12">
            <h2 className="text-center font-serif text-3xl text-ink">
              {t.home.howTitle}
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {t.home.steps.map((step, i) => (
                <CardShell key={step.title} className="text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 font-serif text-gold">
                    {i + 1}
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
                {t.home.finalTitle}
              </h2>
              <p className="mt-3 text-muted">{t.brand.promise}</p>
              <div className="mt-8 flex justify-center">
                <PrimaryButton href="/test">{t.home.ctaPrimary}</PrimaryButton>
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
