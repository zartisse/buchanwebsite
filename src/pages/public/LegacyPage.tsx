import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { withSlash } from '../../lib/legacy';
import { PageMeta } from '../../components/ui/PageMeta';
import { PageCta } from '../../components/ui/PageCta';
import { RichContent } from '../../components/ui/RichContent';
import { OptimizedImage } from '../../components/ui/OptimizedImage';
import { ImageLightbox } from '../../components/ui/ImageLightbox';
import { NotFound } from './NotFound';
import ps from '../../styles/pages.module.css';

type LegacyPageRow = {
  path: string;
  kind: string;
  title: string;
  body: string;
  image_urls: string[];
  file_urls: string[];
  meta_title: string;
  meta_description: string;
};

/**
 * Serves pages imported from the old buchan.com site (floor plans, legal pages,
 * landing pages) at their original URL. Anything not found falls through to 404.
 */
export function LegacyPage() {
  const { pathname } = useLocation();
  const path = withSlash(pathname);
  const [page, setPage] = useState<LegacyPageRow | null>(null);
  const [state, setState] = useState<'loading' | 'found' | 'missing'>('loading');
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    if (!isSupabaseConfigured) {
      setState('missing');
      return;
    }
    supabase
      .from('legacy_pages')
      .select('path,kind,title,body,image_urls,file_urls,meta_title,meta_description')
      .eq('path', path)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setPage((data as LegacyPageRow) ?? null);
        setState(data ? 'found' : 'missing');
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  if (state === 'loading') return <div className="page-loading" style={{ minHeight: '60vh' }} />;
  if (state === 'missing' || !page) return <NotFound />;

  const isFloorplan = page.kind === 'floorplan';
  const images = page.image_urls ?? [];

  return (
    <main>
      <PageMeta title={page.meta_title || page.title} description={page.meta_description || undefined} image={images[0]} />
      <section className={ps.hero}>
        <div className={ps.heroInner}>
          <span className={ps.eyebrow}>{isFloorplan ? 'Floor plan' : page.kind === 'media' ? 'Media' : 'John Buchan Homes'}</span>
          <h1 className={ps.heroTitle}>{page.title}</h1>
          {page.file_urls?.length > 0 && (
            <div className={ps.ctaButtons} style={{ marginTop: 8 }}>
              {page.file_urls.map((f, i) => (
                <a key={f} href={f} target="_blank" rel="noopener noreferrer" className={i === 0 ? 'btnPrimaryFill' : ps.btnGhost}>
                  {page.file_urls.length > 1 ? `Download PDF ${i + 1}` : 'Download floor plan (PDF)'}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {page.body && (
        <section className={ps.section}>
          <div className={ps.sectionInner} style={{ maxWidth: 820 }}>
            <RichContent html={page.body} />
          </div>
        </section>
      )}

      {images.length > 0 && (
        <section className={ps.sectionAlt}>
          <div className={ps.sectionInner}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setLightbox(i)}
                  style={{ padding: 0, border: 0, background: 'none', cursor: 'zoom-in', aspectRatio: '4 / 3', overflow: 'hidden' }}
                  aria-label={`Open image ${i + 1}`}
                >
                  <OptimizedImage src={src} alt="" displayWidth={800} sizes="(max-width: 700px) 100vw, 33vw" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {lightbox !== null && (
        <ImageLightbox images={images} initialIndex={lightbox} onClose={() => setLightbox(null)} />
      )}

      <PageCta
        title={isFloorplan ? 'Build this plan, or one designed for you.' : 'The right home begins with the right conversation.'}
        subtitle="Talk with Mischelle about your property, your goals and a realistic budget range."
      />
    </main>
  );
}
