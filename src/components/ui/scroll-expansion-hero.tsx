'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  ReactNode,
  TouchEvent,
  WheelEvent,
} from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);
  const [prevMediaType, setPrevMediaType] = useState<
    ScrollExpandMediaProps['mediaType']
  >(mediaType);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scrollProgressRef = useRef<number>(0);
  const progressAnimationRef = useRef<number | null>(null);

  // Reset expansion state when the media type changes. Adjusting state
  // during render (rather than in an effect) avoids an extra commit/flash
  // — see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (mediaType !== prevMediaType) {
    setPrevMediaType(mediaType);
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }

  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  const animateProgressTo = useCallback((target: number): void => {
    if (progressAnimationRef.current) {
      window.cancelAnimationFrame(progressAnimationRef.current);
    }

    const start = scrollProgressRef.current;
    const duration = 520;
    const startedAt = window.performance.now();
    const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

    const step = (now: number): void => {
      const elapsed = Math.min((now - startedAt) / duration, 1);
      const nextProgress = start + (target - start) * easeOutCubic(elapsed);

      scrollProgressRef.current = nextProgress;
      setScrollProgress(nextProgress);

      if (nextProgress >= 0.98) {
        setMediaFullyExpanded(true);
        setShowContent(true);
      } else if (nextProgress < 0.75) {
        setShowContent(false);
      }

      if (elapsed < 1) {
        progressAnimationRef.current = window.requestAnimationFrame(step);
      } else {
        progressAnimationRef.current = null;
        scrollProgressRef.current = target;
        setScrollProgress(target);
        setMediaFullyExpanded(target >= 1);
        setShowContent(target >= 1);
      }
    };

    progressAnimationRef.current = window.requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    return () => {
      if (progressAnimationRef.current) {
        window.cancelAnimationFrame(progressAnimationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (mediaType !== 'video' || mediaSrc.includes('youtube.com')) return;

    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playVideo = (): void => {
      void video.play().catch(() => {
        // Mobile browsers may wait for a user gesture. The one-time listeners below retry then.
      });
    };

    playVideo();
    video.addEventListener('canplay', playVideo, { once: true });
    window.addEventListener('touchstart', playVideo, { once: true, passive: true });
    window.addEventListener('pointerdown', playVideo, { once: true });

    return () => {
      video.removeEventListener('canplay', playVideo);
      window.removeEventListener('touchstart', playVideo);
      window.removeEventListener('pointerdown', playVideo);
    };
  }, [mediaSrc, mediaType]);

  useEffect(() => {
    const hasSectionHash = (): boolean => {
      return Boolean(window.location.hash && window.location.hash !== '#home');
    };

    const releaseForAnchorNavigation = (): void => {
      if (!hasSectionHash()) return;
      setScrollProgress(1);
      setMediaFullyExpanded(true);
      setShowContent(true);
    };

    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      const shouldSnapOnMobile = isMobileState && Math.abs(deltaY) > 18;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        if (shouldSnapOnMobile) {
          animateProgressTo(0);
        }
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        if (shouldSnapOnMobile && deltaY > 0) {
          animateProgressTo(1);
          setTouchStartY(touchY);
          return;
        }

        // Increase sensitivity for mobile, especially when scrolling back
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005; // Higher sensitivity for scrolling back
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }

        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = (): void => {
      setTouchStartY(0);
    };

    const handleScroll = (): void => {
      if (hasSectionHash()) {
        releaseForAnchorNavigation();
        return;
      }

      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('wheel', handleWheel as unknown as EventListener, {
      passive: false,
    });
    window.addEventListener('scroll', handleScroll as EventListener);
    window.addEventListener('hashchange', releaseForAnchorNavigation);
    window.addEventListener(
      'touchstart',
      handleTouchStart as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener(
      'touchmove',
      handleTouchMove as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener('touchend', handleTouchEnd as EventListener);

    return () => {
      window.removeEventListener(
        'wheel',
        handleWheel as unknown as EventListener
      );
      window.removeEventListener('scroll', handleScroll as EventListener);
      window.removeEventListener('hashchange', releaseForAnchorNavigation);
      window.removeEventListener(
        'touchstart',
        handleTouchStart as unknown as EventListener
      );
      window.removeEventListener(
        'touchmove',
        handleTouchMove as unknown as EventListener
      );
      window.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [animateProgressTo, isMobileState, scrollProgress, mediaFullyExpanded, touchStartY]);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div
      ref={sectionRef}
      className='transition-colors duration-700 ease-in-out overflow-x-hidden'
    >
      <section className='relative flex flex-col items-center justify-start min-h-[100dvh]'>
        <div className='relative w-full flex flex-col items-center min-h-[100dvh]'>
          <motion.div
            className='absolute inset-0 z-0 h-full'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <Image
              src={bgImageSrc}
              alt='Background'
              width={1920}
              height={1080}
              className='w-screen h-screen'
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              priority
            />
            <div className='absolute inset-0 bg-black/45' />
          </motion.div>

          <div className='container mx-auto flex flex-col items-center justify-start relative z-10'>
            <div className='flex flex-col items-center justify-center w-full h-[78dvh] min-h-[620px] relative md:h-[100dvh] md:min-h-0'>
              <div
                className='absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none rounded-2xl'
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: '95vw',
                  maxHeight: '85vh',
                  boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.3)',
                }}
              >
                {mediaType === 'video' ? (
                  mediaSrc.includes('youtube.com') ? (
                    <div className='relative w-full h-full pointer-events-none'>
                      <iframe
                        width='100%'
                        height='100%'
                        src={
                          mediaSrc.includes('embed')
                            ? mediaSrc +
                              (mediaSrc.includes('?') ? '&' : '?') +
                              'autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1'
                            : mediaSrc.replace('watch?v=', 'embed/') +
                              '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=' +
                              mediaSrc.split('v=')[1]
                        }
                        className='w-full h-full rounded-xl'
                        frameBorder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                      />
                      <div
                        className='absolute inset-0 z-10'
                        style={{ pointerEvents: 'none' }}
                      ></div>

                      <motion.div
                        className='absolute inset-0 bg-black/45 rounded-xl'
                        initial={{ opacity: 0.75 }}
                        animate={{ opacity: 0.62 - scrollProgress * 0.28 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : (
                    <div className='relative w-full h-full pointer-events-none'>
                      <video
                        ref={videoRef}
                        src={mediaSrc}
                        poster={posterSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload='auto'
                        className='w-full h-full object-cover rounded-xl'
                        controls={false}
                        disablePictureInPicture
                        disableRemotePlayback
                      />
                      <div
                        className='absolute inset-0 z-10'
                        style={{ pointerEvents: 'none' }}
                      ></div>

                      <motion.div
                      className='absolute inset-0 bg-black/45 rounded-xl'
                      initial={{ opacity: 0.75 }}
                      animate={{ opacity: 0.62 - scrollProgress * 0.28 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  )
                ) : (
                  <div className='relative w-full h-full'>
                    <Image
                      src={mediaSrc}
                      alt={title || 'Media content'}
                      width={1280}
                      height={720}
                      className='w-full h-full object-cover rounded-xl'
                    />

                    <motion.div
                      className='absolute inset-0 bg-black/50 rounded-xl'
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}

              </div>

              <div
                className={`flex items-center justify-center text-center gap-4 w-full relative z-10 transition-none flex-col ${
                  textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
                }`}
              >
                <motion.h2
                  className='font-[family-name:var(--font-playfair)] text-5xl md:text-6xl lg:text-7xl font-semibold italic text-[#fff3df] drop-shadow-[0_8px_28px_rgba(0,0,0,0.72)] transition-none'
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  {firstWord}
                </motion.h2>
                <motion.h2
                  className='font-[family-name:var(--font-playfair)] text-5xl md:text-6xl lg:text-7xl font-semibold italic text-center text-[#fff3df] drop-shadow-[0_8px_28px_rgba(0,0,0,0.72)] transition-none'
                  style={{ transform: `translateX(${textTranslateX}vw)` }}
                >
                  {restOfTitle}
                </motion.h2>
                <div className='-mt-1 flex w-full max-w-[min(88vw,520px)] flex-col items-center text-center transition-none md:-mt-0.5'>
                  {date && (
                    <p
                      className='w-full text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b6d8c2] drop-shadow-[0_4px_16px_rgba(0,0,0,0.75)] md:text-xs'
                      style={{ transform: `translateX(-${textTranslateX}vw)` }}
                    >
                      {date}
                    </p>
                  )}
                  {scrollToExpand && (
                    <p
                      className='mt-1.5 w-full text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f6e9d8] drop-shadow-[0_4px_16px_rgba(0,0,0,0.72)] md:text-xs'
                      style={{ transform: `translateX(${textTranslateX}vw)` }}
                    >
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <motion.section
              className='flex flex-col w-full px-8 pt-4 pb-4 md:px-16 md:pt-5 lg:pt-6 lg:pb-6'
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
