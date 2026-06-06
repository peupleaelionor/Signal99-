import { QUESTIONS } from "@/data/questions";
import { SIGNAL_ORDER } from "@/data/signals";
import type { QuizOutcome, Scores, SignalId } from "@/types";

function emptyScores(): Scores {
  return SIGNAL_ORDER.reduce((acc, id) => {
    acc[id] = 0;
    return acc;
  }, {} as Scores);
}

/**
 * Compute scores from a map of questionId -> selected optionId.
 * Unknown / missing answers are simply ignored, so partial inputs are safe.
 */
export function computeScores(answers: Record<number, string>): Scores {
  const scores = emptyScores();

  for (const question of QUESTIONS) {
    const selectedId = answers[question.id];
    if (!selectedId) continue;
    const option = question.options.find((o) => o.id === selectedId);
    if (!option) continue;
    for (const [signal, points] of Object.entries(option.weights)) {
      scores[signal as SignalId] += points ?? 0;
    }
  }

  return scores;
}

/** Points a given question's selected answer awarded to a signal (0 if none). */
function boostFromQuestion(
  answers: Record<number, string>,
  questionId: number,
  signal: SignalId,
): number {
  const question = QUESTIONS.find((q) => q.id === questionId);
  if (!question) return 0;
  const selectedId = answers[questionId];
  const option = question.options.find((o) => o.id === selectedId);
  return option?.weights[signal] ?? 0;
}

/**
 * Determine dominant + secondary signals from scores.
 *
 * Tie-break follows the pack (`03_QUIZ/scoring-logic.md`) so the result is fully
 * deterministic — no randomness, ever:
 *   1. higher total score
 *   2. signal boosted by question 7
 *   3. signal boosted by question 6
 *   4. stable canonical SIGNAL_ORDER
 */
export function resolveOutcome(
  scores: Scores,
  answers: Record<number, string> = {},
): QuizOutcome {
  const ranked = [...SIGNAL_ORDER].sort((a, b) => {
    const diff = scores[b] - scores[a];
    if (diff !== 0) return diff;

    const q7 = boostFromQuestion(answers, 7, b) - boostFromQuestion(answers, 7, a);
    if (q7 !== 0) return q7;

    const q6 = boostFromQuestion(answers, 6, b) - boostFromQuestion(answers, 6, a);
    if (q6 !== 0) return q6;

    return SIGNAL_ORDER.indexOf(a) - SIGNAL_ORDER.indexOf(b);
  });

  return {
    scores,
    dominant: ranked[0],
    secondary: ranked[1],
  };
}

export function scoreQuiz(answers: Record<number, string>): QuizOutcome {
  return resolveOutcome(computeScores(answers), answers);
}
