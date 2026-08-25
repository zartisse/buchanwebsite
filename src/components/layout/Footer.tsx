import { Link } from 'react-router-dom';
import { FOOTER_AWARD_BADGES, HOUZZ_PROFILE_URL } from '../../data/awards';
import { assetUrl } from '../../lib/assets';
import {
  FOOTER_COMPANY, FOOTER_RESOURCES, FOOTER_SERVICES, SOCIAL_LINKS,
} from '../../data/navigation';
import { OFFICE_ADDRESS_LINES } from '../../data/contactInfo';
import styles from './Footer.module.css';

const FOOTER_MISSION =
  'Building exceptional homes on the Seattle Eastside since 1961, with integrity, craftsmanship, and care that lasts beyond move-in day.';

export function Footer() {
  const badges = FOOTER_AWARD_BADGES.map((b) => ({ image_url: b.image, alt: b.alt, href: b.href }));

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brandCol}>
          <img src={assetUrl('/assets/logo.png')} alt="John Buchan Homes" className={styles.footerLogo} />
          <p className={styles.tagline}>{FOOTER_MISSION}</p>
        </div>
        <div className={styles.linkCol}>
          <span className={styles.colTitle}>Company</span>
          {FOOTER_COMPANY.map((l) => (
            <Link key={l.label + l.to} to={l.to}>{l.label}</Link>
          ))}
        </div>
        <div className={styles.linkCol}>
          <span className={styles.colTitle}>Services</span>
          {FOOTER_SERVICES.map((l) => (
            <Link key={l.label} to={l.to}>{l.label}</Link>
          ))}
        </div>
        <div className={styles.linkCol}>
          <span className={styles.colTitle}>Resources</span>
          {FOOTER_RESOURCES.map((l) => (
            <Link key={l.label} to={l.to}>{l.label}</Link>
          ))}
        </div>
        <div className={styles.contactCol}>
          <span className={styles.colTitle}>Contact</span>
          <p className={styles.contactLine}>
            {OFFICE_ADDRESS_LINES[0]}<br />{OFFICE_ADDRESS_LINES[1]}
          </p>
          <a href="tel:4258272266" className={styles.contactLine}>425.827.2266</a>
          <a href="mailto:info@buchan.com" className={styles.contactLine}>info@buchan.com</a>
          <Link to="/contact" className="btnGhostDark">Let&apos;s Talk</Link>
        </div>
      </div>

      <div className={styles.awardRow}>
        {badges.map((badge) => (
          <a key={badge.alt} href={badge.href ?? HOUZZ_PROFILE_URL} target="_blank" rel="noopener noreferrer" className={styles.awardLogoLink} title={badge.alt}>
            {badge.image_url ? (
              <img src={assetUrl(badge.image_url)} alt={badge.alt} className={styles.awardLogo} />
            ) : (
              <span className={styles.awardTextBadge}>{badge.alt}</span>
            )}
          </a>
        ))}
      </div>

      <div className={styles.socialRow}>
        {SOCIAL_LINKS.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>{s.label}</a>
        ))}
      </div>

      <div className={styles.copyright}>
        <span>© {new Date().getFullYear()} John Buchan Homes. All rights reserved.</span>
        <span className={styles.legal}>
          <Link to="/faq#privacy">Privacy Policy</Link>
          {' · '}
          <Link to="/faq#terms">Terms of Use</Link>
        </span>
      </div>
    </footer>
  );
}
