import { Link } from 'react-router-dom';
import { useSitePage } from '../../hooks/useSitePage';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { HeroTitle, SectionTitleWithEmphasis } from '../../components/ui/HeroTitle';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import { resolveImageUrl } from '../../lib/placeholders';
import ps from '../../styles/pages.module.css';

export function About() {
  const { page } = useSitePage('about');
  const content = page?.content ?? getDemoPageContent('about');

  return (
    <main>
      <PageMeta title={page?.meta_title ?? 'About Us'} description={page?.meta_description} />
      <section className={ps.hero}>
        <div className={ps.heroInner}>
          <span className={ps.eyebrow}>{content.hero.eyebrow}</span>
          <HeroTitle hero={content.hero} />
        </div>
      </section>

      <section id="legacy" className={ps.section}>
        <div className={ps.sectionInner}>
          <RevealOnScroll>
            <span className={ps.eyebrow}>{content.timeline.eyebrow}</span>
            <h2 className={ps.sectionTitle} style={{ marginTop: 18, marginBottom: 48 }}>{content.timeline.title}</h2>
          </RevealOnScroll>
          <div style={{ display: 'grid', gap: 32 }}>
            {content.timeline.items.map((t) => (
              <RevealOnScroll key={`${t.year}-${t.title}`}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 32, borderBottom: '1px solid var(--color-hairline-light-2)', paddingBottom: 32 }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: 36, color: 'var(--color-accent-dark)' }}>{t.year}</span>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, margin: '0 0 8px' }}>{t.title}</h3>
                    <p className={ps.bodyText}>{t.body}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section id="mission" className={ps.sectionAlt}>
        <RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, maxWidth: 'var(--max-width)', margin: '0 auto', alignItems: 'center' }}>
            <img src={resolveImageUrl(content.mission.image_url, 'mission')} alt="" style={{ width: '100%', height: 'clamp(300px, 40vw, 480px)', objectFit: 'cover' }} />
            <div>
              <span className={ps.eyebrow}>{content.mission.eyebrow}</span>
              <SectionTitleWithEmphasis title={content.mission.title} title_emphasis={content.mission.title_emphasis} className={ps.sectionTitle} style={{ marginTop: 18 } as React.CSSProperties} />
              <p className={ps.bodyText} style={{ marginTop: 24 }}>{content.mission.body}</p>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <section id="team" className={ps.section}>
        <div className={ps.sectionInner}>
          <RevealOnScroll>
            <span className={ps.eyebrow}>{content.team.eyebrow}</span>
            <SectionTitleWithEmphasis title={content.team.title} title_emphasis={content.team.title_emphasis} className={ps.sectionTitle} style={{ marginTop: 18, marginBottom: 48 } as React.CSSProperties} />
          </RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {content.team.members.map((m) => (
              <RevealOnScroll key={m.name}>
                <img src={resolveImageUrl(m.image_url, m.name)} alt={m.name} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', marginBottom: 16 }} />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, margin: '0 0 4px' }}>{m.name}</h3>
                <span style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>{m.role}</span>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section id="giving-back" className={ps.sectionAlt} style={{ position: 'relative', minHeight: 400, display: 'flex', alignItems: 'center' }}>
        <img src={resolveImageUrl(content.giving_back.image_url, 'giving-back')} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
        <RevealOnScroll>
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, padding: '0 8vw' }}>
            <span className={ps.eyebrow}>{content.giving_back.eyebrow}</span>
            <SectionTitleWithEmphasis title={content.giving_back.title} title_emphasis={content.giving_back.title_emphasis} className={ps.sectionTitle} style={{ marginTop: 18 } as React.CSSProperties} />
          </div>
        </RevealOnScroll>
      </section>

      <section className={ps.ctaSection}>
        <div id="join-our-team" style={{ marginBottom: 48 }}>
          <h2 className={ps.sectionTitle}>{content.cta.join_title}</h2>
          <p className={ps.bodyText} style={{ maxWidth: 480, margin: '16px auto 24px' }}>{content.cta.join_body}</p>
          <Link to="/contact" className={ps.btnPrimary}>Get in Touch</Link>
        </div>
        <div id="we-buy-land">
          <h2 className={ps.sectionTitle}>{content.cta.land_title}</h2>
          <p className={ps.bodyText} style={{ maxWidth: 480, margin: '16px auto 24px' }}>{content.cta.land_body}</p>
          <Link to="/contact" className={ps.btnPrimary}>Contact Us</Link>
        </div>
      </section>
    </main>
  );
}
