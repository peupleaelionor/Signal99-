import type { Metadata } from "next";
import { LayoutContainer } from "@/components/LayoutContainer";
import { PrimaryButton } from "@/components/PrimaryButton";

export const metadata: Metadata = {
  title: "Payment canceled",
  robots: { index: false },
};

export default function CancelPage() {
  return (
    <main className="flex min-h-[100dvh] items-center bg-radial-aura">
      <LayoutContainer narrow className="text-center">
        <h1 className="font-serif text-3xl text-ink">Payment canceled</h1>
        <p className="mt-3 text-muted">
          No worries — nothing was charged. Your Signal is still waiting.
        </p>
        <div className="mt-8 flex justify-center">
          <PrimaryButton href="/test">Reveal my Signal</PrimaryButton>
        </div>
      </LayoutContainer>
    </main>
  );
}
