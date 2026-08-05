import { Link } from 'react-router-dom';
import { BETTER_PLANNED_PATH, PROCESS_STAGES } from '../../../data/iaContent';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './BetterPlannedPath.module.css';

export function BetterPlannedPath() {
  return (
    <section className={`${styles.section} ${styles.textureBand}`}>
      <div className={styles.inner}>
        <RevealOnScroll>
          <span className={styles.eyebrow}>{BETTER_PLANNED_PATH.eyebrow}</span>
          <h2 className={styles.title}>
            {BETTER_PLANNED_PATH.title}<br /><em>{BETTER_PLANNED_PATH.titleEmphasis}</em>
          </h2>
          <p className={styles.intro}>{BETTER_PLANNED_PATH.intro}</p>
        </RevealOnScroll>

        <div className={styles.steps}>
          {PROCESS_STAGES.map((stage, i) => (
            <RevealOnScroll key={stage.n}>
              <article className={styles.step}>
                <span className={styles.stepNum}>{stage.n}</span>
                <div>
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                </div>
                {i < PROCESS_STAGES.length - 1 && <span className={styles.connector} aria-hidden />}
              </article>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <div className={styles.teamBlock}>
            <div className={styles.teamCopy}>
              <h3>{BETTER_PLANNED_PATH.teamHeading}</h3>
              <p>{BETTER_PLANNED_PATH.teamBody}</p>
              <Link to="/process" className={styles.processLink}>The full process →</Link>
            </div>
            <img src={BETTER_PLANNED_PATH.teamImage} alt="" className={styles.teamImage} />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
