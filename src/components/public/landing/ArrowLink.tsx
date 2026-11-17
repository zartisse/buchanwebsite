import { Link } from 'react-router-dom';
import styles from './Landing.module.css';

export function ArrowIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type ArrowLinkProps = {
  to: string;
  children: React.ReactNode;
  light?: boolean;
  className?: string;
};

/** Text link with the arrow in its own ring. Internal routes use the router; anchors and http use <a>. */
export function ArrowLink({ to, children, light = false, className = '' }: ArrowLinkProps) {
  const cls = `${styles.arrowLink} ${light ? styles.arrowLinkLight : ''} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      <span className={styles.arrowRing}><ArrowIcon /></span>
    </>
  );
  if (to.startsWith('#')) return <a href={to} className={cls}>{inner}</a>;
  if (to.startsWith('http')) return <a href={to} className={cls} target="_blank" rel="noopener noreferrer">{inner}</a>;
  return <Link to={to} className={cls}>{inner}</Link>;
}
