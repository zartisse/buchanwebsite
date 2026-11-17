import { useEffect, useMemo, useRef, useState } from 'react';
import type { HomeTour as HomeTourData } from '../../data/tours';
import { assetUrl } from '../../lib/assets';
import { PanoViewer } from './PanoViewer';
import s from './tour.module.css';

interface Props {
  tour: HomeTourData;
  /** Modal mode: fixed full-screen overlay with a close button. */
  onClose?: () => void;
}

/** 360° walkthrough of a finished home: one panorama per room, linked by hotspots and room buttons. */
export function HomeTour({ tour, onClose }: Props) {
  const [sceneId, setSceneId] = useState(tour.scenes[0].id);
  const [showHint, setShowHint] = useState(true);
  const closeRef = useRef<HTMLButtonElement>(null);
  const raw = tour.scenes.find((sc) => sc.id === sceneId) ?? tour.scenes[0];
  const scene = useMemo(
    () => ({ ...raw, src: assetUrl(raw.src), preview: raw.preview ? assetUrl(raw.preview) : undefined }),
    [raw],
  );

  useEffect(() => {
    const t = window.setTimeout(() => setShowHint(false), 4000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!onClose) return;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      className={onClose ? s.shell : s.shellPage}
      role={onClose ? 'dialog' : undefined}
      aria-modal={onClose ? true : undefined}
      aria-label={`360° tour of ${tour.name}`}
    >
      <div className={s.bar}>
        <div>
          <span className={s.eyebrow}>360° tour · {tour.city}</span>
          <h2 className={s.title}>{tour.name}</h2>
        </div>
        {onClose && (
          <button ref={closeRef} type="button" className={s.close} onClick={onClose} aria-label="Close tour">
            ×
          </button>
        )}
      </div>
      <div className={s.stage}>
        <PanoViewer scene={scene} onNavigate={setSceneId} />
        {showHint && <div className={s.hint}>Drag to look around</div>}
      </div>
      <div className={s.footer}>
        {tour.scenes.length > 1 ? (
          <div className={s.scenes} role="group" aria-label="Rooms">
            {tour.scenes.map((sc) => (
              <button
                key={sc.id}
                type="button"
                className={s.sceneBtn}
                aria-pressed={sc.id === sceneId}
                onClick={() => setSceneId(sc.id)}
              >
                {sc.label}
              </button>
            ))}
          </div>
        ) : (
          <span className={s.eyebrow} style={{ margin: 0 }}>{scene.label}</span>
        )}
        <p className={s.note}>
          Built from photographs of the finished home. Areas outside the original photos are digitally extended, so some
          details are illustrative.
        </p>
      </div>
    </div>
  );
}

export default HomeTour;
