"use client";

import { motion } from "framer-motion";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SignalCard } from "@/components/SignalCard";
import { LayoutContainer } from "@/components/LayoutContainer";
import { SIGNALS } from "@/data/signals";

interface HeroSectionProps {
  tagline: string;
  sub: string;
  collectionLine: string;
  ctaPrimary: string;
  ctaSecondary: string;
  exampleNote: string;
}

/** Above-the-fold hero: the 2-second pitch + the example card. */
export function HeroSection({
  tagline,
  sub,
  collectionLine,
  ctaPrimary,
  ctaSecondary,
  exampleNote,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-radial-aura pb-16 pt-16 sm:pt-24">
      <LayoutContainer>
        <div className="flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-full border-hairline px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-muted"
          >
            Signal99
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-6 font-serif text-4xl leading-tight text-ink sm:text-6xl"
          >
            <span className="text-gradient">{tagline}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg"
          >
            {sub}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-sm tracking-wide text-ink/70"
          >
            {collectionLine}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-9 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <PrimaryButton href="/test" fullWidth className="sm:w-auto">
              {ctaPrimary}
            </PrimaryButton>
            <PrimaryButton
              href="#cartes"
              variant="secondary"
              fullWidth
              className="sm:w-auto"
            >
              {ctaSecondary}
            </PrimaryButton>
          </motion.div>
        </div>

        <motion.div
          id="exemple"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 scroll-mt-24"
        >
          <SignalCard signal={SIGNALS.visionary} />
          <p className="mt-5 text-center text-xs text-muted">{exampleNote}</p>
        </motion.div>
      </LayoutContainer>
    </section>
  );
}
