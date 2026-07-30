import { useState } from 'react';
import type { Property, PropertyStatus } from '../../types';
import { slugify } from '../../lib/utils';
import { ImageDropzone } from './ImageDropzone';
import { PageMeta } from '../ui/PageMeta';
import styles from '../../styles/admin.module.css';

interface PropertyEditorProps {
  property?: Property;
  onSave: (data: Partial<Property> & { name: string }) => Promise<void>;
  onCancel: () => void;
}

export function PropertyEditor({ property, onSave, onCancel }: PropertyEditorProps) {
  const [name, setName] = useState(property?.name ?? '');
  const [slug, setSlug] = useState(property?.slug ?? '');
  const [autoSlug, setAutoSlug] = useState(!property);
  const [status, setStatus] = useState<PropertyStatus>(property?.status ?? 'Available');
  const [address, setAddress] = useState(property?.address ?? '');
  const [city, setCity] = useState(property?.city ?? '');
  const [beds, setBeds] = useState(property?.beds ?? '');
  const [baths, setBaths] = useState(property?.baths ?? '');
  const [sqft, setSqft] = useState(property?.sqft ?? '');
  const [lot, setLot] = useState(property?.lot ?? '');
  const [year, setYear] = useState(property?.year ?? '');
  const [description, setDescription] = useState(property?.description ?? '');
  const [imageUrl, setImageUrl] = useState(property?.image_url ?? '/assets/ph-arch-1.svg');
  const [galleryUrls, setGalleryUrls] = useState<string[]>(property?.gallery_urls ?? []);
  const [metaTitle, setMetaTitle] = useState(property?.meta_title ?? '');
  const [metaDescription, setMetaDescription] = useState(property?.meta_description ?? '');
  const [featured, setFeatured] = useState(property?.featured ?? false);
  const [featuredOrder, setFeaturedOrder] = useState(property?.featured_order ?? 0);
  const [saving, setSaving] = useState(false);

  const handleNameChange = (v: string) => {
    setName(v);
    if (autoSlug) setSlug(slugify(v));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        id: property?.id,
        name,
        slug: slug || slugify(name),
        status,
        address,
        city,
        beds,
        baths,
        sqft,
        lot,
        year,
        description,
        image_url: imageUrl,
        gallery_urls: galleryUrls,
        meta_title: metaTitle,
        meta_description: metaDescription,
        featured,
        featured_order: featuredOrder,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageMeta title={property ? 'Edit Property' : 'New Property'} />
      <h1 className={styles.pageTitle}>{property ? 'Edit Property' : 'New Property'}</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Name</label>
          <input className={styles.input} value={name} onChange={(e) => handleNameChange(e.target.value)} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Slug</label>
          <input className={styles.input} value={slug} onChange={(e) => { setAutoSlug(false); setSlug(e.target.value); }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className={styles.field}>
            <label className={styles.label}>Status</label>
            <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value as PropertyStatus)}>
              <option>Available</option>
              <option>Coming Soon</option>
              <option>Sold</option>
              <option>Draft</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Year</label>
            <input className={styles.input} value={year} onChange={(e) => setYear(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className={styles.field}>
            <label className={styles.label}>Address</label>
            <input className={styles.input} value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>City</label>
            <input className={styles.input} value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div className={styles.field}>
            <label className={styles.label}>Beds</label>
            <input className={styles.input} value={beds} onChange={(e) => setBeds(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Baths</label>
            <input className={styles.input} value={baths} onChange={(e) => setBaths(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Sq Ft</label>
            <input className={styles.input} value={sqft} onChange={(e) => setSqft(e.target.value)} />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Lot (acres)</label>
          <input className={styles.input} value={lot} onChange={(e) => setLot(e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className={styles.field}>
            <label className={styles.label}>
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} style={{ marginRight: 8 }} />
              Feature on homepage
            </label>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Homepage order</label>
            <input className={styles.input} type="number" min={0} value={featuredOrder} onChange={(e) => setFeaturedOrder(Number(e.target.value))} />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea className={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} rows={6} />
        </div>
        <ImageDropzone
          label="Hero Image"
          folder="properties"
          value={imageUrl}
          onChange={setImageUrl}
        />
        <ImageDropzone
          label="Gallery"
          folder="properties/gallery"
          multiple
          values={galleryUrls}
          onChange={setGalleryUrls}
          heroUrl={imageUrl}
          onSetHero={setImageUrl}
        />
        <div className={styles.field}>
          <label className={styles.label}>Meta Title ({metaTitle.length}/60)</label>
          <input className={styles.input} value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Meta Description ({metaDescription.length}/160)</label>
          <textarea className={styles.textarea} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={2} />
        </div>
        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          <button type="button" className={styles.btn} onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </>
  );
}
