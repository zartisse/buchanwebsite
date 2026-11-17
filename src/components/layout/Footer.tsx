import { Link } from 'react-router-dom';
import { FOOTER_AWARD_BADGES, HOUZZ_PROFILE_URL } from '../../data/awards';
import { assetUrl } from '../../lib/assets';
import { SOCIAL_LINKS } from '../../data/navigation';
import { OFFICE_ADDRESS_LINES, OFFICE_HOURS } from '../../data/contactInfo';
import styles from './Footer.module.css';

const FOOTER_STATEMENT = 'Building exceptional homes in Bellevue and the Greater Eastside.';

/** Essential paths only. Everything else stays reachable from the top menu and these pages. */
const FOOTER_LINKS: { label: string; to: string; external?: boolean }[] = [
  { label: 'Custom Homes', to: '/custom-homes' },
  { label: 'Renovations', to: '/renovations' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Process', to: '/process' },
  { label: 'Client Stories', to: '/testimonials' },
  { label: 'Blog', to: '/blog/' },
  { label: 'Careers', to: '/about#join-our-team' },
  { label: 'Homeowner Portal', to: 'https://portal.buchan.com', external: true },
];

export function Footer() {
  const badges = FOOTER_AWARD_BADGES.filter((b) => b.image);

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <img src={assetUrl('/assets/logo.png')} alt="John Buchan Homes" className={styles.logo} />
          <p className={styles.statement}>{FOOTER_STATEMENT}</p>
        </div>

        <address className={styles.contact}>
          <span>{OFFICE_ADDRESS_LINES[0]}, {OFFICE_ADDRESS_LINES[1]}</span>
          <span>{OFFICE_HOURS}</span>
          <a href="tel:4258272266" className="tabularNums">425.827.2266</a>
          <a href="mailto:mischellem@buchan.com">mischellem@buchan.com</a>
        </address>

      </div>

      <div className={styles.awards} aria-label="Awards and recognition">
        {badges.map((badge) => {
          const href = badge.href ?? HOUZZ_PROFILE_URL;
          const img = (
            <img
              src={assetUrl(badge.image!)}
              alt={badge.alt}
              className={badge.featured ? styles.awardFeatured : styles.awardLogo}
              loading="lazy"
              decoding="async"
            />
          );
          return href.startsWith('/') ? (
            <Link key={badge.alt} to={href} title={badge.alt}>{img}</Link>
          ) : (
            <a key={badge.alt} href={href} target="_blank" rel="noopener noreferrer" title={badge.alt}>{img}</a>
          );
        })}
      </div>

      <nav className={styles.links} aria-label="Footer">
        {FOOTER_LINKS.map((l) =>
          l.external ? (
            <a key={l.label} href={l.to} target="_blank" rel="noopener noreferrer">{l.label}</a>
          ) : (
            <Link key={l.label} to={l.to}>{l.label}</Link>
          ),
        )}
      </nav>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} John Buchan Homes. All rights reserved.</span>
        <span className={styles.bottomLinks}>
          {SOCIAL_LINKS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
          ))}
          <Link to="/faq#privacy">Privacy policy</Link>
          <Link to="/faq#terms">Terms of use</Link>
        </span>
      </div>
    </footer>
  );
}
