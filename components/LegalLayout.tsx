import type { ReactNode } from "react";
import Link from "next/link";
import { LayoutContainer } from "@/components/LayoutContainer";
import { Footer } from "@/components/Footer";

export function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-[100dvh]">
      <LayoutContainer className="py-14">
        <Link href="/" className="text-sm text-muted hover:text-ink">
          ← SIGNAL99
        </Link>
        <h1 className="mt-6 font-serif text-3xl text-ink sm:text-4xl">{title}</h1>
        <div className="mt-8 flex flex-col gap-4 text-sm leading-relaxed text-muted [&_h2]:mt-4 [&_h2]:font-serif [&_h2]:text-lg [&_h2]:text-ink">
          {children}
        </div>
      </LayoutContainer>
      <Footer />
    </main>
  );
}
