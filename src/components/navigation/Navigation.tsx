import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '../../hooks/useLanguage';

const sections = ['hero', 'pathways', 'skills', 'projects', 'contact'];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);
  const navRef = useRef<HTMLElement>(null!);
  const activeLineRef = useRef<HTMLSpanElement>(null!);
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Smooth reveal on mount
  useEffect(() => {
    if (!isVisible || !navRef.current) return;
    const el = navRef.current;
    el.style.opacity = '0';
    el.style.transform = 'translateY(-20px)';
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, [isVisible]);

  // Active section via IntersectionObserver
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('section-', '');
            setActiveSection(id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const els = sections
      .map((id) => document.getElementById(`section-${id}`))
      .filter(Boolean) as HTMLElement[];

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Animate active line
  useEffect(() => {
    if (!activeLineRef.current) return;
    const activeEl = navRef.current?.querySelector(`[data-section="${activeSection}"]`) as HTMLElement | null;
    if (!activeEl) return;

    gsap.to(activeLineRef.current, {
      width: activeEl.offsetWidth,
      x: activeEl.offsetLeft,
      duration: 0.4,
      ease: 'power3.out',
    });
  }, [activeSection]);

  const scrollTo = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(`section-${id}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const label = (s: string) => (t.nav as Record<string, string>)?.[s] ?? s;

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: isVisible ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        padding: '0.8rem 2rem',
        background: 'rgba(10, 10, 15, 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(201, 100, 66, 0.15)',
      }}
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {sections.map((id) => (
          <a
            key={id}
            data-section={id}
            href={`#section-${id}`}
            onClick={(e) => scrollTo(id, e)}
            className="nav-link"
            style={{
              color: activeSection === id ? 'var(--surface-50)' : 'rgba(250, 249, 245, 0.45)',
              textDecoration: 'none',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: activeSection === id ? 600 : 400,
              position: 'relative',
              padding: '0.25rem 0',
              fontFamily: "'JetBrains Mono', monospace",
              transition: 'color 0.3s ease',
            }}
          >
            {label(id)}
          </a>
        ))}

        {/* Animated active indicator */}
        <span
          ref={activeLineRef}
          style={{
            position: 'absolute',
            bottom: -2,
            height: 2,
            background: 'linear-gradient(90deg, #c96442, #d97757)',
            borderRadius: 1,
            transition: 'none',
          }}
        />
      </div>

      <span style={{ flex: 1 }} />

      <button
        onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
        style={{
          background: 'rgba(201, 100, 66, 0.15)',
          border: '1px solid rgba(201, 100, 66, 0.3)',
          borderRadius: 4,
          color: '#d97757',
          padding: '0.25rem 0.6rem',
          fontSize: '0.7rem',
          fontFamily: "'JetBrains Mono', monospace",
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(201, 100, 66, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(201, 100, 66, 0.15)';
        }}
      >
        {language === 'es' ? 'EN' : 'ES'}
      </button>
    </nav>
  );
}
