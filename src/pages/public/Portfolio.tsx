import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProperties } from '../../hooks/useProperties';
import { PageMeta } from '../../components/ui/PageMeta';
import { OptimizedImage } from '../../components/ui/OptimizedImage';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import type { PortfolioType as PropertyPortfolioType } from '../../types';
import ps from '../../styles/pages.module.css';

type PortfolioFilter = 'all' | PropertyPortfolioType;
type StatusFilter = 'all' | 'Available' | 'Coming Soon' | 'Sold';

const TYPE_LABELS: Record<PortfolioFilter, string> = {
  all: 'All Work',
  'custom-homes': 'Custom Homes',
  renovations: 'Renovations',
  interiors: 'Interiors',
  'video-tours': 'Video Tours',
  'available-homes': 'Available Homes',
};

function propertyCategories(p: { slug: string; status: string; portfolio_type?: PropertyPortfolioType }): PortfolioFilter[] {
  const cats: PortfolioFilter[] = [p.portfolio_type ?? 'custom-homes'];
  if (p.status === 'Available' || p.status === 'Coming Soon') cats.push('available-homes');
  if (!p.portfolio_type) {
    if (p.slug.includes('renov') || p.slug.includes('remodel')) cats.push('renovations');
    if (p.slug.includes('interior') || p.slug.includes('kitchen')) cats.push('interiors');
  }
  return [...new Set(cats)];
}

export function Portfolio() {
  const { properties, loading, error } = useProperties({ publicOnly: true });
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = (searchParams.get('type') as PortfolioFilter) ?? 'all';
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const portfolioType: PortfolioFilter = TYPE_LABELS[typeParam] ? typeParam : 'all';

  useEffect(() => {
    if (portfolioType === 'available-homes') {
      setStatusFilter('Available');
    }
  }, [portfolioType]);

  const filtered = properties.filter((p) => {
    if (portfolioType === 'video-tours') return false;
    if (portfolioType === 'available-homes') {
      return p.status === 'Available' || p.status === 'Coming Soon';
    }
    if (portfolioType !== 'all') {
      const cats = propertyCategories(p);
      if (!cats.includes(portfolioType)) return false;
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

          {portfolioType !== 'available-homes' && portfolioType !== 'video-tours' && (
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
                <Link to={`/portfolio/${h.slug}`} className={`${ps.cardLink} imageHover`}>
                  <div className={ps.cardImageWrap}>
                    <OptimizedImage src={h.image_url} seed={h.slug} alt={h.name} className={ps.imageCover} style={{ transition: 'transform 0.55s ease' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16 }}>
                    <span className={ps.cardTitle}>{h.name}</span>
                    <span className={h.status === 'Available' || h.status === 'Coming Soon' ? ps.cardMetaAccent : ps.cardMeta}>{h.status}</span>
                  </div>
                  <span className={ps.cardMeta}>{h.city}</span>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
