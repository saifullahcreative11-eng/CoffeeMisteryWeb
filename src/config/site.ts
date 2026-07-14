import {
  resolveSite,
  type DrinkIngredient,
  type DrinkLayer,
  type MenuItem,
  type SiteInput,
  type TasteProfile,
} from "./resolve";

// ---------------------------------------------------------------------------
// PER-SHOP CONFIG — COFFEEMISTRY
// ---------------------------------------------------------------------------
// This configuration recreates Coffeemistry as a modern specialty coffee brand
// built around precision, single-origin beans, espresso craft, and slow-bar
// brewing.
//
// IMPORTANT:
// - Replace remote assets with licensed local files in /public/media where
//   possible.
// - Menu prices and opening hours are based on the supplied website content.
// - F-8 HQ is used as the primary map and contact location.
// - F-7 remains represented throughout the location-focused content.
// ---------------------------------------------------------------------------

type DrinkStyle =
  | "espresso"
  | "short-milk"
  | "milk"
  | "sweet-milk"
  | "iced-milk"
  | "iced-sweet"
  | "filter"
  | "cold-brew"
  | "chocolate";

const heroImage = "/media/cafe-menu.jpg";

const espresso: DrinkIngredient = { name: "Espresso", quantity: "2 shots", icon: "bean" };
const ristretto: DrinkIngredient = { name: "Ristretto", quantity: "2 short shots", icon: "bean" };
const milk: DrinkIngredient = { name: "Steamed Milk", quantity: "Silky texture", icon: "milk" };
const foam: DrinkIngredient = { name: "Microfoam", quantity: "Velvet cap", icon: "foam" };
const ice: DrinkIngredient = { name: "Ice", quantity: "Generous amount", icon: "ice" };
const water: DrinkIngredient = { name: "Water", quantity: "Recipe balanced", icon: "water" };
const chocolate: DrinkIngredient = { name: "Chocolate", quantity: "House blend", icon: "chocolate" };
const sweetMilk: DrinkIngredient = { name: "Sweet Milk", quantity: "Creamy pour", icon: "milk" };

const styleData: Record<
  DrinkStyle,
  {
    layers: DrinkLayer[];
    ingredients: DrinkIngredient[];
    tasteProfile: TasteProfile;
    bestFor: string[];
  }
