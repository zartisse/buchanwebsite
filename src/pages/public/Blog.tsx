import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../../hooks/usePosts';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { fmtDate } from '../../lib/utils';
import { resolveImageUrl } from '../../lib/placeholders';
import ps from '../../styles/pages.module.css';

type CatFilter = 'All' | 'Company Updates' | 'Industry News';

export function Blog() {
  const { posts, loading, error } = usePosts({ publishedOnly: true });
  const [cat, setCat] = useState<CatFilter>('All');

  const filtered = posts.filter((p) => cat === 'All' || p.category === cat);
  const featured = filtered.find((p) => p.featured) ?? filtered[0];
  const gridPosts = filtered.filter((p) => p !== featured);

  return (
    <main>
      <PageMeta title="Blog" description="Notes and news from John Buchan Homes — building on the Seattle Eastside since 1960." />
      <section className={ps.hero}>
        <div className={ps.heroInner}>
          <span className={ps.eyebrow}>The Journal</span>
          <h1 className={ps.heroTitle}>Notes &amp; News</h1>
        </div>
      </section>

      {featured && (
        <section className={ps.sectionAlt}>
          <RevealOnScroll>
            <Link to={`/blog/${featured.slug}`} className={ps.cardLink} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, maxWidth: 'var(--max-width-wide)', margin: '0 auto' }}>
              <img src={resolveImageUrl(featured.image_url, featured.slug)} alt="" style={{ width: '100%', height: 'clamp(280px, 35vw, 420px)', objectFit: 'cover' }} />
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span className={ps.cardLabel}>Featured</span>
                <h2 className={ps.sectionTitle} style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', marginTop: 16 }}>{featured.title}</h2>
                <p className={ps.bodyText} style={{ marginTop: 16 }}>{featured.excerpt}</p>
                <span className={ps.cardMeta} style={{ marginTop: 16 }}>{fmtDate(featured.date)} · {featured.category}</span>
              </div>
            </Link>
          </RevealOnScroll>
        </section>
      )}

      <section className={ps.section}>
        <div className={ps.sectionInner}>
          <div className={ps.filterRow}>
            {(['All', 'Company Updates', 'Industry News'] as CatFilter[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={cat === c ? ps.filterChipActive : ps.filterChip}
              >
                {c}
              </button>
            ))}
          </div>

          {loading && <div className="page-loading">Loading posts…</div>}
          {error && <div className="page-error">{error}</div>}

          <div className={ps.cardGrid}>
            {gridPosts.map((p) => (
              <RevealOnScroll key={p.id}>
                <Link to={`/blog/${p.slug}`} className={ps.cardLink}>
                  <div className={ps.cardImageWrapSm}>
                    <img src={resolveImageUrl(p.image_url, p.slug)} alt="" className={ps.imageCover} />
                  </div>
                  <span className={ps.cardLabel}>{p.category}</span>
                  <h3 className={ps.cardTitle} style={{ fontSize: 22, marginTop: 8 }}>{p.title}</h3>
                  <span className={ps.cardMeta}>{fmtDate(p.date)}</span>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
