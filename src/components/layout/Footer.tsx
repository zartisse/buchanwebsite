import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FOOTER_AWARD_BADGES, HOUZZ_PROFILE_URL } from '../../data/awards';
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
          <button type="submit" data-cursor className={styles.signUpBtn}>
            {subscribed ? 'Subscribed ✓' : 'Sign Up →'}
          </button>
        </form>
      </div>

      <div className={styles.awardLogos}>
        {FOOTER_AWARD_BADGES.map((badge) => (
          <a
            key={badge.alt}
            href={badge.href ?? HOUZZ_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor
            className={styles.awardLogoLink}
            title={badge.alt}
          >
            <img src={badge.image} alt={badge.alt} className={styles.awardLogo} />
          </a>
        ))}
      </div>

      <div className={styles.grid}>
        <div className={styles.brandCol}>
          <img src="/assets/logo-reverse.svg" alt="John Buchan Homes" className={styles.footerLogo} />
          <p className={styles.tagline}>
            Custom homes built on the Seattle Eastside since 1960. Built on your lot. Designed for your life.
          </p>
        </div>
        <div className={styles.linkCol}>
          <span className={styles.colTitle}>Explore</span>
          <Link to="/" data-cursor>Home</Link>
          <Link to="/about" data-cursor>About Us</Link>
          <Link to="/services" data-cursor>Services</Link>
          <Link to="/portfolio" data-cursor>Portfolio</Link>
          <Link to="/neighborhoods" data-cursor>Neighborhoods</Link>
          <Link to="/process" data-cursor>Process</Link>
          <Link to="/testimonials" data-cursor>Testimonials</Link>
          <Link to="/blog" data-cursor>Blog</Link>
          <Link to="/contact" data-cursor>Contact</Link>
        </div>
        <div className={styles.linkCol}>
          <span className={styles.colTitle}>Resources</span>
          <Link to="/faq" data-cursor>FAQ</Link>
          <Link to="/warranty" data-cursor>Warranty & Aftercare</Link>
          <Link to="/awards" data-cursor>Awards & Press</Link>
          <Link to="/build" data-cursor>Build</Link>
          <Link to="/design" data-cursor>Design</Link>
          <Link to="/remodel" data-cursor>Remodel</Link>
          <a href="https://estimator.buchan.com/" target="_blank" rel="noopener noreferrer" data-cursor>Build Estimator</a>
        </div>
        <div className={styles.linkCol}>
          <span className={styles.colTitle}>Company</span>
          <Link to="/about#we-buy-land" data-cursor>We Buy Land</Link>
          <Link to="/about#join-our-team" data-cursor>Join Our Team</Link>
          <a href="tel:4258272266" data-cursor>425.827.2266</a>
        </div>
      </div>

      <div className={styles.copyright}>
        <span>© {new Date().getFullYear()} John Buchan Homes. All rights reserved.</span>
      </div>
    </footer>
  );
}