> = {
  espresso: {
    layers: [
      { name: "Crema", note: "Aromatic golden cap", color: "#d9a95f", height: 16 },
      { name: "Espresso", note: "Dense double shot", color: "#4a2413", height: 84 },
    ],
    ingredients: [espresso],
    tasteProfile: { strength: 5, sweetness: 1, bitterness: 4, body: 4, acidity: 3 },
    bestFor: ["Pure coffee", "Quick ritual", "No milk", "Strong finish"],
  },
  "short-milk": {
    layers: [
      { name: "Microfoam", note: "Soft milk cap", color: "#f5dfc1", height: 18 },
      { name: "Steamed Milk", note: "Small silky pour", color: "#d7a977", height: 42 },
      { name: "Espresso", note: "Coffee-forward base", color: "#5a2d18", height: 40 },
    ],
    ingredients: [espresso, milk],
    tasteProfile: { strength: 4, sweetness: 2, bitterness: 3, body: 4, acidity: 2 },
    bestFor: ["Balanced milk", "Afternoon cup", "Compact size", "Coffee forward"],
  },
  milk: {
    layers: [
      { name: "Microfoam", note: "Glossy velvet top", color: "#f6e7cd", height: 18 },
      { name: "Steamed Milk", note: "Creamy body", color: "#ddb680", height: 58 },
      { name: "Espresso", note: "Rich coffee base", color: "#5a2f1b", height: 24 },
    ],
    ingredients: [espresso, milk, foam],
    tasteProfile: { strength: 3, sweetness: 2, bitterness: 2, body: 5, acidity: 1 },
    bestFor: ["Comfort drink", "Milk lovers", "Low bitterness", "Daily latte"],
  },
  "sweet-milk": {
    layers: [
      { name: "Microfoam", note: "Soft creamy top", color: "#f7e6c9", height: 16 },
      { name: "Sweet Milk", note: "Round caramel body", color: "#d29a5b", height: 58 },
      { name: "Espresso", note: "Balances sweetness", color: "#4e2818", height: 26 },
    ],
    ingredients: [espresso, sweetMilk, milk],
    tasteProfile: { strength: 3, sweetness: 4, bitterness: 2, body: 5, acidity: 1 },
    bestFor: ["Sweet coffee", "First timers", "Creamy texture", "Dessert mood"],
  },
  "iced-milk": {
    layers: [
      { name: "Espresso", note: "Fresh shot poured over", color: "#5c2e17", height: 28 },
      { name: "Cold Milk", note: "Chilled creamy body", color: "#e3c79d", height: 48 },
      { name: "Ice", note: "Keeps it refreshing", color: "#eef4f4", height: 24 },
    ],
    ingredients: [espresso, { name: "Cold Milk", quantity: "140 ml", icon: "milk" }, ice],
    tasteProfile: { strength: 3, sweetness: 2, bitterness: 2, body: 4, acidity: 1 },
    bestFor: ["Hot weather", "Refreshing", "Milk coffee", "Easy sipping"],
  },
  "iced-sweet": {
    layers: [
      { name: "Espresso", note: "Bold coffee streaks", color: "#4b2413", height: 24 },
      { name: "Sweet Milk", note: "Cold creamy center", color: "#d6a365", height: 48 },
      { name: "Ice", note: "Long chilled finish", color: "#eff5f4", height: 28 },
    ],
    ingredients: [espresso, sweetMilk, ice],
    tasteProfile: { strength: 3, sweetness: 5, bitterness: 2, body: 5, acidity: 1 },
    bestFor: ["Sweet iced", "Summer treat", "Creamy", "Crowd favorite"],
  },
  filter: {
    layers: [
      { name: "Aroma", note: "Origin clarity", color: "#c58b48", height: 20 },
      { name: "Brewed Coffee", note: "Clean slow extraction", color: "#7a3e1f", height: 64 },
      { name: "Light Body", note: "Tea-like finish", color: "#b86e32", height: 16 },
    ],
    ingredients: [
      { name: "Single-Origin Coffee", quantity: "18 g", icon: "brew" },
      { name: "Hot Water", quantity: "280 ml", icon: "water" },
    ],
    tasteProfile: { strength: 3, sweetness: 2, bitterness: 2, body: 2, acidity: 4 },
    bestFor: ["Origin tasting", "Slow mornings", "Black coffee", "Coffee explorers"],
  },
  "cold-brew": {
    layers: [
      { name: "Cold Brew", note: "Slow-steeped coffee", color: "#4a2414", height: 70 },
      { name: "Ice", note: "Crisp chilled base", color: "#edf5f3", height: 30 },
    ],
    ingredients: [
      { name: "Cold Brew", quantity: "16-hour steep", icon: "brew" },
      ice,
      water,
    ],
    tasteProfile: { strength: 4, sweetness: 2, bitterness: 2, body: 3, acidity: 1 },
    bestFor: ["Low acidity", "Hot weather", "No milk", "Long sipping"],
  },
  chocolate: {
    layers: [
      { name: "Cream", note: "Soft rounded top", color: "#f3dfc3", height: 18 },
      { name: "Chocolate", note: "Rich cocoa body", color: "#7a4227", height: 58 },
      { name: "Milk", note: "Smooth base", color: "#d8ab79", height: 24 },
    ],
    ingredients: [chocolate, milk],
    tasteProfile: { strength: 1, sweetness: 4, bitterness: 1, body: 5, acidity: 1 },
    bestFor: ["No coffee", "Chocolate lovers", "Comfort drink", "Family friendly"],
  },
};

function drink(
  item: Omit<MenuItem, "heroImage" | "layers" | "ingredients" | "tasteProfile" | "bestFor">,
  style: DrinkStyle,
  overrides: Partial<Pick<MenuItem, "layers" | "ingredients" | "tasteProfile" | "bestFor">> = {}
): MenuItem {
  return {
    ...item,
    heroImage,
    ...styleData[style],
    ...overrides,
  };
}

