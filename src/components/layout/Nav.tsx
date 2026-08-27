import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PRIMARY_NAV } from '../../data/navigation';
import { assetUrl } from '../../lib/assets';
import styles from './Nav.module.css';

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const onHomeHero = pathname === '/';
  const lightTop = onHomeHero && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
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
      <header className={`${styles.topbar} ${scrolled ? styles.scrolled : ''} ${lightTop ? styles.lightTopbar : ''} ${onHomeHero ? styles.withMarquee : ''}`}>
        <Link to="/" className={styles.logoLink}>
          <img src={lightTop ? assetUrl('/assets/logo-reverse.png') : assetUrl('/assets/logo.png')} alt="John Buchan Homes" className={styles.logo} />
        </Link>

        <div className={styles.topCluster}>
          <nav className={styles.desktopNav} aria-label="Primary">
            {PRIMARY_NAV.map((group) => (
              <DesktopNavItem key={group.label} group={group} lightTop={lightTop} scrolled={scrolled} />
            ))}
          </nav>

          <div className={styles.topRight}>
            <Link to="/contact" className={styles.ctaBtn}>Let&apos;s Talk</Link>
            <a href="tel:4258272266" className={`${styles.phone} ${!lightTop ? styles.phoneDark : ''}`}>425.827.2266</a>
            <button
              type="button"
              className={styles.burger}
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <span /><span />
            </button>
          </div>
        </div>
      </header>

      <nav className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`} aria-label="Mobile menu">
        <div className={styles.ghost}>65</div>
        <div className={styles.overlayTop}>
          <img src={assetUrl('/assets/logo-reverse.png')} alt="" className={styles.logo} />
          <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Close menu">
            <span /><span />
          </button>
        </div>
        <div className={styles.navLinks}>
          {PRIMARY_NAV.map((group) => (
            <MobileNavGroup
              key={group.label}
              label={group.label}
              to={group.to}
              links={group.links}
              open={open}
              onClose={() => setOpen(false)}
            />
          ))}
        </div>
        <div className={styles.overlayFooter}>
          <span>425.827.2266 · Bellevue, WA</span>
        </div>
      </nav>
    </>
  );
}

function DesktopNavItem({
  group,
  lightTop,
  scrolled,
}: {
  group: (typeof PRIMARY_NAV)[number];
  lightTop: boolean;
  scrolled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const hasDropdown = group.links.length > 0;

  return (
    <div
      className={styles.desktopNavItem}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <Link
        to={group.to}
        className={`${styles.desktopNavLink} ${lightTop && !scrolled ? styles.desktopNavLinkLight : ''}`}
        aria-haspopup={hasDropdown ? 'true' : undefined}
        aria-expanded={hasDropdown ? open : undefined}
      >
        {group.label}
      </Link>
      {hasDropdown && (
        <div className={`${styles.dropdown} ${open ? styles.dropdownOpen : ''}`}>
          {group.links.map((link) => (
            <Link key={link.to} to={link.to} className={styles.dropdownLink}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileNavGroup({
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
      <Link to={to} className={styles.navMain} onClick={onClose}>{label}</Link>
      {links.length > 0 && (
        <span className={styles.navSubs}>
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={styles.navSub} onClick={onClose}>{l.label}</Link>
          ))}
        </span>
      )}
    </div>
  );
}
