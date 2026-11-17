import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LEFT, NAV_RIGHT, type NavGroup } from '../../data/navigation';
import { assetUrl } from '../../lib/assets';
import styles from './Nav.module.css';

const MOBILE_GROUPS: NavGroup[] = [...NAV_LEFT, ...NAV_RIGHT];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  // Pages that open on a full-bleed photo get the light (white) logo and links until scrolled.
  const onHomeHero = pathname === '/' || pathname.replace(/\/$/, '') === '/process';
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
      <header className={`${styles.topbar} ${scrolled ? styles.scrolled : ''} ${lightTop ? styles.lightTopbar : ''}`}>
        <nav className={`${styles.cluster} ${styles.clusterLeft}`} aria-label="Primary">
          {NAV_LEFT.map((group) => (
            <DesktopNavItem key={group.label} group={group} />
          ))}
        </nav>

        <Link to="/" className={styles.logoLink} aria-label="John Buchan Homes, home">
          <img
            src={lightTop ? assetUrl('/assets/logo-reverse.png') : assetUrl('/assets/logo.png')}
            alt="John Buchan Homes"
            className={styles.logo}
          />
        </Link>

        <div className={`${styles.cluster} ${styles.clusterRight}`}>
          <nav className={styles.clusterNav} aria-label="Secondary">
            {NAV_RIGHT.map((group) => (
              <DesktopNavItem key={group.label} group={group} />
            ))}
          </nav>
          <button
            type="button"
            className={styles.burger}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <span /><span />
          </button>
        </div>
      </header>

      <nav className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`} aria-label="Menu" aria-hidden={!open}>
        <div className={styles.overlayTop}>
          <img src={assetUrl('/assets/logo-reverse.png')} alt="" className={styles.overlayLogo} />
          <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Close menu">
            <span /><span />
          </button>
        </div>
        <div className={styles.navLinks}>
          {MOBILE_GROUPS.map((group) => (
            <MobileNavGroup key={group.label} group={group} open={open} onClose={() => setOpen(false)} />
          ))}
        </div>
        <div className={styles.overlayFooter}>
          <a href="tel:4258272266">425.827.2266</a>
          <span>Bellevue, WA</span>
        </div>
      </nav>
    </>
  );
}

function DesktopNavItem({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const hasDropdown = group.links.length > 0;
  const isCurrent = [group.to, ...group.links.map((l) => l.to)].some((raw) => {
    const to = raw.split(/[?#]/)[0].replace(/\/$/, '');
    return to !== '' && !to.startsWith('http') && (pathname.replace(/\/$/, '') === to || pathname.startsWith(`${to}/`));
  });

  return (
    <div
      className={styles.item}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <Link
        to={group.to}
        className={`${styles.link} ${isCurrent ? styles.linkCurrent : ''}`}
        aria-current={isCurrent ? 'page' : undefined}
        aria-haspopup={hasDropdown ? 'true' : undefined}
        aria-expanded={hasDropdown ? open : undefined}
      >
        {group.label}
      </Link>
      {hasDropdown && (
        <div className={`${styles.dropdown} ${open ? styles.dropdownOpen : ''}`}>
          {group.links.map((link) => {
            const path = link.to.split('?')[0].split('#')[0];
            const current = path !== '/' && (pathname === path || pathname.startsWith(`${path}/`));
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`${styles.dropdownLink} ${current ? styles.dropdownLinkCurrent : ''}`}
                aria-current={current ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MobileNavGroup({ group, open, onClose }: { group: NavGroup; open: boolean; onClose: () => void }) {
  return (
    <div className={styles.navRow}>
      <Link to={group.to} className={styles.navMain} onClick={onClose} tabIndex={open ? 0 : -1}>{group.label}</Link>
      {group.links.length > 0 && (
        <span className={styles.navSubs}>
          {group.links.map((l) => (
            <Link key={l.to} to={l.to} className={styles.navSub} onClick={onClose} tabIndex={open ? 0 : -1}>{l.label}</Link>
          ))}
        </span>
      )}
    </div>
  );
}
