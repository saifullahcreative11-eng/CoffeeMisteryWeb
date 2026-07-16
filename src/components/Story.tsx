import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";

export function Story() {
  const { story } = site;
  const mobileStats = [
    ...story.stats,
    { value: "03", label: "Slow-Bar Method", mobileOnly: true },
  ];
  const storyImage = (
    <>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
        <Image
          src={site.assets.storyImage}
          alt={`Inside ${site.brand.name}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="scale-125 object-cover"
        />
      </div>
      <div className="absolute -bottom-8 -left-6 hidden max-w-[220px] rounded-xl border border-border-strong bg-surface/90 p-5 shadow-2xl backdrop-blur-sm sm:block">
        <p className="font-display text-2xl italic text-accent">&ldquo;{story.pullQuote}&rdquo;</p>
        <p className="mt-2 text-xs text-muted-foreground">{story.pullQuoteAttribution}</p>
      </div>
    </>
  );

  return (
    <section id="story" className="relative overflow-hidden bg-background pt-8 pb-14 md:pt-20 md:pb-20">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center lg:px-10 lg:gap-24">
        <Reveal className="relative hidden lg:order-1 lg:block">
          {storyImage}
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {story.label}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-4 text-balance font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl">
              {story.heading}
            </h2>
          </Reveal>
          {story.body.map((paragraph, i) => (
            <Reveal key={i} delay={0.2 + i * 0.1}>
              <p className={`${i === 0 ? "mt-6" : "mt-4"} leading-relaxed text-muted-foreground`}>
                {paragraph}
              </p>
            </Reveal>
          ))}

          <Reveal delay={0.2 + story.body.length * 0.1} className="relative mt-10 lg:hidden">
            {storyImage}
          </Reveal>

          <Reveal delay={0.2 + story.body.length * 0.1}>
            <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:mt-10 lg:border-t lg:border-border lg:pt-8">
              {mobileStats.map((stat) => (
                <div
                  key={stat.label}
                  className={`text-center ${"mobileOnly" in stat && stat.mobileOnly ? "sm:hidden" : ""}`}
                >
                  <p className="font-display text-4xl font-semibold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
