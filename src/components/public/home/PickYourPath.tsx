import { Link } from 'react-router-dom';
import type { HomePageContent } from '../../../types';
import { OptimizedImage } from '../../ui/OptimizedImage';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './PickYourPath.module.css';

type PickYourPathProps = {
  section: HomePageContent['pick_your_path'];
};

export function PickYourPath({ section }: PickYourPathProps) {
  const tiles = section.tiles.slice(0, 3);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll variant="down">
          <div className={styles.header}>
            {section.title && <h2 className={styles.title}>{section.title}</h2>}
            {section.intro ? <p className={styles.intro}>{section.intro}</p> : null}
          </div>
        </RevealOnScroll>
        <div className={styles.grid}>
          {tiles.map((tile, i) => {
            const inner = (
              <>
                <OptimizedImage
                  src={tile.image_url}
                  seed={tile.title}
                  alt=""
                  className={styles.cardBg}
                  displayWidth={i === 0 ? 1200 : 800}
                  sizes={i === 0 ? '(max-width: 860px) 100vw, 50vw' : '(max-width: 860px) 100vw, 25vw'}
                />
                <div className={styles.cardScrim} aria-hidden />
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{tile.title}</h3>
                  {tile.description && <p className={styles.cardDesc}>{tile.description}</p>}
                  <span className="linkAccent">{tile.cta_label ?? 'Explore Your Options'} <span>→</span></span>
                </div>
              </>
            );
            const cardClass = `${styles.card} ${i === 0 ? styles.cardLead : ''} cardHover`;
            return (
              <RevealOnScroll
                key={tile.title}
                index={i}
                variant={i % 2 === 0 ? 'scale' : 'up'}
                className={`${styles.gridCell} ${i === 0 ? styles.leadCell : ''}`}
              >
                {tile.external ? (
                  <a href={tile.link} target="_blank" rel="noopener noreferrer" className={cardClass}>{inner}</a>
                ) : (
                  <Link to={tile.link} className={cardClass}>{inner}</Link>
                )}
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
