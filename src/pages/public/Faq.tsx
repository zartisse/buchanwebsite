import { useEffect, useState } from 'react';
import { useSitePage } from '../../hooks/useSitePage';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { HeroTitle } from '../../components/ui/HeroTitle';
import { EstimatorLink } from '../../components/ui/EstimatorLink';
import { PageCta } from '../../components/ui/PageCta';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import { resolveImageUrl } from '../../lib/placeholders';
import faqStyles from './Faq.module.css';
import ps from '../../styles/pages.module.css';

function categoryId(title: string): string {
  if (title.toLowerCase().includes('custom home')) return 'custom-homes';
  if (title.toLowerCase().includes('renovation')) return 'renovations';
  if (title.toLowerCase().includes('privacy')) return 'privacy';
  return title.toLowerCase().replace(/\s+/g, '-');
}

export function Faq() {
  const { page } = useSitePage('faq');
  const content = page?.content ?? getDemoPageContent('faq');
  const [openKey, setOpenKey] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const el = document.getElementById(hash);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const toggle = (key: string) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  return (
    <main>
      <PageMeta title={page?.meta_title ?? 'FAQ'} description={page?.meta_description} />
      <section className={ps.hero}>
        <div className={ps.heroInner}>
          <span className={ps.eyebrow}>{content.hero.eyebrow}</span>
          <HeroTitle hero={content.hero} />
        </div>
      </section>

      <section className={ps.section}>
        <div className={ps.sectionInner}>
          <RevealOnScroll>
            <p className={ps.bodyText} style={{ maxWidth: 640, marginBottom: 48 }}>{content.intro}</p>
          </RevealOnScroll>
          {content.categories.map((cat) => {
            const catId = categoryId(cat.title);
            return (
              <div key={cat.title} id={catId}>
                <RevealOnScroll>
                  <h2 className={faqStyles.categoryTitle}>{cat.title}</h2>
                </RevealOnScroll>
                {catId === 'custom-homes' && (
                  <RevealOnScroll>
                    <div className={ps.calloutBand}>
                      <p className={ps.bodyText} style={{ margin: 0, flex: 1 }}>Wondering about cost? Start with a personalized range.</p>
                      <EstimatorLink className={ps.btnPrimary}>Estimate My Project →</EstimatorLink>
                    </div>
                  </RevealOnScroll>
                )}
                <div className={faqStyles.faqList}>
                  {cat.items.map((item, i) => {
                    const key = `${cat.title}-${i}`;
                    const open = openKey === key;
                    return (
                      <div key={key} className={faqStyles.faqItem}>
                        <button
                          type="button"
                          className={faqStyles.faqQuestion}
                          onClick={() => toggle(key)}
                          aria-expanded={open}
                        >
                          {item.question}
                          <span className={`${faqStyles.faqIcon} ${open ? faqStyles.faqIconOpen : ''}`}>+</span>
                        </button>
                        {open && (
                          <div className={faqStyles.faqAnswer}>
                            <p className={ps.bodyText}>{item.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <PageCta title={content.cta_title} backgroundImage={resolveImageUrl(content.cta_background_image_url ?? '/assets/ph-arch-3.png', 'faq-cta')}>
        <EstimatorLink className="btnGhostLight">Estimate My Project</EstimatorLink>
      </PageCta>
    </main>
  );
}
