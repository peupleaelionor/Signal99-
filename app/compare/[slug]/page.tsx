import type { Metadata } from "next";
import Link from "next/link";
import { SIGNALS, isSignalId } from "@/data/signals";
import { SignalEmblem } from "@/components/SignalEmblem";
import { LayoutContainer } from "@/components/LayoutContainer";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Footer } from "@/components/Footer";
import { SharePageTracker } from "@/components/SharePageTracker";

interface PageProps {
  params: { slug: string };
  searchParams: { s?: string };
}

function resolveSignal(s?: string) {
  return s && isSignalId(s) ? SIGNALS[s] : null;
}

/**
 * Friend-comparison invite landing (/compare/[slug]?s=signal).
 *
 * A friend lands here from a "compare with me" link. They are invited to take
 * the test; the referral slug is carried into /test so the loop is attributable.
 * The real two-Signal comparison is a documented next step — this is the viral
 * entry point.
 */
export function generateMetadata({ searchParams }: PageProps): Metadata {
  const signal = resolveSignal(searchParams.s);
  const title = signal
    ? `On te défie : ${signal.shortLabel}. Et toi ?`
    : "Compare ton Signal avec un ami";
  const description = "Fais le test, révèle ton Signal et compare votre énergie.";
  const ogImage = `/api/og?signal=${signal?.id ?? "visionary"}`;
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: ogImage, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default function ComparePage({ params, searchParams }: PageProps) {
  const signal = resolveSignal(searchParams.s);
  const testHref = `/test?ref=${encodeURIComponent(params.slug)}${
    signal ? `&vs=${signal.id}` : ""
  }`;

  return (
    <main className="min-h-[100dvh] bg-radial-aura">
      <SharePageTracker slug={params.slug} signalId={signal?.id ?? null} />
      <LayoutContainer
        narrow
        className="flex min-h-[80dvh] flex-col items-center justify-center py-16 text-center"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          SIGNAL99 · Comparaison
        </p>

        {signal ? (
          <>
            <div className="mt-8 w-full max-w-[220px]">
              <SignalEmblem signal={signal} priority />
            </div>
            <h1 className="mt-6 font-serif text-3xl text-ink sm:text-4xl">
              On t&apos;a défié : {signal.name}
            </h1>
            <p className="mt-3 text-muted">
              Révèle ton Signal et découvre votre alignement, vos frictions et
              votre pouvoir commun.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-8 font-serif text-4xl text-ink">
              Compare ton <span className="text-gradient">Signal</span>.
            </h1>
            <p className="mt-3 text-muted">
              Un ami t&apos;a invité. Fais le test et compare votre énergie.
            </p>
          </>
        )}

        <div className="mt-10 w-full max-w-xs">
          <PrimaryButton href={testHref} fullWidth>
            Comparer mon Signal
          </PrimaryButton>
        </div>

        <p className="mt-6 text-sm text-muted">
          <Link href="/" className="underline hover:text-ink">
            Découvrir SIGNAL99
          </Link>
        </p>
      </LayoutContainer>
      <Footer />
    </main>
  );
}
