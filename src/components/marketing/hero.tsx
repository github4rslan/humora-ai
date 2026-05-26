"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid absolute inset-0 -z-10" />

      <div className="mx-auto max-w-6xl px-6 pt-24 pb-16 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <Badge className="gap-1.5">
            <Sparkles className="h-3 w-3 text-primary" />
            Hi, I&apos;m Humora · Detector safe across GPTZero, Turnitin, Copyleaks
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-6 text-center text-5xl font-semibold tracking-tight md:text-7xl"
        >
          Hi, I&apos;m Humora.
          <br />
          <span className="gradient-text">I&apos;ll humanize your AI text.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-center text-lg text-muted-foreground"
        >
          Paste your AI draft. I&apos;ll rewrite it so it reads like you wrote it.
          Zero detector flags. Zero AI patterns. Zero stress.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Button asChild size="lg">
            <Link href="#demo">
              Try me free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#how">See how I work</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 text-center text-xs text-muted-foreground"
        >
          No card. No fuss. I&apos;ll handle your first 1,000 words on the house.
        </motion.div>
      </div>
    </section>
  );
}
