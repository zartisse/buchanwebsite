import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { lightboxImageUrl, previewImageUrl } from '../../lib/placeholders';
import styles from '../../styles/pages.module.css';

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

/** Images already fully loaded this session (so revisits show instantly). */
const loaded = new Set<string>();

function preload(url: string) {
  if (!url || loaded.has(url)) return;
  const img = new Image();
  img.decoding = 'async';
  img.onload = () => loaded.add(url);
  img.src = url;
}

export function ImageLightbox({ images, initialIndex, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [ready, setReady] = useState(false);
  const touchX = useRef<number | null>(null);
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  const large = images[index] ? lightboxImageUrl(images[index]) : '';
  const small = images[index] ? previewImageUrl(images[index]) : '';

  const goPrev = useCallback(() => {
    if (hasPrev) setIndex((i) => i - 1);
  }, [hasPrev]);

  const goNext = useCallback(() => {
    if (hasNext) setIndex((i) => i + 1);
  }, [hasNext]);

  // Show the small copy at once, swap to the large one when it arrives,
  // and fetch the neighbours in the background so the arrows feel instant.
  useEffect(() => {
    setReady(loaded.has(large));
    [1, -1, 2, -2, 3].forEach((d) => {
      const n = images[index + d];
      if (n) {
        preload(previewImageUrl(n));
        preload(lightboxImageUrl(n));
      }
    });
  }, [index, images, large]);

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

      <div
        className={styles.lightboxStage}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          touchX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
          if (dx > 50) goPrev();
          else if (dx < -50) goNext();
          touchX.current = null;
        }}
      >
        {hasPrev && (
          <button type="button" className={`${styles.lightboxNav} ${styles.lightboxNavPrev}`} onClick={goPrev} aria-label="Previous image">
            ←
          </button>
        )}

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '100%', maxHeight: '100%' }}>
          {!ready && small && (
            <img src={small} alt="" className={styles.lightboxImage} draggable={false} style={{ filter: 'blur(2px)' }} />
          )}
          <img
            key={large}
            src={large}
            alt=""
            className={styles.lightboxImage}
            draggable={false}
            decoding="async"
            onLoad={() => {
              loaded.add(large);
              setReady(true);
            }}
            onError={(e) => {
              // Fall back to the original file if a smaller copy is missing
              const img = e.currentTarget;
              if (img.src !== images[index]) img.src = images[index];
            }}
            style={ready ? undefined : { position: 'absolute', inset: 0, margin: 'auto', opacity: 0 }}
          />
        </div>

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
