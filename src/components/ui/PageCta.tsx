import { Link } from 'react-router-dom';
import { OptimizedImage } from './OptimizedImage';
import ps from '../../styles/pages.module.css';

type PageCtaProps = {
  title: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryUrl?: string;
  primaryExternal?: boolean;
  phone?: string;
  phoneHref?: string;
  backgroundImage?: string;
  children?: React.ReactNode;
};

export function PageCta({
  title,
  subtitle,
  primaryLabel = 'Start a Conversation',
  primaryUrl = '/contact',
  primaryExternal = false,
  phone,
  phoneHref,
  backgroundImage = '/assets/ph-arch-1.png',
  children,
}: PageCtaProps) {
  const PrimaryBtn = primaryExternal ? (
    <a href={primaryUrl} target="_blank" rel="noopener noreferrer" className="btnPrimaryFill">{primaryLabel}</a>
  ) : (
    <Link to={primaryUrl} className="btnPrimaryFill">{primaryLabel}</Link>
  );
  if (backgroundImage) {
    return (
      <section className={ps.ctaPhoto}>
        <div className={ps.ctaPhotoBg} aria-hidden>
          <OptimizedImage src={backgroundImage} seed="page-cta" />
        </div>
        <div className={ps.ctaPhotoOverlay} aria-hidden />
        <div className={ps.ctaPhotoInner}>
          <h2 className={ps.sectionTitle}>{title}</h2>
          {subtitle && <p className={ps.bodyText}>{subtitle}</p>}
          <div className={ps.ctaButtons}>
            {PrimaryBtn}
            {children}
          </div>
          {phone && phoneHref && (
            <a href={phoneHref} className={ps.ctaPhotoPhone}>or call {phone}</a>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className={ps.ctaSection}>
      <h2 className={ps.sectionTitle}>{title}</h2>
      {subtitle && <p className={ps.bodyText}>{subtitle}</p>}
      <div className={ps.ctaButtons}>
        <Link to={primaryUrl} className={ps.btnPrimary}>{primaryLabel}</Link>
        {children}
      </div>
    </section>
  );
}

/** Light cream band CTA (no photo) */
export function PageCtaLight({
  title,
  subtitle,
  primaryLabel = 'Start a Conversation',
  primaryUrl = '/contact',
  children,
}: Omit<PageCtaProps, 'backgroundImage' | 'phone' | 'phoneHref'>) {
  return (
    <section className={ps.ctaSection}>
      <h2 className={ps.sectionTitle}>{title}</h2>
      {subtitle && <p className={ps.bodyText}>{subtitle}</p>}
      <div className={ps.ctaButtons}>
        <Link to={primaryUrl} className={ps.btnPrimary}>{primaryLabel}</Link>
        {children}
      </div>
    </section>
  );
}
