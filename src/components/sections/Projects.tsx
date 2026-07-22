import { useRef } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '../../hooks/useLanguage';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  color: string;
  gradient: string;
  icon: string;
  url?: string;     // live URL
  code?: string;    // source code URL
  year?: string;
}

const projects: Project[] = [
  {
    id: 'mascotacool',
    title: 'Mascota Cool',
    subtitle: 'Business Portal',
    description: 'Sitio web corporativo con galería de imágenes, servicios y contacto. Diseño responsivo con navegación por pestañas y catálogo visual.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive', 'Gallery'],
    color: '#c96442',
    gradient: 'linear-gradient(135deg, #c96442, #b14f2e)',
    icon: '🐾',
    url: 'https://mascotacool.github.io/principal',
    year: '2021',
  },
  {
    id: 'tangare',
    title: 'Tangaré',
    subtitle: 'Vinos & Chocolates',
    description: 'Sistema de registro y catálogo para Tangaré Vinos y Chocolates. Plataforma de visualización de productos con diseño elegante y moderno.',
    tags: ['React', 'Netlify', 'SPA', 'CSS', 'UX'],
    color: '#ab47bc',
    gradient: 'linear-gradient(135deg, #ab47bc, #7b1fa2)',
    icon: '🍷',
    url: 'https://tangare-registro.netlify.app',
    year: '2024',
  },
  {
    id: 'alquiler',
    title: 'Alquiler e312',
    subtitle: 'Rental Platform',
    description: 'Plataforma de alquiler con catálogo de propiedades. Desplegada en Render con backend funcional y base de datos.',
    tags: ['Render', 'Full-Stack', 'Database', 'API', 'Deploy'],
    color: '#26c6da',
    gradient: 'linear-gradient(135deg, #26c6da, #0097a7)',
    icon: '🏠',
    url: 'https://alquiler-e312.onrender.com',
    year: '2024',
  },
  {
    id: 'viernes',
    title: 'VIERNES',
    subtitle: 'Voice AI Assistant',
    description: 'Asistente de voz con Pipecat + Whisper + Ollama + TTS. Arquitectura de microservicios con FastAPI y WebSockets.',
    tags: ['FastAPI', 'Pipecat', 'WebSockets', 'Ollama', 'Whisper'],
    color: '#c96442',
    gradient: 'linear-gradient(135deg, #c96442, #b14f2e)',
    icon: '🎙',
  },
  {
    id: 'nexis',
    title: 'NÉXIS',
    subtitle: 'Synergy Engine',
    description: 'Motor de sinergia multi-modelo de 12 capas. Orquestación entre 6+ providers de IA con ruteo adaptativo.',
    tags: ['Python', 'LLM', 'Multi-Agent', 'API', 'Synergy'],
    color: '#4fc3f7',
    gradient: 'linear-gradient(135deg, #4fc3f7, #039be5)',
    icon: '🧠',
    code: 'https://github.com/fabriaguirre1979/nexis-synergy',
  },
  {
    id: 'openwa',
    title: 'OpenWA',
    subtitle: 'WhatsApp Automation',
    description: 'Dashboard NestJS + React para automatización de WhatsApp. TypeORM, SQLite, panel de control en tiempo real.',
    tags: ['NestJS', 'React', 'TypeORM', 'SQLite', 'Vite'],
    color: '#26c6da',
    gradient: 'linear-gradient(135deg, #26c6da, #0097a7)',
    icon: '💬',
  },
  {
    id: 'ollama-hf',
    title: 'ollama-viernes',
    subtitle: 'HF Space Deployment',
    description: 'Ollama + qwen2.5:3b desplegado en Hugging Face Spaces. API /chat, /generate, /tags con Docker con interfaz web.',
    tags: ['Docker', 'Ollama', 'HF Spaces', 'API', 'Qwen'],
    color: '#ffa726',
    gradient: 'linear-gradient(135deg, #ffa726, #f57c00)',
    icon: '🚀',
    url: 'https://mascotacool2021-ollama-viernes.hf.space',
  },
  {
    id: 'jfat2026',
    title: 'JFAT2026',
    subtitle: 'This Portfolio',
    description: 'Portfolio inmersivo 3D con Three.js, GSAP, Lenis. Sistema de diseño oscuro con estética neural y partículas interactivas.',
    tags: ['React', 'Three.js', 'GSAP', 'TypeScript', 'MUI'],
    color: '#ab47bc',
    gradient: 'linear-gradient(135deg, #ab47bc, #7b1fa2)',
    icon: '⚡',
    code: 'https://github.com/MascotaCool/principal',
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null!);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { t } = useLanguage();

  useScrollReveal(sectionRef, {
    targets: '.project-card',
    from: { opacity: 0, y: 60, scale: 0.95 },
    to: { opacity: 1, y: 0, scale: 1, ease: 'power4.out' },
    stagger: 0.1,
    start: 'top 80%',
  });

  const handleCardClick = (project: Project, e: React.MouseEvent) => {
    // Don't navigate if clicking a link/button inside
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) return;
    if (project.url) {
      window.open(project.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section
      ref={sectionRef}
      className="section"
      style={{ position: 'relative', zIndex: 1 }}
    >
      <div className="section-inner">
        <div className="section-label">{t.nav.projects || 'Projects'}</div>
        <h2 className="section-title" style={{ marginBottom: 'var(--space-lg)' }}>
          {t.projects.title}
        </h2>
        <p className="section-subtitle" style={{ marginBottom: 'var(--space-2xl)' }}>
          {t.projects.subtitle}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 'var(--space-lg)',
        }}>
          {projects.map((project, i) => (
            <div
              key={project.id}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="project-card glass"
              onClick={(e) => handleCardClick(project, e)}
              style={{
                padding: '0',
                overflow: 'hidden',
                cursor: project.url ? 'pointer' : 'default',
                transition: 'transform 0.4s var(--ease-out-expo), box-shadow 0.4s var(--ease-out-expo)',
                opacity: 0,
                perspective: '1000px',
                position: 'relative',
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                gsap.to(e.currentTarget, {
                  rotationY: x * 8,
                  rotationX: -y * 8,
                  duration: 0.4,
                  ease: 'power2.out',
                  transformPerspective: 1000,
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  rotationY: 0,
                  rotationX: 0,
                  duration: 0.5,
                  ease: 'power3.out',
                });
              }}
            >
              {/* Top gradient bar */}
              <div style={{
                height: '4px',
                background: project.gradient,
                width: '100%',
              }} />

              {/* Year badge */}
              {project.year && (
                <span style={{
                  position: 'absolute',
                  top: 'var(--space-md)',
                  right: 'var(--space-md)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  color: project.color,
                  opacity: 0.6,
                }}>
                  {project.year}
                </span>
              )}

              <div style={{ padding: 'var(--space-lg)' }}>
                {/* Icon + title row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  marginBottom: 'var(--space-md)',
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: 'var(--radius-md)',
                    background: `${project.color}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem',
                    border: `1px solid ${project.color}33`,
                  }}>
                    {project.icon}
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '1.15rem', fontWeight: 600, color: 'var(--surface-50)',
                      display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
                    }}>
                      {project.title}
                      {project.url && (
                        <span style={{
                          fontSize: '0.5rem',
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-sm)',
                          background: `${project.color}22`,
                          color: project.color,
                          fontFamily: 'var(--font-mono)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}>
                          Live
                        </span>
                      )}
                    </h3>
                    <span style={{
                      fontSize: '0.8rem', color: project.color,
                      fontFamily: 'var(--font-mono)', letterSpacing: '0.02em',
                    }}>
                      {project.subtitle}
                    </span>
                  </div>
                </div>

                <p style={{
                  fontSize: '0.9rem', color: 'var(--surface-300)',
                  lineHeight: 1.6, marginBottom: 'var(--space-md)',
                }}>
                  {project.description}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {project.tags.map((tag) => (
                    <span key={tag} style={{
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: `${project.color}11`,
                      color: project.color,
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.03em',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action links */}
                {(project.url || project.code) && (
                  <div style={{
                    display: 'flex', gap: 'var(--space-sm)',
                    marginTop: 'var(--space-lg)',
                    borderTop: `1px solid ${project.color}15`,
                    paddingTop: 'var(--space-md)',
                  }}>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-mono)',
                          color: project.color,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: `${project.color}11`,
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `${project.color}22`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = `${project.color}11`;
                        }}
                      >
                        ↗ {t.projects.viewLive}
                      </a>
                    )}
                    {project.code && (
                      <a
                        href={project.code}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--surface-300)',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(255,255,255,0.03)',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                          e.currentTarget.style.color = 'var(--surface-50)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                          e.currentTarget.style.color = 'var(--surface-300)';
                        }}
                      >
                        &lt;/&gt; {t.projects.viewCode}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
