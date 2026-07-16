"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CaretLeft, CaretRight, Quotes } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";

const testimonials = site.testimonials;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const go = (dir: number) => {
    setDirection(dir);
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);
  };

  const current = testimonials[index];
  const swipeConfidenceThreshold = 44;
  const swipeVelocityThreshold = 420;

  return (
    <section id="reviews" className="relative overflow-hidden border-y border-border bg-surface/40 pt-20 pb-14 md:pt-24 md:pb-20">
      <Quotes
        size={220}
        weight="fill"
        className="pointer-events-none absolute -left-10 -top-10 text-accent/5"
      />
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
        <Reveal>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {site.sections.reviewsLabel}
          </span>
        </Reveal>

        <div className="relative mt-10 min-h-[220px] sm:min-h-[180px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              dragMomentum={false}
              dragSnapToOrigin
              onDragEnd={(_, info) => {
                if (info.offset.x <= -swipeConfidenceThreshold || info.velocity.x <= -swipeVelocityThreshold) {
                  go(1);
                } else if (info.offset.x >= swipeConfidenceThreshold || info.velocity.x >= swipeVelocityThreshold) {
                  go(-1);
                }
              }}
              className="absolute inset-0 cursor-grab touch-pan-y select-none active:cursor-grabbing"
            >
              <p className="text-balance font-display text-2xl italic leading-relaxed text-foreground md:text-3xl">
                &ldquo;{current.quote}&rdquo;
              </p>
              <p className="mt-6 text-sm font-semibold text-accent">{current.name}</p>
              <p className="text-xs text-muted-foreground">{current.role}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => go(-1)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border-strong text-foreground transition-colors hover:border-accent hover:text-accent focus:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <CaretLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            {testimonials.map((t, i) => (
              <button
                key={`${t.name}-${i}`}
                type="button"
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  i === index ? "w-6 bg-accent" : "w-1.5 bg-border-strong"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => go(1)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border-strong text-foreground transition-colors hover:border-accent hover:text-accent focus:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <CaretRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
