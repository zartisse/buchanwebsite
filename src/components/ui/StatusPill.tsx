import adminStyles from '../../styles/admin.module.css';

interface StatusPillProps {
  status: string;
}

export function StatusPill({ status }: StatusPillProps) {
  const cls =
    status === 'Published' || status === 'Available'
      ? adminStyles.pillGold
      : status === 'Coming Soon'
        ? adminStyles.pillNew
        : status === 'Sold'
        ? adminStyles.pillMuted
        : adminStyles.pillGray;
  return <span className={`${adminStyles.pill} ${cls}`}>{status}</span>;
}
