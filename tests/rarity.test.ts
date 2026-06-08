import { describe, it, expect } from "vitest";
import { buildResultMeta } from "@/lib/rarity";
import type { QuizOutcome, Scores } from "@/types";

function outcome(
  dominant: QuizOutcome["dominant"],
  secondary: QuizOutcome["secondary"],
  top: number,
  second: number,
): QuizOutcome {
  const scores = { [dominant]: top, [secondary]: second } as Scores;
  return { scores, dominant, secondary };
}

describe("buildResultMeta", () => {
  it("labels a notable duo with a close margin as 'Très rare'", () => {
    const meta = buildResultMeta(outcome("visionary", "oracle", 10, 9));
    expect(meta.rarityLabel).toBe("Très rare");
    expect(meta.comboLabel).not.toBeNull();
  });

  it("labels a notable duo with a wide margin as 'Rare'", () => {
    const meta = buildResultMeta(outcome("visionary", "oracle", 12, 4));
    expect(meta.rarityLabel).toBe("Rare");
  });

  it("labels a wide non-duo margin as 'Fort'", () => {
    const meta = buildResultMeta(outcome("builder", "rebel", 12, 4));
    expect(meta.rarityLabel).toBe("Fort");
    expect(meta.comboLabel).toBeNull();
  });

  it("labels a razor-thin non-duo margin as 'Rare'", () => {
    const meta = buildResultMeta(outcome("builder", "rebel", 6, 5));
    expect(meta.rarityLabel).toBe("Rare");
  });

  it("labels a mid non-duo margin as 'Commun'", () => {
    const meta = buildResultMeta(outcome("builder", "rebel", 7, 4));
    expect(meta.rarityLabel).toBe("Commun");
  });

  it("always returns a non-empty share hook", () => {
    const meta = buildResultMeta(outcome("sovereign", "strategist", 8, 3));
    expect(meta.shareHook.length).toBeGreaterThan(0);
  });
});
