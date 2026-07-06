import { Link } from 'react-router-dom';
import { useSitePage } from '../../hooks/useSitePage';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { HeroTitle } from '../../components/ui/HeroTitle';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import type { ServiceDetailPageContent, SitePageSlug } from '../../types';
import ps from '../../styles/pages.module.css';

type ServiceSlug = Extract<SitePageSlug, 'build' | 'design' | 'remodel'>;

function ServicePageView({ slug }: { slug: ServiceSlug }) {
  const { page } = useSitePage(slug);
  const content = (page?.content ?? getDemoPageContent(slug)) as ServiceDetailPageContent;

  return (
    <main>
      <PageMeta title={page?.meta_title ?? slug} description={page?.meta_description} />
      <section className={ps.hero}>
        <div className={ps.heroInner}>
          <span className={ps.eyebrow}>{content.hero.eyebrow}</span>
          <HeroTitle hero={content.hero} />
          <div className={ps.ctaButtons} style={{ justifyContent: 'flex-start', marginTop: 32 }}>
            <Link to="/contact" data-cursor className={ps.btnPrimary}>Start a Conversation</Link>
            <a href="https://estimator.buchan.com/" target="_blank" rel="noopener noreferrer" data-cursor className={ps.btnLink}>Get Estimate →</a>
          </div>
        </div>
      </section>
      <section className={ps.sectionAlt}>
        <RevealOnScroll>
          <img src={content.image_url} alt="" style={{ width: '100%', maxWidth: 'var(--max-width)', margin: '0 auto', display: 'block', height: 'clamp(300px, 45vw, 520px)', objectFit: 'cover' }} />
        </RevealOnScroll>
      </section>
      <section className={ps.section}>
        <div className={ps.sectionInner}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
            {content.steps.map((s) => (
              <RevealOnScroll key={s.n}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 48, color: 'var(--color-accent-light)', opacity: 0.5 }}>{s.n}</span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, margin: '8px 0' }}>{s.title}</h3>
                <p className={ps.bodyText}>{s.body}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
      <section className={ps.ctaSection}>
        <h2 className={ps.sectionTitle}>{content.cta_title}</h2>
        <Link to="/contact" data-cursor className={ps.btnPrimary}>Contact Us</Link>
      </section>
    </main>
  );
}

export function Build() {
  return <ServicePageView slug="build" />;
}

export function Design() {
  return <ServicePageView slug="design" />;
}

export function Remodel() {
  return <ServicePageView slug="remodel" />;
}
