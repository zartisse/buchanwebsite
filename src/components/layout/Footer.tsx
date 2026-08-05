import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FOOTER_AWARD_BADGES, HOUZZ_PROFILE_URL } from '../../data/awards';
import {
  FOOTER_COMPANY, FOOTER_RESOURCES, FOOTER_SERVICES, FOOTER_UTILITY, SOCIAL_LINKS,
} from '../../data/navigation';
import styles from './Footer.module.css';

export function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.newsletter}>
        <div className={styles.newsletterText}>
          <span className={styles.eyebrow}>Stay Connected</span>
          <span className={styles.newsletterTitle}>News from the Eastside.</span>
        </div>
        <form onSubmit={onSubscribe} className={styles.newsletterForm}>
          <input type="email" required placeholder="Your email" className={styles.emailInput} />
          <button type="submit" className={styles.signUpBtn}>
            {subscribed ? 'Subscribed ✓' : 'Sign Up →'}
          </button>
        </form>
      </div>

      <div className={styles.badgeRow}>
        <span className={styles.badgeRowLabel}>Credentials & Awards</span>
        <div className={styles.awardLogos}>
          {FOOTER_AWARD_BADGES.map((badge) => (
            <a key={badge.alt} href={badge.href ?? HOUZZ_PROFILE_URL} target="_blank" rel="noopener noreferrer" className={styles.awardLogoLink} title={badge.alt}>
              {badge.image ? (
                <img src={badge.image} alt={badge.alt} className={styles.awardLogo} />
              ) : (
                <span className={styles.awardTextBadge}>{badge.alt}</span>
              )}
            </a>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
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
          <span className={styles.colTitle}>Utility</span>
          {FOOTER_UTILITY.map((l) => (
            'external' in l && l.external ? (
              <a key={l.label} href={l.to} target="_blank" rel="noopener noreferrer">{l.label}</a>
            ) : (
              <Link key={l.label} to={l.to}>{l.label}</Link>
            )
          ))}
        </div>
      </div>

      <div className={styles.socialRow}>
        {SOCIAL_LINKS.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>{s.label}</a>
        ))}
        <a href="tel:4258272266" className={styles.socialLink}>425.827.2266</a>
        <a href="mailto:info@buchan.com" className={styles.socialLink}>info@buchan.com</a>
        <span className={styles.socialLink}>Bellevue, WA</span>
      </div>

      <div className={styles.copyright}>
        <span>© {new Date().getFullYear()} John Buchan Homes. All rights reserved.</span>
        <span className={styles.legal}>
          Licensed & bonded · WA Contractor License #[pending verification] ·{' '}
          <Link to="/faq#privacy">Privacy</Link>
        </span>
      </div>
    </footer>
  );
}
