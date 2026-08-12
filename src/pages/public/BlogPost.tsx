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
        <header className={ps.articleHeader}>
          <Link to="/blog" className={ps.articleBack}>← Journal</Link>
          <span className={ps.eyebrow} style={{ marginTop: 24 }}>{post.category}</span>
          <h1 className={ps.articleTitle}>{post.title}</h1>
          <time className={ps.articleDate}>{fmtDate(post.date)}</time>
        </header>

        <img src={resolveImageUrl(post.image_url, post.slug)} alt="" className={ps.articleHeroImage} />

        <div className={ps.articleBody}>
          {paragraphs.map((p, i) => (
            <p key={i} className={ps.bodyText} style={{ marginBottom: 24 }}>{p}</p>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className={ps.sectionAlt}>
          <div className={ps.sectionInner}>
            <span className={ps.eyebrow}>Keep Reading</span>
            <h2 className={ps.sectionTitle} style={{ marginTop: 16, marginBottom: 32 }}>More from the journal</h2>
            <div className={ps.cardGrid}>
              {related.map((r) => (
                <Link key={r.id} to={`/blog/${r.slug}`} className={ps.cardLink}>
                  <img src={resolveImageUrl(r.image_url, r.slug)} alt="" style={{ width: '100%', height: 180, objectFit: 'cover', marginBottom: 12 }} />
                  <h3 className={ps.cardTitle} style={{ fontSize: 20 }}>{r.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
