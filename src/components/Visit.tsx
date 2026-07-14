"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowSquareOut, Clock, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";

const locations = [
  {
    id: "f8-hq",
    name: "F-8 HQ",
    address: "Shop 1 & 2, Block 8 Allahwali Market, F-8/1, Islamabad",
    hours: "7:30 AM - 11:30 PM",
    phone: "+92 307 8263333",
    mapEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(
      "Coffeemistry Shop 1 & 2 Block 8 Allahwali Market F-8/1 Islamabad"
    )}&output=embed`,
    directionsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      "Coffeemistry Shop 1 & 2 Block 8 Allahwali Market F-8/1 Islamabad"
    )}`,
  },
  {
    id: "f7-location",
    name: "F-7 Location",
    address: "Caltex, F-7 Markaz, Islamabad",
    hours: "7:30 AM - 1:00 AM",
    phone: "+92 307 7263333",
    mapEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(
      "Coffeemistry Caltex F-7 Markaz Islamabad"
    )}&output=embed`,
    directionsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      "Coffeemistry Caltex F-7 Markaz Islamabad"
    )}`,
  },
];

const panelTransition = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function Visit() {
  const [activeLocationId, setActiveLocationId] = useState(locations[0].id);
  const activeLocation =
    locations.find((location) => location.id === activeLocationId) ?? locations[0];
  const phoneHref = `tel:${activeLocation.phone.replace(/\s/g, "")}`;

  return (
    <section id="visit" className="bg-background pt-14 pb-14 md:pt-16 md:pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {site.sections.visitLabel}
          </span>
          <h2 className="mt-4 text-balance font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl">
            {site.sections.visitHeading}
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div
            role="tablist"
            aria-label="Select Coffeemistry location"
            className="mx-auto grid max-w-xl grid-cols-2 gap-1.5 rounded-full border border-border bg-surface/60 p-1.5"
          >
            {locations.map((location) => {
              const isActive = location.id === activeLocationId;
              return (
                <button
                  key={location.id}
                  id={`${location.id}-tab`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="location-panel"
                  onClick={() => setActiveLocationId(location.id)}
                  className={`rounded-full px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/35 focus:ring-offset-2 focus:ring-offset-background sm:text-base ${
                    isActive
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
                  }`}
                >
                  {location.name}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-8 grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.95fr)] lg:gap-10">
          <Reveal delay={0.15} className="h-full">
            <div className="relative h-full min-h-[360px] overflow-hidden rounded-2xl border border-border bg-surface/30 sm:min-h-[430px] lg:min-h-[520px]">
              <AnimatePresence mode="wait">
                <motion.iframe
                  key={activeLocation.id}
                  src={activeLocation.mapEmbedUrl}
                  title={`${site.brand.name} ${activeLocation.name} map`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full"
                  referrerPolicy="no-referrer-when-downgrade"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={panelTransition}
                />
              </AnimatePresence>
              <a
                href={activeLocation.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-border-strong bg-background/90 px-4 py-2 text-xs font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
              >
                Open in Google Maps
                <ArrowSquareOut size={14} weight="bold" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="h-full">
            <div
              id="location-panel"
              role="tabpanel"
              aria-labelledby={`${activeLocation.id}-tab`}
              className="flex h-full flex-col justify-between rounded-2xl border border-border bg-surface/40 p-6 sm:p-7"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLocation.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={panelTransition}
                  className="space-y-6"
                >
                  <div className="flex gap-4">
                    <MapPin size={23} className="mt-0.5 shrink-0 text-accent" weight="duotone" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">Address</p>
                      <p className="mt-3 text-base font-semibold text-foreground">
                        {activeLocation.name}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {activeLocation.address}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Daily: {activeLocation.hours}
                      </p>
                      <a
                        href={phoneHref}
                        className="mt-1 block text-sm text-muted-foreground transition-colors hover:text-accent"
                      >
                        {activeLocation.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4 border-t border-border pt-6">
                    <Clock size={23} className="mt-0.5 shrink-0 text-accent" weight="duotone" />
                    <div className="w-full">
                      <p className="text-sm font-semibold text-foreground">Hours</p>
                      <div className="mt-2 flex items-center justify-between gap-4 text-sm">
                        <span className="text-muted-foreground">Daily</span>
                        <span className="text-foreground tabular-nums">{activeLocation.hours}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 border-t border-border pt-6">
                    <Phone size={23} className="mt-0.5 shrink-0 text-accent" weight="duotone" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Phone</p>
                      <a
                        href={phoneHref}
                        className="mt-1 block text-sm text-muted-foreground transition-colors hover:text-accent"
                      >
                        {activeLocation.phone}
                      </a>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-7 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
                <a
                  href={activeLocation.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all duration-200 hover:bg-foreground hover:text-background"
                >
                  <MapPin size={18} weight="fill" />
                  Get Directions
                </a>
                <a
                  href={phoneHref}
                  className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-border-strong px-6 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  <Phone size={18} />
                  Call Now
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
