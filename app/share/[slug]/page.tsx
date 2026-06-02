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
  searchParams: { s?: string; compare?: string };
}

function resolveSignal(s?: string) {
  return s && isSignalId(s) ? SIGNALS[s] : null;
}

export function generateMetadata({ searchParams }: PageProps): Metadata {
  const signal = resolveSignal(searchParams.s);
  const title = signal ? `Je suis ${signal.shortLabel}. Et toi ?` : "Quel est ton Signal ?";
  const description = "Découvre ton Signal en 7 questions.";
  const ogImage = `/api/og?signal=${signal?.id ?? "visionary"}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function SharePage({ params, searchParams }: PageProps) {
  const signal = resolveSignal(searchParams.s);
  const isCompare = searchParams.compare === "1";

  return (
    <main className="min-h-[100dvh] bg-radial-aura">
      <SharePageTracker slug={params.slug} signalId={signal?.id ?? null} />
      <LayoutContainer narrow className="flex min-h-[80dvh] flex-col items-center justify-center py-16 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Signal99</p>

        {signal ? (
          <>
            <div className="mt-8 w-full max-w-[240px]">
              <SignalEmblem signal={signal} priority />
            </div>
            <h1 className="mt-6 font-serif text-3xl text-ink sm:text-4xl">
              {isCompare
                ? `On t'a défié : ${signal.name}`
                : `Quelqu'un a découvert son Signal : ${signal.name}`}
            </h1>
            <p className="mt-3 text-muted">
              {isCompare
                ? "Fais le test et compare ton Signal au sien."
                : "Et toi, quel est ton Signal ?"}
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-8 font-serif text-4xl text-ink">
              Quel est ton <span className="text-gradient">Signal</span> ?
            </h1>
            <p className="mt-3 text-muted">
              Réponds à 7 questions et découvre l&apos;énergie dominante que les
              autres ressentent chez toi.
            </p>
          </>
        )}

        <div className="mt-10 w-full max-w-xs">
          <PrimaryButton href="/test" fullWidth>
            {isCompare ? "Comparer mon Signal" : "Faire le test"}
          </PrimaryButton>
        </div>

        <p className="mt-6 text-sm text-muted">
          <Link href="/" className="underline hover:text-ink">
            En savoir plus sur SIGNAL99
          </Link>
        </p>
      </LayoutContainer>
      <Footer />
    </main>
  );
}
