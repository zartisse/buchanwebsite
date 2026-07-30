import { Link } from 'react-router-dom';
import { useSitePage } from '../../hooks/useSitePage';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { HeroTitle } from '../../components/ui/HeroTitle';
import { getDemoPageContent } from '../../data/sitePagesDemo';
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, maxWidth: 'var(--max-width)', margin: '0 auto', alignItems: 'center' }}>
            <img src={content.featured.image_url} alt="" style={{ width: '100%', height: 400, objectFit: 'cover' }} />
            <div>
              <blockquote style={{ fontFamily: 'var(--font-serif)', fontSize: quoteFontSize(), fontWeight: 300, lineHeight: 1.35, margin: 0, fontStyle: 'italic' }}>
                &ldquo;{content.featured.quote}&rdquo;
              </blockquote>
              <cite style={{ display: 'block', marginTop: 24, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', fontStyle: 'normal' }}>
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
                <div style={{ border: '1px solid rgba(245,240,232,0.1)', padding: 32 }}>
                  <p className={ps.bodyText} style={{ fontStyle: 'italic' }}>&ldquo;{q.quote}&rdquo;</p>
                  <div style={{ marginTop: 20, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
                    {q.name} · {q.city}
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className={ps.ctaSection}>
        <h2 className={ps.sectionTitle}>{content.cta_title}</h2>
        <div className={ps.ctaButtons}>
          <Link to="/contact" data-cursor className={ps.btnPrimary}>Contact Us</Link>
          <Link to="/cost-estimator" data-cursor className={ps.btnLink}>Cost Estimator →</Link>
        </div>
      </section>
    </main>
  );
}
