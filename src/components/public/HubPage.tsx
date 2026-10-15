import type { ReactNode } from 'react';
import type { HubPage } from '../../types';
import { EstimatorLink } from '../ui/EstimatorLink';
import { PageMeta } from '../ui/PageMeta';
import { PageCta } from '../ui/PageCta';
import { RevealOnScroll } from '../ui/RevealOnScroll';
import { HeroTitle } from '../ui/HeroTitle';
import { ESTIMATOR_URL } from '../../lib/estimator';
import { OptimizedImage } from '../ui/OptimizedImage';
import { RenovationInquiryForm } from './RenovationInquiryForm';
import ps from '../../styles/pages.module.css';
import hs from './HubPage.module.css';

function HubCtaPrimaryButton({ to, className, children }: { to: string; className: string; children: ReactNode }) {
  if (to.startsWith('#')) {
    return (
      <a href={to} className={className}>
        {children}
      </a>
    );
  }
  if (to.startsWith('tel:') || to.startsWith('http')) {
    return (
      <a href={to} className={className} target={to.startsWith('http') ? '_blank' : undefined} rel={to.startsWith('http') ? 'noopener noreferrer' : undefined}>
        {children}
      </a>
    );
  }
  return (
    <a href={to} className={className}>
      {children}
    </a>
  );
}

