import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { assetUrl } from '../../../lib/assets';
import { ArrowLink } from './ArrowLink';
import { WriteOn } from './WriteOn';
import styles from './Landing.module.css';

export function HistorySection() {
  return (
    <section id="our-history" className={`${styles.section} ${styles.history}`}>
      <div className={styles.inner}>
        <RevealOnScroll>
          <p className={`${styles.eyebrow} ${styles.eyebrowCenter}`}>Our history</p>
          <h2 className={`${styles.h2} ${styles.historyTitle}`}>
            Three Generations of <em>Handcrafted</em> Homes
          </h2>
        </RevealOnScroll>

        <div className={styles.historyPhotos}>
          <RevealOnScroll variant="up" index={1} className={styles.cellSide}>
            <figure className={`${styles.photoShell} ${styles.photoLeft}`}>
              <img
                src={assetUrl('/assets/history/john-buchan.webp')}
                alt="Black-and-white archive photograph of a John Buchan Homes builder on site, holding a shovel"
                width={512}
                height={720}
                loading="lazy"
                decoding="async"
              />
            </figure>
          </RevealOnScroll>
          <RevealOnScroll variant="up" index={0} className={styles.cellCenter}>
            <figure className={`${styles.photoShell} ${styles.photoCenter}`}>
              <img
                src={assetUrl('/assets/history/framing-crew-1960s.webp')}
                alt="Archive photograph of three carpenters raising a framed wall"
                width={870}
                height={1096}
                loading="lazy"
                decoding="async"
              />
            </figure>
          </RevealOnScroll>
          <RevealOnScroll variant="up" index={2} className={styles.cellSide}>
            <figure className={`${styles.photoShell} ${styles.photoRight}`}>
              <img
                src={assetUrl('/assets/history/brick-home-dusk.webp')}
                alt="Brick home with an arched entry, lit at dusk"
                width={830}
                height={550}
                loading="lazy"
                decoding="async"
              />
            </figure>
          </RevealOnScroll>
        </div>

        <RevealOnScroll>
          <div className={styles.historyCopy}>
            <p>
              Since 1961, John Buchan Homes has earned the trust of generations of families through exceptional
              craftsmanship, enduring quality, and a commitment to doing what&rsquo;s right.
            </p>
            <p>
              We invite you to discover the people, principles, and proud history that make a John Buchan home
              truly special.
            </p>
            <span className={styles.signature}><WriteOn ms={2800} label="Signed, Heather Dosch">Heather Dosch</WriteOn></span>
            <ArrowLink to="/about">Explore our story</ArrowLink>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
