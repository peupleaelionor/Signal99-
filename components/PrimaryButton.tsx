import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-medium tracking-tight transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 disabled:opacity-50 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-copper-gold text-background shadow-aura hover:brightness-110 font-semibold",
  secondary:
    "bg-surface text-ink border-hairline hover:border-copper/60 hover:text-gold",
  ghost: "text-muted hover:text-ink",
};

interface CommonProps {
  variant?: Variant;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkProps = CommonProps & {
  href: string;
  external?: boolean;
};

export function PrimaryButton(props: ButtonProps | LinkProps) {
  const { variant = "primary", fullWidth, className, children } = props;
  const classes = cn(base, variants[variant], fullWidth && "w-full", className);

  if ("href" in props && props.href !== undefined) {
    const { href, external } = props as LinkProps;
    if (external) {
      return (
        <a href={href} className={classes} target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const {
    variant: _v,
    fullWidth: _f,
    className: _c,
    children: _ch,
    ...rest
  } = props as ButtonProps;
  void _v;
  void _f;
  void _c;
  void _ch;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
