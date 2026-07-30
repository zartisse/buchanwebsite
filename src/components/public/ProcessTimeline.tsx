import { useEffect, useRef } from 'react';
import styles from './ProcessTimeline.module.css';

export type ProcessStage = {
  n: string;
  title: string;
  description?: string;
};

export function ProcessTimeline({ stages }: { stages: ProcessStage[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const track = root.querySelector(`.${styles.track}`);
    const steps = root.querySelectorAll(`.${styles.step}`);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          track?.classList.add(styles.trackVisible);
          steps.forEach((step, i) => {
            window.setTimeout(() => {
              step.classList.add(styles.stepVisible);
            }, i * 80);
          });
          io.disconnect();
        });
      },
      { threshold: 0.2 },
    );

    io.observe(root);
    return () => io.disconnect();
  }, [stages.length]);

  return (
    <div ref={rootRef} className={styles.processTimeline}>
      <div className={styles.track} aria-hidden />
      <div className={styles.steps}>
        {stages.map((stage) => (
          <div key={stage.n} className={styles.step}>
            <div className={styles.dot} aria-hidden />
            <div className={styles.node}>
              <span className={styles.number}>{stage.n}</span>
              <p className={styles.title}>{stage.title}</p>
              {stage.description && <p className={styles.description}>{stage.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
