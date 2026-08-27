import { Link } from 'react-router-dom';
import type { HomePageContent, ServiceIconName } from '../../../types';
import { resolveImageUrl } from '../../../lib/placeholders';
import { ServiceIcon } from '../../ui/ServiceIcon';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './PickYourPath.module.css';

type PickYourPathProps = {
  section: HomePageContent['pick_your_path'];
};

function iconFor(tile: { icon?: ServiceIconName; title: string }): ServiceIconName {
  if (tile.icon) return tile.icon;
  const t = tile.title.toLowerCase();
  if (t.includes('building') || t.includes('considering')) return 'building';
  if (t.includes('plan')) return 'blueprint';
  return 'hammer';
}

export function PickYourPath({ section }: PickYourPathProps) {
  const tiles = section.tiles.slice(0, 3);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll variant="down">
          <div className={styles.header}>
            {section.intro ? (
              <span className="eyebrowRule eyebrowRuleCenter">{section.intro}</span>
            ) : null}
            {section.title && <h2 className={styles.title}>{section.title}</h2>}
          </div>
        </RevealOnScroll>
        <div className={styles.grid}>
          {tiles.map((tile, i) => {
            const inner = (
              <>
                <div
                  className={styles.cardBg}
                  style={{ backgroundImage: `url(${resolveImageUrl(tile.image_url, tile.title)})` }}
                  aria-hidden
                />
                <div className={styles.cardContent}>
                  <ServiceIcon name={iconFor(tile)} className={styles.icon} size={32} />
                  <h3 className={styles.cardTitle}>{tile.title}</h3>
                  {tile.description && <p className={styles.cardDesc}>{tile.description}</p>}
                  <span className="linkAccent">{tile.cta_label ?? 'Explore Your Options'} <span>→</span></span>
                </div>
              </>
            );
            const cardClass = `${styles.card} cardHover`;
            return (
              <RevealOnScroll key={tile.title} index={i} variant={i % 2 === 0 ? 'scale' : 'up'}>
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
