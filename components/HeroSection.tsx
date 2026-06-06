"use client";

import { motion } from "framer-motion";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SignalCard } from "@/components/SignalCard";
import { LayoutContainer } from "@/components/LayoutContainer";
import { SIGNALS } from "@/data/signals";
import { CTA } from "@/lib/copy";

/** Above-the-fold hero: the 2-second pitch + the example card. */
export function HeroSection() {
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
            What’s your <span className="text-gradient">Signal</span>?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg"
          >
            Your energy speaks before you do. Answer 7 questions and reveal the
            card that reflects your presence.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-sm tracking-wide text-ink/70"
          >
            7 questions · 60 seconds · One unique card
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-9 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <PrimaryButton href="/test" fullWidth className="sm:w-auto">
              {CTA.reveal}
            </PrimaryButton>
            <PrimaryButton
              href="#example"
              variant="secondary"
              fullWidth
              className="sm:w-auto"
            >
              {CTA.seeSignals}
            </PrimaryButton>
          </motion.div>
        </div>

        <motion.div
          id="example"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 scroll-mt-24"
        >
          <SignalCard signal={SIGNALS.visionary} />
          <p className="mt-5 text-center text-xs text-muted">
            An example card — yours will be unique.
          </p>
        </motion.div>
      </LayoutContainer>
    </section>
  );
}
