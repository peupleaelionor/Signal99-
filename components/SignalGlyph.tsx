import type { SVGProps } from "react";

/**
 * Minimalist line-symbols for each archetype (no emoji, no cartoon).
 * Drawn with `currentColor` so the aura color flows through.
 */

type GlyphName =
  | "crown"
  | "compass"
  | "horizon"
  | "pillar"
  | "bolt"
  | "shield"
  | "moon";

interface SignalGlyphProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: string;
  size?: number;
}

const PATHS: Record<GlyphName, JSX.Element> = {
  // abstract crown
  crown: (
    <>
      <path d="M6 34h36" />
      <path d="M6 34l3-18 9 11 6-15 6 15 9-11 3 18" />
    </>
  ),
  // tactical compass star
  compass: (
    <>
      <circle cx="24" cy="24" r="17" />
      <path d="M24 9l4 11 11 4-11 4-4 11-4-11-11-4 11-4z" />
    </>
  ),
  // solar horizon / eye
  horizon: (
    <>
      <path d="M6 30h36" />
      <circle cx="24" cy="30" r="9" />
      <path d="M24 6v6M11 13l3 3M37 13l-3 3" />
    </>
  ),
  // pillar / column
  pillar: (
    <>
      <path d="M10 12h28M8 38h32" />
      <path d="M16 12v26M24 12v26M32 12v26" />
    </>
  ),
  // elegant fracture / bolt
  bolt: <path d="M27 5L11 27h10l-4 16 18-24H24z" />,
  // soft shield
  shield: (
    <>
      <path d="M24 5l15 5v11c0 9-6.5 15-15 22-8.5-7-15-13-15-22V10z" />
      <path d="M17 24l5 5 9-11" />
    </>
  ),
  // crescent moon
  moon: (
    <>
      <path d="M31 6a18 18 0 1 0 11 30A20 20 0 0 1 31 6z" />
      <circle cx="34" cy="30" r="1.6" />
    </>
  ),
};

function isGlyph(name: string): name is GlyphName {
  return name in PATHS;
}

export function SignalGlyph({ name, size = 48, ...rest }: SignalGlyphProps) {
  const content = isGlyph(name) ? PATHS[name] : PATHS.compass;
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {content}
    </svg>
  );
}
