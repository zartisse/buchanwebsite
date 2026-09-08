import { Link } from 'react-router-dom';
import type { Property } from '../../types';
import { OptimizedImage } from '../ui/OptimizedImage';
import ps from '../../styles/pages.module.css';

type PortfolioPropertyCardProps = {
  property: Property;
};

export function PortfolioPropertyCard({ property }: PortfolioPropertyCardProps) {
  const showBanner = property.status === 'Available' || property.status === 'Coming Soon';

  return (
    <Link to={`/portfolio/${property.slug}`} className={`${ps.cardLink} imageHover`}>
      <div className={ps.cardImageWrap}>
        <OptimizedImage
          src={property.image_url}
          seed={property.slug}
          alt={property.name}
          className={ps.imageCover}
          style={{ transition: 'transform 0.55s ease' }}
        />
        {showBanner && <span className={ps.cardStatusBanner}>{property.status}</span>}
      </div>
      <span className={ps.cardTitle}>{property.name}</span>
      <span className={ps.cardMeta}>
        {property.city}
        {property.status === 'Sold' ? ' · Sold' : ''}
      </span>
    </Link>
  );
}
