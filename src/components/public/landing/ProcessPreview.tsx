import { Link } from 'react-router-dom';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { PROCESS_PHASES } from '../../../data/buchanProcess';
import { ArrowLink } from './ArrowLink';
import styles from './Landing.module.css';

function firstSentence(text: string): string {
  const m = text.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
}

export function ProcessPreview() {
  return (
    <section id="process" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.processHead}>
          <RevealOnScroll>
            <p className={styles.eyebrow}>The Buchan experience</p>
            <h2 className={styles.h2}>A more predictable way <em>to build.</em></h2>
          </RevealOnScroll>
          <RevealOnScroll variant="right">
            <p className={styles.body} style={{ marginBottom: 'var(--s-8)' }}>
              Thoughtful planning, steady communication, accountability, and disciplined execution make building a
              home clearer and more enjoyable, from the first conversation through move-in and beyond.
            </p>
            <ArrowLink to="/process">See the full process</ArrowLink>
          </RevealOnScroll>
        </div>

        <div className={styles.phases}>
          {PROCESS_PHASES.map((phase, i) => (
            <RevealOnScroll key={phase.n} index={i}>
              <Link to={`/process#phase-${phase.n}`} className={styles.phase}>
                <span className={`${styles.phaseNum} tabularNums`}>{phase.n.padStart(2, '0')}</span>
                <h3>{phase.title}</h3>
                <p>{firstSentence(phase.intro)}</p>
                <span className={styles.phaseSteps}>{phase.steps.length} steps</span>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
