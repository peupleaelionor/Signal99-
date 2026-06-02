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

/**
 * Determine dominant + secondary signals from scores.
 * Tie-break is stable: it follows SIGNAL_ORDER so the same answers always
 * yield the same result.
 */
export function resolveOutcome(scores: Scores): QuizOutcome {
  const ranked = [...SIGNAL_ORDER].sort((a, b) => {
    const diff = scores[b] - scores[a];
    if (diff !== 0) return diff;
    // stable tie-break by canonical order
    return SIGNAL_ORDER.indexOf(a) - SIGNAL_ORDER.indexOf(b);
  });

  return {
    scores,
    dominant: ranked[0],
    secondary: ranked[1],
  };
}

export function scoreQuiz(answers: Record<number, string>): QuizOutcome {
  return resolveOutcome(computeScores(answers));
}
