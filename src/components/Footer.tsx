"use client";

import Link from "next/link";
import { FacebookLogo, InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { BrandMark } from "@/components/BrandLogo";
import { site } from "@/config/site";

export function Footer() {
  const socials = [
    { icon: InstagramLogo, label: "Instagram", href: site.social.instagram },
    { icon: FacebookLogo, label: "Facebook", href: site.social.facebook },
    
  ].filter((s) => s.href);
  const phoneHref = site.contact.phone
    ? `tel:${site.contact.phone.replace(/\s/g, "")}`
    : undefined;

  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[minmax(320px,1.65fr)_minmax(120px,0.65fr)_minmax(190px,0.85fr)_minmax(340px,1.35fr)] lg:items-start lg:gap-14">
          <div>
            <div className="flex items-center gap-3">
              <span
                className={
                  site.assets.logo
                    ? "flex h-20 max-w-[260px] items-center justify-center"
                    : "flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent"
                }
              >
                <BrandMark
                  logo={site.assets.logo}
                  className="h-8 w-9"
                  imageClassName="h-16 w-auto max-w-[260px] object-contain"
                />
              </span>
              {!site.assets.logo && (
                <p className="font-display text-2xl font-semibold text-foreground">
                  {site.brand.name}
                </p>
              )}
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {site.footer.description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border-strong text-foreground transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Explore</p>
            <ul className="mt-4 space-y-3">
              {site.nav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:-translate-x-6 lg:justify-self-center">
            <p className="text-sm font-semibold text-foreground">Contact</p>
            <ul className="mt-4 space-y-3">
              {site.contact.phone && phoneHref && (
                <li>
                  <a
                    href={phoneHref}
                    className="text-sm text-muted-foreground transition-colors hover:text-accent"
                  >
                    {site.contact.phone}
                  </a>
                </li>
              )}
              {site.contact.email && (
                <li>
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-accent"
                  >
                    {site.contact.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="w-full lg:max-w-md">
            <p className="text-sm font-semibold text-foreground">{site.footer.newsletterHeading}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              {site.footer.newsletterCopy}
            </p>
            <form
              className="mt-4 flex w-full items-center gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder="you@email.com"
                autoComplete="email"
                className="min-w-0 flex-1 rounded-full border border-border bg-background px-5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <button
                type="submit"
                className="shrink-0 cursor-pointer rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>{site.footer.copyright}</p>
          <p>{site.footer.madeWith}</p>
        </div>
      </div>
    </footer>
  );
}
