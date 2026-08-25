import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProperty } from '../../hooks/useProperties';
import { ImageLightbox } from '../../components/ui/ImageLightbox';
import { OptimizedImage } from '../../components/ui/OptimizedImage';
import { PageMeta } from '../../components/ui/PageMeta';
import { PageCta } from '../../components/ui/PageCta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { resolveImageUrl } from '../../lib/placeholders';
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
  const fallbackGallery = [heroUrl, '/assets/ph-arch-2.png', '/assets/ph-arch-3.png'];
  const galleryUrls = property?.gallery_urls?.length ? property.gallery_urls : fallbackGallery;
  const allImages = useMemo(
    () => (property ? buildImageList(heroUrl, galleryUrls).map((url, i) => resolveImageUrl(url, `${slug}-${i}`)) : []),
    [property, heroUrl, galleryUrls, slug],
  );
  const resolvedHero = allImages[0] ?? resolveImageUrl(heroUrl, slug);

  if (loading) return <div className="page-loading">Loading…</div>;
  if (!property) return <div className="page-error">{error || 'Property not found.'}</div>;

  const openLightbox = (url: string) => {
    const index = allImages.indexOf(url);
    if (index >= 0) setLightboxIndex(index);
  };

  const stats = [
    { label: 'Beds', value: property.beds },
    { label: 'Baths', value: property.baths },
    { label: 'Sq Ft', value: property.sqft },
    { label: 'Lot', value: property.lot ? `${property.lot} ac` : '' },
    { label: 'Year', value: property.year },
  ].filter((s) => s.value);

  return (
    <main>
      <PageMeta
        title={property.meta_title || property.name}
        description={property.meta_description || property.description || `${property.name} — custom home in ${property.city}.`}
      />
      <section className={ps.detailHero}>
        <button
          type="button"
          className={ps.heroClickable}
          onClick={() => openLightbox(resolvedHero)}
          aria-label="View hero image fullscreen"
          style={{ width: '100%', height: '100%', padding: 0, border: 'none', background: 'none', display: 'block' }}
        >
          <OptimizedImage src={resolvedHero} alt={property.name} className={ps.imageCover} resolved priority />
        </button>
        <div className={ps.detailHeroOverlay} aria-hidden />
        <div className={ps.detailHeroContent}>
          <span className={ps.eyebrow}>{property.city}</span>
          <h1 className={ps.detailHeroTitle}>{property.name}</h1>
        </div>
      </section>

      {stats.length > 0 && (
        <section className={ps.statBar}>
          {stats.map((s) => (
            <div key={s.label} className={ps.statItem}>
              <div className={ps.statValue}>{s.value}</div>
              <div className={ps.statLabel}>{s.label}</div>
            </div>
          ))}
        </section>
      )}

      <section className={ps.section}>
        <RevealOnScroll>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p className={ps.bodyText}>{property.description || `A custom ${property.name} built by John Buchan Homes in ${property.city}.`}</p>
          </div>
        </RevealOnScroll>
      </section>

      <section className={ps.sectionAlt}>
        <div className={ps.galleryGrid}>
          {allImages.map((url, index) => (
            <button
              key={url}
              type="button"
              className={ps.galleryThumb}
              onClick={() => openLightbox(url)}
              aria-label="View image fullscreen"
            >
              <OptimizedImage src={url} alt="" resolved priority={index === 0} />
            </button>
          ))}
        </div>
      </section>

      <PageCta
        title="Interested in this home?"
        primaryLabel="Contact Us"
        primaryUrl="/contact"
        backgroundImage={heroUrl}
      >
        <Link to="/portfolio" className="btnGhostLight">All Homes</Link>
      </PageCta>

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
