import { Link } from 'react-router-dom';
import ps from '../../styles/pages.module.css';

type EmptyStateProps = {
  title: string;
  body: string;
  actionTo?: string;
  actionLabel?: string;
};

export function EmptyState({
  title,
  body,
  actionTo = '/contact',
  actionLabel = "Let's talk",
}: EmptyStateProps) {
  return (
    <div className={ps.emptyState}>
      <h2 className={ps.emptyTitle}>{title}</h2>
      <p className={ps.bodyText}>{body}</p>
      <Link to={actionTo} className="btnPrimaryFill">
        {actionLabel}
      </Link>
    </div>
  );
}
