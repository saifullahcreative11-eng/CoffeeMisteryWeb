"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Coffee, Cube, Drop, Lightning, Sparkle, SquaresFour, X } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";
import type { DrinkIngredient, MenuItem } from "@/config/resolve";

const menuCategories = site.menu;

const currency = new Intl.NumberFormat(site.currency.locale, {
  style: "currency",
  currency: site.currency.code,
  maximumFractionDigits: 0,
});

const contentTransition = {
  duration: 0.24,
  ease: [0.22, 1, 0.36, 1] as const,
};

const iconMap: Record<Exclude<DrinkIngredient["icon"], "milk" | "foam">, typeof Coffee> = {
  bean: Coffee,
  water: Drop,
  ice: Cube,
  chocolate: SquaresFour,
  brew: Coffee,
  sweet: Sparkle,
};

function splitLastWord(value: string) {
  const words = value.trim().split(/\s+/);
  return {
    lead: words.slice(0, -1).join(" "),
    last: words.at(-1) ?? value,
  };
}

function RatingDots({ value }: { value: number }) {
  return (
    <div className="flex gap-1.5" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={`h-2.5 w-2.5 rounded-full border ${
            index < value ? "border-[#335c4b] bg-[#335c4b]" : "border-[#aab6ae] bg-transparent"
          }`}
        />
      ))}
    </div>
  );
}

function IngredientIcon({ icon }: { icon: DrinkIngredient["icon"] }) {
  if (icon === "milk") {
    return (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(51,92,75,0.18)] bg-[#f7faf6] text-[#335c4b]">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="overflow-visible"
        >
          <path
            d="M6.25 5.25h10.2v12.1c0 1.55-1.25 2.8-2.8 2.8h-4.6c-1.55 0-2.8-1.25-2.8-2.8V5.25Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M16.45 8.15h1.25c1.9 0 3.25 1.38 3.25 3.28s-1.35 3.28-3.25 3.28h-1.25"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M6.25 12.05h10.2v5.3c0 1.55-1.25 2.8-2.8 2.8h-4.6c-1.55 0-2.8-1.25-2.8-2.8v-5.3Z" fill="currentColor" />
        </svg>
      </span>
    );
  }

  if (icon === "foam") {
    return (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(51,92,75,0.18)] bg-[#f7faf6] text-[#335c4b]">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="overflow-visible"
        >
          <circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="6.2" fill="currentColor" opacity="0.16" />
          <path
            d="M12 17.2C8.1 14.5 6.2 12.1 6.7 9.9c.4-1.6 2-2.2 3.2-1.1.7.6 1.1 1.4 2.1 2.3 1-.9 1.4-1.7 2.1-2.3 1.2-1.1 2.8-.5 3.2 1.1.5 2.2-1.4 4.6-5.3 7.3Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinejoin="round"
          />
          <path
            d="M7.9 13.6c1.6 1 3 1.5 4.1 1.5s2.5-.5 4.1-1.5M8.8 11.5c1.2.8 2.3 1.2 3.2 1.2s2-.4 3.2-1.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.15"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }

  const Icon = iconMap[icon];
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(51,92,75,0.18)] bg-[#f7faf6] text-[#335c4b]">
      <Icon size={20} weight={icon === "bean" || icon === "sweet" ? "fill" : "regular"} />
    </span>
  );
}

