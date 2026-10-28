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
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll variant="right">
          <div className={styles.imageWrap}>
            <OptimizedImage
              src={band.image_url ?? '/assets/ph-arch-2.webp'}
              seed="preconstruction"
              alt=""
              className={styles.image}
              displayWidth={1200}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
        </RevealOnScroll>
        <RevealOnScroll variant="left" index={1}>
          <div className={styles.copy}>
            <h2 className={styles.title}>{band.title}</h2>
            <p className={styles.body}>{band.body}</p>
            <Link to={band.cta_link} className="btnPrimaryFill">{band.cta_label}</Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
