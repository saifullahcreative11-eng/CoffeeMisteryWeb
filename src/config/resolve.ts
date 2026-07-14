// ---------------------------------------------------------------------------
// Rebrandable site config — types + resolver
// ---------------------------------------------------------------------------
// A shop provides a small `SiteInput` (see src/config/site.ts). `resolveSite`
// fills every optional field from the essentials so a minimal input still
// yields a complete site. Components import the resolved `site` object only.
// See REBRAND.md for the intake form + step-by-step rebrand instructions.
// ---------------------------------------------------------------------------

/* -------------------------------- Content types ------------------------- */

export type NavLink = { label: string; href: string };
export type Hour = { day: string; time: string };
export type Stat = { value: string; label: string };
export type Feature = { title: string; description: string; icon: string };
export type GalleryImage = { src: string; alt: string };
export type Testimonial = { quote: string; name: string; role: string };
export type DrinkLayer = {
  name: string;
  note: string;
  color: string;
  height: number;
};
export type DrinkIngredient = {
  name: string;
  quantity: string;
  icon: "bean" | "water" | "ice" | "milk" | "foam" | "chocolate" | "brew" | "sweet";
};
export type TasteProfile = {
  strength: number;
  sweetness: number;
  bitterness: number;
  body: number;
  acidity: number;
};
export type ThemePalette = {
  background: string;
  surface: string;
  surface2: string;
  foreground: string;
  mutedForeground: string;
  border: string;
  borderStrong: string;
  accentForeground: string;
};

export type MenuItem = {
  name: string;
  description: string;
  heroImage: string;
  layers: DrinkLayer[];
  ingredients: DrinkIngredient[];
  tasteProfile: TasteProfile;
  bestFor: string[];
  price: number;
  signature?: boolean;
};
export type MenuCategory = { id: string; label: string; items: MenuItem[] };

/* -------------------------------- Input shape --------------------------- */

export interface SiteInput {
  /** REQUIRED — brand essentials. `accent*` optional (default gold). */
  brand: {
    name: string;
    tagline: string;
    founded?: string | number;
    accent?: string;
    accentHover?: string;
    accentDeep?: string;
  };

  /** REQUIRED — contact + location. Optional channels hide their CTAs. */
  contact: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    address: string;
    area: string;
    city: string;
  };

  /** OPTIONAL — socials. Missing links render conditionally (hidden). */
  social?: {
    instagram?: string;
    instagramHandle?: string;
    facebook?: string;
    tiktok?: string;
    linkedin?: string;
  };

  /** REQUIRED — map. bbox derived from lat/lng ± spanDeg (default 0.01). */
  map: {
    lat: number;
    lng: number;
    googleMapsUrl?: string;
    spanDeg?: number;
  };

  /** REQUIRED — opening hours. */
  hours: Hour[];

  /** OPTIONAL — currency for menu prices (default en-PK / PKR). */
  currency?: { locale: string; code: string };

  /** OPTIONAL — asset paths/URLs. Each missing slot falls back independently. */
  assets?: {
    logo?: string;
    heroVideo?: string;
    heroPoster?: string;
    heroBg?: string;
    storyImage?: string;
    gallery?: GalleryImage[];
  };

  /** OPTIONAL — global color palette (default to the shipped dark coffee theme). */
  theme?: Partial<ThemePalette>;

  /** OPTIONAL — nav links (default to the standard section anchors). */
  nav?: NavLink[];

  /* --- OPTIONAL rich content — omit to auto-generate from essentials --- */

  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    locale?: string;
    ogTitle?: string;
    ogDescription?: string;
  };

  hero?: {
    kicker?: string;
    scrollLabel?: string;
    contentHeading?: string;
    contentBody?: string;
    primaryCta?: string;
    secondaryCta?: string;
  };

  story?: {
    label?: string;
    heading?: string;
    body?: string[];
    pullQuote?: string;
    pullQuoteAttribution?: string;
    stats?: Stat[];
  };

  features?: Feature[];
  menu?: MenuCategory[];
  testimonials?: Testimonial[];

  sections?: {
    featuresLabel?: string;
    featuresHeading?: string;
    menuLabel?: string;
    menuHeading?: string;
    galleryLabel?: string;
    galleryHeading?: string;
    reviewsLabel?: string;
    visitLabel?: string;
    visitHeading?: string;
  };

  footer?: {
    description?: string;
    newsletterHeading?: string;
    newsletterCopy?: string;
    copyright?: string;
    madeWith?: string;
  };
}