export function HubPage({ page }: { page: HubPage }) {
  const data = page.content;
  const ctaTo = data.ctaLink ?? '/contact';
  const ctaBg = data.cta_background_image_url ?? data.hero.image_url ?? '/assets/ph-arch-1.png';
  const isExternal = ctaTo.startsWith('tel:') || ctaTo.startsWith('http');
  const isHashCta = ctaTo.startsWith('#');
  const pdfUrl = data.process_pdf_url;
  const pdfTitle = data.process_pdf_title ?? 'Renovation process overview';

  return (
    <main>
      <PageMeta title={page.meta_title} description={page.meta_description} />
      <section className={ps.hero}>
        <div className={ps.heroInner}>
          <span className={ps.eyebrow}>{data.hero.eyebrow}</span>
          <HeroTitle hero={{ eyebrow: data.hero.eyebrow, title: data.hero.title, title_emphasis: data.hero.titleEmphasis }} />
          {data.hero.subtitle && <p className={ps.bodyText} style={{ marginTop: 8, maxWidth: 640 }}>{data.hero.subtitle}</p>}
          {data.hero.image_url && (
            <div className={hs.heroMedia}>
              <OptimizedImage src={data.hero.image_url} seed={page.slug} priority />
            </div>
          )}
        </div>
      </section>

      {data.intro && (
        <section className={ps.sectionAlt}>
          <RevealOnScroll>
            <p className={ps.bodyText} style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>{data.intro}</p>
          </RevealOnScroll>
        </section>
      )}

      <section className={ps.section}>
        <div className={ps.sectionInner}>
          <div className={hs.sectionsStack}>
            {data.sections.map((section, i) => (
              <RevealOnScroll key={section.title + i}>
                <div
                  id={page.slug === 'renovations' && i === 0 ? 'what-we-renovate' : undefined}
                  className={`${hs.sectionRow} ${section.image_url ? hs.sectionRowHasImage : ''}`}
                >
                  <div>
                    <h2 className={hs.sectionHeading}>{section.title}</h2>
                    <p className={ps.bodyText}>{section.body}</p>
                    {section.bullets && (
                      <ul className={hs.bulletList}>
                        {section.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {section.image_url && (
                    <div className={hs.sectionImage}>
                      <OptimizedImage src={section.image_url} seed={section.title} />
                    </div>
                  )}
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {page.slug === 'areas-we-serve' && data.service_areas && data.service_areas.length > 0 && (
        <section className={ps.sectionAlt}>
          <div className={ps.sectionInner}>
            <div className={ps.areaChips}>
              {data.service_areas.map((area) => (
                <span key={area} className={ps.areaChip}>{area}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.slug === 'renovations' && pdfUrl && (
        <section className={ps.sectionAlt}>
          <RevealOnScroll>
            <div className={ps.sectionInner}>
              <span className={ps.eyebrow}>Process overview</span>
              <h2 className={ps.sectionTitle} style={{ marginTop: 16 }}>{pdfTitle}</h2>
              <p className={ps.bodyText} style={{ marginTop: 12, maxWidth: 640 }}>
                Preview the step-by-step process you will follow with Buchan, or download a copy to share with your household.
              </p>
              <div className={hs.pdfActions}>
                <a href={pdfUrl} download className={ps.btnPrimary}>
                  Download PDF
                </a>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={ps.btnGhost}>
                  Open in new tab
                </a>
              </div>
              <div className={hs.pdfPreviewWrap}>
                <iframe
                  title={pdfTitle}
                  src={pdfUrl}
                  className={hs.pdfPreviewFrame}
                />
              </div>
              <p className={ps.bodyText} style={{ marginTop: 12, fontSize: '0.9rem' }}>
                If the preview does not load in your browser, use Download PDF or Open in new tab.
              </p>
            </div>
          </RevealOnScroll>
        </section>
      )}

      {page.slug === 'renovations' && (
        <section id="renovation-inquiry" className={ps.section}>
          <RevealOnScroll>
            <div className={ps.formGrid}>
              <div>
                <span className={ps.eyebrow}>Start your project</span>
                <h2 className={ps.sectionTitle} style={{ marginTop: 16 }}>Tell us about your renovation</h2>
                <p className={ps.bodyText} style={{ marginTop: 12, maxWidth: 520 }}>
                  Share location, goals, and timing so we can respond with the right next steps for your home.
                </p>
              </div>
              <div>
                <RenovationInquiryForm />
              </div>
            </div>
          </RevealOnScroll>
        </section>
      )}

      {isExternal ? (
        <section className={ps.ctaPhoto}>
          <div className={ps.ctaPhotoBg} aria-hidden>
            <OptimizedImage src={ctaBg} seed={`${page.slug}-cta`} />
          </div>
          <div className={ps.ctaPhotoOverlay} aria-hidden />
          <div className={ps.ctaPhotoInner}>
            <h2 className={ps.sectionTitle}>{data.ctaTitle}</h2>
            <div className={ps.ctaButtons}>
              <a
                href={ctaTo}
                target={ctaTo === ESTIMATOR_URL ? '_blank' : undefined}
                rel={ctaTo === ESTIMATOR_URL ? 'noopener noreferrer' : undefined}
                className="btnPrimaryFill"
              >
                {ctaTo === ESTIMATOR_URL ? 'Open Cost Estimator' : 'Start a Conversation'}
              </a>
              {ctaTo !== ESTIMATOR_URL && (
                <EstimatorLink className="btnGhostLight">Cost Estimator</EstimatorLink>
              )}
            </div>
          </div>
        </section>
      ) : isHashCta ? (
        <section className={ps.ctaPhoto}>
          <div className={ps.ctaPhotoBg} aria-hidden>
            <OptimizedImage src={ctaBg} seed={`${page.slug}-cta`} />
          </div>
          <div className={ps.ctaPhotoOverlay} aria-hidden />
          <div className={ps.ctaPhotoInner}>
            <h2 className={ps.sectionTitle}>{data.ctaTitle}</h2>
            <div className={ps.ctaButtons}>
              <HubCtaPrimaryButton to={ctaTo} className="btnPrimaryFill">
                Start your renovation inquiry
              </HubCtaPrimaryButton>
              <EstimatorLink className="btnGhostLight">Cost Estimator</EstimatorLink>
            </div>
          </div>
        </section>
      ) : (
        <PageCta
          title={data.ctaTitle}
          primaryUrl={ctaTo}
          backgroundImage={ctaBg}
        >
          <EstimatorLink className="btnGhostLight">Cost Estimator</EstimatorLink>
        </PageCta>
      )}
    </main>
  );
}
