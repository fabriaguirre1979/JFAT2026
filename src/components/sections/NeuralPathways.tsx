import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '../../hooks/useLanguage';

const phases = [
  { key: 'phase1', icon: '🌱', color: '#4caf50' },
  { key: 'phase2', icon: '✈', color: '#42a5f5' },
  { key: 'phase3', icon: '🤝', color: '#ffa726' },
  { key: 'phase4', icon: '🏒', color: '#26c6da' },
  { key: 'phase5', icon: '🧠', color: '#c96442' },
  { key: 'phase6', icon: '⚡', color: '#4fc3f7' },
];

export default function NeuralPathways() {
  const sectionRef = useRef<HTMLElement>(null!);
  const titleRef = useRef<HTMLHeadingElement>(null!);
  const labelRef = useRef<HTMLDivElement>(null!);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const { t } = useLanguage();
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section label & title
      gsap.fromTo(labelRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );

      // Animate nodes on scroll
      nodesRef.current.forEach((node, i) => {
        if (!node) return;
        const phases = gsap.timeline({
          scrollTrigger: {
            trigger: node,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
        phases
          .fromTo(node,
            { scale: 0, opacity: 0, rotation: -30 },
            { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)' }
          )
          .fromTo(node.querySelector('.node-icon'),
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(3)' },
            '-=0.2'
          )
          .fromTo(node.querySelector('.node-content'),
            { opacity: 0, x: i % 2 === 0 ? -20 : 20 },
            { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' },
            '-=0.1'
          );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section" style={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}>
      {/* Connection lines SVG */}
      <svg
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          pointerEvents: 'none', zIndex: 0, opacity: 0.1,
        }}
      >
        <defs>
          <linearGradient id="path-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c96442" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#d97757" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4fc3f7" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d="M50,20 C200,10 300,90 450,50 C600,10 700,120 850,80 C1000,40 1100,130 1200,100"
          stroke="url(#path-grad)"
          strokeWidth="1"
          fill="none"
          className="connection-line"
        />
        <path
          d="M50,30 C200,50 300,20 450,70 C600,120 700,30 850,90 C1000,150 1100,40 1200,120"
          stroke="url(#path-grad)"
          strokeWidth="0.5"
          fill="none"
          className="connection-line"
        />
      </svg>

      <div className="section-inner" style={{ position: 'relative', zIndex: 1 }}>
        <div ref={labelRef} className="section-label">Línea de Vida</div>
        <h2 ref={titleRef} className="section-title" style={{ marginBottom: 'var(--space-2xl)' }}>
          {t.thoughts.title}<br />
          <span style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: 400, color: 'var(--surface-300)', display: 'block', marginTop: '0.5rem' }}>
            {t.thoughts.subtitle}
          </span>
        </h2>

        {/* Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', maxWidth: '800px', margin: '0 auto' }}>
          {phases.map((phase, i) => (
            <div
              key={phase.key}
              ref={(el) => { nodesRef.current[i] = el; }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-lg)',
                flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
                opacity: 0,
                transform: 'scale(0)',
              }}
            >
              {/* Node circle */}
              <div
                className="node-icon"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 30% 30%, ${phase.color}, transparent)`,
                  border: `2px solid ${phase.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0,
                  boxShadow: `0 0 30px ${phase.color}33, 0 0 60px ${phase.color}11`,
                  opacity: 0,
                  transform: 'scale(0)',
                }}
              >
                {phase.icon}
              </div>

              {/* Content */}
              <div
                className="node-content glass"
                style={{
                  padding: 'var(--space-lg)',
                  flex: 1,
                  opacity: 0,
                }}
              >
                <p style={{ color: 'var(--surface-50)', fontSize: '1rem', lineHeight: 1.7 }}>
                  {/* @ts-ignore */}
                  {t.thoughts[phase.key]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
