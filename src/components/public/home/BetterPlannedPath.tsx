import { Link } from 'react-router-dom';
import type { HomePageContent } from '../../../types';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './BetterPlannedPath.module.css';

type BetterPlannedPathProps = {
  section: HomePageContent['better_planned_path'];
  stages: HomePageContent['process_stages'];
};

function linkLabel(label: string): string {
  return label.replace(/\s*→\s*$/, '').trim();
}

export function BetterPlannedPath({ section, stages }: BetterPlannedPathProps) {
  const title = section.title_emphasis
    ? <>{section.title} <em>{section.title_emphasis}</em></>
    : section.title;
  const ctaLabel = section.cta_label?.trim();

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <RevealOnScroll variant="left">
            <h2 className={styles.title}>{title}</h2>
          </RevealOnScroll>
          <RevealOnScroll variant="left" index={1}>
            <p className={styles.intro}>{section.intro}</p>
          </RevealOnScroll>
        </div>

        <ol className={styles.timeline}>
          {stages.map((stage, i) => (
            <li key={stage.n} className={styles.stepItem}>
              <RevealOnScroll index={i}>
                <div className={styles.step}>
                  <span className={styles.stepNum} aria-hidden>
                    {Number.parseInt(stage.n, 10) || i + 1}
                  </span>
                  <h3 className={styles.stepTitle}>{stage.title}</h3>
                  <p className={styles.stepBody}>{stage.body}</p>
                </div>
              </RevealOnScroll>
            </li>
          ))}
        </ol>

        {ctaLabel && section.cta_link && (
          <RevealOnScroll>
            <Link to={section.cta_link} className="linkAccent" style={{ marginTop: 40, display: 'inline-flex' }}>
              {linkLabel(ctaLabel)} <span>→</span>
            </Link>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}
