import { useEffect, useRef, useState } from 'react';
import { PROCESS_FILM } from '../../../data/processFilm';
import styles from './ProcessJourney.module.css';

interface Props {
  /** Phase index (PROCESS_PHASES order). */
  phase: number;
  /** False pauses playback (panel off screen). */
  playing: boolean;
  /** Called once every shot of the phase has played. */
  onPhaseEnd: () => void;
}

/**
 * Muted, inline time-lapse of the home being built. Each phase plays its own shots in order;
 * every clip starts on the frame the previous one ended on, so the cuts are seamless.
 */
export function ProcessFilm({ phase, playing, onPhaseEnd }: Props) {
  const shots = PROCESS_FILM[phase];
  const [shot, setShot] = useState(0);
  const [done, setDone] = useState(false);
  // Nothing downloads until the panel has been on screen once, so the hero loads first.
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (playing) setSeen(true);
  }, [playing]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const endRef = useRef(onPhaseEnd);
  endRef.current = onPhaseEnd;

  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    setShot(0);
    setDone(false);
  }, [phase]);

  const current = shots[Math.min(shot, shots.length - 1)];

  const next = () => {
    if (shot < shots.length - 1) setShot((s) => s + 1);
    else {
      setDone(true);
      endRef.current();
    }
  };

  // Stills (no clip) hold for their duration.
  useEffect(() => {
    if (reduced || done || current.video || !playing) return;
    const t = window.setTimeout(next, current.ms);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, shot, playing, done, reduced]);

  // Play or pause with visibility; always muted.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    if (playing && !done) v.play().catch(() => {});
    else v.pause();
  }, [playing, done, phase, shot]);

  const finalFrame = shots[shots.length - 1].end;

  // Warm the cache for whatever plays next (next shot, or the next phase's first shot).
  const upcoming = shot < shots.length - 1
    ? shots[shot + 1]
    : PROCESS_FILM[(phase + 1) % PROCESS_FILM.length][0];
  useEffect(() => {
    if (!seen || reduced || !upcoming.video) return;
    const v = document.createElement('video');
    v.muted = true;
    v.preload = 'auto';
    v.src = upcoming.video;
    v.load();
    return () => {
      v.removeAttribute('src');
      v.load();
    };
  }, [seen, reduced, upcoming.video]);

  return (
    <div className={styles.film}>
      {!seen ? null : reduced || !current.video ? (
        <img className={styles.filmMedia} src={reduced ? finalFrame : current.poster} alt="" decoding="async" />
      ) : (
        <video
          key={`${phase}-${shot}`}
          ref={videoRef}
          className={styles.filmMedia}
          src={current.video}
          poster={current.poster}
          muted
          playsInline
          autoPlay={playing}
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden
          tabIndex={-1}
          onEnded={next}
          onError={next}
        />
      )}
      <p className={styles.filmStep} key={`${phase}-${shot}-step`}>
        <span>{(reduced ? shots[shots.length - 1] : current).step}</span>
        {(reduced ? shots[shots.length - 1] : current).label}
      </p>
      {shots.length > 1 && (
        <ol className={styles.filmDots} aria-hidden>
          {shots.map((s, i) => (
            <li key={i} className={i <= shot || reduced ? styles.filmDotOn : undefined} title={s.label} />
          ))}
        </ol>
      )}
    </div>
  );
}
