import { ImageDropzone } from './ImageDropzone';
import styles from '../../styles/admin.module.css';

export function ImageField({
  label,
  value,
  onChange,
  folder = 'pages',
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}) {
  return (
    <ImageDropzone
      label={label}
      folder={folder}
      value={value}
      onChange={onChange}
    />
  );
}

export function HeroFields({
  hero,
  onChange,
}: {
  hero: { eyebrow: string; title: string; title_emphasis?: string };
  onChange: (hero: { eyebrow: string; title: string; title_emphasis?: string }) => void;
}) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>Hero</legend>
      <div className={styles.field}>
        <label className={styles.label}>Eyebrow</label>
        <input className={styles.input} value={hero.eyebrow} onChange={(e) => onChange({ ...hero, eyebrow: e.target.value })} />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Title</label>
        <input className={styles.input} value={hero.title} onChange={(e) => onChange({ ...hero, title: e.target.value })} />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Title emphasis (italic line)</label>
        <input className={styles.input} value={hero.title_emphasis ?? ''} onChange={(e) => onChange({ ...hero, title_emphasis: e.target.value })} />
      </div>
    </fieldset>
  );
}

export function MetaFields({
  metaTitle,
  metaDescription,
  onMetaTitle,
  onMetaDescription,
}: {
  metaTitle: string;
  metaDescription: string;
  onMetaTitle: (v: string) => void;
  onMetaDescription: (v: string) => void;
}) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>SEO</legend>
      <div className={styles.field}>
        <label className={styles.label}>Meta Title ({metaTitle.length}/60)</label>
        <input className={styles.input} value={metaTitle} onChange={(e) => onMetaTitle(e.target.value)} />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Meta Description ({metaDescription.length}/160)</label>
        <textarea className={styles.textarea} value={metaDescription} onChange={(e) => onMetaDescription(e.target.value)} rows={2} />
      </div>
    </fieldset>
  );
}
