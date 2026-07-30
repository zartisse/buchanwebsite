import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { ESTIMATOR_URL } from '../../lib/estimator';
import ps from '../../styles/pages.module.css';
import est from './CostEstimator.module.css';

export function CostEstimator() {
  return (
    <main>
      <PageMeta
        title="Build Cost & Fit Estimator"
        description="Directional build cost and fit estimate for custom homes and major renovations on the Seattle Eastside."
      />
      <section className={ps.hero}>
        <div className={ps.heroInner}>
          <span className={ps.eyebrow}>Cost & Planning</span>
          <h1 className={ps.heroTitle}>How much will my<br /><em>project cost?</em></h1>
          <p className={ps.bodyText} style={{ marginTop: 24, maxWidth: 560 }}>
            Answer five questions for a preliminary range — then follow up with our preconstruction team for project-specific pricing.
          </p>
        </div>
      </section>

      <section className={ps.section}>
        <div className={`${ps.sectionInner} ${est.embedWrap}`}>
          <RevealOnScroll>
            <div className={est.launchPanel}>
              <p className={est.launchLead}>
                Our Build Cost &amp; Fit Estimator walks you through five quick questions and returns a directional range based on your inputs.
              </p>
              <a href={ESTIMATOR_URL} target="_blank" rel="noopener noreferrer" className={ps.btnPrimary}>
                Start Your Estimate
              </a>
              <p className={est.fallbackLink}>
                Opens in a new tab — return here anytime to explore the rest of the site.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
