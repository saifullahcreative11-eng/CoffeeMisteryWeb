import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://coffee-mistery-web.vercel.app"),
  title: site.seo.title,
  description: site.seo.description,
  keywords: site.seo.keywords,
  openGraph: {
    title: site.seo.ogTitle,
    description: site.seo.ogDescription,
    type: "website",
    locale: site.seo.locale,
    url: "https://coffee-mistery-web.vercel.app",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Coffeemistry logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.ogTitle,
    description: site.seo.ogDescription,
    images: ["/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
      style={site.cssVars as CSSProperties}
    >
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-accent selection:text-accent-foreground">
        {children}
      </body>
    </html>
  );
}
