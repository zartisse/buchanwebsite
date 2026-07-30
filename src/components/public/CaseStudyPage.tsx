import { Link } from 'react-router-dom';
import { PageMeta } from '../ui/PageMeta';
import { RevealOnScroll } from '../ui/RevealOnScroll';
import { HeroTitle } from '../ui/HeroTitle';
import ps from '../../styles/pages.module.css';

export interface CaseStudyData {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  hero: { eyebrow: string; title: string; titleEmphasis?: string };
  objective: string;
  sections: { title: string; body: string }[];
  result: string;
  ctaTitle: string;
  ctaLink: string;
}

export function CaseStudyPage({ data }: { data: CaseStudyData }) {
  return (
    <main>
      <PageMeta title={data.metaTitle} description={data.metaDescription} />
      <section className={ps.hero}>
        <div className={ps.heroInner}>
          <span className={ps.eyebrow}>{data.hero.eyebrow}</span>
          <HeroTitle hero={{ eyebrow: data.hero.eyebrow, title: data.hero.title, title_emphasis: data.hero.titleEmphasis }} />
        </div>
      </section>

      <section className={ps.sectionAlt}>
        <RevealOnScroll>
          <p className={ps.bodyText} style={{ maxWidth: 760, margin: '0 auto', fontSize: 'clamp(17px, 1.6vw, 20px)' }}>
            <strong style={{ color: 'var(--color-accent-on-light)', fontWeight: 500 }}>Objective. </strong>
            {data.objective}
          </p>
        </RevealOnScroll>
      </section>

      <section className={ps.section}>
        <div className={ps.sectionInner}>
          <div style={{ display: 'grid', gap: 48, maxWidth: 760, margin: '0 auto' }}>
            {data.sections.map((section) => (
              <RevealOnScroll key={section.title}>
                <h2 className={ps.sectionTitle} style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', marginBottom: 16 }}>{section.title}</h2>
                <p className={ps.bodyText}>{section.body}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className={ps.sectionAlt}>
        <RevealOnScroll>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <h2 className={ps.sectionTitle} style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', marginBottom: 16 }}>The result</h2>
            <p className={ps.bodyText}>{data.result}</p>
          </div>
        </RevealOnScroll>
      </section>

      <section className={ps.ctaSection}>
        <h2 className={ps.sectionTitle}>{data.ctaTitle}</h2>
        <Link to={data.ctaLink} data-cursor className={ps.btnPrimary}>Start a Conversation</Link>
      </section>
    </main>
  );
}
