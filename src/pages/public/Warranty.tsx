import { Link } from 'react-router-dom';
import { useSitePage } from '../../hooks/useSitePage';
import { PageMeta } from '../../components/ui/PageMeta';
import { PageCta } from '../../components/ui/PageCta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { HeroTitle } from '../../components/ui/HeroTitle';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import { resolveImageUrl } from '../../lib/placeholders';
import ps from '../../styles/pages.module.css';

export function Warranty() {
  const { page } = useSitePage('warranty');
  const content = page?.content ?? getDemoPageContent('warranty');

  return (
    <main>
      <PageMeta title={page?.meta_title ?? 'Warranty & Aftercare'} description={page?.meta_description} />
      <section className={ps.hero}>
        <div className={ps.heroInner}>
          <span className={ps.eyebrow}>{content.hero.eyebrow}</span>
          <HeroTitle hero={content.hero} />
        </div>
      </section>

      <section className={ps.section}>
        <RevealOnScroll>
          <p className={ps.bodyText} style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>{content.intro}</p>
        </RevealOnScroll>
      </section>

      {content.sections.map((s, i) => (
        <section key={s.title} className={i % 2 ? ps.sectionAlt : ps.section}>
          <RevealOnScroll>
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
              <h2 className={ps.sectionTitle}>{s.title}</h2>
              <p className={ps.bodyText} style={{ marginTop: 24 }}>{s.body}</p>
            </div>
          </RevealOnScroll>
        </section>
      ))}

      <section className={ps.sectionAlt}>
        <div className={ps.sectionInner}>
          <RevealOnScroll>
            <span className={ps.eyebrow}>Coverage</span>
            <h2 className={ps.sectionTitle} style={{ marginTop: 18, marginBottom: 48 }}>What we stand behind.</h2>
          </RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
            {content.coverage_items.map((item) => (
              <RevealOnScroll key={item.title}>
                <div style={{ border: '1px solid var(--color-hairline-light-2)', padding: 32, height: '100%' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, margin: '0 0 12px' }}>{item.title}</h3>
                  <p className={ps.bodyText}>{item.description}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <PageCta title={content.cta_title} backgroundImage={resolveImageUrl(content.cta_background_image_url ?? '/assets/ph-arch-3.png', 'warranty-cta')}>
        <Link to="/faq" className="btnGhostLight">Read FAQ</Link>
      </PageCta>
    </main>
  );
}