function DrinkCup({ item }: { item: MenuItem }) {
  const cupClipId = `drink-cup-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const cupTop = 58;
  const cupHeight = 204;
  const cupLayers = item.layers.reduce<
    Array<{ layer: MenuItem["layers"][number]; y: number; height: number }>
  >((layers, layer) => {
    const previous = layers.at(-1);
    const height = (layer.height / 100) * cupHeight;
    const y = previous ? previous.y + previous.height : cupTop;
    return [...layers, { layer, y, height }];
  }, []);

  return (
    <div className="relative flex h-[230px] items-center justify-center overflow-hidden rounded-[24px] border border-white/70 bg-white px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] sm:h-auto sm:min-h-[420px] sm:px-8 sm:py-8 lg:min-h-[590px]">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 28% 18%, rgba(255,255,255,0.9), transparent 34%), linear-gradient(135deg, rgba(255,255,255,0.7), rgba(236,218,196,0.35))",
        }}
      />
      <div className="relative w-full max-w-[400px] sm:max-w-[520px]">
        <svg
          viewBox="0 0 620 340"
          role="img"
          aria-label={`${item.name} layer diagram`}
          className="h-auto w-full drop-shadow-[0_18px_26px_rgba(75,43,24,0.14)] sm:drop-shadow-[0_26px_34px_rgba(75,43,24,0.16)]"
        >
          <defs>
            <clipPath id={cupClipId}>
              <path d="M194 54 H498 C498 122 492 194 470 232 C449 267 411 284 347 284 H308 C244 284 210 263 197 228 C182 187 176 120 176 54 Z" />
            </clipPath>
          </defs>

          <path
            d="M498 116 H520 C545 116 561 133 556 156 C551 181 530 196 492 197"
            fill="none"
            stroke="#15110e"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <g clipPath={`url(#${cupClipId})`}>
            <rect x="172" y="48" width="334" height="244" fill="#f7f4ef" />
            {cupLayers.map(({ layer, y, height: layerHeight }) => (
              <rect
                key={`${item.name}-${layer.name}-cup-layer`}
                x="172"
                y={y}
                width="334"
                height={layerHeight + 0.75}
                fill={layer.color}
              />
            ))}
          </g>

          <path
            d="M194 54 H498 C498 122 492 194 470 232 C449 267 411 284 347 284 H308 C244 284 210 263 197 228 C182 187 176 120 176 54 Z"
            fill="none"
            stroke="#15110e"
            strokeWidth="7"
            strokeLinejoin="round"
          />

          {cupLayers.map(({ layer, y, height: layerHeight }, index) => {
            const labelY = y + layerHeight / 2;
            const lineEndX = index === 0 ? 168 : index === cupLayers.length - 1 ? 150 : 160;
            return (
              <g key={`${item.name}-${layer.name}-label`}>
                <text
                  x="24"
                  y={labelY - 4}
                  fill="#2e2822"
                  fontSize="22"
                  fontWeight="700"
                  letterSpacing="0"
                  textAnchor="start"
                >
                  {layer.name}
                </text>
                <line x1="24" y1={labelY + 18} x2={lineEndX} y2={labelY + 18} stroke="#8b8278" strokeWidth="2" />
                <circle cx={lineEndX} cy={labelY + 18} r="4.5" fill="#8b8278" />
              </g>
            );
          })}

        </svg>
      </div>
    </div>
  );
}

