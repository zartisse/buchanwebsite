import { Link } from 'react-router-dom';
import type { HomePageContent } from '../../../types';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './BetterPlannedPath.module.css';

type BetterPlannedPathProps = {
  section: HomePageContent['better_planned_path'];
  stages: HomePageContent['process_stages'];
};

export function BetterPlannedPath({ section, stages }: BetterPlannedPathProps) {
  return (
    <section className={`${styles.section} ${styles.textureBand}`}>
      <div className={styles.inner}>
        <RevealOnScroll>
          <span className={styles.eyebrow}>{section.eyebrow}</span>
          <h2 className={styles.title}>
            {section.title}
            {section.title_emphasis && (
              <>
                <br /><em>{section.title_emphasis}</em>
              </>
            )}
          </h2>
          <p className={styles.intro}>{section.intro}</p>
        </RevealOnScroll>

        <div className={styles.steps}>
          {stages.map((stage, i) => (
            <RevealOnScroll key={stage.n}>
              <article className={styles.step}>
                <span className={styles.stepNum}>{stage.n}</span>
                <div>
                  <h3>{stage.title}</h3>
                  <p>{stage.body}</p>
                </div>
                {i < stages.length - 1 && <span className={styles.connector} aria-hidden />}
              </article>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <div className={styles.teamBlock}>
            <div className={styles.teamCopy}>
              <h3>{section.team_heading}</h3>
              <p>{section.team_body}</p>
              <Link to={section.cta_link} className={styles.processLink}>{section.cta_label}</Link>
            </div>
            <img src={section.team_image_url} alt="" className={styles.teamImage} />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
