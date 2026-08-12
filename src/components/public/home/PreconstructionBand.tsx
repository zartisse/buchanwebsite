import { Link } from 'react-router-dom';
import type { HomePageContent } from '../../../types';
import { resolveImageUrl } from '../../../lib/placeholders';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './PreconstructionBand.module.css';

type PreconstructionBandProps = {
  band: HomePageContent['what_we_do']['preconstruction'];
};

export function PreconstructionBand({ band }: PreconstructionBandProps) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll variant="left">
          <div className={styles.imageWrap}>
            <img
              src={resolveImageUrl(band.image_url ?? '/assets/ph-arch-2.png', 'preconstruction')}
              alt=""
              className={styles.image}
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
