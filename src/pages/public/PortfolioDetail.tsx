import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProperty } from '../../hooks/useProperties';
import { ImageLightbox } from '../../components/ui/ImageLightbox';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import ps from '../../styles/pages.module.css';

function buildImageList(heroUrl: string, galleryUrls: string[]) {
  const seen = new Set<string>();
  const images: string[] = [];

  for (const url of [heroUrl, ...galleryUrls]) {
    if (url && !seen.has(url)) {
      seen.add(url);
      images.push(url);
    }
  }

  return images;
}

export function PortfolioDetail() {
  const { slug = '' } = useParams();
  const { property, loading, error } = useProperty(slug);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const heroUrl = property?.image_url || '/assets/ph-arch-1.png';
  const fallbackGallery = [
    heroUrl,
    '/assets/ph-arch-2.png',
    '/assets/ph-arch-3.png',
  ];
  const galleryUrls = property?.gallery_urls?.length ? property.gallery_urls : fallbackGallery;
  const allImages = useMemo(
    () => (property ? buildImageList(heroUrl, galleryUrls) : []),
    [property, heroUrl, galleryUrls],
  );

  if (loading) return <div className="page-loading">Loading…</div>;
  if (!property) return <div className="page-error">{error || 'Property not found.'}</div>;

  const openLightbox = (url: string) => {
    const index = allImages.indexOf(url);
    if (index >= 0) setLightboxIndex(index);
  };

  return (
    <main>
      <PageMeta title={property.name} description={property.description || `${property.name} — custom home in ${property.city}.`} />
      <section style={{ position: 'relative', height: 'clamp(400px, 60vh, 700px)', overflow: 'hidden' }}>
        <button
          type="button"
          className={ps.heroClickable}
          onClick={() => openLightbox(heroUrl)}
          aria-label="View hero image fullscreen"
          style={{ width: '100%', height: '100%', padding: 0, border: 'none', background: 'none', display: 'block' }}
        >
          <img src={heroUrl} alt={property.name} className={ps.imageCover} />
        </button>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(13,21,18,0.85) 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '48px 8vw', pointerEvents: 'none' }}>
          <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent-on-light)' }}>{property.city}</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(40px, 6vw, 72px)', margin: '12px 0 0' }}>{property.name}</h1>
        </div>
      </section>

      <section style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center', padding: '32px 8vw', borderBottom: '1px solid var(--color-hairline-light)', background: 'var(--color-bg-cream)' }}>
        {[
          { label: 'Beds', value: property.beds },
          { label: 'Baths', value: property.baths },
          { label: 'Sq Ft', value: property.sqft },
          { label: 'Lot', value: property.lot ? `${property.lot} ac` : '' },
          { label: 'Year', value: property.year },
        ].filter((s) => s.value).map((s) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 32 }}>{s.value}</div>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-accent)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </section>

      <section className={ps.section}>
        <RevealOnScroll>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p className={ps.bodyText}>{property.description || `A custom ${property.name} built by John Buchan Homes in ${property.city}.`}</p>
          </div>
        </RevealOnScroll>
      </section>

      <section className={ps.sectionAlt}>
        <div className={ps.galleryGrid}>
          {allImages.map((url) => (
            <button
              key={url}
              type="button"
              className={ps.galleryThumb}
              onClick={() => openLightbox(url)}
              aria-label="View image fullscreen"
            >
              <img src={url} alt="" />
            </button>
          ))}
        </div>
      </section>

      <section className={ps.ctaSection}>
        <h2 className={ps.sectionTitle}>Interested in this home?</h2>
        <div className={ps.ctaButtons}>
          <Link to="/contact" data-cursor className={ps.btnPrimary}>Contact Us</Link>
          <Link to="/portfolio" data-cursor className={ps.btnLink}>← All Homes</Link>
        </div>
      </section>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={allImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </main>
  );
}
