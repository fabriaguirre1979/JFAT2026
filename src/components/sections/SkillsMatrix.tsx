import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '../../hooks/useLanguage';

const categoryColors: Record<string, string> = {
  agriculture: '#4caf50',
  tech: '#4fc3f7',
  aviation: '#42a5f5',
  sales: '#ffa726',
  sports: '#26c6da',
  education: '#ab47bc',
  ai: '#c96442',
};

const categoryIcons: Record<string, string> = {
  agriculture: '🌾',
  tech: '💻',
  aviation: '🚁',
  sales: '📈',
  sports: '🏆',
  education: '📚',
  ai: '🧠',
};

interface SkillItem {
  name: string;
  desc: string;
}

export default function SkillsMatrix() {
  const sectionRef = useRef<HTMLElement>(null!);
  const titleRef = useRef<HTMLHeadingElement>(null!);
  const labelRef = useRef<HTMLDivElement>(null!);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { t } = useLanguage();

  const categories = Object.entries(t.skills.categories) as [string, string][];
  const itemsArr = Object.entries(t.skills.items) as unknown as [string, SkillItem][];

  const skillCategoryMap: Record<string, string> = {
    agro: 'agriculture', drone: 'aviation', sales: 'sales',
    hockey: 'sports', skating: 'sports', prompt: 'ai',
    ai_dev: 'ai', mcp: 'ai', react: 'tech',
    python: 'tech', web_fundamentals: 'tech', php: 'tech', git: 'tech',
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { opacity: 0, y: 40, scale: 0.9 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.5,
            delay: i * 0.05,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section" style={{ position: 'relative', zIndex: 1 }}>
      <div className="section-inner">
        <div ref={labelRef} className="section-label">Competencias</div>
        <h2 ref={titleRef} className="section-title" style={{ marginBottom: 'var(--space-lg)' }}>
          {t.skills.title}
        </h2>
        <p className="section-subtitle" style={{ marginBottom: 'var(--space-2xl)' }}>
          {t.skills.subtitle}
        </p>

        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)',
          marginBottom: 'var(--space-xl)', justifyContent: 'center',
        }}>
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-full)',
              border: activeCategory === null ? '2px solid var(--copper-400)' : '1px solid var(--surface-600)',
              background: activeCategory === null ? 'rgba(201,100,66,0.15)' : 'transparent',
              color: activeCategory === null ? 'var(--copper-300)' : 'var(--surface-300)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              transition: 'all 0.3s var(--ease-out-expo)',
            }}
          >
            ALL
          </button>
          {categories.map(([key]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                border: activeCategory === key ? `2px solid ${categoryColors[key]}` : '1px solid var(--surface-600)',
                background: activeCategory === key ? `${categoryColors[key]}22` : 'transparent',
                color: activeCategory === key ? categoryColors[key] : 'var(--surface-300)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                transition: 'all 0.3s var(--ease-out-expo)',
              }}
            >
              {categoryIcons[key]} {t.skills.categories[key as keyof typeof t.skills.categories]}
            </button>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-md)',
        }}>
          {itemsArr.map(([id, item], i) => {
            const cat = skillCategoryMap[id] || 'tech';
            const color = categoryColors[cat];
            if (activeCategory && cat !== activeCategory) return null;

            return (
              <div
                key={id}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="glass animated-border"
                style={{
                  padding: 'var(--space-lg)',
                  cursor: 'pointer',
                  transition: 'all 0.3s var(--ease-out-expo)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, { y: -4, scale: 1.02, duration: 0.3, ease: 'power3.out' });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.3, ease: 'power3.out' });
                }}
              >
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: color, marginBottom: 'var(--space-md)',
                  boxShadow: `0 0 12px ${color}`,
                }} />

                <h3 style={{
                  fontSize: '1.1rem', fontWeight: 600,
                  color: 'var(--surface-50)',
                  marginBottom: 'var(--space-sm)',
                }}>
                  {item.name}
                </h3>
                <p style={{
                  fontSize: '0.85rem', color: 'var(--surface-300)',
                  lineHeight: 1.6,
                }}>
                  {item.desc}
                </p>

                <span style={{
                  position: 'absolute', top: 'var(--space-md)', right: 'var(--space-md)',
                  fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                  padding: '2px 8px', borderRadius: 'var(--radius-sm)',
                  background: `${color}15`, color: color,
                  letterSpacing: '0.05em',
                }}>
                  {t.skills.categories[cat as keyof typeof t.skills.categories]?.toString().toUpperCase() || cat.toUpperCase()}
                </span>

                <div style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: '40px', height: '40px',
                  borderRight: `2px solid ${color}22`,
                  borderBottom: `2px solid ${color}22`,
                  borderRadius: '0 0 var(--radius-lg) 0',
                }} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
