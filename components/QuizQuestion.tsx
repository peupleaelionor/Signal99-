"use client";

import { motion } from "framer-motion";
import type { QuizQuestion as Question } from "@/types";
import { cn } from "@/lib/cn";

interface QuizQuestionProps {
  question: Question;
  selectedId?: string;
  onSelect: (optionId: string) => void;
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function QuizQuestion({
  question,
  selectedId,
  onSelect,
}: QuizQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <h2 className="font-serif text-2xl leading-snug text-ink sm:text-3xl">
        {question.prompt}
      </h2>

      <div className="mt-8 flex flex-col gap-3">
        {question.options.map((option, i) => {
          const active = selectedId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={active}
              className={cn(
                "group flex items-center gap-4 rounded-xl border px-4 py-4 text-left transition-all duration-200 active:scale-[0.99]",
                active
                  ? "border-gold/70 bg-card shadow-aura"
                  : "border-line bg-surface hover:border-copper/50",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-colors",
                  active
                    ? "border-gold/70 bg-copper-gold text-background"
                    : "border-line text-muted group-hover:text-ink",
                )}
              >
                {LETTERS[i]}
              </span>
              <span
                className={cn(
                  "text-base leading-snug",
                  active ? "text-ink" : "text-ink/90",
                )}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
