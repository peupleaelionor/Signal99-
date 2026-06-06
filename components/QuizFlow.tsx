"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { QUESTIONS, QUESTION_COUNT } from "@/data/questions";
import { ProgressBar } from "@/components/ProgressBar";
import { QuizQuestion } from "@/components/QuizQuestion";
import { LayoutContainer } from "@/components/LayoutContainer";
import { createResult } from "@/lib/storage";
import { track } from "@/lib/analytics";
import { QUIZ_MICROCOPY } from "@/lib/copy";

/**
 * Orchestrates the 7-question funnel: one question per screen, auto-advance on
 * selection, then computes + stores the result and routes to /result/[id].
 */
export function QuizFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    track("quiz_started");
  }, []);

  const question = QUESTIONS[step];

  function handleSelect(optionId: string) {
    if (submitting) return;
    const next = { ...answers, [question.id]: optionId };
    setAnswers(next);
    track("question_answered", { question: question.id, option: optionId });

    // brief delay so the selected state is visible before advancing
    window.setTimeout(() => {
      if (step < QUESTION_COUNT - 1) {
        setStep((s) => s + 1);
      } else {
        finish(next);
      }
    }, 260);
  }

  function finish(finalAnswers: Record<number, string>) {
    setSubmitting(true);
    const record = createResult(finalAnswers);
    track("quiz_completed", {
      dominant: record.dominantSignal,
      secondary: record.secondarySignal,
    });
    router.push(`/result/${record.id}`);
  }

  function handleBack() {
    if (step === 0) {
      router.push("/");
      return;
    }
    setStep((s) => s - 1);
  }

  return (
    <LayoutContainer narrow className="flex min-h-[100dvh] flex-col py-8">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="text-sm text-muted transition-colors hover:text-ink"
          aria-label="Previous question"
        >
          ← Back
        </button>
        <span className="text-xs uppercase tracking-[0.3em] text-muted">
          Signal99
        </span>
      </div>

      <div className="mt-8">
        <ProgressBar current={step + 1} total={QUESTION_COUNT} />
        <p className="mt-3 text-center text-xs tracking-wide text-muted">
          {step < QUESTION_COUNT - 1 ? QUIZ_MICROCOPY.instinct : QUIZ_MICROCOPY.forming}
        </p>
      </div>

      <div className="mt-10 flex-1">
        <AnimatePresence mode="wait">
          <QuizQuestion
            key={question.id}
            question={question}
            selectedId={answers[question.id]}
            onSelect={handleSelect}
          />
        </AnimatePresence>
      </div>

      <p className="pt-8 text-center text-xs text-muted">
        No account. 7 questions. 60 seconds.
      </p>
    </LayoutContainer>
  );
}
