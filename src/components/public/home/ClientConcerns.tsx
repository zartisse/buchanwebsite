import type { HomePageContent } from '../../../types';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './ClientConcerns.module.css';

type ClientConcernsProps = {
  section: HomePageContent['client_concerns'];
};

export function ClientConcerns({ section }: ClientConcernsProps) {
  const items = section.items.slice(0, 3);

  return (
    <section className={styles.section} aria-labelledby="client-concerns-title">
      <div className={styles.inner}>
        <RevealOnScroll>
          <h2 id="client-concerns-title" className={styles.title}>
            {section.eyebrow}
          </h2>
        </RevealOnScroll>
        <dl className={styles.list}>
          {items.map((item, i) => (
            <RevealOnScroll key={item.title} index={i}>
              <div className={styles.item}>
                <dt className={styles.question}>{item.title}</dt>
                <dd className={styles.answer}>{item.body}</dd>
              </div>
            </RevealOnScroll>
          ))}
        </dl>
      </div>
    </section>
  );
}
