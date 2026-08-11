import { Link, useParams } from 'react-router-dom';
import { usePost, usePosts } from '../../hooks/usePosts';
import { PageMeta } from '../../components/ui/PageMeta';
import { fmtDate } from '../../lib/utils';
import { resolveImageUrl } from '../../lib/placeholders';
import ps from '../../styles/pages.module.css';

export function BlogPost() {
  const { slug = '' } = useParams();
  const { post, loading, error } = usePost(slug);
  const { posts } = usePosts({ publishedOnly: true });

  const related = posts.filter((p) => p.slug !== slug).slice(0, 3);

  if (loading) return <div className="page-loading">Loading…</div>;
  if (!post) return <div className="page-error">{error || 'Post not found.'}</div>;

  const paragraphs = (post.body || post.excerpt).split('\n').filter(Boolean);

  return (
    <main>
      <PageMeta
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
      />
      <article>
        <header style={{ padding: 'clamp(140px, 20vh, 200px) 8vw 48px', maxWidth: 800, margin: '0 auto' }}>
          <Link to="/blog" style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', textDecoration: 'none' }}>← Journal</Link>
          <span style={{ display: 'block', marginTop: 24, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent-on-light)' }}>{post.category}</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1.1, margin: '16px 0' }}>{post.title}</h1>
          <time style={{ fontSize: 13, color: 'var(--color-text-muted-light)' }}>{fmtDate(post.date)}</time>
        </header>

        <img src={resolveImageUrl(post.image_url, post.slug)} alt="" style={{ width: '100%', maxHeight: 520, objectFit: 'cover' }} />

        <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 8vw 80px' }}>
          {paragraphs.map((p, i) => (
            <p key={i} className={ps.bodyText} style={{ marginBottom: 24 }}>{p}</p>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className={ps.sectionAlt}>
          <div className={ps.sectionInner}>
            <h2 className={ps.sectionTitle} style={{ marginBottom: 32 }}>Keep Reading</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
              {related.map((r) => (
                <Link key={r.id} to={`/blog/${r.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img src={resolveImageUrl(r.image_url, r.slug)} alt="" style={{ width: '100%', height: 180, objectFit: 'cover', marginBottom: 12 }} />
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, margin: 0, lineHeight: 1.2 }}>{r.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
