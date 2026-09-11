"use client";

import * as React from "react";
import Link from "next/link";
import { HelpCircle, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How does Open Smile recognize smiles?",
    answer:
      "Open Smile uses on-device computer vision to evaluate facial landmarks directly in your browser. Raw camera frames never leave your device, ensuring complete privacy and millisecond-fast scoring.",
    category: "AI & Tech",
  },
  {
    question: "How do smile points turn into rewards?",
    answer:
      "Every valid smile score earns coins added to your coin ledger. Accumulated coins can be redeemed for real gift cards (such as Amazon and partner vouchers) in the Rewards Marketplace.",
    category: "Rewards",
  },
  {
    question: "Are my photos stored or sold?",
    answer:
      "No. Photos are processed locally on your device and are never sold. Explore posts are strictly opt-in and automatically auto-delete after 24 hours.",
    category: "Privacy",
  },
  {
    question: "What is a smile streak?",
    answer:
      "Smiling daily builds your consecutive streak, unlocking coin multipliers, special badges, and higher leaderboard rankings.",
    category: "Streaks",
  },
  {
    question: "Do I need to download an app or extension?",
    answer:
      "No downloads required. Open Smile works directly in any standard mobile or desktop web browser with camera access enabled.",
    category: "Platform",
  },
  {
    question: "How does anti-cheat protect the reward pool?",
    answer:
      "Our system uses client-side liveness detection, capture cooldowns, and perceptual image hashing to reject repeat or spoofed captures, keeping the reward economy fair for everyone.",
    category: "Security",
  },
];

export function Faq() {
  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className="border-b-[length:var(--border-width)] border-black bg-background py-16 sm:py-20 lg:py-24 dark:border-border"
    >
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 border-[length:var(--border-width)] border-black rounded-md bg-accent px-3 py-1 font-mono text-xs font-black tracking-widest text-accent-foreground uppercase shadow-brutal-xs dark:border-border">
            <HelpCircle className="size-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-display mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="mt-3 text-base font-semibold text-muted-foreground sm:text-lg">
            Everything you need to know about our on-device smile AI, privacy posture, and rewards.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="space-y-3.5"
          >
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={`faq-${index}`}
                value={`item-${index}`}
                className="overflow-hidden border-[length:var(--border-width)] border-black rounded-lg bg-card shadow-brutal-xs transition-all duration-200 hover:shadow-brutal data-[state=open]:shadow-brutal dark:border-border dark:bg-card"
              >
                <AccordionTrigger className="px-5 py-4 text-left font-title text-base font-bold text-foreground transition-colors hover:no-underline hover:text-primary sm:text-lg [&[data-state=open]]:bg-accent/15">
                  <div className="flex items-center gap-3 pr-2">
                    <span className="flex size-7 shrink-0 items-center justify-center border-[length:var(--border-width)] border-black rounded-md bg-secondary font-mono text-xs font-black text-secondary-foreground shadow-brutal-xs dark:border-border">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 pt-2 text-sm font-medium leading-relaxed text-muted-foreground sm:text-base">
                  <div className="border-t-[length:var(--border-width)] border-border/40 pt-3">
                    {item.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mx-auto mt-10 max-w-xl text-center">
          <div className="inline-flex w-full flex-col items-center justify-between gap-4 border-[length:var(--border-width)] border-black rounded-xl bg-card p-4 sm:flex-row shadow-brutal-xs dark:border-border">
            <div className="text-center sm:text-left">
              <p className="font-title text-sm font-black text-foreground">
                Still wondering how it feels?
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                Test your smile right now in your browser with zero registration.
              </p>
            </div>
            <Button asChild size="sm" className="shrink-0">
              <Link href="/try">
                Try it free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Faq;
