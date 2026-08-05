import { Link } from 'react-router-dom';
import { EstimatorLink } from '../../ui/EstimatorLink';
import { PICK_YOUR_PATH_INTRO, PICK_YOUR_PATH_TILES } from '../../../data/iaContent';
import styles from './PickYourPath.module.css';

export function PickYourPath() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.intro}>{PICK_YOUR_PATH_INTRO}</p>
        <div className={styles.grid}>
          {PICK_YOUR_PATH_TILES.map((tile) => {
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
