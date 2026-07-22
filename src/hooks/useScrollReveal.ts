import { useEffect, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealConfig {
  /** Elements to animate with stagger */
  targets?: string | HTMLElement[];
  /** From state */
  from?: gsap.TweenVars;
  /** To state */
  to?: gsap.TweenVars;
  /** ScrollTrigger start position */
  start?: string;
  /** Stagger delay between items */
  stagger?: number;
  /** Delay before animation */
  delay?: number;
  /** Duration of animation */
  duration?: number;
  /** Easing */
  ease?: string;
}

const defaults = {
  from: { opacity: 0, y: 40 },
  to: { opacity: 1, y: 0 },
  start: 'top 85%',
  stagger: 0.08,
  delay: 0,
  duration: 0.7,
  ease: 'power3.out',
};

/**
 * Scroll reveal hook — animates elements when they scroll into view.
 * @param ref - React ref to the section container
 * @param config - Animation configuration
 */
export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  config: RevealConfig = {}
) {
  const cfg = { ...defaults, ...config };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Animate label & title if they exist (by class)
      const label = el.querySelector('.section-label');
      const title = el.querySelector('.section-title');
      const subtitle = el.querySelector('.section-subtitle');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: cfg.start,
          toggleActions: 'play none none reverse',
        },
      });

      if (label) {
        tl.fromTo(label, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: cfg.delay });
      }
      if (title) {
        tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3');
      }
      if (subtitle) {
        tl.fromTo(subtitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2');
      }

      // Animate custom targets
      if (cfg.targets) {
        const targets = typeof cfg.targets === 'string'
          ? el.querySelectorAll(cfg.targets)
          : cfg.targets.filter(Boolean);

        if (targets.length > 0) {
          tl.fromTo(
            targets,
            cfg.from,
            { ...cfg.to, duration: cfg.duration, stagger: cfg.stagger, ease: cfg.ease },
            '-=0.2'
          );
        }
      }
    }, el);

    return () => ctx.revert();
  }, [ref, cfg.start, cfg.stagger, cfg.delay, cfg.duration, cfg.ease]);
}

/**
 * Simple fade-in-up for individual elements on scroll.
 */
export function useFadeInOnScroll(
  ref: RefObject<HTMLElement | null>,
  fromVars: gsap.TweenVars = { opacity: 0, y: 30 },
  toVars: gsap.TweenVars = { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
  start = 'top 85%'
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, fromVars, {
        ...toVars,
        scrollTrigger: { trigger: el, start, toggleActions: 'play none none reverse' },
      });
    }, el);
    return () => ctx.revert();
  }, [ref, fromVars, toVars, start]);
}
