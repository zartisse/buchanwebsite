import { Link } from 'react-router-dom';
import { useSitePage } from '../../hooks/useSitePage';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { HeroTitle } from '../../components/ui/HeroTitle';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import ps from '../../styles/pages.module.css';

export function Process() {
  const { page } = useSitePage('process');
  const content = page?.content ?? getDemoPageContent('process');

  return (
    <main>
      <PageMeta title={page?.meta_title ?? 'Our Process'} description={page?.meta_description} />
      <section className={ps.hero}>
        <div className={ps.heroInner}>
          <span className={ps.eyebrow}>{content.hero.eyebrow}</span>
          <HeroTitle hero={content.hero} />
        </div>
      </section>

      <section className={ps.section}>
        <div className={ps.sectionInner}>
          {content.steps.map((s, i) => (
            <RevealOnScroll key={s.n}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 32, padding: '32px 0', borderBottom: i < content.steps.length - 1 ? '1px solid rgba(245,240,232,0.08)' : 'none', alignItems: 'start' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 36, color: 'var(--color-accent-light)' }}>{s.n}</span>
                <div>
                  <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>{s.tag}</span>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, margin: '8px 0' }}>{s.title}</h3>
                  <p className={ps.bodyText}>{s.body}</p>
                </div>
                <span style={{ fontSize: 12, color: 'rgba(245,240,232,0.45)', whiteSpace: 'nowrap' }}>{s.duration}</span>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className={ps.sectionAlt} style={{ position: 'relative', minHeight: 300 }}>
        <img src="/assets/ph-arch-2.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
        <RevealOnScroll>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '80px 8vw' }}>
            <h2 className={ps.sectionTitle}>You&apos;re never building alone.</h2>
            <p className={ps.bodyText} style={{ maxWidth: 520, margin: '20px auto 0' }}>A dedicated concierge stays with you from first call to final key.</p>
          </div>
        </RevealOnScroll>
      </section>

      <section className={ps.ctaSection}>
        <h2 className={ps.sectionTitle}>{content.cta_title}</h2>
        <Link to="/contact" data-cursor className={ps.btnPrimary}>Start the Conversation</Link>
      </section>
    </main>
  );
}