/* ------------------------------ Resolved shape -------------------------- */

export interface ResolvedSite {
  brand: {
    name: string;
    tagline: string;
    founded?: string | number;
    accent: string;
    accentHover: string;
    accentDeep: string;
    accentSoft: string;
  };
  contact: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    address: string;
    area: string;
    city: string;
  };
  social: {
    instagram?: string;
    instagramHandle?: string;
    facebook?: string;
    tiktok?: string;
    linkedin?: string;
  };
  map: {
    lat: number;
    lng: number;
    googleMapsUrl: string;
    bbox: string;
    marker: string;
  };
  hours: Hour[];
  currency: { locale: string; code: string };
  assets: {
    logo?: string;
    heroVideo: string;
    heroPoster: string;
    heroBg: string;
    storyImage: string;
    gallery: GalleryImage[];
  };
  theme: ThemePalette;
  nav: NavLink[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
    locale: string;
    ogTitle: string;
    ogDescription: string;
  };
  hero: {
    title: string;
    kicker: string;
    scrollLabel: string;
    contentHeading: string;
    contentBody: string;
    primaryCta: string;
    secondaryCta: string;
  };
  story: {
    label: string;
    heading: string;
    body: string[];
    pullQuote: string;
    pullQuoteAttribution: string;
    stats: Stat[];
  };
  features: Feature[];
  menu: MenuCategory[];
  testimonials: Testimonial[];
  sections: {
    featuresLabel: string;
    featuresHeading: string;
    menuLabel: string;
    menuHeading: string;
    galleryLabel: string;
    galleryHeading: string;
    reviewsLabel: string;
    visitLabel: string;
    visitHeading: string;
  };
  footer: {
    description: string;
    newsletterHeading: string;
    newsletterCopy: string;
    copyright: string;
    madeWith: string;
  };
  /** CSS custom-property overrides injected on :root by the layout. */
  cssVars: Record<string, string>;
}

/* -------------------------------- Helpers ------------------------------- */

