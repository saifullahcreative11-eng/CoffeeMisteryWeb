import Link from "next/link";
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import Masonry, { type MasonryItem } from "@/components/ui/Masonry";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";

export function Gallery() {
  const itemHeights = [520, 390, 470, 330, 440, 380];
  const desktopOnlyImages = [
    {
      src: "/media/Single Origin.png",
      alt: "Single-origin coffee detail at Coffeemistry",
      height: 460,
      position: "center top",
    },
    {
      src: "/media/Precision Espresso.png",
      alt: "Espresso preparation at Coffeemistry",
      height: 360,
      position: "center top",
    },
    {
      src: "/media/dkjsn.png",
      alt: "Coffeemistry slow bar brewing setup",
      height: 500,
      position: "center top",
    },
    {
      src: "/media/Coffee mistry.webp",
      alt: "Coffeemistry cafe interior atmosphere",
      height: 420,
      position: "center center",
    },
  ];

  const galleryItems: MasonryItem[] = site.assets.gallery.map((image, index) => ({
    id: `coffeemistry-gallery-${index + 1}`,
    img: image.src,
    url: site.social.instagram ?? image.src,
    height: itemHeights[index % itemHeights.length],
    alt: image.alt,
  }));
  const desktopGalleryItems: MasonryItem[] = [
    ...galleryItems,
    ...desktopOnlyImages.map((image, index) => ({
      id: `coffeemistry-desktop-gallery-${index + 1}`,
      img: image.src,
      url: site.social.instagram ?? image.src,
      height: image.height,
      alt: image.alt,
      position: image.position,
    })),
  ];

  return (
    <section id="gallery" className="bg-background py-8 pt-6 md:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {site.sections.galleryLabel}
            </span>
            <h2 className="mt-4 text-balance font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl">
              {site.sections.galleryHeading}
            </h2>
          </div>
          {site.social.instagram && (
            <Link
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <InstagramLogo size={18} weight="bold" />
              {site.social.instagramHandle ?? "Instagram"}
            </Link>
          )}
        </Reveal>

        <div className="mt-10 -mx-6 overflow-hidden md:hidden">
          <div className="w-[210vw] -translate-x-[55vw]">
            <Masonry
              items={desktopGalleryItems}
              ease="power3.out"
              duration={0.6}
              stagger={0.04}
              animateFrom="bottom"
              scaleOnHover
              hoverScale={0.97}
              blurToFocus
              colorShiftOnHover={false}
              columns={3}
            />
          </div>
        </div>

        <div className="mt-10 hidden overflow-hidden rounded-[28px] border border-border bg-surface/40 p-3 md:block">
          <Masonry
            items={desktopGalleryItems}
            ease="power3.out"
            duration={0.6}
            stagger={0.04}
            animateFrom="bottom"
            scaleOnHover
            hoverScale={0.97}
            blurToFocus
            colorShiftOnHover={false}
          />
        </div>
      </div>
    </section>
  );
}
