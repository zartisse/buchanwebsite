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
  const featured = filtered[0];

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
            <Link to={`/blog/${featured.slug}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, maxWidth: 'var(--max-width)', margin: '0 auto', textDecoration: 'none', color: 'inherit' }}>
              <img src={resolveImageUrl(featured.image_url, featured.slug)} alt="" style={{ width: '100%', height: 'clamp(280px, 35vw, 420px)', objectFit: 'cover' }} />
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span className={ps.eyebrow}>Featured</span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(28px, 4vw, 44px)', margin: '16px 0', lineHeight: 1.1 }}>{featured.title}</h2>
                <p className={ps.bodyText}>{featured.excerpt}</p>
                <span style={{ marginTop: 16, fontSize: 12, color: 'var(--color-accent)' }}>{fmtDate(featured.date)} · {featured.category}</span>
              </div>
            </Link>
          </RevealOnScroll>
        </section>
      )}

      <section className={ps.section}>
        <div className={ps.sectionInner}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
            {(['All', 'Company Updates', 'Industry News'] as CatFilter[]).map((c) => (
              <button
                key={c}
                type="button"
               
                onClick={() => setCat(c)}
                style={{
                  background: cat === c ? 'rgba(176,130,76,0.16)' : 'transparent',
                  border: `1px solid ${cat === c ? 'var(--color-accent-dark)' : 'var(--color-hairline-light-3)'}`,
                  color: 'var(--color-text-on-light)',
                  padding: '8px 18px',
                  fontSize: 11,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {loading && <div className="page-loading">Loading posts…</div>}
          {error && <div className="page-error">{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            {filtered.slice(featured ? 1 : 0).map((p) => (
              <RevealOnScroll key={p.id}>
                <Link to={`/blog/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ overflow: 'hidden', height: 240, marginBottom: 20 }}>
                    <img src={resolveImageUrl(p.image_url, p.slug)} alt="" className={ps.imageCover} />
                  </div>
                  <span style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>{p.category}</span>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, margin: '8px 0', lineHeight: 1.2 }}>{p.title}</h3>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted-light)' }}>{fmtDate(p.date)}</span>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
