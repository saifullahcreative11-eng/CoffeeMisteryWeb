'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CaretRight } from '@phosphor-icons/react/dist/ssr';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import { site } from '@/config/site';

export function ScrollHero() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ScrollExpandMedia
      mediaType='video'
      mediaSrc={site.assets.heroVideo}
      posterSrc={site.assets.heroPoster}
      bgImageSrc={site.assets.heroBg}
      title={site.hero.title}
      date={site.hero.kicker}
      scrollToExpand={site.hero.scrollLabel}
    >
      <div className='mx-auto max-w-4xl text-center'>
        <span className='text-xs font-medium uppercase tracking-[0.2em] text-accent'>
                  EXPERIENCE COFFEEMISTRY
        </span>
        <h2 className='mt-3 text-balance font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl'>
          {site.hero.contentHeading}
        </h2>
        <p className='mx-auto mt-4 max-w-xl text-balance leading-relaxed text-muted-foreground md:max-w-2xl md:text-lg'>
          {site.hero.contentBody}
        </p>
        <div className='mt-6 flex flex-col items-center justify-center gap-3'>
          <Link
            href='#menu'
            className='group inline-flex min-w-[240px] cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-all duration-200 hover:bg-accent-hover hover:shadow-[0_0_32px_var(--color-accent-soft)]'
          >
            {site.hero.primaryCta}
            <CaretRight
              size={16}
              weight='bold'
              className='transition-transform duration-200 group-hover:translate-x-0.5'
            />
          </Link>
          <Link
            href='#visit'
            className='inline-flex min-w-[240px] cursor-pointer items-center justify-center gap-2 rounded-full border border-border-strong px-7 py-3.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-accent hover:bg-accent-soft hover:text-accent'
          >
            {site.hero.secondaryCta}
          </Link>
        </div>
      </div>
    </ScrollExpandMedia>
  );
}
