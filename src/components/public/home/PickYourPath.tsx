import { Link } from 'react-router-dom';
import { EstimatorLink } from '../../ui/EstimatorLink';
import type { HomePageContent } from '../../../types';
import styles from './PickYourPath.module.css';

type PickYourPathProps = {
  section: HomePageContent['pick_your_path'];
};

export function PickYourPath({ section }: PickYourPathProps) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.intro}>{section.intro}</p>
        <div className={styles.grid}>
          {section.tiles.map((tile) => {
            const className = `${styles.tile} cardHover`;
            if (tile.external) {
              return (
                <EstimatorLink key={tile.title} className={className}>
                  {tile.title}
                </EstimatorLink>
              );
            }
            return (
              <Link key={tile.title} to={tile.link} className={className}>
                {tile.title}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
