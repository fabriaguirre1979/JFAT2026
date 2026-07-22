import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '../../hooks/useLanguage';

type WordDef = {
  text: string;
  style: 'light-italic' | 'bold-white' | 'gradient' | 'cyan-mono';
};

const NAME_WORDS: WordDef[] = [
  { text: 'Juan',     style: 'light-italic' },
  { text: 'Fabricio', style: 'bold-white' },
  { text: 'Aguirre',  style: 'gradient' },
  { text: 'Tamayo',   style: 'cyan-mono' },
];

/** Random integer in [min, max] */
const ri = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
/** Random float in [min, max] to 2 decimals */
const rf = (min: number, max: number) => Math.round((Math.random() * (max - min) + min) * 100) / 100;

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null!);
  const titleRef = useRef<HTMLHeadingElement>(null!);
  const subtitleRef = useRef<HTMLParagraphElement>(null!);
  const descRef = useRef<HTMLParagraphElement>(null!);
  const labelRef = useRef<HTMLDivElement>(null!);
  const indicatorRef = useRef<HTMLDivElement>(null!);
  const badgeRef = useRef<HTMLDivElement>(null!);
  const charsRef = useRef<Map<HTMLElement, { ox: number; oy: number }>>(new Map());
  const [glitchActive, setGlitchActive] = useState(false);
  const { t } = useLanguage();

  // Glitch subtitle trigger
  useEffect(() => {
    setGlitchActive(true);
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 4000);
    setTimeout(() => setGlitchActive(false), 300);
    return () => clearInterval(glitchInterval);
  }, []);

  // Entrance + looping shatter
  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Label ──
      gsap.fromTo(labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 }
      );

      // ── Name chars entrance (stagger pop-in) ──
      const allNameChars = [...(charsRef.current?.keys() || [])];
      if (allNameChars.length) {
        gsap.fromTo(allNameChars,
          { opacity: 0, y: 60, rotateX: -30, filter: 'blur(10px)' },
          {
            opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
            duration: 0.7, ease: 'back.out(1.7)',
            stagger: { each: 0.03, from: 'random' },
            delay: 0.5,
          }
        );
      }

      // ── Title chars stagger ──
      const titleChars = titleRef.current?.querySelectorAll('.char');
      if (titleChars?.length) {
        gsap.fromTo(titleChars,
          { opacity: 0, y: 80, rotateX: -40, filter: 'blur(8px)' },
          {
            opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
            duration: 0.9, stagger: 0.04, ease: 'back.out(1.7)',
            delay: 1.3,
          }
        );
      }

      // ── Subtitle ──
      gsap.fromTo(subtitleRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 1.7 }
      );

      // ── Badge ──
      gsap.fromTo(badgeRef.current,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2.5)', delay: 1.8 }
      );

      // ── Description ──
      gsap.fromTo(descRef.current,
        { opacity: 0, y: 20 },
        { opacity: 0.7, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.9 }
      );

      // ── Scroll indicator ──
      gsap.fromTo(indicatorRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 2.3 }
      );

      // ── LOOPING SHATTER — each character distorts then reforms ──
      // Wait for entrance to finish, then start the infinite loop
      const chars = [...(charsRef.current?.keys() || [])];
      if (!chars.length) return;

      // Group chars by word index so each word breaks on its own cycle
      // We stored data attributes word-index on each char
      const wordGroups: HTMLElement[][] = [[], [], [], []];
      chars.forEach((el) => {
        const idx = parseInt(el.getAttribute('data-wi') || '0', 10);
        if (wordGroups[idx]) wordGroups[idx].push(el);
        else wordGroups[0].push(el);
      });

      // ── LOOPING SHATTER — independent infinite timelines per word ──
      // Each word has its own timeline so the breaks are staggered naturally
      wordGroups.forEach((group, i) => {
        if (!group.length) return;
        const wordTl = gsap.timeline({
          repeat: -1,
          delay: 3.5 + i * 0.8,
          repeatDelay: 4.0,
        });

        // Hold normal
        wordTl.to({}, { duration: 0.3 });

        // ── ABRUPT DISTORT (0.08s) ──
        wordTl.to(group, {
          x: () => ri(-140, 140),
          y: () => ri(-90, 90),
          rotation: () => ri(-40, 40),
          scale: () => rf(0.3, 1.3),
          opacity: () => rf(0.3, 1),
          duration: 0.08,
          ease: 'power4.in',
          stagger: { each: 0.015, from: 'random' },
        });

        // Hold chaos
        wordTl.to({}, { duration: 0.25 });

        // ── SMOOTH REFORM (0.7s) ──
        wordTl.to(group, {
          x: 0, y: 0, rotation: 0, scale: 1, opacity: 1,
          duration: 0.7,
          ease: 'back.out(1.7)',
          stagger: { each: 0.012, from: 'random' },
        });
      });

      // Kill on cleanup — context.revert handles everything
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const title = t.hero.title;
  const charArray: string[] = title.split('');

  return (
    <section
      ref={containerRef}
      className="section"
      style={{
        minHeight: '100vh',
        height: '100vh',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow orbs */}
      <div style={{
        position: 'absolute', top: '15%', left: '10%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,100,66,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(60px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '5%',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,195,247,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(60px)',
      }} />

      <div className="section-inner" style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', justifyContent: 'center', minHeight: '100vh',
      }}>
        {/* Portfolio label */}
        <div ref={labelRef} style={{ opacity: 0 }}>
          <span className="text-mono" style={{
            fontSize: '0.7rem', letterSpacing: '0.4em', color: 'var(--copper-400)',
          }}>
            PORTFOLIO {new Date().getFullYear()}
          </span>
        </div>

        {/* ════════════════════════════════════════
            FULL NAME — Shatter-Reform Loop
            Each letter individually animated.
            ════════════════════════════════════════ */}
        <div
          style={{
            marginTop: 'clamp(0.6rem, 2vw, 1.2rem)',
            marginBottom: 'clamp(0.4rem, 1.5vw, 0.8rem)',
            position: 'relative',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'baseline',
            gap: '0.15rem 0.6rem',
          }}
        >
          {NAME_WORDS.map((word, wIdx) => {
            // Typography per word
            const getWordStyle = (): React.CSSProperties => {
              switch (word.style) {
                case 'light-italic':
                  return {
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 300, fontStyle: 'italic',
                    fontSize: 'clamp(1.2rem, 3.5vw, 2.4rem)',
                    color: 'var(--copper-400)',
                    letterSpacing: '0.08em',
                  };
                case 'bold-white':
                  return {
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: 'clamp(1.5rem, 4.5vw, 3.2rem)',
                    color: 'var(--surface-50)',
                    letterSpacing: '-0.02em',
                  };
                case 'gradient':
                  return {
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 500,
                    fontSize: 'clamp(1.2rem, 3.8vw, 2.7rem)',
                    background: 'linear-gradient(135deg, var(--copper-300), var(--copper-500))',
                    WebkitBackgroundClip: 'text' as const,
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text' as const,
                    letterSpacing: '-0.01em',
                  };
                case 'cyan-mono':
                  return {
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: 'clamp(1.1rem, 3.2vw, 2.2rem)',
                    color: 'var(--cyan-400)',
                    letterSpacing: '0.12em',
                    textShadow: '0 0 30px rgba(79, 195, 247, 0.15)',
                  };
              }
            };

            return (
              <span
                key={word.text}
                style={{ display: 'inline-flex', gap: '0' }}
              >
                {word.text.split('').map((char, cIdx) => {
                  const charKey = `${wIdx}-${cIdx}`;
                  return (
                    <span
                      key={charKey}
                      data-wi={wIdx}
                      data-ci={cIdx}
                      ref={(el) => {
                        if (el) {
                          if (!charsRef.current.has(el)) {
                            charsRef.current.set(el, { ox: 0, oy: 0 });
                          }
                        }
                      }}
                      style={{
                        ...getWordStyle(),
                        display: 'inline-block',
                        opacity: 0,
                        position: 'relative',
                        willChange: 'transform, opacity',
                      }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  );
                })}
              </span>
            );
          })}

          {/* Separator diamond */}
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 'clamp(0.4rem, 0.8vw, 0.6rem)', color: 'var(--copper-400)',
              padding: '0 0.2rem', textShadow: '0 0 8px rgba(201, 100, 66, 0.4)',
            }}
          >
            ◆
          </span>

          {/* Underline gradient */}
          <div style={{
            flex: '0 0 100%', height: '1px', marginTop: '0.3rem',
            background: 'linear-gradient(90deg, transparent, rgba(201,100,66,0.3), rgba(79,195,247,0.3), transparent)',
            transform: 'scaleX(0.3)', opacity: 0.4,
          }} />
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-gradient"
          style={{
            fontSize: 'clamp(3rem, 10vw, 8rem)', fontWeight: 700,
            lineHeight: 1.02, letterSpacing: '-0.04em',
            marginTop: 0, marginBottom: 'var(--space-md)', maxWidth: '90vw',
          }}
        >
          {charArray.map((char: string, i: number) => (
            <span key={i} className="char" style={{ display: 'inline-block', opacity: 0 }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <p
            ref={subtitleRef}
            className={glitchActive ? 'glitch-text' : ''}
            data-text={`<${t.hero.subtitle} />`}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.5rem)', color: 'var(--copper-300)',
              fontFamily: 'var(--font-mono)', letterSpacing: '0.05em',
              opacity: 0, marginBottom: 'var(--space-lg)', position: 'relative',
            }}
          >
            {'<'}
            <span className="text-gradient-cyber">{t.hero.subtitle}</span>
            {' />'}
          </p>
        </div>

        {/* Badge */}
        <div
          ref={badgeRef}
          className="glass"
          style={{
            padding: '6px 16px', borderRadius: 'var(--radius-full)',
            fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
            color: 'var(--cyan-400)', border: '1px solid rgba(79, 195, 247, 0.2)',
            marginBottom: 'var(--space-lg)', letterSpacing: '0.1em', opacity: 0,
          }}
        >
          ⚡ Full-Stack · AI · Drone
        </div>

        {/* Description */}
        <p
          ref={descRef}
          style={{
            fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)', color: 'var(--surface-300)',
            maxWidth: '650px', lineHeight: 1.7, opacity: 0,
          }}
        >
          {t.hero.description}
        </p>
      </div>

      {/* Scroll indicator */}
      <div ref={indicatorRef} className="scroll-indicator" style={{ opacity: 0 }}>
        <span>{t.hero.scrollHint}</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" style={{ marginTop: '4px' }}>
          <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="8" cy="8" r="2" fill="currentColor">
            <animate attributeName="cy" values="8;12;8" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </section>
  );
}
