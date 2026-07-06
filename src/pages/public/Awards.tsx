import { Link } from 'react-router-dom';
import { useSitePage } from '../../hooks/useSitePage';
import { FOOTER_AWARD_BADGES, HOUZZ_PROFILE_URL } from '../../data/awards';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { HeroTitle } from '../../components/ui/HeroTitle';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import ps from '../../styles/pages.module.css';
import footerStyles from '../../components/layout/Footer.module.css';

export function Awards() {
  const { page } = useSitePage('awards');
  const content = page?.content ?? getDemoPageContent('awards');

  return (
    <main>
      <PageMeta title={page?.meta_title ?? 'Awards & Press'} description={page?.meta_description} />
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

      <section className={ps.sectionAlt}>
        <div className={ps.sectionInner}>
          <RevealOnScroll>
            <span className={ps.eyebrow}>Houzz</span>
            <h2 className={ps.sectionTitle} style={{ marginTop: 18, marginBottom: 32 }}>Best of Houzz & community recognition.</h2>
          </RevealOnScroll>
          <div className={footerStyles.awardLogos}>
            {FOOTER_AWARD_BADGES.map((badge) => (
              <a
                key={badge.alt}
                href={badge.href ?? HOUZZ_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor
                className={footerStyles.awardLogoLink}
              >
                <img src={badge.image} alt={badge.alt} className={footerStyles.awardLogo} />
              </a>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginTop: 48 }}>
            {content.awards.map((a) => (
              <RevealOnScroll key={`${a.title}-${a.year}`}>
                <div style={{ borderBottom: '1px solid rgba(245,240,232,0.08)', paddingBottom: 24 }}>
                  <span style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>{a.year}</span>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, margin: '8px 0' }}>{a.title}</h3>
                  <p className={ps.bodyText}>{a.description}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className={ps.section}>
        <div className={ps.sectionInner}>
          <RevealOnScroll>
            <span className={ps.eyebrow}>Press & Stories</span>
            <h2 className={ps.sectionTitle} style={{ marginTop: 18, marginBottom: 48 }}>From our blog and community.</h2>
          </RevealOnScroll>
          <div style={{ display: 'grid', gap: 32 }}>
            {content.press.map((p) => (
              <RevealOnScroll key={p.title}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 32, borderBottom: '1px solid rgba(245,240,232,0.08)', paddingBottom: 32 }}>
                  <span style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>{p.date}</span>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, margin: '0 0 8px' }}>
                      {p.url ? <Link to={p.url} data-cursor style={{ color: 'inherit', textDecoration: 'none' }}>{p.title}</Link> : p.title}
                    </h3>
                    <span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.45)' }}>{p.source}</span>
                    <p className={ps.bodyText} style={{ marginTop: 12 }}>{p.excerpt}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className={ps.sectionAlt}>
        <div className={ps.sectionInner}>
          <RevealOnScroll>
            <span className={ps.eyebrow}>Credentials</span>
            <h2 className={ps.sectionTitle} style={{ marginTop: 18, marginBottom: 48 }}>Licensed. Insured. Established.</h2>
          </RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
            {content.credentials.map((c) => (
              <RevealOnScroll key={c.title}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, margin: '0 0 12px' }}>{c.title}</h3>
                <p className={ps.bodyText}>{c.body}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className={ps.ctaSection}>
        <h2 className={ps.sectionTitle}>{content.cta_title}</h2>
        <div className={ps.ctaButtons}>
          <Link to="/contact" data-cursor className={ps.btnPrimary}>Contact Us</Link>
          <Link to="/portfolio" data-cursor className={ps.btnLink}>View Portfolio →</Link>
        </div>
      </section>
    </main>
  );
}
