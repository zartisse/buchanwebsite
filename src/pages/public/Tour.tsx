import { Link, useParams } from 'react-router-dom';
import { HomeTour } from '../../components/tour/HomeTour';
import { PageMeta } from '../../components/ui/PageMeta';
import { getTour } from '../../data/tours';
import s from '../../components/tour/tour.module.css';

/** Shareable full-page 360° tour, e.g. /tour/clyde-hill-contemporary */
export function Tour() {
  const { tourId = '' } = useParams();
  const tour = getTour(tourId);
  if (!tour) {
    return (
      <div className="page-error">
        Tour not found. <Link to="/portfolio">View all homes</Link>
      </div>
    );
  }
  return (
    <main className={s.page}>
      <PageMeta
        title={`${tour.name} 360° tour`}
        description={`Look around inside the ${tour.name}, a John Buchan Homes custom home in ${tour.city}.`}
      />
      <HomeTour tour={tour} />
    </main>
  );
}
