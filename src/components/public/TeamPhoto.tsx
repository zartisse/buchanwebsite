import { useState } from 'react';
import { assetUrl } from '../../lib/assets';
import styles from './TeamPhoto.module.css';

type TeamPhotoProps = {
  src: string;
  alt: string;
  /** When set, hovering or focusing the portrait fades into this archive photograph. */
  archiveSrc?: string;
  archiveAlt?: string;
};

export function TeamPhoto({ src, alt, archiveSrc, archiveAlt = '' }: TeamPhotoProps) {
  const [shown, setShown] = useState(false);

  if (!archiveSrc) {
    return <img src={src} alt={alt} className={styles.plain} />;
  }

  return (
    <div
      className={`${styles.swap} ${shown ? styles.swapShown : ''}`}
      tabIndex={0}
      onMouseEnter={() => setShown(true)}
      onMouseLeave={() => setShown(false)}
      onFocus={() => setShown(true)}
      onBlur={() => setShown(false)}
      onClick={() => setShown((v) => !v)}
    >
      <img src={src} alt={alt} className={styles.portrait} />
      <div className={styles.archive} aria-hidden={!shown}>
        <img src={assetUrl(archiveSrc)} alt={archiveAlt} className={styles.print} loading="lazy" decoding="async" />
      </div>
    </div>
  );
}
