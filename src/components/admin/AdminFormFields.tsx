import { useId, useRef, useState } from 'react';
import { ImageDropzone } from './ImageDropzone';
import { uploadMedia } from '../../lib/utils';
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

export function CtaBackgroundField({
  value,
  onChange,
  folder,
}: {
  value?: string;
  onChange: (url: string) => void;
  folder: string;
}) {
  return (
    <ImageField
      label="Closing CTA background photo"
      value={value ?? ''}
      onChange={onChange}
      folder={folder}
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

const MAX_PDF_MB = 25;

/** Upload a PDF to Supabase Storage (media bucket) and return its public URL. */
export function PdfUploadField({
  label,
  value,
  onChange,
  folder = 'documents',
  defaultUrl,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  /** File the site falls back to when no PDF has been uploaded */
  defaultUrl?: string;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const current = value || defaultUrl || '';
  const fileName = current ? decodeURIComponent(current.split('/').pop() ?? current) : '';

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please choose a PDF file.');
      return;
    }
    if (file.size > MAX_PDF_MB * 1024 * 1024) {
      setError(`PDF is larger than ${MAX_PDF_MB} MB. Export a smaller version and try again.`);
      return;
    }
    try {
      setProgress(0);
      const pdf = file.type ? file : new File([file], file.name, { type: 'application/pdf' });
      const url = await uploadMedia(pdf, folder, setProgress);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>{label}</label>
      {current && (
        <p className={styles.dropzoneHint} style={{ margin: '0 0 8px' }}>
          Current file:{' '}
          <a href={current} target="_blank" rel="noopener noreferrer">{fileName}</a>
          {!value && defaultUrl ? ' (site default)' : ''}
        </p>
      )}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          type="button"
          className={styles.btnPrimary}
          onClick={() => inputRef.current?.click()}
          disabled={progress !== null}
        >
          {progress !== null ? `Uploading… ${progress}%` : value ? 'Replace PDF' : 'Upload PDF'}
        </button>
        {value && (
          <button type="button" className={styles.btn} onClick={() => onChange('')} disabled={progress !== null}>
            Use site default
          </button>
        )}
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="application/pdf,.pdf"
          className={styles.dropzoneInput}
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <p className={styles.dropzoneHint} style={{ marginTop: 8 }}>
        PDF up to {MAX_PDF_MB} MB. Click Save after uploading to publish it on the Renovations page.
      </p>
    </div>
  );
}
