import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '../../styles/pages.module.css';

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export function ImageLightbox({ images, initialIndex, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) setIndex((i) => i - 1);
  }, [hasPrev]);

  const goNext = useCallback(() => {
    if (hasNext) setIndex((i) => i + 1);
  }, [hasNext]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev, onClose]);

  if (!images.length) return null;

  return createPortal(
    <div
      className={styles.lightboxBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
      onClick={onClose}
    >
      <button type="button" className={styles.lightboxClose} onClick={onClose} aria-label="Close gallery">
        ×
      </button>

      <div className={styles.lightboxCounter}>
        {index + 1} / {images.length}
      </div>

      <div className={styles.lightboxStage} onClick={(e) => e.stopPropagation()}>
        {hasPrev && (
          <button type="button" className={`${styles.lightboxNav} ${styles.lightboxNavPrev}`} onClick={goPrev} aria-label="Previous image">
            ←
          </button>
        )}

        <img
          src={images[index]}
          alt=""
          className={styles.lightboxImage}
          draggable={false}
        />

        {hasNext && (
          <button type="button" className={`${styles.lightboxNav} ${styles.lightboxNavNext}`} onClick={goNext} aria-label="Next image">
            →
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
}
