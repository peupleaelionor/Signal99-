import type { Metadata } from "next";
import { LayoutContainer } from "@/components/LayoutContainer";
import { PrimaryButton } from "@/components/PrimaryButton";

export const metadata: Metadata = {
  title: "Paiement annulé",
  robots: { index: false },
};

export default function CancelPage() {
  return (
    <main className="flex min-h-[100dvh] items-center bg-radial-aura">
      <LayoutContainer narrow className="text-center">
        <h1 className="font-serif text-3xl text-ink">Paiement annulé</h1>
        <p className="mt-3 text-muted">
          Aucun souci, rien n&apos;a été débité. Ton Signal t&apos;attend encore.
        </p>
        <div className="mt-8 flex justify-center">
          <PrimaryButton href="/test">Reprendre le test</PrimaryButton>
        </div>
      </LayoutContainer>
    </main>
  );
}
