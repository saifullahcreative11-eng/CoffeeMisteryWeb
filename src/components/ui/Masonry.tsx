"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./Masonry.module.css";

export type MasonryItem = {
  id: string;
  img: string;
  url: string;
  height: number;
  alt?: string;
  position?: string;
};

type MasonryGridItem = MasonryItem & {
  x: number;
  y: number;
  w: number;
  h: number;
};

type MasonryProps = {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: "top" | "bottom" | "left" | "right" | "center" | "random";
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  columns?: number;
  className?: string;
};

const queries = ["(min-width:1500px)", "(min-width:1000px)", "(min-width:600px)", "(min-width:400px)"];
const columnValues = [5, 4, 3, 2];

const getMediaValue = (defaultValue: number) => {
  if (typeof window === "undefined") return defaultValue;
  const matchedIndex = queries.findIndex((query) => window.matchMedia(query).matches);
  return columnValues[matchedIndex] ?? defaultValue;
};

const useMedia = (defaultValue: number) => {
  const [value, setValue] = useState(() => getMediaValue(defaultValue));

  useEffect(() => {
    const handler = () => setValue(getMediaValue(defaultValue));
    const mediaQueries = queries.map((query) => window.matchMedia(query));

    mediaQueries.forEach((query) => query.addEventListener("change", handler));
    handler();

    return () => mediaQueries.forEach((query) => query.removeEventListener("change", handler));
  }, [defaultValue]);

  return value;
};

const useMeasure = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    resizeObserver.observe(ref.current);
    return () => resizeObserver.disconnect();
  }, []);

  return [ref, size] as const;
};

const preloadImages = async (urls: string[]) => {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const image = new window.Image();
          image.src = src;
          image.onload = image.onerror = () => resolve();
        }),
    ),
  );
};

export default function Masonry({
  items,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  columns: fixedColumns,
  className,
}: MasonryProps) {
  const responsiveColumns = useMedia(1);
  const columns = fixedColumns ?? responsiveColumns;
  const [containerRef, { width }] = useMeasure();
  const [imagesReady, setImagesReady] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    let cancelled = false;
    hasMounted.current = false;

    preloadImages(items.map((item) => item.img)).then(() => {
      if (!cancelled) setImagesReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [items]);

  const grid = useMemo(() => {
    if (!width) return [];

    const columnHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;

    return items.map((item) => {
      const column = columnHeights.indexOf(Math.min(...columnHeights));
      const x = columnWidth * column;
      const height = item.height / 2;
      const y = columnHeights[column];

      columnHeights[column] += height;

      return { ...item, x, y, w: columnWidth, h: height };
    });
  }, [columns, items, width]);

  const gridHeight = useMemo(() => {
    if (!grid.length) return 520;
    return Math.max(...grid.map((item) => item.y + item.h)) + 12;
  }, [grid]);

  const getInitialPosition = useCallback((item: MasonryGridItem) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect || typeof window === "undefined") return { x: item.x, y: item.y };

    let direction = animateFrom;

    if (animateFrom === "random") {
      const directions = ["top", "bottom", "left", "right"] as const;
      direction = directions[Math.floor(Math.random() * directions.length)];
    }

    switch (direction) {
      case "top":
        return { x: item.x, y: -200 };
      case "bottom":
        return { x: item.x, y: window.innerHeight + 200 };
      case "left":
        return { x: -200, y: item.y };
      case "right":
        return { x: window.innerWidth + 200, y: item.y };
      case "center":
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  }, [animateFrom, containerRef]);

  useLayoutEffect(() => {
    if (!imagesReady) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animationProps = {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
      };

      if (reduceMotion) {
        gsap.set(selector, { opacity: 1, filter: "blur(0px)", ...animationProps });
        return;
      }

      if (!hasMounted.current) {
        const initialPosition = getInitialPosition(item);

        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: initialPosition.x,
            y: initialPosition.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: "blur(10px)" }),
          },
          {
            opacity: 1,
            ...animationProps,
            ...(blurToFocus && { filter: "blur(0px)" }),
            duration: 0.8,
            ease: "power3.out",
            delay: index * stagger,
          },
        );
      } else {
        gsap.to(selector, {
          ...animationProps,
          duration,
          ease,
          overwrite: "auto",
        });
      }
    });

    hasMounted.current = true;
  }, [blurToFocus, duration, ease, getInitialPosition, grid, imagesReady, stagger]);

  const handleMouseEnter = (item: MasonryGridItem) => {
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: hoverScale,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    if (colorShiftOnHover) {
      gsap.to(`${selector} .${styles.colorOverlay}`, {
        opacity: 0.3,
        duration: 0.3,
      });
    }
  };

  const handleMouseLeave = (item: MasonryGridItem) => {
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    if (colorShiftOnHover) {
      gsap.to(`${selector} .${styles.colorOverlay}`, {
        opacity: 0,
        duration: 0.3,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={[styles.list, className].filter(Boolean).join(" ")}
      style={{ height: gridHeight }}
    >
      {grid.map((item) => (
        <div
          key={item.id}
          data-key={item.id}
          className={styles.itemWrapper}
          onMouseEnter={() => handleMouseEnter(item)}
          onMouseLeave={() => handleMouseLeave(item)}
        >
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.itemLink}
            aria-label={item.alt ?? "Open Coffeemistry gallery image"}
          >
            <div
              className={styles.itemImg}
              style={{
                backgroundImage: `url("${item.img}")`,
                backgroundPosition: item.position ?? "center center",
              }}
            >
              {colorShiftOnHover && <div className={styles.colorOverlay} />}
            </div>
          </a>
        </div>
      ))}
    </div>
  );
}
