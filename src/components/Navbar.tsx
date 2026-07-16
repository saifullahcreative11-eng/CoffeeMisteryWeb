"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { BrandMark } from "@/components/BrandLogo";
import { site } from "@/config/site";

const SCROLL_DIRECTION_THRESHOLD = 12;
const TOP_VISIBILITY_OFFSET = 8;

export function Navbar() {
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const [heroExpanded, setHeroExpanded] = useState(false);

  useEffect(() => {
    const heroMedia = document.querySelector<HTMLElement>(
      "[data-hero-media], [data-hero-section]"
    );
    const hasHeroMedia = Boolean(heroMedia && "IntersectionObserver" in window);
    let isHeroMediaVisible = true;
    let lastScrollY = window.scrollY;
    let accumulatedDelta = 0;
    let lastDirection: "up" | "down" | null = null;

    const shouldForceVisible = () => {
      if (heroExpanded) return false;

      return (
        window.scrollY <= TOP_VISIBILITY_OFFSET ||
        (hasHeroMedia && isHeroMediaVisible)
      );
    };

    const syncVisibility = () => {
      if (shouldForceVisible()) {
        setNavbarVisible(true);
      }
    };

    const syncVisibilitySoon = () => {
      window.requestAnimationFrame(syncVisibility);
    };

    syncVisibility();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      if (delta > 0) {
        lastDirection = "down";
      } else if (delta < 0) {
        lastDirection = "up";
      }

      if (shouldForceVisible()) {
        accumulatedDelta = 0;
        setNavbarVisible(true);
        return;
      }

      accumulatedDelta =
        Math.sign(delta) === Math.sign(accumulatedDelta)
          ? accumulatedDelta + delta
          : delta;

      if (Math.abs(accumulatedDelta) < SCROLL_DIRECTION_THRESHOLD) {
        return;
      }

      setNavbarVisible(accumulatedDelta < 0);
      accumulatedDelta = 0;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", syncVisibilitySoon, { passive: true });
    window.addEventListener("pageshow", syncVisibilitySoon);
    window.addEventListener("hashchange", syncVisibilitySoon);

    if (!hasHeroMedia || !heroMedia) {
      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", syncVisibilitySoon);
        window.removeEventListener("pageshow", syncVisibilitySoon);
        window.removeEventListener("hashchange", syncVisibilitySoon);
      };
    }

    isHeroMediaVisible = heroMedia.getBoundingClientRect().bottom > 0;
    syncVisibility();

    const observer = new IntersectionObserver(([entry]) => {
      isHeroMediaVisible = entry.isIntersecting;

      if (
        !isHeroMediaVisible &&
        lastDirection === "down" &&
        window.scrollY > TOP_VISIBILITY_OFFSET
      ) {
        setNavbarVisible(false);
        return;
      }

      syncVisibility();
    });

    observer.observe(heroMedia);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", syncVisibilitySoon);
      window.removeEventListener("pageshow", syncVisibilitySoon);
      window.removeEventListener("hashchange", syncVisibilitySoon);
    };
  }, [heroExpanded]);

  useEffect(() => {
    function handleHeroExpandedChange(event: Event) {
      const expanded = event instanceof CustomEvent && Boolean(event.detail?.expanded);
      setHeroExpanded(expanded);

      if (expanded && !open) {
        setNavbarVisible(false);
      } else if (!expanded) {
        setNavbarVisible(true);
      }
    }

    window.addEventListener("coffeemistry:hero-expanded-change", handleHeroExpandedChange);
    return () => {
      window.removeEventListener("coffeemistry:hero-expanded-change", handleHeroExpandedChange);
    };
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      aria-hidden={!navbarVisible && !open}
      className={`pointer-events-none fixed inset-x-0 top-5 z-50 px-4 transition-all duration-300 ease-in-out ${
        navbarVisible || open
          ? "translate-y-0 opacity-100"
          : "-translate-y-4 opacity-0"
      }`}
    >
      <nav
        inert={!navbarVisible && !open}
        className={`mx-auto flex h-[66px] max-w-6xl items-center justify-between rounded-full border border-border bg-surface/80 px-5 py-2 shadow-[0_18px_54px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:h-20 sm:px-7 lg:px-9 ${
          navbarVisible || open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <Link
          href="#home"
          className="flex items-center gap-2.5 font-display text-base font-semibold tracking-tight text-foreground sm:text-lg"
          onClick={() => setOpen(false)}
        >
          <span
            className={
              site.assets.logo
                ? "flex h-12 max-w-[180px] items-center justify-center sm:h-16"
                : "flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent shadow-[0_0_22px_var(--accent-soft)] sm:h-11 sm:w-11"
            }
          >
            <BrandMark
              logo={site.assets.logo}
              className="h-6 w-7 sm:h-7 sm:w-8"
              imageClassName="h-10 w-auto max-w-[180px] object-contain sm:h-14"
            />
          </span>
          {!site.assets.logo && site.brand.name}
        </Link>

        <ul className="hidden items-center gap-9 md:flex lg:gap-12">
          {site.nav.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-base font-medium text-foreground/55 transition-colors duration-200 hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Link
            href="#visit"
            className="inline-flex cursor-pointer items-center justify-center rounded-full bg-accent px-7 py-3 text-base font-semibold text-accent-foreground transition-all duration-200 hover:bg-foreground hover:text-background hover:shadow-[0_0_28px_var(--accent-soft)]"
          >
            Get Direction
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/10 md:hidden"
        >
          {open ? <X size={24} /> : <List size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto mx-auto mt-3 max-w-5xl overflow-hidden rounded-[28px] border border-border bg-surface/95 shadow-[0_24px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-6">
              {site.nav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-full px-4 py-3 text-base font-medium text-foreground/75 transition-colors hover:bg-foreground/10 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="#visit"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                  Get Direction
                </Link>
              </li>
              <li className="pt-4 text-center text-xs text-muted-foreground">
                {site.contact.address}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
