# Rebrand Guide

This site is a **rebrandable coffee-shop template**. Every per-shop value —
copy, contact details, colors, map, menu, logo, assets — lives in **one file**:
[`src/config/site.ts`](src/config/site.ts). To spin up a new shop:

1. **Duplicate the repo** (one copy per shop).
2. **Edit `src/config/site.ts`** — fill in the `SiteInput` (form below).
3. **Drop assets** into `/public/media/` (defaults ship, so this is optional).
4. **Resolve the Google Maps link** to lat/lng (see step in the prompt).
5. `npm run build` and verify in the browser.

Nothing else needs touching. Optional fields you omit are auto-generated from
the essentials by `resolveSite` in [`src/config/resolve.ts`](src/config/resolve.ts).

---

## 1. Intake form

### REQUIRED

```
brand.name        = "____"                 // e.g. "Coffeemistry"
brand.tagline     = "____"                 // one line, shown in hero + footer
brand.founded     = ____                   // optional, e.g. 2019

contact.address   = "____"                 // full address, one line
contact.area      = "____"                 // e.g. "F-7 Markaz"
contact.city      = "____"                 // e.g. "Islamabad"

map.lat           = ____                   // from the Google Maps link (see prompt)
map.lng           = ____
map.googleMapsUrl = "____"                 // the shop's share link (used by "Open in Google Maps")
map.spanDeg       = 0.01                    // OPTIONAL — map zoom; smaller = closer

hours = [ { day: "____", time: "____" }, ... ]   // e.g. { day: "Every day", time: "7:30 AM – 1:00 AM" }
```

### OPTIONAL (omit any block to auto-generate)

```
brand.accent      = "#rrggbb"              // accent color; default gold #c9a15a
brand.accentHover / brand.accentDeep       // default to the gold tones

theme = {                                  // global palette; omit to keep dark theme
  background, surface, surface2,
  foreground, mutedForeground,
  border, borderStrong,
  accentForeground,
}

social.instagram        = "____"           // full URL; IG button hidden if omitted
social.instagramHandle  = "@____"
social.facebook         = "____"           // full URL; icon hidden if omitted
social.tiktok           = "____"           // full URL; icon hidden if omitted
contact.phone           = "____"           // OPTIONAL — omit to hide phone CTAs
contact.whatsapp        = "____"           // OPTIONAL — digits w/ country code
contact.email           = "____"           // OPTIONAL — omit to hide Email CTA

currency = { locale: "en-PK", code: "PKR" }        // default

assets = { logo, heroVideo, heroPoster, heroBg, storyImage, gallery[] }   // see §2

nav = [ { label, href } ]                  // default: Story / Menu / Gallery / Reviews / Visit

seo          = { title, description, keywords[], locale, ogTitle, ogDescription }
hero         = { kicker, scrollLabel, contentHeading, contentBody, primaryCta, secondaryCta }
story        = { label, heading, body[], pullQuote, pullQuoteAttribution, stats[] }
features     = [ { title, description, icon } ]    // icons: Coffee | WifiHigh | Mountains | Bicycle
menu         = [ { id, label, items: [{ name, description, price, signature? }] } ]
testimonials = [ { quote, name, role } ]
sections     = { featuresLabel, featuresHeading, menuLabel, menuHeading, galleryLabel,
                 galleryHeading, reviewsLabel, visitLabel, visitHeading }
footer       = { description, newsletterHeading, newsletterCopy, copyright, madeWith }
```

**Fallbacks when omitted** (see `resolveSite`):
- `seo.title` → `"{name} — {area}, {city}"`; description/keywords from tagline + city.
- `hero.kicker` → `"{area} · {city}"`; `scrollLabel` → `"Scroll to enter"`.
- `story.heading` → `"Born in {area}"`; body → 2 generated paragraphs.
- `features` → 4 venue-neutral cards (Small-Batch Coffee / Free Wi-Fi / Fresh Daily
  Bakes / Order Online) — fit a cart or a two-floor cafe alike.
- `menu` → a generic coffee / tea / bakes template menu.
- `testimonials` → 3 generic reviews templated with the shop name + city.
- `sections.*` → `"Why {name}"`, `"{city} Loves Us"`, `"Life at {name}"`,
  `"Find us in {area}"`, etc.
- `footer.copyright` → `"© {year} {name}. All rights reserved."`
- `theme.*` → the shipped dark coffee palette.
- `assets.*` → each missing slot keeps the shipped default image; `logo` falls
  back to the inline coffee icon.

---

## 2. Asset checklist

Drop files into `/public/media/`. The template **ships working defaults**, so a
demo renders with zero new assets — replace slots as the shop provides imagery.
Point `assets` in `site.ts` at whatever paths you use.

| Slot         | Default (shipped)              | Recommended                          |
|--------------|--------------------------------|--------------------------------------|
| `logo`       | Inline coffee icon             | SVG/PNG logo, transparent background |
| `heroVideo`  | `/media/coffee-beans.mp4`      | ≤ ~1280px wide, short, loopable MP4  |
| `heroPoster` | `/media/coffee-beans-poster.jpg` | first frame of the hero video      |
| `heroBg`     | `/media/cafe-menu.jpg`         | landscape, sits behind the hero      |
| `storyImage` | (Unsplash URL)                 | ~4:5 portrait, interior/product      |
| `gallery[]`  | 6 Unsplash URLs                | 6 images, ~1200px square             |

