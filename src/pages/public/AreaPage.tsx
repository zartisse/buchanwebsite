import { Link, Navigate, useParams } from 'react-router-dom';
import { useProperties } from '../../hooks/useProperties';
import { PageMeta } from '../../components/ui/PageMeta';
import { PageCta } from '../../components/ui/PageCta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { PortfolioPropertyCard } from '../../components/public/PortfolioPropertyCard';
import { AREA_PAGES, findArea } from '../../data/areas';
import { PROCESS_STAGES } from '../../data/iaContent';
import { JsonLd } from '../../components/ui/JsonLd';
import ps from '../../styles/pages.module.css';

/** Local landing page: /areas-we-serve/:area (e.g. /areas-we-serve/medina). */
export function AreaPage() {
  const { area: slug } = useParams();
  const area = findArea(slug);
  const { properties, loading } = useProperties({ publicOnly: true });

  if (!area) return <Navigate to="/areas-we-serve" replace />;

  const local = properties.filter((p) => p.city?.trim().toLowerCase() === area.name.toLowerCase());
  const nearby = properties.filter((p) => !local.includes(p)).slice(0, 3);
  const others = AREA_PAGES.filter((a) => a.slug !== area.slug);

  return (
    <main>
      <PageMeta
        title={`Custom Homes & Renovations in ${area.name}, WA`}
        description={`Custom home building and major renovations in ${area.name}, WA, from family-owned John Buchan Homes. One team from planning through warranty, serving Bellevue & the Greater Eastside.`}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: 'Custom home building and major renovations',
          provider: { '@type': 'HomeAndConstructionBusiness', name: 'John Buchan Homes', telephone: '+1-425-827-2266' },
          areaServed: { '@type': 'City', name: `${area.name}, WA` },
        }}
      />

      <section className={ps.hero}>
        <div className={ps.heroInner}>
          <span className={ps.eyebrow}>Areas we serve · {area.name}</span>
          <h1 className={ps.heroTitle}>
            Custom homes &amp; renovations
            <br />
            <em>in {area.name}.</em>
          </h1>
          <p className={ps.bodyText} style={{ maxWidth: 640 }}>
            John Buchan Homes builds custom homes and major renovations in {area.name} and across Bellevue &amp; the
            Greater Eastside. One family-owned team carries your project from the first conversation and budget
            planning through construction and warranty care.
          </p>
          <div className={ps.ctaButtons} style={{ marginTop: 8 }}>
            <Link to={`/contact?service=I want to build a custom home#inquiry`} className="btnPrimaryFill">Start a conversation</Link>
            <a href="tel:4258272266" className={ps.btnLink}>Call 425.827.2266 <span>→</span></a>
          </div>
        </div>
      </section>

      <section className={ps.section}>
        <div className={ps.sectionInner}>
          <span className={ps.eyebrow}>{local.length ? `Our work in ${area.name}` : 'Recent work nearby'}</span>
          <h2 className={ps.sectionTitle} style={{ margin: '16px 0 40px' }}>
            {local.length ? `Homes we've built in ${area.name}` : 'Homes we have built on the Eastside'}
          </h2>
          {loading ? (
            <p className={ps.bodyText}>Loading projects…</p>
          ) : (
            <div className={ps.cardGrid}>
              {(local.length ? local : nearby).map((p) => (
                <RevealOnScroll key={p.id}>
                  <PortfolioPropertyCard property={p} />
                </RevealOnScroll>
              ))}
            </div>
          )}
          <Link to="/portfolio" className={ps.btnLink} style={{ marginTop: 32 }}>View the full portfolio <span>→</span></Link>
        </div>
      </section>

      <section className={ps.sectionAlt}>
        <div className={ps.sectionInner}>
          <span className={ps.eyebrow}>How we work in {area.name}</span>
          <h2 className={ps.sectionTitle} style={{ margin: '16px 0 32px' }}>One team, four clear stages.</h2>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 32 }}>
            {PROCESS_STAGES.map((s) => (
              <li key={s.n}>
                <span className={ps.cardLabel}>{s.n}</span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, margin: '8px 0' }}>{s.title}</h3>
                <p className={ps.bodyText} style={{ fontSize: 16 }}>{s.description}</p>
              </li>
            ))}
          </ol>
          <p className={ps.bodyText} style={{ marginTop: 32, maxWidth: 680 }}>
            We coordinate permitting and inspections with {area.name}&apos;s building department as part of the
            preconstruction work, so the schedule and budget account for local requirements from the start.
          </p>
        </div>
      </section>

      <section className={ps.section}>
        <div className={ps.sectionInner}>
          <span className={ps.eyebrow}>Other areas we serve</span>
          <div className={ps.areaChips} style={{ marginTop: 20 }}>
            {others.map((a) => (
              <Link key={a.slug} to={`/areas-we-serve/${a.slug}`} className={ps.areaChip} style={{ textDecoration: 'none' }}>
                {a.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PageCta title={`Planning a home in ${area.name}?`} subtitle="Let's talk about your property, your goals and a realistic budget range." />
    </main>
  );
}
