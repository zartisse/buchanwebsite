import type { HubPage } from '../../types';
import { EstimatorLink } from '../ui/EstimatorLink';
import { PageMeta } from '../ui/PageMeta';
import { PageCta } from '../ui/PageCta';
import { RevealOnScroll } from '../ui/RevealOnScroll';
import { HeroTitle } from '../ui/HeroTitle';
import { ESTIMATOR_URL } from '../../lib/estimator';
import { resolveImageUrl } from '../../lib/placeholders';
import ps from '../../styles/pages.module.css';
import hs from './HubPage.module.css';

export function HubPage({ page }: { page: HubPage }) {
  const data = page.content;
  const ctaTo = data.ctaLink ?? '/contact';
  const ctaBg = data.cta_background_image_url ?? data.hero.image_url ?? '/assets/ph-arch-1.png';
  const isExternal = ctaTo.startsWith('tel:') || ctaTo.startsWith('http');

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
              <img src={resolveImageUrl(data.hero.image_url, page.slug)} alt="" />
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
                      <img src={resolveImageUrl(section.image_url, section.title)} alt="" />
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

      {isExternal ? (
        <section className={ps.ctaPhoto}>
          <div className={ps.ctaPhotoBg} aria-hidden>
            <img src={resolveImageUrl(ctaBg, `${page.slug}-cta`)} alt="" />
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