const input: SiteInput = {
  theme: {
    background: "#f6f1e9",
    surface: "#fffdf9",
    surface2: "#e8ede6",
    foreground: "#20231f",
    mutedForeground: "#6f746d",
    border: "rgba(32, 35, 31, 0.12)",
    borderStrong: "rgba(32, 35, 31, 0.22)",
    accentForeground: "#ffffff",
  },

  brand: {
    name: "Coffeemistry",
    tagline: "Specialty Coffee Done Right",
    accent: "#335c4b",
    accentHover: "#20231f",
    accentDeep: "#335c4b",
  },

  contact: {
    phone: "+92 307 8263333",
    whatsapp: "+923078263333",
    email: "hello@coffeemistry.com",
    address:
      "Shop 1 & 2, Block 8 Allahwali Market, F-8/1, Islamabad, Pakistan",
    area: "F-8/1",
    city: "Islamabad",
  },

  social: {
    instagram: "https://www.instagram.com/coffeemistrypk/?hl=en",
    instagramHandle: "@coffeemistrypk",
    facebook: "https://www.facebook.com/coffeemistrypk/",
  },

  map: {
    lat: 33.7107,
    lng: 73.0398,
    spanDeg: 0.03,
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Coffeemistry%20F-8%20Islamabad",
  },

  hours: [
    {
      day: "F-8 HQ · Daily",
      time: "7:30 AM – 11:30 PM",
    },
    {
      day: "F-7 Location · Daily",
      time: "7:30 AM – 1:00 AM",
    },
  ],

  currency: {
    locale: "en-PK",
    code: "PKR",
  },

  seo: {
    title: "Coffeemistry — Specialty Coffee in Islamabad",
    description:
      "Discover Coffeemistry in Islamabad for precision-crafted espresso, single-origin pour overs, cold brew, Spanish lattes and specialty coffee at F-8 and F-7.",
    keywords: [
      "Coffeemistry",
      "specialty coffee Islamabad",
      "coffee shop F-8 Islamabad",
      "coffee shop F-7 Islamabad",
      "single origin coffee Pakistan",
      "pour over coffee Islamabad",
      "V60 Islamabad",
      "Spanish latte Islamabad",
      "cold brew Islamabad",
      "best coffee Islamabad",
    ],
    locale: "en_PK",
    ogTitle: "Coffeemistry — Specialty Coffee Done Right",
    ogDescription:
      "Precision-crafted espresso, globally sourced single-origin coffee and slow-bar brewing in Islamabad.",
  },

  hero: {
    kicker: "F-8 HQ · F-7 · Islamabad",
    scrollLabel: "Discover the Perfect Blend",
    contentHeading: "Specialty Coffee Done Right",
    contentBody:
      "Crafting the perfect cup through precision, passion and the finest single-origin beans. From balanced espresso to slow-bar brews, every pour is carefully dialed in for clarity, aroma and a memorable finish.",
    primaryCta: "Explore the Menu",
    secondaryCta: "Visit Coffeemistry",
  },

  story: {
    label: "The Coffeemistry Approach",
    heading: "Precision In Every Pour",
    body: [
      "Coffeemistry is built around one idea: exceptional coffee should be approached with curiosity, consistency and care. Every drink begins with quality beans, precise recipes and a clear understanding of how each variable affects flavor.",
      "From concentrated espresso drinks to globally sourced single-origin coffees, every cup is designed to reveal something distinct. The result is a menu that welcomes everyday coffee drinkers while giving enthusiasts more to explore.",
    ],
    pullQuote: "Every pour is an experiment in flavor.",
    pullQuoteAttribution: "Coffeemistry",
    stats: [
      {
        value: "2",
        label: "Islamabad locations",
      },
      {
        value: "3",
        label: "Slow-bar methods",
      },
      {
        value: "100%",
        label: "Coffee focused",
      },
    ],
  },

  sections: {
    featuresLabel: "Why Coffeemistry",
    featuresHeading: "Coffee Approached With Precision",
    menuLabel: "Our Menu",
    menuHeading: "Espresso, Slow Bar And More",
    galleryLabel: "Inside Coffeemistry",
    galleryHeading: "Coffee, Craft And Daily Rituals",
    reviewsLabel: "For Coffee People",
    visitLabel: "Visit Us",
    visitHeading: "Two Locations In Islamabad",
  },

  features: [
    {
      title: "Single-Origin Coffee",
      description:
        "Carefully selected coffees chosen for clarity, sweetness and distinctive flavor.",
      icon: "GlobeHemisphereWest",
    },
    {
      title: "Precision Espresso",
      description:
        "Every espresso-based drink is dialed in carefully to balance extraction, texture and milk ratio.",
      icon: "Coffee",
    },
    {
      title: "Dedicated Slow Bar",
      description:
        "Explore expressive single-origin coffees brewed through V60, AeroPress and Chemex methods.",
      icon: "Drop",
    },
    {
      title: "Early Until Late",
      description:
        "Start your morning at F-8 or stay late at F-7 with specialty coffee available seven days a week.",
      icon: "Clock",
    },
  ],

  menu: [
    {
      id: "espresso-based",
      label: "Espresso Based",
      items: [
        drink({
          name: "Espresso",
          description: "Liquid gold",
          price: 500,
          signature: true,
        }, "espresso"),
        drink({
          name: "Piccolo",
          description: "A baby latte",
          price: 530,
        }, "short-milk"),
        drink({
          name: "Cortado",
          description: "A more concentrated latte",
          price: 630,
        }, "short-milk", {
          bestFor: ["Coffee forward", "Small milk drink", "Low sweetness", "Afternoon cup"],
        }),
        drink({
          name: "Cappuccino",
          description: "The OG milk drink",
          price: 700,
        }, "milk", {
          ingredients: [espresso, milk, { name: "Foam", quantity: "Thick cap", icon: "foam" }],
          tasteProfile: { strength: 3, sweetness: 2, bitterness: 2, body: 4, acidity: 1 },
        }),
        drink({
          name: "Classic Latte",
          description: "Creamy milky goodness",
          price: 700,
        }, "milk"),
        drink({
          name: "Creamy Flat White",
          description: "The greatest Kiwi gift to coffee",
          price: 700,
          signature: true,
        }, "milk", {
          ingredients: [ristretto, milk],
          tasteProfile: { strength: 4, sweetness: 2, bitterness: 2, body: 5, acidity: 1 },
          bestFor: ["Velvety milk", "Coffee forward", "Low foam", "Signature cup"],
        }),
        drink({
          name: "Spanish Latte",
          description: "A sweeter, creamier latte",
          price: 750,
          signature: true,
        }, "sweet-milk"),
        drink({
          name: "Sweet Mocha",
          description: "A delicious blend of chocolate and coffee",
          price: 750,
        }, "sweet-milk", {
          ingredients: [espresso, chocolate, milk],
          tasteProfile: { strength: 3, sweetness: 4, bitterness: 2, body: 5, acidity: 1 },
          bestFor: ["Chocolate coffee", "Dessert mood", "Creamy", "Sweet finish"],
        }),
        drink({
          name: "Chocolate Iced Latte",
          description: "The perfect summer coffee",
          price: 750,
        }, "iced-milk", {
          ingredients: [espresso, chocolate, { name: "Cold Milk", quantity: "140 ml", icon: "milk" }, ice],
          tasteProfile: { strength: 3, sweetness: 4, bitterness: 2, body: 4, acidity: 1 },
          bestFor: ["Iced chocolate", "Summer coffee", "Creamy", "Easy sipping"],
        }),
        drink({
          name: "Summer Iced Spanish Latte",
          description: "An iced, irresistible treat",
          price: 830,
          signature: true,
        }, "iced-sweet"),
        drink({
          name: "Sweet Iced Mocha",
          description: "Iced chocolaty heaven",
          price: 830,
        }, "iced-sweet", {
          ingredients: [espresso, chocolate, sweetMilk, ice],
          tasteProfile: { strength: 3, sweetness: 5, bitterness: 2, body: 5, acidity: 1 },
          bestFor: ["Iced dessert", "Chocolate lovers", "Sweet coffee", "Hot weather"],
        }),
      ],
    },
    {
      id: "slow-bar",
      label: "Slow Bar",
      items: [
        drink({
          name: "Signature Pour Over",
          description:
            "A single-origin coffee designed to shine through V60, AeroPress or Chemex",
          price: 880,
          signature: true,
        }, "filter"),
        drink({
          name: "Special Tier 1",
          description:
            "Exceptional coffees selected directly from the founders’ vault",
          price: 1500,
          signature: true,
        }, "filter", {
          ingredients: [
            { name: "Rare Single-Origin", quantity: "18 g", icon: "brew" },
            { name: "Filtered Water", quantity: "280 ml", icon: "water" },
          ],
          tasteProfile: { strength: 3, sweetness: 3, bitterness: 1, body: 2, acidity: 5 },
          bestFor: ["Rare lots", "Origin clarity", "Coffee enthusiasts", "Slow bar"],
        }),
        drink({
          name: "Special Tier 2",
          description:
            "Premium single-origin coffees collected from around the world",
          price: 1000,
        }, "filter", {
          bestFor: ["Premium origins", "Black coffee", "Bright cup", "Slow bar"],
        }),
        drink({
          name: "Global Cold Brew",
          description:
            "Smooth, naturally sweet and incredibly refreshing",
          price: 750,
        }, "cold-brew"),
      ],
    },
    {
      id: "not-coffee",
      label: "Not Coffee",
      items: [
        drink({
          name: "Hot Chocolate",
          description:
            "A creamy, rich combination of fine chocolate and milk",
          price: 630,
        }, "chocolate"),
        drink({
          name: "Iced Chocolate",
          description: "Iced chocolaty heaven",
          price: 680,
        }, "chocolate", {
          layers: [
            { name: "Chocolate", note: "Cold cocoa body", color: "#744026", height: 60 },
            { name: "Milk", note: "Creamy chilled base", color: "#d9b17f", height: 20 },
            { name: "Ice", note: "Keeps it crisp", color: "#eef5f5", height: 20 },
          ],
          ingredients: [chocolate, { name: "Cold Milk", quantity: "160 ml", icon: "milk" }, ice],
          bestFor: ["No coffee", "Iced chocolate", "Hot weather", "Sweet treat"],
        }),
      ],
    },
  ],

  testimonials: [
    {
      quote:
        "Coffeemistry treats coffee like a craft. The espresso is balanced, consistent and noticeably more precise than a typical café drink.",
      name: "Coffeemistry Guest",
      role: "Espresso Regular",
    },
    {
      quote:
        "The slow bar makes it easy to explore single-origin coffee without feeling overwhelmed. The team helps you understand what you are drinking.",
      name: "Coffeemistry Guest",
      role: "Pour Over Enthusiast",
    },
    {
      quote:
        "The Spanish latte is sweet without hiding the coffee, and the F-7 location being open late makes it an easy evening stop.",
      name: "Coffeemistry Guest",
      role: "F-7 Regular",
    },
  ],

  assets: {
    // Add only files that exist in /public/media, or use approved remote URLs.
    logo: "/media/coffeemistry-logo-transparent.png",
    storyImage: "/media/Coffee Mistry shop.jpg",

    // Suggested local assets:
    // heroVideo: "/media/coffeemistry-espresso-pour.mp4",
    // heroPoster: "/media/coffeemistry-hero-poster.jpg",
    // heroBg: "/media/coffeemistry-hero.jpg",
    // storyImage: "/media/coffeemistry-slow-bar.jpg",
    // gallery: [
    //   {
    //     src: "/media/coffeemistry-espresso.jpg",
    //     alt: "Freshly extracted espresso at Coffeemistry",
    //   },
    //   {
    //     src: "/media/coffeemistry-flat-white.jpg",
    //     alt: "Flat white with precise latte art",
    //   },
    //   {
    //     src: "/media/coffeemistry-pour-over.jpg",
    //     alt: "Single-origin coffee brewed through a V60",
    //   },
    //   {
    //     src: "/media/coffeemistry-cold-brew.jpg",
    //     alt: "Refreshing Coffeemistry cold brew",
    //   },
    //   { 
    //     src: "/media/coffeemistry-f8.jpg",
    //     alt: "Coffeemistry F-8 headquarters in Islamabad",
    //   },
    //   {
    //     src: "/media/coffeemistry-f7.jpg",
    //     alt: "Coffeemistry F-7 location in Islamabad",
    //   },
    // ],
  },

  footer: {
    description:
      "Precision-crafted espresso, globally sourced single-origin beans and slow-bar coffee at F-8 and F-7 in Islamabad.",
    newsletterCopy:
      "New coffees, experimental brews and Coffeemistry events.",
    madeWith: "Islamabad, Pakistan.",
  },
};

export const site = resolveSite(input);
