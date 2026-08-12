import { Link } from 'react-router-dom';
import { useProperties } from '../../hooks/useProperties';
import { useSitePage } from '../../hooks/useSitePage';
import { PageCta } from '../../components/ui/PageCta';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { HeroTitle } from '../../components/ui/HeroTitle';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import { resolveImageUrl } from '../../lib/placeholders';
import ps from '../../styles/pages.module.css';

export function AvailableHomes() {
  const { page } = useSitePage('available-homes');
  const content = page?.content ?? getDemoPageContent('available-homes');
  const { properties, loading } = useProperties({ publicOnly: true });
  const available = properties.filter((p) => p.status === 'Available');
  const comingSoon = properties.filter((p) => p.status === 'Coming Soon');
  const recentlySold = properties.filter((p) => p.status === 'Sold').slice(0, 3);
  const spotlight = available[0] ?? comingSoon[0] ?? recentlySold[0];

  return (
    <main>
      <PageMeta title={page?.meta_title ?? 'Available Homes'} description={page?.meta_description} />
      <section className={ps.hero}>
        <div className={ps.heroInner}>
          <span className={ps.eyebrow}>{content.hero.eyebrow}</span>
          <HeroTitle hero={content.hero} />
          <p className={ps.bodyText} style={{ marginTop: 24, maxWidth: 560 }}>{content.hero.intro}</p>
        </div>
      </section>

      {spotlight && (
        <section className={ps.sectionAlt}>
          <RevealOnScroll>
            <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 8vw' }}>
              <span className={ps.eyebrow}>{content.featured_eyebrow}</span>
              <Link to={`/portfolio/${spotlight.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, marginTop: 24, alignItems: 'center' }}>
                  <div style={{ overflow: 'hidden', height: 'clamp(280px, 35vw, 420px)' }}>
                    <img src={resolveImageUrl(spotlight.image_url, spotlight.slug)} alt={spotlight.name} className={ps.imageCover} />
                  </div>
                  <div>
                    <span style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>{spotlight.status}</span>
                    <h2 className={ps.sectionTitle} style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginTop: 8 }}>{spotlight.name}</h2>
                    <p className={ps.bodyText}>{spotlight.city}{spotlight.sqft ? ` · ${spotlight.sqft} sf` : ''}</p>
                    <span className={ps.btnLink} style={{ marginTop: 16, display: 'inline-block' }}>View home →</span>
                  </div>
                </div>
              </Link>
            </div>
          </RevealOnScroll>
        </section>
      )}

      <section className={ps.section}>
        <div className={ps.sectionInner}>
          {loading && <p className={ps.bodyText}>Loading…</p>}
          <HomeSection title={content.sections.for_sale_title} items={available} empty={content.sections.empty_for_sale} />
          <HomeSection title={content.sections.coming_soon_title} items={comingSoon} empty={content.sections.empty_coming_soon} />
          <HomeSection title={content.sections.recently_completed_title} items={recentlySold} empty="" />
        </div>
      </section>

      <PageCta
        title={content.cta.title}
        primaryLabel={content.cta.primary_label}
        primaryUrl={content.cta.primary_url}
        backgroundImage={resolveImageUrl(content.cta.background_image_url ?? '/assets/ph-arch-1.png', 'available-homes-cta')}
      >
        <Link to={content.cta.secondary_url} className="btnGhostLight">{content.cta.secondary_label}</Link>
      </PageCta>
    </main>
  );
}

function HomeSection({ title, items, empty }: { title: string; items: ReturnType<typeof useProperties>['properties']; empty: string }) {
  if (!items.length && !empty) return null;
  return (
    <div style={{ marginBottom: 64 }}>
      <h2 className={ps.sectionTitle} style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', marginBottom: 32 }}>{title}</h2>
      {!items.length ? (
        <p className={ps.bodyText}>{empty}</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
          {items.map((h) => (
            <RevealOnScroll key={h.id}>
              <Link to={`/portfolio/${h.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ overflow: 'hidden', height: 280, marginBottom: 16 }}>
                  <img src={resolveImageUrl(h.image_url, h.slug)} alt={h.name} className={ps.imageCover} />
                </div>
                <span style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>{h.status}</span>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, marginTop: 4 }}>{h.name}</div>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted-light)' }}>{h.city}</span>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      )}
    </div>
  );
}
