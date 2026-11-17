import { useEffect, useRef, useState } from 'react';
import styles from './Landing.module.css';

type WriteOnProps = {
  children: React.ReactNode;
  className?: string;
  /** Duration of the pen stroke in ms. */
  ms?: number;
  label?: string;
};

/** Script text that is "signed" left to right the first time it scrolls into view. */
export function WriteOn({ children, className = '', ms = 2600, label }: WriteOnProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={`${styles.writeOn} ${run ? styles.writeOnRun : ''} ${className}`}
      style={{ '--write-ms': `${ms}ms` } as React.CSSProperties}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      {children}
    </span>
  );
}
