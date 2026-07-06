import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProperties } from '../../hooks/useProperties';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import ps from '../../styles/pages.module.css';

type Filter = 'all' | 'Available' | 'Sold';

export function Portfolio() {
  const { properties, loading, error } = useProperties({ publicOnly: true });
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = properties.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  return (
    <main>
      <PageMeta title="Portfolio" description="Custom homes built by John Buchan Homes across the Seattle Eastside." />
      <section className={ps.hero}>
        <div className={ps.heroInner}>
          <span className={ps.eyebrow}>Our Work</span>
          <h1 className={ps.heroTitle}>Portfolio</h1>
        </div>
      </section>

      <section className={ps.section}>
        <div className={ps.sectionInner}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 48 }}>
            {(['all', 'Available', 'Sold'] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                data-cursor
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? 'rgba(176,130,76,0.16)' : 'transparent',
                  border: `1px solid ${filter === f ? '#B0824C' : 'rgba(245,240,232,0.2)'}`,
                  color: '#F5F0E8',
                  padding: '10px 20px',
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {f === 'all' ? 'All Homes' : f}
              </button>
            ))}
          </div>

          {loading && <div className="page-loading">Loading portfolio…</div>}
          {error && <div className="page-error">{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
            {filtered.map((h) => (
              <RevealOnScroll key={h.id}>
                <Link to={`/portfolio/${h.slug}`} data-cursor style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ overflow: 'hidden', height: 'clamp(280px, 30vw, 380px)', marginBottom: 20 }}>
                    <img src={h.image_url || '/assets/ph-arch-1.svg'} alt={h.name} className={ps.imageCover} style={{ transition: 'transform 0.55s ease' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: 26 }}>{h.name}</span>
                    <span style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: h.status === 'Available' ? 'var(--color-accent-light)' : 'rgba(245,240,232,0.45)' }}>{h.status}</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'rgba(245,240,232,0.5)' }}>{h.city}</span>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
