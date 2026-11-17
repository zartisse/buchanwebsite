import { OptimizedImage } from '../../ui/OptimizedImage';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { SITE_CTA_IMAGE } from '../../../data/siteImages';
import { ArrowLink } from './ArrowLink';
import styles from './Landing.module.css';

export function StartConversation() {
  return (
    <section id="start-a-conversation" className={styles.convo} aria-label="Start a conversation">
      <div className={styles.convoBg} aria-hidden>
        <OptimizedImage src={SITE_CTA_IMAGE} seed="closing-cta" displayWidth={1920} sizes="100vw" />
      </div>
      <div className={styles.convoVeil} aria-hidden />
      <div className={styles.convoInner}>
        <RevealOnScroll>
          <p className={`${styles.eyebrow} ${styles.eyebrowCenter}`}>Let&rsquo;s talk</p>
          <h2 className={styles.convoTitle}>Start a <em>conversation.</em></h2>
          <p className={styles.convoSub}>
            Tell us about your property, your plans, or the home you imagine. We will take it from there.
          </p>
          <div className={styles.convoActions}>
            <ArrowLink to="/contact" light>Contact us</ArrowLink>
            <a href="tel:4258272266" className={`${styles.convoPhone} tabularNums`}>425.827.2266</a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
