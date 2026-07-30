import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const WHATSAPP_URL =
  'https://api.whatsapp.com/send?phone=593998741295&text=Hola!%20Vi%20tu%20portfolio%20y%20quiero%20contactarte.';

export default function WhatsAppButton() {
  const btnRef = useRef<HTMLAnchorElement>(null!);
  const glowRef = useRef<HTMLDivElement>(null!);
  const pulseRef = useRef<HTMLDivElement>(null!);
  const tooltipRef = useRef<HTMLSpanElement>(null!);

  // Detect if device supports hover (false = touch-first device)
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover)').matches);
  }, []);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 4 });
      tl.fromTo(
        btnRef.current,
        { opacity: 0, scale: 0, x: 40 },
        { opacity: 1, scale: 1, x: 0, duration: 0.5, ease: 'back.out(2.5)' }
      );
    }, btnRef);
    return () => ctx.revert();
  }, []);

  // Continuous glow pulse
  useEffect(() => {
    if (!pulseRef.current) return;
    const pulse = pulseRef.current;
    const loop = () => {
      gsap.to(pulse, {
        scale: 1.8,
        opacity: 0,
        duration: 2,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(pulse, { scale: 1, opacity: 0.5 });
          loop();
        },
      });
    };
    loop();
    return () => gsap.killTweensOf(pulse);
  }, []);

  // Hover effects — only on devices that actually support hover
  const handleMouseEnter = () => {
    if (!canHover) return;
    gsap.to(btnRef.current, { scale: 1.1, duration: 0.3, ease: 'power3.out' });
    gsap.to(glowRef.current, { opacity: 0.6, duration: 0.3, ease: 'power2.out' });
    gsap.to(tooltipRef.current, { opacity: 1, x: 0, duration: 0.3, ease: 'power3.out' });
  };

  const handleMouseLeave = () => {
    if (!canHover) return;
    gsap.to(btnRef.current, { scale: 1, duration: 0.3, ease: 'power3.out' });
    gsap.to(glowRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
    gsap.to(tooltipRef.current, { opacity: 0, x: 10, duration: 0.3, ease: 'power3.out' });
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '0.75rem',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flexDirection: 'row-reverse',
      }}
    >
      {/* Tooltip */}
      <span
        ref={tooltipRef}
        className="glass"
        style={{
          padding: '6px 14px',
          fontSize: '0.7rem',
          fontFamily: "'JetBrains Mono', monospace",
          color: 'var(--surface-50)',
          letterSpacing: '0.05em',
          whiteSpace: 'nowrap',
          opacity: 0,
          transform: 'translateX(10px)',
          borderRadius: 'var(--radius-md)',
          pointerEvents: 'none',
          transition: canHover ? 'none' : 'opacity 0.2s ease',
        }}
        data-tooltip="Hablemos"
      >
        <span style={{ color: 'var(--copper-400)' }}>💬</span> Hablemos
      </span>

      {/* Button */}
      <a
        ref={btnRef}
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          cursor: 'pointer',
          background: 'rgba(17, 17, 24, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(201, 100, 66, 0.25)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          WebkitTapHighlightColor: 'transparent',
          // Slight active feedback for touch
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
      >
        {/* Glow ring */}
        <div
          ref={glowRef}
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #c96442, #4fc3f7)',
            opacity: 0,
            filter: 'blur(8px)',
            zIndex: -1,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Pulse ring */}
        <div
          ref={pulseRef}
          style={{
            position: 'absolute',
            inset: -2,
            borderRadius: '50%',
            border: '2px solid rgba(201, 100, 66, 0.3)',
            opacity: 0.5,
            zIndex: -2,
          }}
        />

        {/* Inner gradient ring */}
        <div
          style={{
            position: 'absolute',
            inset: 2,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(201,100,66,0.15), rgba(79,195,247,0.08))',
            zIndex: -1,
          }}
        />

        {/* WhatsApp SVG icon */}
        <svg
          viewBox="0 0 24 24"
          width="26"
          height="26"
          fill="none"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <defs>
            <linearGradient id="wa-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c96442" />
              <stop offset="100%" stopColor="#d97757" />
            </linearGradient>
          </defs>
          <path
            d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.948-1.38A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.182c-1.69 0-3.28-.44-4.655-1.21l-.34-.2-2.94.82.82-2.87-.22-.36a8.182 8.182 0 117.335 3.82z"
            fill="url(#wa-grad)"
          />
          <path
            d="M17.3 14.3c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.77-1.64-2.07-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5-.17-.02-.37-.02-.57-.02s-.52.07-.8.37c-.27.3-1.03 1-1.03 2.44s1.05 2.83 1.2 3.02c.15.2 2.07 3.16 5.02 4.33.7.28 1.25.44 1.68.57.7.2 1.34.17 1.84.1.56-.07 1.73-.7 1.97-1.38.25-.67.25-1.25.17-1.37-.07-.12-.27-.2-.57-.35z"
            fill="url(#wa-grad)"
            opacity="0.9"
          />
        </svg>
      </a>
    </div>
  );
}
