import { Link } from 'react-router-dom';
import { useProperties } from '../../hooks/useProperties';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { resolveImageUrl } from '../../lib/placeholders';
import ps from '../../styles/pages.module.css';

export function AvailableHomes() {
  const { properties, loading } = useProperties({ publicOnly: true });
  const available = properties.filter((p) => p.status === 'Available');
  const comingSoon = properties.filter((p) => p.status === 'Coming Soon');
  const recentlySold = properties.filter((p) => p.status === 'Sold').slice(0, 3);
  const spotlight = available[0] ?? comingSoon[0] ?? recentlySold[0];

  return (
    <main>
      <PageMeta title="Available Homes" description="Move-in-ready and coming-soon homes by John Buchan Homes on the Seattle Eastside." />
      <section className={ps.hero}>
        <div className={ps.heroInner}>
          <span className={ps.eyebrow}>Available Homes</span>
          <h1 className={ps.heroTitle}>For sale, coming soon,<br /><em>or recently sold.</em></h1>
          <p className={ps.bodyText} style={{ marginTop: 24, maxWidth: 560 }}>
            Always something to explore — with a path to build yours if nothing fits today.
          </p>
        </div>
      </section>

      {spotlight && (
        <section className={ps.sectionAlt}>
          <RevealOnScroll>
            <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 8vw' }}>
              <span className={ps.eyebrow}>Featured</span>
              <Link to={`/portfolio/${spotlight.slug}`} style={{ textDecoration: 'none', color: 'inherit' }} data-cursor>
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
          <HomeSection title="Currently for sale" items={available} empty="No homes for sale right now — let's build yours." />
          <HomeSection title="Coming soon" items={comingSoon} empty="Nothing coming soon — contact us about custom build opportunities." />
          <HomeSection title="Recently completed" items={recentlySold} empty="" />
        </div>
      </section>

      <section className={ps.ctaSection}>
        <h2 className={ps.sectionTitle}>Or, let&apos;s build yours.</h2>
        <div className={ps.ctaButtons}>
          <Link to="/custom-homes" data-cursor className={ps.btnPrimary}>Plan My Custom Home</Link>
          <Link to="/contact" data-cursor className={ps.btnLink}>Start a Conversation →</Link>
        </div>
      </section>
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
              <Link to={`/portfolio/${h.slug}`} data-cursor style={{ textDecoration: 'none', color: 'inherit' }}>
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
