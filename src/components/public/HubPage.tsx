import { Link } from 'react-router-dom';
import type { HubPageData } from '../../data/iaContent';
import { SERVICE_AREAS } from '../../data/navigation';
import { PageMeta } from '../ui/PageMeta';
import { RevealOnScroll } from '../ui/RevealOnScroll';
import { HeroTitle } from '../ui/HeroTitle';
import ps from '../../styles/pages.module.css';

export function HubPage({ data }: { data: HubPageData }) {
  const ctaTo = data.ctaLink ?? '/contact';
  const isExternal = ctaTo.startsWith('tel:') || ctaTo.startsWith('http');

  return (
    <main>
      <PageMeta title={data.metaTitle} description={data.metaDescription} />
      <section className={ps.hero}>
        <div className={ps.heroInner}>
          <span className={ps.eyebrow}>{data.hero.eyebrow}</span>
          <HeroTitle hero={{ eyebrow: data.hero.eyebrow, title: data.hero.title, title_emphasis: data.hero.titleEmphasis }} />
          {data.hero.subtitle && <p className={ps.bodyText} style={{ marginTop: 24, maxWidth: 640 }}>{data.hero.subtitle}</p>}
        </div>
      </section>

      {data.intro && (
        <section className={ps.sectionAlt}>
          <RevealOnScroll>
            <p className={ps.bodyText} style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>{data.intro}</p>
          </RevealOnScroll>
        </section>
      )}

      <section className={ps.section}>
        <div className={ps.sectionInner}>
          <div style={{ display: 'grid', gap: 48 }}>
            {data.sections.map((section) => (
              <RevealOnScroll key={section.title}>
                <h2 className={ps.sectionTitle} style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', marginBottom: 16 }}>{section.title}</h2>
                <p className={ps.bodyText}>{section.body}</p>
                {section.bullets && (
                  <ul style={{ marginTop: 16, paddingLeft: 20, color: 'var(--color-text-muted)' }}>
                    {section.bullets.map((b) => (
                      <li key={b} style={{ marginBottom: 8, lineHeight: 1.6 }}>{b}</li>
                    ))}
                  </ul>
                )}
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {data.slug === 'areas-we-serve' && (
        <section className={ps.section}>
          <div className={ps.sectionInner}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {SERVICE_AREAS.map((area) => (
                <span key={area} style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 16px', border: '1px solid rgba(245,240,232,0.18)' }}>{area}</span>
              ))}
            </div>
            <p className={ps.bodyText} style={{ marginTop: 24 }}>Interactive service-area map and jurisdiction-specific guides coming soon.</p>
          </div>
        </section>
      )}

      <section className={ps.ctaSection}>
        <h2 className={ps.sectionTitle}>{data.ctaTitle}</h2>
        <div className={ps.ctaButtons}>
          {isExternal ? (
            <a href={ctaTo} data-cursor className={ps.btnPrimary}>{data.ctaTitle}</a>
          ) : (
            <Link to={ctaTo} data-cursor className={ps.btnPrimary}>Start a Conversation</Link>
          )}
          <Link to="/cost-estimator" data-cursor className={ps.btnLink}>Cost Estimator →</Link>
        </div>
      </section>
    </main>
  );
}
