import type { HomePageContent } from '../../../types';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './ClientConcerns.module.css';

type ClientConcernsProps = {
  section: HomePageContent['client_concerns'];
};

export function ClientConcerns({ section }: ClientConcernsProps) {
  const items = section.items.slice(0, 3);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll>
          <div className={styles.header}>
            <span className="eyebrowRule eyebrowRuleCenter">{section.eyebrow}</span>
          </div>
        </RevealOnScroll>
        <div className={styles.grid}>
          {items.map((item, i) => (
            <RevealOnScroll key={item.title} index={i}>
              <article className={styles.card}>
                <span className={styles.bgNum} aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={styles.question}>{item.title}</h3>
                <p className={styles.answer}>{item.body}</p>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
