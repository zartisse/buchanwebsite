import { useSitePage } from '../../hooks/useSitePage';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { HeroTitle } from '../../components/ui/HeroTitle';
import { EstimatorLink } from '../../components/ui/EstimatorLink';
import { PageCta } from '../../components/ui/PageCta';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import { resolveImageUrl } from '../../lib/placeholders';
import ps from '../../styles/pages.module.css';

export function Process() {
  const { page } = useSitePage('process');
  const content = page?.content ?? getDemoPageContent('process');

  return (
    <main>
      <PageMeta title={page?.meta_title ?? 'Custom Home Process'} description={page?.meta_description} />
      <section className={ps.hero}>
        <div className={ps.heroInner}>
          <span className={ps.eyebrow}>{content.hero.eyebrow}</span>
          <HeroTitle hero={content.hero} />
        </div>
      </section>

      <section className={ps.section}>
        <div className={ps.sectionInner}>
          <RevealOnScroll>
            <div className={ps.calloutBand}>
              <div style={{ flex: 1, minWidth: 240 }}>
                <strong className={ps.calloutBandTitle}>Estimate My Project</strong>
                <p className={ps.bodyText} style={{ margin: 0 }}>Get a personalized cost range before your first conversation.</p>
              </div>
              <EstimatorLink className={ps.btnPrimary}>Estimate My Project →</EstimatorLink>
            </div>
          </RevealOnScroll>
          {content.steps.map((s, i) => (
            <RevealOnScroll key={s.n}>
              <div id={i === 0 ? 'custom-homes' : undefined} style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 32, padding: '32px 0', borderBottom: i < content.steps.length - 1 ? '1px solid var(--color-hairline-light-2)' : 'none', alignItems: 'start' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 36, color: 'var(--color-accent-dark)' }}>{s.n}</span>
                <div>
                  <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>{s.tag}</span>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, margin: '8px 0' }}>{s.title}</h3>
                  <p className={ps.bodyText}>{s.body}</p>
                </div>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted-light)', whiteSpace: 'nowrap' }}>{s.duration}</span>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section id="renovations" className={ps.sectionAlt} style={{ position: 'relative', minHeight: 300 }}>
        <img src={resolveImageUrl(content.band_image_url ?? '/assets/ph-arch-2.png', 'process-band')} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
        <RevealOnScroll>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '80px 8vw' }}>
            <h2 className={ps.sectionTitle}>{content.band_title ?? 'One aligned team, chosen for your home.'}</h2>
            <p className={ps.bodyText} style={{ maxWidth: 560, margin: '20px auto 0' }}>
              {content.band_body ?? 'We collaborate with independent architects on every project and interior designers on most. Buchan provides estimating, constructability review, schedule planning, coordination, and construction leadership from the early stages.'}
            </p>
          </div>
        </RevealOnScroll>
      </section>

      <PageCta
        title={content.cta_title}
        backgroundImage={resolveImageUrl(content.cta_background_image_url ?? content.band_image_url ?? '/assets/ph-arch-2.png', 'process-cta')}
      />
    </main>
  );
}
