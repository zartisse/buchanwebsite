import { Link } from 'react-router-dom';
import { useSitePage } from '../../hooks/useSitePage';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { HeroTitle } from '../../components/ui/HeroTitle';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import ps from '../../styles/pages.module.css';

function servicePath(slug: string) {
  const serviceRoutes: Record<string, string> = {
    adus: '/services/adus',
    'real-estate': '/services/real-estate',
    'home-care': '/services/home-care',
  };
  return serviceRoutes[slug] ?? `/${slug}`;
}

export function Services() {
  const { page } = useSitePage('services');
  const content = page?.content ?? getDemoPageContent('services');

  return (
    <main>
      <PageMeta title={page?.meta_title ?? 'Services'} description={page?.meta_description} />
      <section className={ps.hero}>
        <div className={ps.heroInner}>
          <span className={ps.eyebrow}>{content.hero.eyebrow}</span>
          <HeroTitle hero={content.hero} />
        </div>
      </section>

      {content.items.map((s, i) => (
        <section key={s.slug} className={i % 2 ? ps.sectionAlt : ps.section}>
          <RevealOnScroll>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, maxWidth: 'var(--max-width)', margin: '0 auto', alignItems: 'center' }}>
              <img src={s.image_url} alt="" style={{ width: '100%', height: 'clamp(280px, 35vw, 420px)', objectFit: 'cover', order: i % 2 ? 1 : 0 }} />
              <div style={{ order: i % 2 ? 0 : 1 }}>
                <span className={ps.eyebrow}>Service</span>
                <h2 className={ps.sectionTitle} style={{ marginTop: 18 }}>{s.title}</h2>
                <p className={ps.bodyText} style={{ marginTop: 24 }}>{s.description}</p>
                <Link to={servicePath(s.slug)} data-cursor className={ps.btnLink} style={{ marginTop: 24, display: 'inline-flex' }}>Explore {s.title} →</Link>
              </div>
            </div>
          </RevealOnScroll>
        </section>
      ))}

      <section className={ps.ctaSection}>
        <h2 className={ps.sectionTitle}>{content.cta_title}</h2>
        <Link to="/contact" data-cursor className={ps.btnPrimary}>Start a Conversation</Link>
      </section>
    </main>
  );
}
