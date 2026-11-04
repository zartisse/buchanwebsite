import { Link } from 'react-router-dom';
import type { HomePageContent } from '../../../types';
import { OptimizedImage } from '../../ui/OptimizedImage';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './PreconstructionBand.module.css';

type PreconstructionBandProps = {
  band: HomePageContent['what_we_do']['preconstruction'];
};

export function PreconstructionBand({ band }: PreconstructionBandProps) {
  return (
    <section className={`${styles.section} onDark`}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <RevealOnScroll variant="up">
            <p className={styles.kicker}>Preconstruction</p>
            <h2 className={styles.title}>{band.title}</h2>
          </RevealOnScroll>
          <RevealOnScroll variant="up" index={1}>
            <p className={styles.body}>{band.body}</p>
          </RevealOnScroll>
          <RevealOnScroll variant="up" index={2}>
            <Link to={band.cta_link} className="btnPrimaryFill">{band.cta_label}</Link>
          </RevealOnScroll>
        </div>
        <RevealOnScroll variant="mask" className={styles.imageWrap}>
          <OptimizedImage
            src={band.image_url ?? '/assets/ph-arch-2.webp'}
            seed="preconstruction"
            alt=""
            className={styles.image}
            displayWidth={1300}
            sizes="(max-width: 900px) 100vw, 56vw"
          />
        </RevealOnScroll>
      </div>
    </section>
  );
}
