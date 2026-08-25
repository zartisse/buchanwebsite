import { Link } from 'react-router-dom';
import type { HomePageContent } from '../../../types';
import { OptimizedImage } from '../../ui/OptimizedImage';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './TestimonialStrip.module.css';

type TestimonialStripProps = {
  section: HomePageContent['testimonial_section'];
};

export function TestimonialStrip({ section }: TestimonialStripProps) {
  const leftImg = section.left_image_url ?? '/assets/ph-arch-1.webp';
  const rightImg = section.right_image_url ?? '/assets/ph-arch-4.webp';

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <RevealOnScroll variant="left">
          <div className={styles.photoWrap}>
            <OptimizedImage src={leftImg} seed="testimonial-left" className={styles.photo} />
          </div>
        </RevealOnScroll>
        <RevealOnScroll>
          <blockquote className={styles.quoteBlock}>
            <p className={styles.quote}>&ldquo;{section.quote}&rdquo;</p>
            <cite className={styles.cite}>{section.cite}</cite>
            {section.cta_label?.trim() && section.cta_link && (
              <Link to={section.cta_link} className="linkAccent" style={{ marginTop: 24 }}>
                {section.cta_label.replace(/\s*→\s*$/, '')} <span>→</span>
              </Link>
            )}
          </blockquote>
        </RevealOnScroll>
        <RevealOnScroll variant="left" index={1}>
          <div className={styles.photoWrap}>
            <OptimizedImage src={rightImg} seed="testimonial-right" className={styles.photo} />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
