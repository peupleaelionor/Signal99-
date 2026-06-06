import type { QuizQuestion } from "@/types";

/**
 * 7 quick, emotional, universal questions (SIGNAL99 pack `03_QUIZ/questions.json`).
 * Each option awards weighted points to one or two Signals so the final
 * dominant / secondary feel earned rather than random.
 */
export const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    prompt: "When you enter a room, your energy usually…",
    options: [
      { id: "1a", label: "Takes space naturally.", weights: { king_queen: 2, rebel: 1 } },
      { id: "1b", label: "Observes before revealing itself.", weights: { strategist: 2, oracle: 1 } },
      { id: "1c", label: "Intrigues without speaking.", weights: { oracle: 2, visionary: 1 } },
      { id: "1d", label: "Makes people feel safe.", weights: { protector: 2, builder: 1 } },
    ],
  },
  {
    id: 2,
    prompt: "Facing a problem, your first instinct is to…",
    options: [
      { id: "2a", label: "Take back control.", weights: { king_queen: 2, strategist: 1 } },
      { id: "2b", label: "Read the situation.", weights: { strategist: 2, oracle: 1 } },
      { id: "2c", label: "Imagine another path.", weights: { visionary: 2, rebel: 1 } },
      { id: "2d", label: "Build a stable solution.", weights: { builder: 2, protector: 1 } },
    ],
  },
  {
    id: 3,
    prompt: "What people underestimate about you is…",
    options: [
      { id: "3a", label: "Your ambition.", weights: { king_queen: 2, builder: 1 } },
      { id: "3b", label: "Your patience.", weights: { strategist: 2, protector: 1 } },
      { id: "3c", label: "Your intuition.", weights: { oracle: 2, visionary: 1 } },
      { id: "3d", label: "Your ability to survive change.", weights: { rebel: 2, builder: 1 } },
    ],
  },
  {
    id: 4,
    prompt: "What attracts you the most?",
    options: [
      { id: "4a", label: "Leading.", weights: { king_queen: 2, protector: 1 } },
      { id: "4b", label: "Understanding.", weights: { strategist: 2, oracle: 1 } },
      { id: "4c", label: "Creating.", weights: { visionary: 2, builder: 1 } },
      { id: "4d", label: "Freedom.", weights: { rebel: 2, visionary: 1 } },
    ],
  },
  {
    id: 5,
    prompt: "In a group, you often become…",
    options: [
      { id: "5a", label: "The one who influences.", weights: { king_queen: 2, rebel: 1 } },
      { id: "5b", label: "The one who analyzes.", weights: { strategist: 2, builder: 1 } },
      { id: "5c", label: "The one who inspires.", weights: { visionary: 2, oracle: 1 } },
      { id: "5d", label: "The one who protects.", weights: { protector: 2, king_queen: 1 } },
    ],
  },
  {
    id: 6,
    prompt: "Your hidden risk is…",
    options: [
      { id: "6a", label: "Wanting to control everything.", weights: { king_queen: 2, strategist: 1 } },
      { id: "6b", label: "Thinking too much.", weights: { strategist: 2, oracle: 1 } },
      { id: "6c", label: "Getting lost in visions.", weights: { visionary: 2, oracle: 1 } },
      { id: "6d", label: "Carrying too much alone.", weights: { protector: 2, builder: 1 } },
    ],
  },
  {
    id: 7,
    prompt: "What do you want to leave behind?",
    options: [
      { id: "7a", label: "An empire.", weights: { king_queen: 2, builder: 1 } },
      { id: "7b", label: "A strategy that changes everything.", weights: { strategist: 2, visionary: 1 } },
      { id: "7c", label: "A new vision.", weights: { visionary: 2, rebel: 1 } },
      { id: "7d", label: "Something useful and solid.", weights: { builder: 2, protector: 1 } },
    ],
  },
];

export const QUESTION_COUNT = QUESTIONS.length;
