import { Link } from 'react-router-dom';
import type { HomePageContent } from '../../../types';
import { OptimizedImage } from '../../ui/OptimizedImage';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { SectionIndex } from '../../ui/SectionIndex';
import styles from './DifferenceSection.module.css';

type DifferenceSectionProps = {
  section: HomePageContent['difference_section'];
  index?: string;
};

export function DifferenceSection({ section, index }: DifferenceSectionProps) {
  const paragraphs = section.body.split(/\n\n+/).filter(Boolean);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll variant="mask" className={styles.imageWrap}>
          <OptimizedImage
            src={section.image_url}
            seed="difference"
            alt=""
            className={styles.image}
            displayWidth={1300}
            sizes="(max-width: 900px) 100vw, 56vw"
          />
        </RevealOnScroll>
        <div className={styles.copy}>
          <RevealOnScroll variant="up">
            <SectionIndex index={index} label={section.eyebrow} />
            <h2 className={styles.title}>{section.title}</h2>
          </RevealOnScroll>
          {paragraphs.map((paragraph, i) => (
            <RevealOnScroll key={paragraph.slice(0, 32)} variant="up" index={i + 1}>
              <p className={`${styles.body} ${i === 0 ? styles.lead : ''}`}>{paragraph}</p>
            </RevealOnScroll>
          ))}
          <RevealOnScroll variant="up" index={paragraphs.length + 1}>
            <Link to={section.cta_link} className="linkAccent">
              {section.cta_label} <span>→</span>
            </Link>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
