import type { QuizQuestion } from "@/types";

/**
 * 7 quick, emotional, universal questions (SIGNAL99 product pack).
 * Each option awards weighted points to one or two signals so the final
 * dominant / secondary feel earned rather than random.
 */
export const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    prompt: "Quand tu entres dans une pièce, ton énergie fait souvent quoi ?",
    options: [
      {
        id: "1a",
        label: "Elle prend naturellement de la place.",
        weights: { sovereign: 2, rebel: 1 },
      },
      {
        id: "1b",
        label: "Elle observe avant de se révéler.",
        weights: { strategist: 2, oracle: 1 },
      },
      {
        id: "1c",
        label: "Elle intrigue sans parler.",
        weights: { oracle: 2, visionary: 1 },
      },
      {
        id: "1d",
        label: "Elle rassure les autres.",
        weights: { protector: 2, builder: 1 },
      },
    ],
  },
  {
    id: 2,
    prompt: "Face à un problème, ton premier réflexe est :",
    options: [
      {
        id: "2a",
        label: "Reprendre le contrôle.",
        weights: { sovereign: 2, builder: 1 },
      },
      {
        id: "2b",
        label: "Comprendre la stratégie.",
        weights: { strategist: 2, oracle: 1 },
      },
      {
        id: "2c",
        label: "Imaginer une autre voie.",
        weights: { visionary: 2, rebel: 1 },
      },
      {
        id: "2d",
        label: "Construire une solution stable.",
        weights: { builder: 2, protector: 1 },
      },
    ],
  },
  {
    id: 3,
    prompt: "Ce que les autres sous-estiment chez toi :",
    options: [
      {
        id: "3a",
        label: "Ton ambition.",
        weights: { sovereign: 2, visionary: 1 },
      },
      {
        id: "3b",
        label: "Ta patience.",
        weights: { strategist: 2, builder: 1 },
      },
      {
        id: "3c",
        label: "Ton intuition.",
        weights: { oracle: 2, visionary: 1 },
      },
      {
        id: "3d",
        label: "Ta capacité à survivre aux ruptures.",
        weights: { rebel: 2, protector: 1 },
      },
    ],
  },
  {
    id: 4,
    prompt: "Ce qui t'attire le plus :",
    options: [
      {
        id: "4a",
        label: "Diriger.",
        weights: { sovereign: 2, strategist: 1 },
      },
      {
        id: "4b",
        label: "Comprendre.",
        weights: { strategist: 2, oracle: 1 },
      },
      {
        id: "4c",
        label: "Créer.",
        weights: { visionary: 2, builder: 1 },
      },
      {
        id: "4d",
        label: "Être libre.",
        weights: { rebel: 2, oracle: 1 },
      },
    ],
  },
  {
    id: 5,
    prompt: "Dans un groupe, tu deviens souvent :",
    options: [
      {
        id: "5a",
        label: "Celui ou celle qui influence.",
        weights: { sovereign: 2, rebel: 1 },
      },
      {
        id: "5b",
        label: "Celui ou celle qui analyse.",
        weights: { strategist: 2, oracle: 1 },
      },
      {
        id: "5c",
        label: "Celui ou celle qui inspire.",
        weights: { visionary: 2, sovereign: 1 },
      },
      {
        id: "5d",
        label: "Celui ou celle qui protège.",
        weights: { protector: 2, builder: 1 },
      },
    ],
  },
  {
    id: 6,
    prompt: "Ton danger intérieur le plus probable :",
    options: [
      {
        id: "6a",
        label: "Tout contrôler.",
        weights: { sovereign: 2, strategist: 1 },
      },
      {
        id: "6b",
        label: "Trop réfléchir.",
        weights: { strategist: 2, oracle: 1 },
      },
      {
        id: "6c",
        label: "Te perdre dans tes visions.",
        weights: { visionary: 2, rebel: 1 },
      },
      {
        id: "6d",
        label: "Porter trop de choses seul.",
        weights: { protector: 2, builder: 1 },
      },
    ],
  },
  {
    id: 7,
    prompt: "Ce que tu veux vraiment laisser derrière toi :",
    options: [
      {
        id: "7a",
        label: "Un empire.",
        weights: { sovereign: 2, builder: 1 },
      },
      {
        id: "7b",
        label: "Une stratégie qui change tout.",
        weights: { strategist: 2, visionary: 1 },
      },
      {
        id: "7c",
        label: "Une vision nouvelle.",
        weights: { visionary: 2, oracle: 1 },
      },
      {
        id: "7d",
        label: "Une trace utile et solide.",
        weights: { builder: 2, protector: 1 },
      },
    ],
  },
];

export const QUESTION_COUNT = QUESTIONS.length;
