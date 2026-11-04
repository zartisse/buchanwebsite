import { useSitePage } from '../../hooks/useSitePage';
import { EstimatorLink } from '../../components/ui/EstimatorLink';
import { PageMeta } from '../../components/ui/PageMeta';
import { PageCta } from '../../components/ui/PageCta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { HeroTitle } from '../../components/ui/HeroTitle';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import { resolveImageUrl } from '../../lib/placeholders';
import ps from '../../styles/pages.module.css';

function quoteFontSize() {
  return 'clamp(28px, 4vw, 36px)';
}

export function Testimonials() {
  const { page } = useSitePage('testimonials');
  const content = page?.content ?? getDemoPageContent('testimonials');

  return (
    <main>
      <PageMeta title={page?.meta_title ?? 'Testimonials'} description={page?.meta_description} />
      <section className={ps.hero}>
        <div className={ps.heroInner}>
          <span className={ps.eyebrow}>{content.hero.eyebrow}</span>
          <HeroTitle hero={content.hero} />
        </div>
      </section>

      <section className={ps.sectionAlt}>
        <RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(32px, 6vw, 112px)', maxWidth: 'var(--max-width-wide)', margin: '0 auto', alignItems: 'center' }}>
            <img src={resolveImageUrl(content.featured.image_url, 'testimonials-featured')} alt="" style={{ width: '100%', aspectRatio: '5 / 4', height: 'auto', objectFit: 'cover' }} />
            <div>
              <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: quoteFontSize(), fontWeight: 400, lineHeight: 1.4, letterSpacing: '-0.005em', margin: 0, paddingLeft: 24, borderLeft: '1px solid var(--color-accent)', color: 'var(--color-text-on-light)' }}>
                &ldquo;{content.featured.quote}&rdquo;
              </blockquote>
              <cite style={{ display: 'block', marginTop: 24, paddingLeft: 24, fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent-on-light)', fontStyle: 'normal' }}>
                {content.featured.cite}
              </cite>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <section className={ps.section}>
        <div className={ps.sectionInner}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
            {content.quotes.map((q) => (
              <RevealOnScroll key={q.name}>
                <div style={{ borderTop: '1px solid var(--color-hairline-light-3)', paddingTop: 28 }}>
                  <p className={ps.bodyText}>&ldquo;{q.quote}&rdquo;</p>
                  <div style={{ marginTop: 20, fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent-on-light)' }}>
                    {q.name} · {q.city}
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <PageCta title={content.cta_title} backgroundImage={resolveImageUrl(content.cta_background_image_url ?? '/assets/ph-arch-4.webp', 'testimonials-cta')}>
        <EstimatorLink className="btnGhostLight">Cost Estimator</EstimatorLink>
      </PageCta>
    </main>
  );
}
