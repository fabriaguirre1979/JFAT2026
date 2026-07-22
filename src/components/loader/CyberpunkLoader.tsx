import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface CyberpunkLoaderProps {
  onComplete: () => void;
}

const bootSteps = [
  { text: 'INITIALIZING_NEURAL_NETWORK', duration: 800 },
  { text: 'LOADING_MEMORY_BANKS', duration: 600 },
  { text: 'CALIBRATING_NEURAL_PATHWAYS', duration: 500 },
  { text: 'MOUNTING_SKILL_MATRIX', duration: 400 },
  { text: 'ESTABLISHING_CONNECTIONS', duration: 300 },
  { text: 'SYSTEM_READY', duration: 200 },
];

export default function CyberpunkLoader({ onComplete }: CyberpunkLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null!);
  const textRef = useRef<HTMLDivElement>(null!);
  const barRef = useRef<HTMLDivElement>(null!);
  const [currentStep, setCurrentStep] = useState(0);
  const [_progress, _setProgress] = useState(0);

  useEffect(() => {
    // Boot sequence
    let totalDuration = 0;
    const timings = bootSteps.map((step) => {
      totalDuration += step.duration;
      return totalDuration;
    });

    bootSteps.forEach((step, i) => {
      setTimeout(() => {
        setCurrentStep(i);
        const pct = ((i + 1) / bootSteps.length) * 100;
        _setProgress(pct);

        if (textRef.current) {
          gsap.fromTo(textRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }
          );
        }
        if (barRef.current) {
          gsap.to(barRef.current, {
            width: `${pct}%`,
            duration: 0.4,
            ease: 'power3.out',
          });
        }

        if (i === bootSteps.length - 1) {
          setTimeout(() => {
            gsap.to(containerRef.current, {
              opacity: 0,
              duration: 0.5,
              ease: 'power2.in',
              onComplete: onComplete,
            });
          }, 600);
        }
      }, timings[i] - step.duration);
    });
  }, []);

  const stepText = bootSteps[currentStep]?.text || 'BOOTING';

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--surface-950)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-lg)',
      }}
    >
      {/* Central glyph */}
      <div style={{
        width: '80px', height: '80px',
        position: 'relative',
        marginBottom: 'var(--space-lg)',
      }}>
        <svg viewBox="0 0 80 80" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="loader-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c96442" />
              <stop offset="100%" stopColor="#4fc3f7" />
            </linearGradient>
          </defs>
          {/* Outer hex */}
          <polygon
            points="40,5 68,20 68,50 40,65 12,50 12,20"
            fill="none"
            stroke="url(#loader-grad)"
            strokeWidth="1.5"
            opacity="0.5"
          >
            <animateTransform attributeName="transform" type="rotate" from="0 40 40" to="360 40 40" dur="8s" repeatCount="indefinite" />
          </polygon>
          {/* Inner hex */}
          <polygon
            points="40,15 58,25 58,45 40,55 22,45 22,25"
            fill="none"
            stroke="url(#loader-grad)"
            strokeWidth="1"
            opacity="0.3"
          >
            <animateTransform attributeName="transform" type="rotate" from="360 40 40" to="0 40 40" dur="6s" repeatCount="indefinite" />
          </polygon>
          {/* Center dot */}
          <circle cx="40" cy="40" r="3" fill="#c96442">
            <animate attributeName="r" values="2;4;2" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Boot text */}
      <div ref={textRef} style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        letterSpacing: '0.2em',
        color: 'var(--copper-400)',
      }}>
        {stepText}
      </div>

      {/* Progress bar */}
      <div style={{
        width: '200px',
        height: '2px',
        background: 'var(--surface-800)',
        borderRadius: '1px',
        overflow: 'hidden',
      }}>
        <div
          ref={barRef}
          style={{
            width: '0%',
            height: '100%',
            background: 'linear-gradient(90deg, #c96442, #4fc3f7)',
            borderRadius: '1px',
          }}
        />
      </div>

      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        color: 'var(--surface-500)',
        letterSpacing: '0.15em',
        marginTop: 'var(--space-md)',
      }}>
        JFAT2026 // v1.0
      </div>
    </div>
  );
}
