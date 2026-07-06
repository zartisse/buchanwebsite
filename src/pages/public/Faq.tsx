import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSitePage } from '../../hooks/useSitePage';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { HeroTitle } from '../../components/ui/HeroTitle';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import faqStyles from './Faq.module.css';
import ps from '../../styles/pages.module.css';

export function Faq() {
  const { page } = useSitePage('faq');
  const content = page?.content ?? getDemoPageContent('faq');
  const [openKey, setOpenKey] = useState<string | null>(null);

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
          {content.categories.map((cat) => (
            <div key={cat.title}>
              <RevealOnScroll>
                <h2 className={faqStyles.categoryTitle}>{cat.title}</h2>
              </RevealOnScroll>
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
          ))}
        </div>
      </section>

      <section className={ps.ctaSection}>
        <h2 className={ps.sectionTitle}>{content.cta_title}</h2>
        <div className={ps.ctaButtons}>
          <Link to="/contact" data-cursor className={ps.btnPrimary}>Contact Us</Link>
          <Link to="/warranty" data-cursor className={ps.btnLink}>Warranty & Aftercare →</Link>
        </div>
      </section>
    </main>
  );
}
