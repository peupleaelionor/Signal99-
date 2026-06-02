import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface LayoutContainerProps {
  children: ReactNode;
  className?: string;
  /** Narrow column for focused flows (quiz, checkout). */
  narrow?: boolean;
}

/** Mobile-first centered column with consistent horizontal padding. */
export function LayoutContainer({
  children,
  className,
  narrow,
}: LayoutContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-6",
        narrow ? "max-w-md" : "max-w-2xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
