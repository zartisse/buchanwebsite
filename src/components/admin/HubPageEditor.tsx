import { useState } from 'react';
import type { HubPage, HubPageContent } from '../../types';
import { HeroFields, ImageField, MetaFields } from './AdminFormFields';
import { PageMeta } from '../ui/PageMeta';
import styles from '../../styles/admin.module.css';

interface HubPageEditorProps {
  slug: string;
  page?: HubPage | null;
  onSave: (data: Pick<HubPage, 'slug' | 'meta_title' | 'meta_description' | 'content'> & { id?: string }) => Promise<void>;
  onCancel: () => void;
}

export function HubPageEditor({ slug, page, onSave, onCancel }: HubPageEditorProps) {
  const [metaTitle, setMetaTitle] = useState(page?.meta_title ?? '');
  const [metaDescription, setMetaDescription] = useState(page?.meta_description ?? '');
  const [content, setContent] = useState<HubPageContent>(page?.content ?? {
    hero: { eyebrow: '', title: '' },
    sections: [],
    ctaTitle: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        id: page?.id,
        slug,
        meta_title: metaTitle,
        meta_description: metaDescription,
        content,
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (i: number, patch: Partial<HubPageContent['sections'][0]>) => {
    const sections = content.sections.map((s, j) => (j === i ? { ...s, ...patch } : s));
    setContent({ ...content, sections });
  };

  return (
    <>
      <PageMeta title={`Edit ${slug}`} />
      <h1 className={styles.pageTitle}>Edit Hub Page: {slug}</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <MetaFields metaTitle={metaTitle} metaDescription={metaDescription} onMetaTitle={setMetaTitle} onMetaDescription={setMetaDescription} />

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Hero</legend>
          <HeroFields
            hero={{ eyebrow: content.hero.eyebrow, title: content.hero.title, title_emphasis: content.hero.titleEmphasis }}
            onChange={(hero) => setContent({ ...content, hero: { ...content.hero, eyebrow: hero.eyebrow ?? content.hero.eyebrow, title: hero.title ?? content.hero.title, titleEmphasis: hero.title_emphasis } })}
          />
          <div className={styles.field}>
            <label className={styles.label}>Subtitle</label>
            <input className={styles.input} value={content.hero.subtitle ?? ''} onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })} />
          </div>
          <ImageField label="Hero image" value={content.hero.image_url ?? ''} onChange={(url) => setContent({ ...content, hero: { ...content.hero, image_url: url } })} folder={`hub-pages/${slug}`} />
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Intro</legend>
          <textarea className={styles.textarea} value={content.intro ?? ''} rows={4} onChange={(e) => setContent({ ...content, intro: e.target.value })} />
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Sections</legend>
          {content.sections.map((section, i) => (
            <div key={i} className={styles.repeatItem}>
              <div className={styles.field}><label className={styles.label}>Title</label><input className={styles.input} value={section.title} onChange={(e) => updateSection(i, { title: e.target.value })} /></div>
              <div className={styles.field}><label className={styles.label}>Body</label><textarea className={styles.textarea} value={section.body} rows={4} onChange={(e) => updateSection(i, { body: e.target.value })} /></div>
              <div className={styles.field}><label className={styles.label}>Bullets (one per line)</label><textarea className={styles.textarea} value={(section.bullets ?? []).join('\n')} rows={3} onChange={(e) => updateSection(i, { bullets: e.target.value.split('\n').filter(Boolean) })} /></div>
              <ImageField label="Section image" value={section.image_url ?? ''} onChange={(url) => updateSection(i, { image_url: url })} folder={`hub-pages/${slug}/sections`} />
            </div>
          ))}
          <button type="button" className={styles.btn} onClick={() => setContent({ ...content, sections: [...content.sections, { title: '', body: '' }] })}>Add section</button>
        </fieldset>

        {slug === 'areas-we-serve' && (
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Service areas (one per line)</legend>
            <textarea className={styles.textarea} value={(content.service_areas ?? []).join('\n')} rows={6} onChange={(e) => setContent({ ...content, service_areas: e.target.value.split('\n').filter(Boolean) })} />
          </fieldset>
        )}

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Closing CTA</legend>
          <div className={styles.field}><label className={styles.label}>CTA title</label><input className={styles.input} value={content.ctaTitle} onChange={(e) => setContent({ ...content, ctaTitle: e.target.value })} /></div>
          <div className={styles.field}><label className={styles.label}>CTA link</label><input className={styles.input} value={content.ctaLink ?? ''} onChange={(e) => setContent({ ...content, ctaLink: e.target.value })} /></div>
        </fieldset>

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          <button type="button" className={styles.btn} onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </>
  );
}
