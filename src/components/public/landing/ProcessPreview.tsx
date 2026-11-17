import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { PROCESS_PHASES } from '../../../data/buchanProcess';
import { ArrowLink } from './ArrowLink';
import styles from './ProcessJourney.module.css';
import shared from './Landing.module.css';
import { ProcessFilm } from './ProcessFilm';
import { phaseFilmMs } from '../../../data/processFilm';

const REDUCED_STAGE_MS = 5400;

function firstSentence(text: string): string {
  const m = text.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
}

export function ProcessPreview() {
  const [stage, setStage] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const advance = () => setStage((s) => (s + 1) % PROCESS_PHASES.length);

  // The film drives the pace; with reduced motion there is no film, so step on a timer.
  useEffect(() => {
    if (!auto || !inView) return;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setTimeout(advance, REDUCED_STAGE_MS);
    return () => window.clearTimeout(t);
  }, [stage, auto, inView]);

  const stageMs = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? REDUCED_STAGE_MS
    : phaseFilmMs(stage);

  const choose = (i: number) => {
    setAuto(false); // once someone clicks, they drive
    setStage(i);
  };

  const phase = PROCESS_PHASES[stage];

  return (
    <section id="process" className={`${shared.section} ${shared.sectionTint}`}>
      <div className={shared.inner}>
        <div className={styles.grid} ref={rootRef}>
          <div className={styles.left}>
            <RevealOnScroll>
              <p className={shared.eyebrow}>The Buchan experience</p>
              <h2 className={shared.h2}>A more predictable way <em>to build.</em></h2>
            </RevealOnScroll>

            <RevealOnScroll index={1}>
              <ol className={styles.list}>
                {PROCESS_PHASES.map((p, i) => {
                  const active = i === stage;
                  return (
                    <li key={p.n} className={`${styles.row} ${active ? styles.rowActive : ''}`}>
                      <button
                        type="button"
                        className={styles.rowBtn}
                        aria-expanded={active}
                        onClick={() => choose(i)}
                      >
                        <span className={`${styles.rowNum} tabularNums`}>{p.n.padStart(2, '0')}</span>
                        <span className={styles.rowTitle}>{p.title}</span>
                      </button>
                      <div className={styles.rowBody} inert={!active}>
                        <div className={styles.rowBodyInner}>
                          <p>{firstSentence(p.intro)}</p>
                          <Link to={`/process#phase-0${p.n}`} className={styles.rowLink}>
                            {p.steps.length} steps in this phase
                          </Link>
                        </div>
                      </div>
                      {active && auto && inView && <span key={`bar-${stage}`} className={styles.bar} style={{ animationDuration: `${stageMs}ms` }} aria-hidden />}
                    </li>
                  );
                })}
              </ol>
            </RevealOnScroll>

            <RevealOnScroll index={2}>
              <ArrowLink to="/process">See the full process</ArrowLink>
            </RevealOnScroll>
          </div>

          <RevealOnScroll variant="right" className={styles.right}>
            <div className={styles.bezel}>
              <div className={`${styles.paper} ${styles.paperFilm}`}>
                <ProcessFilm phase={stage} playing={inView} onPhaseEnd={() => auto && advance()} />
                <p className={styles.caption} key={phase.n} aria-live="polite">
                  <span>Phase {phase.n.padStart(2, '0')}</span> {phase.title}
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
