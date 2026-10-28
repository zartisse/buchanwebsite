import { Link } from 'react-router-dom';
import { FOOTER_AWARD_BADGES, HOUZZ_PROFILE_URL } from '../../data/awards';
import { assetUrl } from '../../lib/assets';
import {
  FOOTER_COMPANY, FOOTER_RESOURCES, FOOTER_SERVICES, SOCIAL_LINKS,
} from '../../data/navigation';
import { OFFICE_ADDRESS_LINES, OFFICE_HOURS } from '../../data/contactInfo';
import styles from './Footer.module.css';

const FOOTER_STATEMENT = 'Building exceptional homes on the Seattle Eastside since 1961.';
const FOOTER_MISSION =
  'With integrity, craftsmanship, and care that lasts beyond move-in day.';

function isInternalHref(href: string | undefined): href is string {
  return Boolean(href && href.startsWith('/') && !href.startsWith('//'));
}

export function Footer() {
  const badges = FOOTER_AWARD_BADGES.map((b) => ({ image_url: b.image, alt: b.alt, href: b.href }));
  const imageBadges = badges.filter((b) => b.image_url);
  const textBadges = badges.filter((b) => !b.image_url);

  return (
    <footer className={styles.footer}>
      <div className={styles.close}>
        <div className={styles.statementCol}>
          <img src={assetUrl('/assets/logo.png')} alt="John Buchan Homes" className={styles.footerLogo} />
          <p className={styles.statement}>{FOOTER_STATEMENT}</p>
          <p className={styles.tagline}>{FOOTER_MISSION}</p>
        </div>
        <address className={styles.contactCol}>
          <p className={styles.contactLine}>
            {OFFICE_ADDRESS_LINES[0]}
            <br />
            {OFFICE_ADDRESS_LINES[1]}
          </p>
          <p className={styles.contactLine}>{OFFICE_HOURS}</p>
          <a href="tel:4258272266" className={`${styles.contactStrong} tabularNums`}>425.827.2266</a>
          <a href="mailto:info@buchan.com" className={styles.contactStrong}>info@buchan.com</a>
          <Link to="/contact" className="btnPrimaryFill">Let&apos;s talk</Link>
        </address>
      </div>

      <nav className={styles.grid} aria-label="Footer">
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
        <div className={styles.linkCol}>
          <span className={styles.colTitle}>Recognition</span>
          <div className={styles.awardRow}>
            {imageBadges.map((badge) => {
              const href = badge.href ?? HOUZZ_PROFILE_URL;
              const logo = (
                <img src={assetUrl(badge.image_url!)} alt={badge.alt} className={styles.awardLogo} loading="lazy" decoding="async" />
              );
              if (isInternalHref(href)) {
                return (
                  <Link key={badge.alt} to={href} className={styles.awardLogoLink} title={badge.alt}>
                    {logo}
                  </Link>
                );
              }
              return (
                <a
                  key={badge.alt}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.awardLogoLink}
                  title={badge.alt}
                >
                  {logo}
                </a>
              );
            })}
          </div>
          {textBadges.map((badge) => {
            const href = badge.href ?? HOUZZ_PROFILE_URL;
            if (isInternalHref(href)) {
              return <Link key={badge.alt} to={href}>{badge.alt}</Link>;
            }
            return (
              <a key={badge.alt} href={href} target="_blank" rel="noopener noreferrer">
                {badge.alt}
              </a>
            );
          })}
        </div>
      </nav>

      <div className={styles.bottomBar}>
        <span>© {new Date().getFullYear()} John Buchan Homes. All rights reserved.</span>
        <span className={styles.bottomLinks}>
          {SOCIAL_LINKS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
          ))}
          <Link to="/faq#privacy">Privacy policy</Link>
          <Link to="/faq#terms">Terms of use</Link>
        </span>
      </div>

      <p className={styles.wordmark} aria-hidden>
        John Buchan Homes
      </p>
    </footer>
  );
}
