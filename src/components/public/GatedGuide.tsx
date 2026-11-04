import { useState } from 'react';
import { useSubmissions } from '../../hooks/useSubmissions';
import { pushEvent } from '../../lib/analytics';
import { fieldErrors } from '../../lib/formValidation';
import { FormField, inputClass } from '../ui/FormField';
import { RENOVATION_PROCESS_PDF_URL } from '../../data/renovationAssets';
import ps from '../../styles/pages.module.css';
import styles from './GatedGuide.module.css';

const UNLOCK_KEY = 'buchan-guide-unlocked';
const PREVIEW_IMAGE = '/assets/documents/renovation-guide-preview.webp';

function readUnlocked(): boolean {
  try {
    return localStorage.getItem(UNLOCK_KEY) === '1';
  } catch {
    return false;
  }
}

/** Renovation guide: visitors leave name + email to download (each download becomes a lead). */
export function GatedGuide({ pdfUrl, title }: { pdfUrl: string; title: string }) {
  const { createSubmission } = useSubmissions();
  const [unlocked, setUnlocked] = useState(readUnlocked);
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  // The preview image matches the default guide; hide it if a different PDF was uploaded in the admin.
  const showPreview = pdfUrl === RENOVATION_PROCESS_PDF_URL;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next = fieldErrors(fd, { name: 'Your name', email: 'Email' });
    setFieldErr(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    setError('');
    try {
      await createSubmission({
        name: String(fd.get('name') ?? ''),
        email: String(fd.get('email') ?? ''),
        phone: String(fd.get('phone') ?? ''),
        subject: 'Downloaded the renovation guide',
        message: `Renovation guide download.${fd.get('timing') ? `\nPlanning to start: ${fd.get('timing')}` : ''}`,
        source: 'Renovation guide',
      });
      try {
        localStorage.setItem(UNLOCK_KEY, '1');
      } catch {
        /* ignore */
      }
      pushEvent({ event: 'guide_download_unlocked', guide: 'renovation' });
      setUnlocked(true);
    } catch {
      setError('That did not go through. Please try again, or call 425.827.2266.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.copy}>
        <span className={ps.eyebrow}>Free renovation guide</span>
        <h2 className={ps.sectionTitle} style={{ marginTop: 16 }}>{title}</h2>
        <p className={ps.bodyText} style={{ marginTop: 12, maxWidth: 520 }}>
          The ten steps of a Buchan renovation on one page, from the first meeting to the final walkthrough. Share it
          with your household before you talk to any builder.
        </p>

        {unlocked ? (
          <div className={styles.unlocked}>
            <p className={ps.bodyText} style={{ margin: 0 }}>Your guide is ready.</p>
            <div className={styles.actions}>
              <a
                href={pdfUrl}
                download
                className={ps.btnPrimary}
                onClick={() => pushEvent({ event: 'guide_download', guide: 'renovation' })}
              >
                Download the guide (PDF)
              </a>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={ps.btnGhost}>
                Open in new tab
              </a>
            </div>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <FormField name="name" error={fieldErr.name}>
              <input name="name" placeholder="Your name" autoComplete="name" className={inputClass(fieldErr.name)} />
            </FormField>
            <FormField name="email" error={fieldErr.email}>
              <input name="email" type="email" placeholder="Email" autoComplete="email" className={inputClass(fieldErr.email)} />
            </FormField>
            <input name="phone" type="tel" placeholder="Phone (optional)" autoComplete="tel" className={ps.formInput} />
            <select name="timing" className={ps.formInput} defaultValue="">
              <option value="">When are you hoping to start? (optional)</option>
              <option>Within 6 months</option>
              <option>6 to 12 months</option>
              <option>1 to 2 years</option>
              <option>Just exploring</option>
            </select>
            {error && <p className={ps.formError}>{error}</p>}
            <button type="submit" className={ps.btnPrimary} disabled={saving} style={{ alignSelf: 'flex-start' }}>
              {saving ? 'Sending…' : 'Get the guide'}
            </button>
            <p className={styles.fine}>We'll only use your details to follow up about your project.</p>
          </form>
        )}
      </div>

      {showPreview && (
        <div className={`${styles.preview} ${unlocked ? styles.previewOpen : ''}`}>
          <img src={PREVIEW_IMAGE} alt="Preview of the John Buchan Homes renovation guide" loading="lazy" width={1100} height={850} />
        </div>
      )}
    </div>
  );
}
