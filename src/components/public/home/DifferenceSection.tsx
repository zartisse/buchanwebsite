import { Link } from 'react-router-dom';
import type { HomePageContent } from '../../../types';
import { OptimizedImage } from '../../ui/OptimizedImage';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './DifferenceSection.module.css';

type DifferenceSectionProps = {
  section: HomePageContent['difference_section'];
};

export function DifferenceSection({ section }: DifferenceSectionProps) {
  const paragraphs = section.body.split(/\n\n+/).filter(Boolean);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll variant="left">
          <div className={styles.copy}>
            <span className="eyebrowRule">{section.eyebrow}</span>
            <h2 className={styles.title}>{section.title}</h2>
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className={styles.body}>{paragraph}</p>
            ))}
            <Link to={section.cta_link} className="linkAccent">
              {section.cta_label} <span>→</span>
            </Link>
          </div>
        </RevealOnScroll>
        <RevealOnScroll variant="right" index={1}>
          <div className={styles.imageWrap}>
            <OptimizedImage src={section.image_url} seed="difference" className={styles.image} />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
