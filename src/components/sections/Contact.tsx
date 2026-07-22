import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '../../hooks/useLanguage';

const contactLinks = [
  { id: 'email', label: 'Email', value: 'fabriaguirre@gmail.com', href: 'mailto:fabriaguirre@gmail.com', icon: '✉' },
  { id: 'github', label: 'GitHub', value: '@MascotaCool', href: 'https://github.com/MascotaCool/principal', icon: '⌨' },
  { id: 'linkedin', label: 'LinkedIn', value: 'Fabricio Aguirre', href: 'https://www.linkedin.com/in/fabricio-aguirre-1979may28', icon: '🔗' },
  { id: 'whatsapp', label: 'WhatsApp', value: '+593 998 741 295', href: 'https://api.whatsapp.com/send?phone=593998741295&text=Hola!%20Vi%20tu%20portfolio%20y%20quiero%20contactarte.', icon: '💬' },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null!);
  const labelRef = useRef<HTMLDivElement>(null!);
  const titleRef = useRef<HTMLHeadingElement>(null!);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null!);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(labelRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
        .fromTo(titleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3');

      cardsRef.current.forEach((card) => {
        tl.fromTo(card,
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.5)' },
          '-=0.2'
        );
      });

      tl.fromTo(ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
        '-=0.1'
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section" style={{ position: 'relative', zIndex: 1 }}>
      <div className="section-inner" style={{ textAlign: 'center' }}>
        <div ref={labelRef} className="section-label" style={{ textAlign: 'center' }}>Contacto</div>
        <h2 ref={titleRef} className="section-title">
          {t.contact.title}
        </h2>
        <p className="section-subtitle" style={{ margin: '0 auto var(--space-2xl)', textAlign: 'center' }}>
          {t.contact.subtitle}
        </p>

        {/* Contact cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 'var(--space-md)',
          maxWidth: '900px',
          margin: '0 auto var(--space-2xl)',
        }}>
          {contactLinks.map((link, _i) => (
            <a
              key={link.id}
              href={link.href}
              target={link.id !== 'email' ? '_blank' : undefined}
              rel="noopener noreferrer"
              ref={(el) => { cardsRef.current[_i] = el; }}
              className="glass"
              style={{
                padding: 'var(--space-lg)',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                transition: 'all 0.3s var(--ease-out-expo)',
                opacity: 0,
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, { y: -6, scale: 1.03, duration: 0.3, ease: 'power3.out' });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.3, ease: 'power3.out' });
              }}
            >
              <span style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>{link.icon}</span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                color: 'var(--copper-400)', letterSpacing: '0.15em',
              }}>
                {link.label.toUpperCase()}
              </span>
              <span style={{
                fontSize: '0.9rem', color: 'var(--surface-50)',
                fontWeight: 500,
              }}>
                {link.value}
              </span>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div ref={ctaRef} style={{ opacity: 0 }}>
          <a
            href="mailto:fabriaguirre@gmail.com?subject=Contacto%20desde%20JFAT2026"
            className="glass animated-border"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
              padding: 'var(--space-md) var(--space-xl)',
              textDecoration: 'none',
              color: 'var(--surface-50)',
              fontSize: '1.1rem',
              fontWeight: 500,
              transition: 'all 0.3s var(--ease-out-expo)',
            }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3, ease: 'power3.out' });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: 'power3.out' });
            }}
          >
            <span className="text-gradient">{t.contact.cta}</span>
            <span style={{ fontSize: '1.2rem' }}>→</span>
          </a>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 'var(--space-3xl)',
          fontSize: '0.8rem', color: 'var(--surface-500)',
          fontFamily: 'var(--font-mono)',
        }}>
          <p>
            © {new Date().getFullYear()} Fabricio Aguirre T. — {t.footer.rights}
          </p>
          <p style={{ marginTop: '0.25rem' }}>
            {t.footer.madeWith} <span style={{ color: 'var(--copper-400)' }}>✦</span> {t.footer.and} <span style={{ color: 'var(--cyan-400)' }}>⚡</span>
          </p>
        </div>
      </div>
    </section>
  );
}
