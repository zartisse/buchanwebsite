import { CLIENT_CONCERNS } from '../../../data/iaContent';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './ClientConcerns.module.css';

export function ClientConcerns() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll>
          <span className={styles.eyebrow}>Your Concerns Shape How We Build</span>
          <h2 className={styles.title}>Confidence at<br /><em>every stage.</em></h2>
        </RevealOnScroll>
        <div className={styles.grid}>
          {CLIENT_CONCERNS.map((concern) => (
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
