import { useEffect, useId, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSitePage } from '../../hooks/useSitePage';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { EstimatorLink } from '../../components/ui/EstimatorLink';
import { PageCta } from '../../components/ui/PageCta';
import { ArrowIcon } from '../../components/public/landing/ArrowLink';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import { PROCESS_INTRO, PROCESS_PHASES } from '../../data/buchanProcess';
import { assetUrl } from '../../lib/assets';
import { resolveImageUrl } from '../../lib/placeholders';
import styles from './Process.module.css';

const HERO_IMAGE = '/assets/photos/clyde-hill-46.webp';

/** Thin line icons, one per phase. */
function PhaseIcon({ n }: { n: string }) {
  const common = { width: 44, height: 44, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 0.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  switch (n) {
    case '1':
      return (
        <svg {...common}>
          <path d="M8 4 4.5 11h2.2L3.5 17h9L9.3 11h2.2z" />
          <path d="M8 17v3M17 7l-3.2 6h2L13 19h8l-2.8-6h2z" />
          <path d="M17 19v2" />
        </svg>
      );
    case '2':
      return (
        <svg {...common}>
          <circle cx="12" cy="4.6" r="1.6" />
          <path d="M12 6.2 6 21M12 6.2 18 21M8.7 15h6.6" />
        </svg>
      );
    case '3':
      return (
        <svg {...common}>
          <path d="M3.5 10.5 12 3.5l8.5 7V20h-17z" />
          <path d="M12 3.5V20M3.5 10.5 12 14l8.5-3.5" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="7" cy="17" r="3.4" />
          <path d="M9.4 14.6 20 4M16 8l2.6 2.6M13.5 10.5l2 2" />
        </svg>
      );
  }
}

export function Process() {
  const { page } = useSitePage('process');
  const content = page?.content ?? getDemoPageContent('process');
  const { hash } = useLocation();
  const baseId = useId();

  const [phaseIdx, setPhaseIdx] = useState(0);
  const [openStep, setOpenStep] = useState<string | null>(PROCESS_PHASES[0].steps[0].n);

  const phase = PROCESS_PHASES[phaseIdx];

  // Deep links: /process#phase-03 selects that phase.
  useEffect(() => {
    const m = hash.match(/^#phase-0?(\d)$/);
    if (!m) return;
    const i = PROCESS_PHASES.findIndex((p) => p.n === m[1]);
    if (i >= 0) {
      setPhaseIdx(i);
      setOpenStep(PROCESS_PHASES[i].steps[0].n);
      window.setTimeout(() => document.getElementById('process-steps')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    }
  }, [hash]);

  const choosePhase = (i: number) => {
    setPhaseIdx(i);
    setOpenStep(PROCESS_PHASES[i].steps[0].n);
  };

  return (
    <main>
      <PageMeta title={page?.meta_title ?? 'Our Building Process'} description={page?.meta_description} />

      <section className={styles.hero}>
        <img src={assetUrl(HERO_IMAGE)} alt="" className={styles.heroImg} width={1600} height={1067} fetchPriority="high" />
        <div className={styles.heroScrim} aria-hidden />
        <div className={styles.heroInner}>
          <p className={styles.eyebrowLight}>Our process</p>
          <h1 className={styles.heroTitle}>A guided <em>journey.</em></h1>
          <p className={styles.heroSub}>
            A clear, collaborative process that gives you confidence at every step, from first conversation to
            years in your new home.
          </p>
        </div>
      </section>

      <section className={styles.body}>
        <div className={styles.inner}>
          <RevealOnScroll>
            <div className={styles.tabsShell}>
              <div className={styles.tabs} role="tablist" aria-label="Process phases">
                {PROCESS_PHASES.map((p, i) => (
                  <button
                    key={p.n}
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${p.n}`}
                    aria-selected={i === phaseIdx}
                    aria-controls={`${baseId}-panel`}
                    className={`${styles.tab} ${i === phaseIdx ? styles.tabActive : ''}`}
                    onClick={() => choosePhase(i)}
                  >
                    <span className={styles.tabIcon}><PhaseIcon n={p.n} /></span>
                    <span className={styles.tabPhase}>Phase {p.n}</span>
                    <span className={styles.tabTitle}>{p.title}</span>
                    <span className={styles.tabSteps}>
                      {p.steps.length} steps <ArrowIcon size={14} />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          <div id="process-steps" className={styles.panelWrap}>
            <div id={`phase-0${phase.n}`} className={styles.anchor} />
            <div id="custom-homes" className={styles.anchor} />
            <RevealOnScroll>
              <p className={styles.intro}>{PROCESS_INTRO}</p>
            </RevealOnScroll>

            <div
              id={`${baseId}-panel`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${phase.n}`}
              className={styles.panel}
              key={phase.n}
            >
              <div className={styles.panelHead}>
                <span className={styles.panelKicker}>Phase {phase.n}</span>
                <h2 className={styles.panelTitle}>{phase.title}</h2>
                <p className={styles.panelIntro}>{phase.intro}</p>
              </div>

              <ol className={styles.steps}>
                {phase.steps.map((step) => {
                  const open = openStep === step.n;
                  const bodyId = `${baseId}-step-${step.n}`;
                  return (
                    <li key={step.n} className={`${styles.step} ${open ? styles.stepOpen : ''}`}>
                      <h3 className={styles.stepHead}>
                        <button
                          type="button"
                          className={styles.stepBtn}
                          aria-expanded={open}
                          aria-controls={bodyId}
                          onClick={() => setOpenStep(open ? null : step.n)}
                        >
                          <span className={`${styles.stepNum} tabularNums`}>{step.n}</span>
                          <span className={styles.stepTitle}>{step.title}</span>
                          <span className={styles.chevron} aria-hidden>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="m4 7 5 5 5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </span>
                        </button>
                      </h3>
                      <div id={bodyId} className={styles.stepBody} role="region" aria-labelledby={undefined} inert={!open}>
                        <div className={styles.stepBodyInner}>
                          {step.body.map((para) => <p key={para.slice(0, 28)}>{para}</p>)}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <RevealOnScroll>
            <div className={styles.estimate}>
              <div>
                <strong className={styles.estimateTitle}>Estimate my project</strong>
                <p className={styles.estimateText}>Get a personalized cost range before your first conversation.</p>
              </div>
              <EstimatorLink className="btnPrimaryFill">Estimate my project</EstimatorLink>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section id="renovations" className={styles.band}>
        <img
          src={resolveImageUrl(content.band_image_url ?? '/assets/ph-arch-2.webp', 'process-band')}
          alt=""
          className={styles.bandImg}
          loading="lazy"
          decoding="async"
        />
        <div className={styles.bandScrim} aria-hidden />
        <RevealOnScroll>
          <div className={styles.bandInner}>
            <h2 className={styles.bandTitle}>{content.band_title ?? 'One aligned team, chosen for your home.'}</h2>
            <p className={styles.bandText}>
              {content.band_body ?? 'We collaborate with independent architects on every project and interior designers on most. Buchan provides estimating, constructability review, schedule planning, coordination, and construction leadership from the early stages.'}
            </p>
          </div>
        </RevealOnScroll>
      </section>

      <PageCta
        title={content.cta_title}
        backgroundImage={resolveImageUrl(content.cta_background_image_url ?? content.band_image_url ?? '/assets/ph-arch-2.webp', 'process-cta')}
      />
    </main>
  );
}
