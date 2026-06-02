import type { Metadata } from "next";
import { QuizFlow } from "@/components/QuizFlow";

export const metadata: Metadata = {
  title: "Le test",
  description:
    "7 questions pour découvrir ton Signal dominant. 60 secondes, sans inscription.",
};

export default function TestPage() {
  return (
    <main className="min-h-[100dvh] bg-radial-aura">
      <QuizFlow />
    </main>
  );
}
