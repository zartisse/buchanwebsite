import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { PROCESS_PHASES } from '../../../data/buchanProcess';
import { ArrowLink } from './ArrowLink';
import styles from './ProcessJourney.module.css';
import shared from './Landing.module.css';

const STAGE_MS = 5400;

function firstSentence(text: string): string {
  const m = text.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
}

/** Delay index so strokes inside a layer draw one after another. */
const d = (i: number) => ({ '--i': i } as React.CSSProperties);

/**
 * A line drawing that builds as the phases advance:
 * 1 site and plan, 2 blueprint, 3 framing, 4 the finished home with the lights on.
 */
function HouseDrawing({ stage }: { stage: number }) {
  const on = (n: number) => (stage >= n ? styles.on : '');
  return (
    <svg className={styles.drawing} viewBox="0 0 520 380" role="img" aria-label="A home taking shape in four stages, from site plan to finished house">
      <defs>
        <radialGradient id="jbhGlow" cx="50%" cy="62%" r="55%">
          <stop offset="0%" stopColor="#B88A4B" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#B88A4B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Phase 4 glow sits behind everything */}
      <rect x="0" y="0" width="520" height="380" fill="url(#jbhGlow)" className={`${styles.fade} ${on(3)}`} />

      {/* 1. Site and plan */}
      <g className={`${styles.layer} ${styles.l1} ${on(0)}`}>
        <path className={styles.draw} style={d(0)} pathLength={1} d="M20 300H500" />
        <path className={styles.draw} style={d(1)} pathLength={1} d="M20 322Q140 310 260 322T500 322" />
        <path className={styles.draw} style={d(2)} pathLength={1} d="M64 300V284M64 212 46 262H82ZM64 238 40 286H88Z" />
        <path className={styles.draw} style={d(3)} pathLength={1} d="M456 300V284M456 212 438 262H474ZM456 238 432 286H480Z" />
        <path className={styles.draw} style={d(4)} pathLength={1} d="M120 346H400M120 338V354M400 338V354" />
        <path className={styles.draw} style={d(5)} pathLength={1} d="M486 52V92M486 52 479 68M486 52 493 68" />
        <path className={`${styles.fade} ${styles.dash}`} d="M44 312H476" />
      </g>

      {/* 2. Blueprint */}
      <g className={`${styles.layer} ${styles.l2} ${on(1)}`}>
        <path className={styles.draw} style={d(0)} pathLength={1} d="M130 300V190H390V300" />
        <path className={styles.draw} style={d(1)} pathLength={1} d="M108 192 260 100 412 192" />
        <path className={styles.draw} style={d(2)} pathLength={1} d="M236 300V240H284V300" />
        <path className={styles.draw} style={d(3)} pathLength={1} d="M156 220H212V266H156ZM184 220V266" />
        <path className={styles.draw} style={d(4)} pathLength={1} d="M308 220H364V266H308ZM336 220V266" />
        <path className={styles.draw} style={d(5)} pathLength={1} d="M340 150V108H366V162" />
        <path className={`${styles.fade} ${styles.dash}`} d="M260 84V334" />
      </g>

      {/* 3. Framing */}
      <g className={`${styles.layer} ${styles.l3} ${on(2)}`}>
        <path className={styles.draw} style={d(0)} pathLength={1} d="M150 300V190M170 300V190M190 300V190M210 300V190M230 300V190M290 300V190M310 300V190M330 300V190M350 300V190M370 300V190" />
        <path className={styles.draw} style={d(3)} pathLength={1} d="M130 200H390M130 300H390" />
        <path className={styles.draw} style={d(4)} pathLength={1} d="M170 190V155M210 190V131M260 190V100M310 190V131M350 190V155" />
        <path className={styles.draw} style={d(6)} pathLength={1} d="M170 190 260 112M350 190 260 112" />
      </g>

      {/* 4. Finished and lit */}
      <g className={`${styles.layer} ${styles.l4} ${on(3)}`}>
        <polygon className={`${styles.fade} ${styles.roofFill}`} points="108,192 260,100 412,192" />
        <rect className={`${styles.fade} ${styles.wallFill}`} x="130" y="190" width="260" height="110" />
        <rect className={`${styles.fade} ${styles.lit}`} x="156" y="220" width="56" height="46" />
        <rect className={`${styles.fade} ${styles.lit}`} x="308" y="220" width="56" height="46" />
        <rect className={`${styles.fade} ${styles.doorFill}`} x="236" y="240" width="48" height="60" />
        <polygon className={`${styles.fade} ${styles.pathFill}`} points="236,300 284,300 322,348 198,348" />
        <circle className={`${styles.fade} ${styles.lamp}`} cx="222" cy="262" r="3" />
        <circle className={`${styles.fade} ${styles.lamp}`} cx="298" cy="262" r="3" />
      </g>
    </svg>
  );
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

  useEffect(() => {
    if (!auto || !inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setTimeout(() => setStage((s) => (s + 1) % PROCESS_PHASES.length), STAGE_MS);
    return () => window.clearTimeout(t);
  }, [stage, auto, inView]);

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
                      {active && auto && inView && <span key={`bar-${stage}`} className={styles.bar} style={{ animationDuration: `${STAGE_MS}ms` }} aria-hidden />}
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
              <div className={styles.paper}>
                <HouseDrawing stage={stage} />
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