Assets may be **local paths** (`/media/...`) or remote URLs. Remote story,
gallery, and hero background image hosts must be allowed in
[`next.config.ts`](next.config.ts) `images.remotePatterns` (`images.unsplash.com`
is already listed). `assets.logo` uses a normal image tag, so an external logo
URL does not need `next.config.ts`.

You can provide only the image slots you have. Missing slots fall back
independently to the shipped defaults.

### Global theme palette

The site background is controlled globally by `theme.background`; sections are
not themed one-by-one. Change the palette as a coordinated set so text, surfaces,
borders, buttons, and the background remain readable and visually matched.

Tim Hortons-style example:

```ts
brand: {
  name: "Tim Hortons",
  tagline: "Always fresh coffee and baked goods",
  accent: "#c8102e",
  accentHover: "#a60d26",
  accentDeep: "#7d0a1d",
},
assets: {
  logo: "/media/tim-hortons-logo.png",
  heroBg: "/media/tim-hero.jpg",
  storyImage: "/media/tim-store.jpg",
  gallery: [
    { src: "/media/tim-gallery-1.jpg", alt: "Tim Hortons coffee and donuts" },
  ],
},
theme: {
  background: "#fff7ef",
  surface: "#ffffff",
  surface2: "#f3e7dc",
  foreground: "#251915",
  mutedForeground: "#71615a",
  border: "rgba(37, 25, 21, 0.12)",
  borderStrong: "rgba(37, 25, 21, 0.2)",
  accentForeground: "#ffffff",
},
```

**Compressing a hero video** (`ffmpeg-static` is a devDependency):
```bash
node -e "const f=require('ffmpeg-static');require('child_process').execFileSync(f,['-i','input.mov','-vf','scale=1280:-2','-an','-movflags','+faststart','-crf','30','public/media/hero.mp4'],{stdio:'inherit'})"
```

---

## 3. Ready-to-paste prompt for the next rebrand

> Rebrand this template for a new coffee shop. Update `src/config/site.ts` with
> the `SiteInput` below, leaving optional fields out to use the fallbacks. Place
> any provided assets in `/public/media/` (defaults are fine for missing slots;
> allow new remote image hosts in `next.config.ts` if needed). Resolve the Google
> Maps short link to `map.lat`/`map.lng` — fetch the link and read the
> `@lat,lng` in the URL it redirects to. Then run `npm run lint && npm run build`
> and verify in the browser that the navbar/footer name, hero kicker, Visit
> address + hours + map + WhatsApp, Instagram link, and (if set) accent color are
> all correct, with no console errors.
>
> **SiteInput:**
> ```ts
> // paste the filled-in intake form here
> ```

---

## Worked example — Coffeemistry

Minimal input (menu/features/story/testimonials/SEO/sections all omitted → the
venue-neutral fallbacks, since Coffeemistry is a cart, not a two-floor cafe).
Verified end-to-end against this template.

```ts
const input: SiteInput = {
  brand: {
    name: "Coffeemistry",
    tagline: "Speciality coffee, slow bar, and loads of good things to eat",
  },
  contact: {
    phone: "0307 7263333",
    whatsapp: "923077263333",
    // email omitted → Email CTA hidden
    address: "Caltex, F-7 Markaz, Islamabad, 44000",
    area: "F-7 Markaz",
    city: "Islamabad",
  },
  social: {
    instagram: "https://www.instagram.com/coffeemistrypk/",
    instagramHandle: "@coffeemistrypk",
  },
  map: {
    // https://maps.app.goo.gl/U3h3zzhSTj5jG8nu8 redirects to …/@33.7203427,73.0547181,…
    lat: 33.7203427,
    lng: 73.0547181,
    googleMapsUrl: "https://maps.app.goo.gl/U3h3zzhSTj5jG8nu8",
  },
  hours: [{ day: "Every day", time: "7:30 AM – 1:00 AM" }],
};
```

Result: navbar/footer read "Coffeemistry", hero kicker "F-7 Markaz · Islamabad",
auto SEO title "Coffeemistry — F-7 Markaz, Islamabad", Visit shows the Caltex
address + daily 7:30 AM–1:00 AM hours + a map centered on the resolved coords +
working "Open in Google Maps" + WhatsApp to 923077263333, Instagram links to
coffeemistrypk, Email CTA hidden, and the Features/Menu/Testimonials fall back to
the generic template content. Set `brand.accent` if Coffeemistry supplies a brand color.

---

## Notes

- **One global palette, same layout.** `brand.accent` recolors buttons/labels/rings,
  while `theme` controls the global background, surfaces, text, and borders via
  CSS variables injected on `:root` in [`src/app/layout.tsx`](src/app/layout.tsx).
  Omit `theme` to keep the shipped dark coffee palette.
- **Newsletter form** is decorative (`preventDefault`, no backend). Wire to a
  mailto/Formspree per shop if needed — out of scope by default.
- **No favicon system** yet; add a per-shop favicon under `/public` if desired.
