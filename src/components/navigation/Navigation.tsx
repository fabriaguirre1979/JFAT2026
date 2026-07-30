import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '../../hooks/useLanguage';

const sections = ['hero', 'pathways', 'skills', 'projects', 'contact'];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null!);
  const activeLineRef = useRef<HTMLSpanElement>(null!);
  const drawerRef = useRef<HTMLDivElement>(null!);
  const overlayRef = useRef<HTMLDivElement>(null!);
  const { t, language, setLanguage } = useLanguage();

  // ── Detect touch-friendly device ──
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Smooth reveal on mount (desktop only — mobile has its own drawer entry)
  useEffect(() => {
    if (!isVisible || !navRef.current || window.innerWidth <= 768) return;
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

  // Animate active line (desktop only)
  useEffect(() => {
    if (!activeLineRef.current || window.innerWidth <= 768) return;
    const activeEl = navRef.current?.querySelector(`[data-section="${activeSection}"]`) as HTMLElement | null;
    if (!activeEl) return;

    gsap.to(activeLineRef.current, {
      width: activeEl.offsetWidth,
      x: activeEl.offsetLeft,
      duration: 0.4,
      ease: 'power3.out',
    });
  }, [activeSection]);

  // Animate mobile drawer open/close
  useEffect(() => {
    if (!drawerRef.current || !overlayRef.current) return;
    if (mobileOpen) {
      gsap.to(drawerRef.current, {
        x: 0,
        duration: 0.4,
        ease: 'power4.out',
      });
      gsap.to(overlayRef.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.3,
        ease: 'power2.out',
      });
    } else {
      gsap.to(drawerRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power3.in',
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [mobileOpen]);

  // Close drawer on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const scrollTo = useCallback((id: string, e?: React.MouseEvent | React.TouchEvent) => {
    e?.preventDefault?.();
    const target = document.getElementById(`section-${id}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  }, []);

  const label = (s: string) => (t.nav as Record<string, string>)?.[s] ?? s;

  const toggleLang = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  const currentLabel = label(activeSection);

  // ── Shared link styles ──
  const linkBase: React.CSSProperties = {
    color: 'rgba(250, 249, 245, 0.45)',
    textDecoration: 'none',
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    fontWeight: 400,
    padding: '0.25rem 0',
    fontFamily: "'JetBrains Mono', monospace",
    transition: 'color 0.3s ease',
  };

  const linkActive: React.CSSProperties = {
    ...linkBase,
    color: 'var(--surface-50)',
    fontWeight: 600,
  };

  const langBtnStyle: React.CSSProperties = {
    background: 'rgba(201, 100, 66, 0.15)',
    border: '1px solid rgba(201, 100, 66, 0.3)',
    borderRadius: 4,
    color: '#d97757',
    padding: '0.25rem 0.6rem',
    fontSize: '0.7rem',
    fontFamily: "'JetBrains Mono', monospace",
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    WebkitTapHighlightColor: 'transparent',
    minWidth: 36,
    textAlign: 'center',
  } as React.CSSProperties;

  return (
    <>
      {/* ──────────── DESKTOP NAV ──────────── */}
      <nav
        ref={navRef}
        className="desktop-nav"
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
              style={activeSection === id ? linkActive : linkBase}
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
          onClick={toggleLang}
          style={{
            ...langBtnStyle,
            background: 'rgba(201, 100, 66, 0.15)',
          }}
          onMouseEnter={(e) => {
            if (isTouch) return;
            e.currentTarget.style.background = 'rgba(201, 100, 66, 0.25)';
          }}
          onMouseLeave={(e) => {
            if (isTouch) return;
            e.currentTarget.style.background = 'rgba(201, 100, 66, 0.15)';
          }}
        >
          {language === 'es' ? 'EN' : 'ES'}
        </button>
      </nav>

      {/* ──────────── MOBILE HEADER ──────────── */}
      <header
        className="mobile-header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: isVisible ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          height: 52,
          background: 'rgba(10, 10, 15, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(201, 100, 66, 0.15)',
        }}
      >
        {/* Current section label */}
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--copper-400)',
          }}
        >
          {currentLabel}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            style={langBtnStyle}
          >
            {language === 'es' ? 'EN' : 'ES'}
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              width: 40,
              height: 40,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              padding: 0,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span
              style={{
                display: 'block',
                width: 22,
                height: 2,
                background: mobileOpen ? '#c96442' : 'rgba(250,249,245,0.6)',
                borderRadius: 1,
                transition: 'all 0.3s ease',
                transform: mobileOpen ? 'rotate(45deg) translate(2.5px, 2.5px)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                width: 22,
                height: 2,
                background: mobileOpen ? '#c96442' : 'rgba(250,249,245,0.6)',
                borderRadius: 1,
                transition: 'all 0.3s ease',
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: 'block',
                width: 22,
                height: 2,
                background: mobileOpen ? '#c96442' : 'rgba(250,249,245,0.6)',
                borderRadius: 1,
                transition: 'all 0.3s ease',
                transform: mobileOpen ? 'rotate(-45deg) translate(2.5px, -2.5px)' : 'none',
              }}
            />
          </button>
        </div>
      </header>

      {/* ──────────── MOBILE DRAWER OVERLAY ──────────── */}
      <div
        ref={overlayRef}
        onClick={() => setMobileOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          background: 'rgba(0,0,0,0.6)',
          opacity: 0,
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* ──────────── MOBILE DRAWER ──────────── */}
      <div
        ref={drawerRef}
        style={{
          position: 'fixed',
          top: 52,
          right: 0,
          bottom: 0,
          width: 'min(280px, 80vw)',
          zIndex: 1001,
          background: 'rgba(10, 10, 15, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(201, 100, 66, 0.15)',
          transform: 'translateX(100%)',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem 1.5rem',
          gap: '0.25rem',
        }}
      >
        {sections.map((id) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={(e) => scrollTo(id, e as any)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                padding: '1rem 1rem',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.85rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: isActive ? 'var(--surface-50)' : 'rgba(250,249,245,0.45)',
                fontWeight: isActive ? 600 : 400,
                borderLeft: isActive ? '3px solid var(--copper-400)' : '3px solid transparent',
                transition: 'all 0.2s ease',
                borderRadius: 0,
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {label(id)}
              {isActive && (
                <span style={{ color: 'var(--copper-400)', marginLeft: '0.5rem', fontSize: '0.7rem' }}>
                  ◆
                </span>
              )}
            </button>
          );
        })}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Drawer footer */}
        <div
          style={{
            padding: '1rem',
            borderTop: '1px solid rgba(201,100,66,0.1)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem',
            color: 'var(--surface-500)',
            letterSpacing: '0.1em',
          }}
        >
          JFAT 2026 ©
        </div>
      </div>
    </>
  );
}
