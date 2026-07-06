import { Link } from 'react-router-dom';
import { useSitePage } from '../../hooks/useSitePage';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { HeroTitle } from '../../components/ui/HeroTitle';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import ps from '../../styles/pages.module.css';

export function Neighborhoods() {
  const { page } = useSitePage('neighborhoods');
  const content = page?.content ?? getDemoPageContent('neighborhoods');

  return (
    <main>
      <PageMeta title={page?.meta_title ?? 'Neighborhoods'} description={page?.meta_description} />
      <section className={ps.hero}>
        <div className={ps.heroInner}>
          <span className={ps.eyebrow}>{content.hero.eyebrow}</span>
          <HeroTitle hero={content.hero} />
        </div>
      </section>

      {content.areas.map((a, i) => (
        <section key={a.name} className={i % 2 ? ps.sectionAlt : ps.section}>
          <RevealOnScroll>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, maxWidth: 'var(--max-width)', margin: '0 auto', alignItems: 'center' }}>
              <img src={a.image_url} alt={a.name} style={{ width: '100%', height: 'clamp(280px, 35vw, 400px)', objectFit: 'cover', order: i % 2 ? 1 : 0 }} />
              <div style={{ order: i % 2 ? 0 : 1 }}>
                <span className={ps.eyebrow}>Neighborhood</span>
                <h2 className={ps.sectionTitle} style={{ marginTop: 18 }}>{a.name}</h2>
                <p className={ps.bodyText} style={{ marginTop: 24 }}>{a.body}</p>
                <Link to="/portfolio" data-cursor className={ps.btnLink} style={{ marginTop: 24, display: 'inline-flex' }}>View Homes →</Link>
              </div>
            </div>
          </RevealOnScroll>
        </section>
      ))}

      <section className={ps.ctaSection}>
        <h2 className={ps.sectionTitle}>{content.cta_title}</h2>
        <Link to="/contact" data-cursor className={ps.btnPrimary}>Contact Us</Link>
      </section>
    </main>
  );
}
