import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { HomePageContent } from '../../../types';
import { OptimizedImage } from '../../ui/OptimizedImage';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { SectionIndex } from '../../ui/SectionIndex';
import styles from './PickYourPath.module.css';

type PickYourPathProps = {
  section: HomePageContent['pick_your_path'];
  index?: string;
};

type Tile = HomePageContent['pick_your_path']['tiles'][number];

function TileLink({ tile, className, children }: { tile: Tile; className: string; children: ReactNode }) {
  if (tile.external) {
    return <a href={tile.link} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
  }
  return <Link to={tile.link} className={className}>{children}</Link>;
}

export function PickYourPath({ section, index }: PickYourPathProps) {
  const tiles = section.tiles.slice(0, 3);
  const [lead, ...rest] = tiles;
  if (!lead) return null;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll variant="up">
          <header className={styles.header}>
            <SectionIndex index={index} label="Where to begin" />
            {section.title && <h2 className={styles.title}>{section.title}</h2>}
            {section.intro ? <p className={styles.intro}>{section.intro}</p> : null}
          </header>
        </RevealOnScroll>

        <div className={styles.grid}>
          <TileLink tile={lead} className={`${styles.card} ${styles.cardLead}`}>
            <RevealOnScroll variant="mask" className={styles.frame}>
              <OptimizedImage src={lead.image_url} seed={lead.title} alt="" displayWidth={1300} sizes="(max-width: 900px) 100vw, 56vw" />
            </RevealOnScroll>
            <div className={styles.copy}>
              <span className={styles.no}>01</span>
              <h3 className={styles.cardTitle}>{lead.title}</h3>
              {lead.description && <p className={styles.cardDesc}>{lead.description}</p>}
              <span className="linkAccent">{lead.cta_label ?? 'Explore Your Options'} <span>→</span></span>
            </div>
          </TileLink>

          <div className={styles.stack}>
            {rest.map((tile, i) => (
              <RevealOnScroll key={tile.title} variant="up" index={i + 1}>
                <TileLink tile={tile} className={`${styles.card} ${styles.cardRow}`}>
                  <span className={styles.rowFrame}>
                    <OptimizedImage src={tile.image_url} seed={tile.title} alt="" displayWidth={600} sizes="(max-width: 900px) 40vw, 18vw" />
                  </span>
                  <div className={styles.copy}>
                    <span className={styles.no}>{String(i + 2).padStart(2, '0')}</span>
                    <h3 className={styles.cardTitle}>{tile.title}</h3>
                    {tile.description && <p className={styles.cardDesc}>{tile.description}</p>}
                    <span className="linkAccent">{tile.cta_label ?? 'Explore Your Options'} <span>→</span></span>
                  </div>
                </TileLink>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
