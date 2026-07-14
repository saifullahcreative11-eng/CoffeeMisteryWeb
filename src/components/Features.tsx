"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { site } from "@/config/site";

const featureImages = [
  { src: "/media/Single Origin.png", alt: "Single-origin coffee beans", position: "top" },
  { src: "/media/Precision Espresso.png", alt: "Precision espresso preparation", position: "center 50%" },
  { src: "/media/dkjsn.png", alt: "Slow bar coffee brewing", position: "center 85%" },
  { src: "/media/Coffee mistry.webp", alt: "Coffeemistry cafe atmosphere", position: "center 75%", scale: 1.08 },
];

const ease = [0.22, 1, 0.36, 1] as const;

type Feature = (typeof site.features)[number];

function FeatureCard({
  feature,
  image,
  index,
  active = true,
  onHover,
}: {
  feature: Feature;
  image: (typeof featureImages)[number];
  index: number;
  active?: boolean;
  onHover?: (index: number | null) => void;
}) {
  return (
    <article
      onMouseEnter={() => onHover?.(index)}
      onMouseLeave={() => onHover?.(null)}
      className={`group relative h-full min-h-[280px] overflow-hidden rounded-2xl border border-border bg-background/70 p-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-accent/45 hover:shadow-[0_24px_60px_-34px_rgba(51,92,75,0.7)] md:p-7 ${
        active ? "scale-100 opacity-100" : "scale-[0.97] opacity-60"
      }`}
    >
      <div
        className="absolute inset-0 opacity-[0.8] transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-[0.62]"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 46%, transparent 62%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 46%, transparent 62%)",
        }}
      >
        <Image
          src={image.src}
          alt=""
          fill
          sizes="(max-width: 768px) 85vw, 25vw"
          className="object-cover saturate-100"
          style={{
            objectPosition: image.position,
            transform: image.scale ? `scale(${image.scale})` : undefined,
          }}
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(246,241,233,0)_0%,rgba(246,241,233,0)_42%,rgba(51,92,75,0.05)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-background via-background to-transparent" />
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accent/0 blur-3xl transition-colors duration-700 group-hover:bg-accent/18" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="mt-auto pt-28">
          <h3 className="font-display text-xl font-semibold leading-tight text-foreground">
            {feature.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {feature.description}
          </p>
        </div>
      </div>
    </article>
  );
}

export function Features() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const inView = useInView(sectionRef, { once: true, margin: "-18% 0px -18% 0px" });

  const handleCarouselScroll = () => {
    const carousel = carouselRef.current;
    const firstCard = carousel?.querySelector<HTMLElement>("[data-feature-card]");
    if (!carousel || !firstCard) return;

    const gap = 14;
    const cardStep = firstCard.offsetWidth + gap;
    const nextIndex = Math.round(carousel.scrollLeft / cardStep);
    setActiveIndex(Math.min(Math.max(nextIndex, 0), site.features.length - 1));
  };

  return (
    <section ref={sectionRef} className="overflow-hidden border-y border-border bg-surface/40 pt-14 pb-14 md:pt-16 md:pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 26 }}
          animate={inView || shouldReduceMotion ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {site.sections.featuresLabel}
          </span>
          <h2 className="mt-4 text-balance font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl">
            {site.sections.featuresHeading}
          </h2>
        </motion.div>

        <div className="relative mt-14 hidden md:block">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 z-0 h-64 w-64 -translate-y-1/2 rounded-full bg-accent/15 blur-3xl"
            initial={false}
            animate={{
              opacity: hoveredIndex === null ? 0.28 : 0.46,
              left: `${((hoveredIndex ?? 1.5) + 0.5) * 25}%`,
              x: "-50%",
            }}
            transition={{ duration: 0.65, ease }}
          />

          <div className="relative z-10 grid grid-cols-4 gap-4 lg:gap-6">
            {site.features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
                animate={inView || shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : undefined}
                transition={{ duration: 0.68, ease, delay: 0.15 + index * 0.1 }}
              >
                <FeatureCard
                  feature={feature}
                  image={featureImages[index] ?? site.assets.gallery[0]}
                  index={index}
                  onHover={setHoveredIndex}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-9 md:hidden">
          <div className="mb-4 flex items-center justify-end">
      
            <p className="font-mono text-xs text-muted-foreground" aria-live="polite">
              {String(activeIndex + 1).padStart(2, "0")} — {String(site.features.length).padStart(2, "0")}
            </p>
          </div>

          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="-mx-6 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-6 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {site.features.map((feature, index) => (
              <motion.div
                key={feature.title}
                data-feature-card
                className="w-[85%] shrink-0 snap-center"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20, scale: 0.96 }}
                animate={inView || shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : undefined}
                transition={{ duration: 0.62, ease, delay: index * 0.08 }}
              >
                <FeatureCard
                  feature={feature}
                  image={featureImages[index] ?? site.assets.gallery[0]}
                  index={index}
                  active={activeIndex === index}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
