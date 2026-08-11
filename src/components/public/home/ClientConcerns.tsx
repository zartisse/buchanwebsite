import type { HomePageContent } from '../../../types';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './ClientConcerns.module.css';

type ClientConcernsProps = {
  section: HomePageContent['client_concerns'];
};

export function ClientConcerns({ section }: ClientConcernsProps) {
  return (
    <section className={styles.section}>
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
        </RevealOnScroll>
        <div className={styles.grid}>
          {section.items.map((concern) => (
            <RevealOnScroll key={concern.title}>
              <article className={styles.card}>
                <h3>{concern.title}</h3>
                <p>{concern.body}</p>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
