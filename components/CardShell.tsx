import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardShellProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

/** Reusable luxurious surface used for content blocks. */
export function CardShell({ children, className, glow }: CardShellProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border-hairline bg-card p-6 shadow-card",
        glow && "shadow-aura",
        className,
      )}
    >
      {children}
    </div>
  );
}