function DrinkExplorer({
  item,
  onClose,
}: {
  item: MenuItem;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const profile = useMemo(
    () => [
      ["Strength", item.tasteProfile.strength],
      ["Sweetness", item.tasteProfile.sweetness],
      ["Creaminess", item.tasteProfile.body],
    ],
    [item]
  );

  useEffect(() => {
    const previousActive = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previousActive?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      aria-labelledby="drink-explorer-title"
      aria-modal="true"
      role="dialog"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-[#1b120c]/38 backdrop-blur-[10px]"
        aria-label="Close drink details"
        onClick={onClose}
      />

      <motion.div
        ref={panelRef}
        className="relative max-h-[90vh] w-[72vw] max-w-[1100px] overflow-y-auto rounded-[26px] border border-white/65 bg-background p-2 text-[#20231f] shadow-[0_34px_120px_rgba(28,18,12,0.28)] outline-none sm:rounded-[30px] sm:p-3 max-lg:w-[86vw] max-md:w-full"
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 14 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >  
        <button 
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(51,92,75,0.18)] bg-white/85 text-[#20231f] shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[#335c4b]/35 sm:right-5 sm:top-5 sm:h-11 sm:w-11 sm:hover:bg-white cursor-pointer
        
          aria-label="Close drink details"
        
        >
          <X size={20} />
        </button>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={contentTransition}
            className="grid gap-4 sm:gap-6 lg:grid-cols-[45fr_55fr]"
          >
            <DrinkCup item={item} />

            <div className="flex min-w-0 flex-col px-3 py-5 sm:px-6 sm:py-12 lg:py-14 lg:pr-8">
              <div>
                <p className="mb-1.5 inline-flex items-center gap-2 rounded-full bg-[rgba(51,92,75,0.1)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#335c4b] sm:mb-2">
                  <Lightning size={13} weight="fill" />
                  Drink Guide
                </p>
                <h3 id="drink-explorer-title" className="font-display text-3xl font-semibold leading-tight text-[#20231f] sm:text-5xl">
                  {item.name}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f746d] sm:mt-3 sm:text-lg sm:leading-7">
                  {item.description}
                </p>
              </div>

              <section className="mt-4 border-t border-[rgba(32,35,31,0.12)] pt-3.5 sm:mt-6 sm:pt-5">
                <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#335c4b]">Ingredients</h4>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-4">
                  {item.ingredients.map((ingredient) => (
                    <div
                      key={`${item.name}-${ingredient.name}`}
                      className="flex min-w-0 flex-col items-center gap-2 text-center sm:flex-row sm:text-left"
                    >
                      <IngredientIcon icon={ingredient.icon} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold leading-tight text-[#20231f] sm:text-sm">{ingredient.name}</p>
                        <p className="mt-1 text-xs leading-tight text-[#6f746d] sm:text-sm">{ingredient.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-4 border-t border-[rgba(32,35,31,0.12)] pt-3.5 sm:mt-6 sm:pt-5">
                <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#335c4b]">Taste Profile</h4>
                <div className="mt-3 grid gap-x-8 gap-y-2.5 sm:mt-4 sm:grid-cols-2 sm:gap-y-3">
                  {profile.map(([label, value]) => (
                    <div key={`${item.name}-${label}`} className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-[#20231f]">{label}</span>
                      <RatingDots value={Number(value)} />
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-4 border-t border-[rgba(32,35,31,0.12)] pt-3.5 sm:mt-6 sm:pt-5">
                <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#335c4b]">Best For</h4>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:flex sm:flex-wrap sm:gap-2.5">
                  {item.bestFor.slice(0, 3).map((tag) => (
                    <span
                      key={`${item.name}-${tag}`}
                      className="flex min-h-12 min-w-0 items-center justify-center rounded-full bg-[rgba(51,92,75,0.1)] px-2.5 py-2 text-center text-xs font-medium leading-tight text-[#335c4b] sm:min-h-10 sm:px-4 sm:text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export function Menu() {
  const [activeId, setActiveId] = useState(menuCategories[0].id);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const active = menuCategories.find((c) => c.id === activeId) ?? menuCategories[0];
  const closeExplorer = useCallback(() => setSelectedItem(null), []);

  return (
    <section id="menu" className="bg-background pt-14 pb-8 md:pt-16 md:pb-10">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {site.sections.menuLabel}
          </span>
          <h2 className="mt-4 text-balance font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl">
            {site.sections.menuHeading}
          </h2>
        </Reveal>

        <Reveal
          delay={0.1}
          className="mt-12 flex justify-center overflow-x-auto px-2 [-ms-overflow-style:none] [-webkit-mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] [scrollbar-width:none] sm:px-6 sm:[mask-image:none] sm:[-webkit-mask-image:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="inline-flex max-w-full shrink-0 gap-1.5 rounded-full border border-border bg-surface/60 p-1.5 sm:gap-2">
            {menuCategories.map((category) => {
              const isActive = category.id === activeId;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveId(category.id)}
                  className={`relative cursor-pointer whitespace-nowrap rounded-full px-3.5 py-2.5 text-xs font-medium transition-colors duration-200 sm:px-5 sm:text-sm ${
                    isActive ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="menu-tab-pill"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{category.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>
        <Reveal delay={0.16} className="mt-4 px-4 text-center">
          <p className="mx-auto max-w-[240px] text-xs font-medium leading-relaxed text-muted-foreground sm:max-w-none sm:text-sm">
            Tap any drink to explore its ingredients and taste profile
          </p>
        </Reveal>

        <div className="mt-10 min-h-[300px] sm:mt-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2"
            >
              {active.items.map((menuItem) => {
                const title = splitLastWord(menuItem.name);

                return (
                  <button
                    key={menuItem.name}
                    type="button"
                    onClick={() => setSelectedItem(menuItem)}
                    className="group grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-start gap-4 rounded-3xl border border-border bg-[#faf6ef] px-5 py-5 text-left transition-all duration-200 hover:border-accent/45 hover:bg-[#faf6ef] focus:outline-none focus:ring-2 focus:ring-accent/35 focus:ring-offset-4 focus:ring-offset-background max-sm:rounded-2xl max-sm:px-3 max-sm:py-3 max-sm:active:scale-[0.99]"
                    aria-label={`Open details for ${menuItem.name}`}
                  >
                    <span className="min-w-0">
                      <span className="block font-display text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
                        {menuItem.signature ? (
                          <>
                            {title.lead && `${title.lead} `}
                            <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
                              <span>{title.last}</span>
                              <span className="inline-flex translate-y-[-2px] items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wide text-accent">
                                <Sparkle size={10} weight="fill" />
                                Signature
                              </span>
                            </span>
                          </>
                        ) : (
                          menuItem.name
                        )}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">{menuItem.description}</span>
                    </span>
                    <span className="flex flex-col items-end">
                      <span className="whitespace-nowrap font-display text-lg font-bold text-accent tabular-nums">
                        {currency.format(menuItem.price)}
                      </span>
                      <span className="mt-2 inline-flex items-center gap-1 whitespace-nowrap text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-accent">
                        View details
                        <ArrowRight size={11} weight="bold" />
                      </span>
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <DrinkExplorer
            item={selectedItem}
            onClose={closeExplorer}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
