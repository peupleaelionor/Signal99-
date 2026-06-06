import type { Metadata } from "next";
import { QuizFlow } from "@/components/QuizFlow";

export const metadata: Metadata = {
  title: "The test",
  description:
    "7 questions to reveal your dominant Signal. 60 seconds, no account needed.",
};

export default function TestPage() {
  return (
    <main className="min-h-[100dvh] bg-radial-aura">
      <QuizFlow />
    </main>
  );
}
