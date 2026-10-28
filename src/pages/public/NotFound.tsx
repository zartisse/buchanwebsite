import { Link } from 'react-router-dom';
import { PageMeta } from '../../components/ui/PageMeta';
import ps from '../../styles/pages.module.css';

export function NotFound() {
  return (
    <main className={ps.notFound}>
      <PageMeta
        title="Page not found"
        description="This page is not on the John Buchan Homes website. Return home or contact the Bellevue office."
      />
      <p className={ps.notFoundKicker}>John Buchan Homes</p>
      <h1 className={ps.heroTitle}>This page isn&apos;t here</h1>
      <p className={ps.bodyText}>
        The address may have changed, or the page may have been removed. The Bellevue office can help you find the right place.
      </p>
      <div className={ps.notFoundActions}>
        <Link to="/" className="btnPrimaryFill">
          Back to the homepage
        </Link>
        <Link to="/contact" className="btnGhostDark">
          Talk with us
        </Link>
      </div>
    </main>
  );
}
