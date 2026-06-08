import { describe, it, expect } from "vitest";
import { computeScores, resolveOutcome, scoreQuiz } from "@/lib/scoring";
import { QUESTIONS } from "@/data/questions";
import { SIGNAL_ORDER } from "@/data/signals";
import type { Scores } from "@/types";

/** Build an answer set that always picks option[index] of each question. */
function pick(index: number): Record<number, string> {
  const answers: Record<number, string> = {};
  for (const q of QUESTIONS) {
    const opt = q.options[Math.min(index, q.options.length - 1)];
    answers[q.id] = opt.id;
  }
  return answers;
}

describe("computeScores", () => {
  it("returns a zeroed score for every signal with no answers", () => {
    const scores = computeScores({});
    for (const id of SIGNAL_ORDER) {
      expect(scores[id]).toBe(0);
    }
  });

  it("ignores unknown question ids and unknown option ids", () => {
    const scores = computeScores({ 999: "nope", [QUESTIONS[0].id]: "nope" });
    const total = SIGNAL_ORDER.reduce((s, id) => s + scores[id], 0);
    expect(total).toBe(0);
  });

  it("accumulates weights from selected options", () => {
    const first = QUESTIONS[0];
    const opt = first.options[0];
    const scores = computeScores({ [first.id]: opt.id });
    const expected = Object.values(opt.weights).reduce(
      (s, n) => s + (n ?? 0),
      0,
    );
    const total = SIGNAL_ORDER.reduce((s, id) => s + scores[id], 0);
    expect(total).toBe(expected);
  });
});

describe("resolveOutcome tie-break", () => {
  it("is stable: ties resolve by canonical SIGNAL_ORDER", () => {
    const flat: Scores = SIGNAL_ORDER.reduce((acc, id) => {
      acc[id] = 5;
      return acc;
    }, {} as Scores);
    const outcome = resolveOutcome(flat);
    expect(outcome.dominant).toBe(SIGNAL_ORDER[0]);
    expect(outcome.secondary).toBe(SIGNAL_ORDER[1]);
  });

  it("ranks the highest score as dominant", () => {
    const scores: Scores = SIGNAL_ORDER.reduce((acc, id) => {
      acc[id] = 0;
      return acc;
    }, {} as Scores);
    scores[SIGNAL_ORDER[3]] = 10;
    scores[SIGNAL_ORDER[5]] = 4;
    const outcome = resolveOutcome(scores);
    expect(outcome.dominant).toBe(SIGNAL_ORDER[3]);
    expect(outcome.secondary).toBe(SIGNAL_ORDER[5]);
  });
});

describe("scoreQuiz determinism", () => {
  it("produces the same outcome for the same answers", () => {
    const a = scoreQuiz(pick(0));
    const b = scoreQuiz(pick(0));
    expect(a.dominant).toBe(b.dominant);
    expect(a.secondary).toBe(b.secondary);
    expect(a.dominant).not.toBe(a.secondary);
  });
});