/** Convert a #rrggbb / #rgb hex color to an rgba() string at `alpha`. */
function hexToRgba(hex: string, alpha: number): string {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return `rgba(201, 161, 90, ${alpha})`;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Current shipped media — safe defaults so a demo works with zero new assets.
const DEFAULT_ASSETS = {
  logo: undefined as string | undefined,
  heroVideo: "/media/coffee-beans.mp4",
  heroPoster: "/media/coffee-beans-poster.jpg",
  heroBg: "/media/cafe-menu.jpg",
  storyImage:
    "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1400&auto=format&fit=crop",
  gallery: [
    {
      src: "https://images.unsplash.com/photo-1481833761820-0509d3217039?q=80&w=1200&auto=format&fit=crop",
      alt: "Latte art in a white ceramic cup",
    },
    {
      src: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1200&auto=format&fit=crop",
      alt: "Warm cafe interior seating",
    },
    {
      src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
      alt: "Freshly roasted coffee beans",
    },
    {
      src: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1200&auto=format&fit=crop",
      alt: "Bakery pastries on display",
    },
    {
      src: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?q=80&w=1200&auto=format&fit=crop",
      alt: "Barista pouring filter coffee",
    },
    {
      src: "https://images.unsplash.com/photo-1524350876685-274059332603?q=80&w=1200&auto=format&fit=crop",
      alt: "Top down view of coffee cup on table",
    },
  ] as GalleryImage[],
};

const DEFAULT_THEME: ThemePalette = {
  background: "#0e0b09",
  surface: "#1a1512",
  surface2: "#231c17",
  foreground: "#f5efe6",
  mutedForeground: "#b3a695",
  border: "rgba(245, 239, 230, 0.1)",
  borderStrong: "rgba(245, 239, 230, 0.18)",
  accentForeground: "#14100c",
};

const DEFAULT_NAV: NavLink[] = [
  { label: "Story", href: "#story" },
  { label: "Menu", href: "#menu" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
  { label: "Visit", href: "#visit" },
];

function menuItem(
  item: Omit<MenuItem, "heroImage" | "layers" | "ingredients" | "tasteProfile" | "bestFor"> &
    Partial<Pick<MenuItem, "heroImage" | "layers" | "ingredients" | "tasteProfile" | "bestFor">>
): MenuItem {
  return {
    ...item,
    heroImage: item.heroImage ?? "/media/cafe-menu.jpg",
    layers:
      item.layers ??
      [
        { name: "Coffee", note: "Freshly prepared", color: "#5a321c", height: 55 },
        { name: "Texture", note: "Balanced finish", color: "#d8b98c", height: 28 },
        { name: "Aroma", note: "Served at its peak", color: "#f7ead7", height: 17 },
      ],
    ingredients:
      item.ingredients ??
      [
        { name: "Coffee", quantity: "Freshly brewed", icon: "bean" },
        { name: "Water", quantity: "Recipe balanced", icon: "water" },
      ],
    tasteProfile:
      item.tasteProfile ??
      { strength: 3, sweetness: 2, bitterness: 3, body: 3, acidity: 2 },
    bestFor: item.bestFor ?? ["Daily ritual", "Coffee curious", "Balanced cup"],
  };
}

// Venue-neutral fallback features (fit a cart or a two-floor cafe alike).
function defaultFeatures(): Feature[] {
  return [
    {
      title: "Small-Batch Coffee",
      description:
        "Beans sourced with care and prepared fresh to order — every cup poured with intention.",
      icon: "Coffee",
    },
    {
      title: "Free Wi-Fi",
      description:
        "Comfortable seating and fast Wi-Fi built for long work sessions, calls, and catch-ups.",
      icon: "WifiHigh",
    },
    {
      title: "Fresh Daily Bakes",
      description:
        "Pastries and treats baked fresh through the day to pair perfectly with your order.",
      icon: "Bicycle",
    },
    {
      title: "Order Online",
      description:
        "Pickup, dine-in, or delivery — fresh from our counter to wherever you are.",
      icon: "Mountains",
    },
  ];
}

// Generic template menu — used only when a shop provides no menu of its own.
function defaultMenu(): MenuCategory[] {
  return [
    {
      id: "coffee",
      label: "Coffee",
      items: [
        menuItem({ name: "Espresso", description: "Double shot, house blend", price: 450 }),
        menuItem({ name: "Cappuccino", description: "Espresso, steamed milk, microfoam", price: 650 }),
        menuItem({ name: "Flat White", description: "Ristretto shots, velvet milk", price: 750 }),
        menuItem({ name: "Latte", description: "Espresso, silky steamed milk", price: 700 }),
        menuItem({ name: "Cold Brew", description: "Slow-steeped, served over ice", price: 800 }),
        menuItem({ name: "Mocha", description: "Espresso, chocolate, steamed milk", price: 800, signature: true }),
      ],
    },
    {
      id: "tea",
      label: "Tea & More",
      items: [
        menuItem({ name: "Karak Chai", description: "Strong, spiced, and comforting", price: 350, signature: true }),
        menuItem({ name: "Green Tea", description: "Light, fresh, and calming", price: 400 }),
        menuItem({ name: "Matcha Latte", description: "Ceremonial grade, oat milk option", price: 750 }),
        menuItem({ name: "Fresh Lemonade", description: "Lemon, mint, house syrup", price: 550 }),
      ],
    },
    {
      id: "bakes",
      label: "All-Day Bakes",
      items: [
        menuItem({ name: "Butter Croissant", description: "Baked fresh every morning", price: 500 }),
        menuItem({ name: "Cinnamon Roll", description: "Cream cheese glaze", price: 600 }),
        menuItem({ name: "Chocolate Brownie", description: "Rich, fudgy, house-made", price: 550 }),
        menuItem({ name: "Cheese Sandwich", description: "Toasted, herb butter", price: 750 }),
      ],
    },
  ];
}

function defaultTestimonials(name: string, city: string): Testimonial[] {
  return [
    {
      quote: `Easily my favourite spot in ${city}. The coffee is consistently excellent and the vibe is just right.`,
      name: "Ayesha R.",
      role: "Regular",
    },
    {
      quote: `${name} has become my go-to for work sessions — great coffee, comfortable seating, and friendly staff.`,
      name: "Hamza S.",
      role: "Freelancer",
    },
    {
      quote: `You can taste the care in every cup. Worth the visit whenever I'm in the area.`,
      name: "Sana M.",
      role: "Food Blogger",
    },
  ];
}

/* -------------------------------- Resolver ------------------------------ */

export function resolveSite(input: SiteInput): ResolvedSite {
  const { brand, contact, map } = input;
  const name = brand.name;
  const area = contact.area;
  const city = contact.city;

  // --- Accent colors ------------------------------------------------------
  const accent = brand.accent ?? "#335c4b";
  const accentHover = brand.accentHover ?? "#20231f";
  const accentDeep = brand.accentDeep ?? "#335c4b";
  const accentSoft = hexToRgba(accent, 0.12);

  // --- Map ----------------------------------------------------------------
  const span = map.spanDeg ?? 0.01;
  const bbox = [
    map.lng - span,
    map.lat - span / 2,
    map.lng + span,
    map.lat + span / 2,
  ].join(",");
  const marker = `${map.lat}%2C${map.lng}`;
  const googleMapsUrl =
    map.googleMapsUrl ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${contact.address}`
    )}`;

  // --- Assets -------------------------------------------------------------
  const assets = {
    logo: input.assets?.logo ?? DEFAULT_ASSETS.logo,
    heroVideo: input.assets?.heroVideo ?? DEFAULT_ASSETS.heroVideo,
    heroPoster: input.assets?.heroPoster ?? DEFAULT_ASSETS.heroPoster,
    heroBg: input.assets?.heroBg ?? DEFAULT_ASSETS.heroBg,
    storyImage: input.assets?.storyImage ?? DEFAULT_ASSETS.storyImage,
    gallery: input.assets?.gallery ?? DEFAULT_ASSETS.gallery,
  };

  // --- Theme --------------------------------------------------------------
  const theme: ThemePalette = {
    background: input.theme?.background ?? DEFAULT_THEME.background,
    surface: input.theme?.surface ?? DEFAULT_THEME.surface,
    surface2: input.theme?.surface2 ?? DEFAULT_THEME.surface2,
    foreground: input.theme?.foreground ?? DEFAULT_THEME.foreground,
    mutedForeground: input.theme?.mutedForeground ?? DEFAULT_THEME.mutedForeground,
    border: input.theme?.border ?? DEFAULT_THEME.border,
    borderStrong: input.theme?.borderStrong ?? DEFAULT_THEME.borderStrong,
    accentForeground: input.theme?.accentForeground ?? DEFAULT_THEME.accentForeground,
  };

  // --- SEO ----------------------------------------------------------------
  const seoTitle = input.seo?.title ?? `${name} — ${area}, ${city}`;
  const seoDescription =
    input.seo?.description ??
    `${name} — ${brand.tagline}. Visit us in ${area}, ${city} or order online.`;
  const seo = {
    title: seoTitle,
    description: seoDescription,
    keywords:
      input.seo?.keywords ??
      [
        `coffee shop ${city}`,
        `cafe ${city}`,
        `best coffee ${area}`,
        name,
        `specialty coffee ${city}`,
      ],
    locale: input.seo?.locale ?? "en_PK",
    ogTitle: input.seo?.ogTitle ?? seoTitle,
    ogDescription: input.seo?.ogDescription ?? brand.tagline,
  };

  // --- Hero ---------------------------------------------------------------
  const hero = {
    title: name,
    kicker: input.hero?.kicker ?? `${area} · ${city}`,
    scrollLabel: input.hero?.scrollLabel ?? "Scroll to enter",
    contentHeading:
      input.hero?.contentHeading ?? "Great Coffee, Poured With Intention",
    contentBody:
      input.hero?.contentBody ??
      `Freshly prepared coffee, honest food, and a warm place to slow down — this is ${name} in ${area}.`,
    primaryCta: input.hero?.primaryCta ?? "Explore the Menu",
    secondaryCta: input.hero?.secondaryCta ?? "Find Us",
  };

  // --- Story --------------------------------------------------------------
  const foundedText = brand.founded ? ` in ${brand.founded}` : "";
  const story = {
    label: input.story?.label ?? "Our Story",
    heading: input.story?.heading ?? `Born in ${area}`,
    body:
      input.story?.body ??
      [
        `${name} opened${foundedText} in ${area} with a simple idea: ${city} deserved coffee made with real care. We prepare each cup fresh and treat every order with the same attention.`,
        `Today we're a daily ritual for regulars across ${city} — a place to slow down, catch up, and enjoy something made well.`,
      ],
    pullQuote: input.story?.pullQuote ?? "Made fresh, served with care.",
    pullQuoteAttribution: input.story?.pullQuoteAttribution ?? "Our promise",
    stats:
      input.story?.stats ??
      [
        { value: brand.founded ? `${brand.founded}` : "Est.", label: `Serving ${area}` },
        { value: "12", label: "Origins on rotation" },
        { value: "40k+", label: "Cups served yearly" },
      ],
  };

  // --- Sections -----------------------------------------------------------
  const sections = {
    featuresLabel: input.sections?.featuresLabel ?? `Why ${name}`,
    featuresHeading: input.sections?.featuresHeading ?? "Every Detail, Considered",
    menuLabel: input.sections?.menuLabel ?? "The Menu",
    menuHeading: input.sections?.menuHeading ?? "Crafted Daily, Priced Honestly",
    galleryLabel: input.sections?.galleryLabel ?? "From the Counter",
    galleryHeading: input.sections?.galleryHeading ?? `Life at ${name}`,
    reviewsLabel: input.sections?.reviewsLabel ?? `${city} Loves Us`,
    visitLabel: input.sections?.visitLabel ?? "Visit Us",
    visitHeading: input.sections?.visitHeading ?? `Find Us In ${area}`,
  };

  // --- Footer -------------------------------------------------------------
  const footer = {
    description:
      input.footer?.description ??
      `${brand.tagline}. In the heart of ${area}, ${city}.`,
    newsletterHeading: input.footer?.newsletterHeading ?? "Join the Brew",
    newsletterCopy:
      input.footer?.newsletterCopy ?? "New drinks and seasonal menus, once a month.",
    copyright:
      input.footer?.copyright ??
      `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
    madeWith: input.footer?.madeWith ?? `Made with care in ${city}.`,
  };

  const cssVars: Record<string, string> = {
    "--background": theme.background,
    "--surface": theme.surface,
    "--surface-2": theme.surface2,
    "--foreground": theme.foreground,
    "--muted-foreground": theme.mutedForeground,
    "--border": theme.border,
    "--border-strong": theme.borderStrong,
    "--accent": accent,
    "--accent-hover": accentHover,
    "--accent-foreground": theme.accentForeground,
    "--accent-deep": accentDeep,
    "--accent-soft": accentSoft,
  };

  return {
    brand: { ...brand, accent, accentHover, accentDeep, accentSoft },
    contact,
    social: input.social ?? {},
    map: { lat: map.lat, lng: map.lng, googleMapsUrl, bbox, marker },
    hours: input.hours,
    currency: input.currency ?? { locale: "en-PK", code: "PKR" },
    assets,
    theme,
    nav: input.nav ?? DEFAULT_NAV,
    seo,
    hero,
    story,
    features: input.features ?? defaultFeatures(),
    menu: input.menu ?? defaultMenu(),
    testimonials: input.testimonials ?? defaultTestimonials(name, city),
    sections,
    footer,
    cssVars,
  };
}
