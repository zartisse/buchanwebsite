import { Link } from 'react-router-dom';
import type { HomePageContent } from '../../../types';
import { resolveImageUrl } from '../../../lib/placeholders';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './DifferenceSection.module.css';

type DifferenceSectionProps = {
  section: HomePageContent['difference_section'];
};

export function DifferenceSection({ section }: DifferenceSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll variant="left">
          <div className={styles.copy}>
            <span className="eyebrowRule">{section.eyebrow}</span>
            <h2 className={styles.title}>{section.title}</h2>
            <p className={styles.body}>{section.body}</p>
            <Link to={section.cta_link} className="linkAccent">
              {section.cta_label} <span>→</span>
            </Link>
          </div>
        </RevealOnScroll>
        <RevealOnScroll variant="left" index={1}>
          <div className={styles.imageWrap}>
            <img src={resolveImageUrl(section.image_url, 'difference')} alt="" className={styles.image} />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
