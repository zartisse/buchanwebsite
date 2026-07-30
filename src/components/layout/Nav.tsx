import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PRIMARY_NAV } from '../../data/navigation';
import styles from './Nav.module.css';

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <header className={`${styles.topbar} ${scrolled ? styles.scrolled : ''}`}>
        <Link to="/" data-cursor className={styles.logoLink}>
          <img src="/assets/logo-reverse.svg" alt="John Buchan Homes" className={styles.logo} />
        </Link>
        <div className={styles.topRight}>
          <Link to="/contact" data-cursor className={styles.ctaBtn}>Start a Conversation</Link>
          <a href="tel:4258272266" data-cursor className={styles.phone}>425.827.2266</a>
          <button
            type="button"
            data-cursor
            className={styles.burger}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <span /><span />
          </button>
        </div>
      </header>

      <nav className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`}>
        <div className={styles.ghost}>65</div>
        <div className={styles.overlayTop}>
          <img src="/assets/logo-reverse.svg" alt="" className={styles.logo} />
          <button type="button" data-cursor className={styles.close} onClick={() => setOpen(false)} aria-label="Close menu">
            <span /><span />
          </button>
        </div>
        <div className={styles.navLinks}>
          {PRIMARY_NAV.map((group) => (
            <NavGroup
              key={group.label}
              label={group.label}
              to={group.to}
              links={group.links}
              open={open}
              onClose={() => setOpen(false)}
            />
          ))}
          <div className={styles.navRow}>
            <Link to="/contact" data-cursor className={styles.navMain} onClick={() => setOpen(false)}>Contact</Link>
          </div>
        </div>
        <div className={styles.overlayFooter}>
          <Link to="/cost-estimator" onClick={() => setOpen(false)} style={{ color: 'inherit', textDecoration: 'none' }}>Cost Estimator</Link>
          <span> · </span>
          <span>425.827.2266 · Bellevue, WA</span>
        </div>
      </nav>
    </>
  );
}

function NavGroup({
  label, to, links, open, onClose,
}: {
  label: string;
  to: string;
  links: { to: string; label: string }[];
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div className={`${styles.navRow} ${open ? styles.navRowVisible : ''}`}>
      <Link to={to} data-cursor className={styles.navMain} onClick={onClose}>{label}</Link>
      {links.length > 0 && (
        <span className={styles.navSubs}>
          {links.map((l) => (
            <Link key={l.to} to={l.to} data-cursor className={styles.navSub} onClick={onClose}>{l.label}</Link>
          ))}
        </span>
      )}
    </div>
  );
}
