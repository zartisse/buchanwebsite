import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProperties } from '../../hooks/useProperties';
import { PortfolioPropertyCard } from '../../components/public/PortfolioPropertyCard';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import ps from '../../styles/pages.module.css';

type PortfolioFilter = 'all' | 'custom-homes' | 'video-tours';
type StatusFilter = 'all' | 'Available' | 'Coming Soon' | 'Sold';

const TYPE_LABELS: Record<PortfolioFilter, string> = {
  all: 'All Work',
  'custom-homes': 'Custom Homes',
  'video-tours': 'Video Tours',
};

const REMOVED_TYPE_PARAMS = new Set(['renovations', 'interiors', 'available-homes']);

export function Portfolio() {
  const { properties, loading, error } = useProperties({ publicOnly: true });
  const [searchParams, setSearchParams] = useSearchParams();
  const rawType = searchParams.get('type') ?? 'all';
  const typeParam = (REMOVED_TYPE_PARAMS.has(rawType) ? 'all' : rawType) as PortfolioFilter;
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const portfolioType: PortfolioFilter = TYPE_LABELS[typeParam] ? typeParam : 'all';

  useEffect(() => {
    if (REMOVED_TYPE_PARAMS.has(rawType)) {
      searchParams.delete('type');
      setSearchParams(searchParams, { replace: true });
    }
  }, [rawType, searchParams, setSearchParams]);

  const filtered = properties.filter((p) => {
    if (portfolioType === 'video-tours') return false;
    if (portfolioType === 'custom-homes') {
      const type = p.portfolio_type ?? 'custom-homes';
      if (type !== 'custom-homes') return false;
    }
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  const setType = (type: PortfolioFilter) => {
    if (type === 'all') {
      searchParams.delete('type');
    } else {
      searchParams.set('type', type);
    }
    setSearchParams(searchParams);
  };

  return (
    <main>
      <PageMeta title="Portfolio" description="Custom homes built by John Buchan Homes across the Seattle Eastside." />
      <section className={ps.hero}>
        <div className={ps.heroInner}>
          <span className={ps.eyebrow}>Our Work</span>
          <h1 className={ps.heroTitle}>Portfolio</h1>
          <p className={ps.bodyText} style={{ maxWidth: 560, marginTop: 8 }}>
            Custom homes, renovations, and interiors across Bellevue and the Eastside.
          </p>
        </div>
      </section>

      <section className={ps.section}>
        <div className={ps.sectionInner}>
          <div className={ps.filterRow}>
            {(Object.keys(TYPE_LABELS) as PortfolioFilter[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={portfolioType === t ? ps.filterChipActive : ps.filterChip}
              >
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>

          {portfolioType !== 'video-tours' && (
            <div className={ps.filterRow}>
              {(['all', 'Available', 'Coming Soon', 'Sold'] as StatusFilter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setStatusFilter(f)}
                  className={statusFilter === f ? ps.filterChipActive : ps.filterChip}
                >
                  {f === 'all' ? 'All Status' : f}
                </button>
              ))}
            </div>
          )}

          {portfolioType === 'video-tours' && (
            <p className={ps.bodyText} style={{ marginBottom: 48 }}>
              Video tours are coming soon. Explore our portfolio photography in the meantime, or{' '}
              <Link to="/contact" className={ps.btnLink}>contact us<span>→</span></Link> to schedule a private showing.
            </p>
          )}

          {loading && <div className="page-loading">Loading portfolio…</div>}
          {error && <div className="page-error">{error}</div>}

          <div className={ps.cardGrid}>
            {filtered.map((h) => (
              <RevealOnScroll key={h.id}>
                <PortfolioPropertyCard property={h} />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
