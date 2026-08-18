import { Link } from 'react-router-dom';
import { BetterPlannedPath } from '../../components/public/home/BetterPlannedPath';
import { ClientConcerns } from '../../components/public/home/ClientConcerns';
import { DifferenceSection } from '../../components/public/home/DifferenceSection';
import { FeaturedWorkGrid } from '../../components/public/home/FeaturedWorkGrid';
import { PickYourPath } from '../../components/public/home/PickYourPath';
import { PreconstructionBand } from '../../components/public/home/PreconstructionBand';
import { QualityLayersInteractive } from '../../components/public/home/QualityLayersInteractive';
import { TestimonialStrip } from '../../components/public/home/TestimonialStrip';
import { WhatWeDo } from '../../components/public/home/WhatWeDo';
import { useSitePage } from '../../hooks/useSitePage';
import { PageMeta } from '../../components/ui/PageMeta';
import { mergeHomeContent } from '../../data/homeContentDefaults';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import { assetUrl } from '../../lib/assets';
import homeStyles from './Home.module.css';

function HeroCta({ url, label, className }: { url: string; label: string; className: string }) {
  if (url.startsWith('#')) {
    return <a href={url} className={className}>{label}</a>;
  }
  if (url.startsWith('http')) {
    return <a href={url} className={className} target="_blank" rel="noopener noreferrer">{label}</a>;
  }
  return <Link to={url} className={className}>{label}</Link>;
}

export function Home() {
  const { page } = useSitePage('home');
  const rawContent = page?.content ?? getDemoPageContent('home');
  const content = mergeHomeContent(rawContent);
  const { hero } = content;

  const heroTitle = hero.title_emphasis
    ? <>{hero.title} <em>{hero.title_emphasis}</em></>
    : hero.title;

  const stats = content.credibility_stats?.length
    ? content.credibility_stats
    : content.credibility_line.split('|').map((s) => ({ label: s.trim() })).filter((s) => s.label);

  return (
    <main className={homeStyles.homePage}>
      <PageMeta title={page?.meta_title ?? 'Build with Certainty | John Buchan Homes'} description={page?.meta_description} />

      <section className={homeStyles.heroOverlay}>
        <div className={homeStyles.heroMedia} aria-hidden>
          <img src={assetUrl(hero.image_url ?? '/assets/ph-arch-1.png')} alt="" />
        </div>
        <div className={homeStyles.heroScrim} aria-hidden />
        <div className={homeStyles.heroContent}>
          <h1 className={homeStyles.heroTitle}>{heroTitle}</h1>
          <p className={homeStyles.heroSub}>{hero.subtitle}</p>
          <div className={homeStyles.heroCtas}>
            <HeroCta url={hero.cta_primary_url} label={hero.cta_primary_label} className="btnPrimaryFill" />
            {hero.cta_secondary_url && hero.cta_secondary_label && (
              <HeroCta
                url={hero.cta_secondary_url}
                label={hero.cta_secondary_label}
                className="btnGhostLight"
              />
            )}
          </div>
        </div>
      </section>

      <section className={homeStyles.trustBar} aria-label="Company credentials">
        {stats.map((stat, i) => (
          <span key={stat.label} style={{ display: 'contents' }}>
            {i > 0 && <span className={homeStyles.trustDivider} aria-hidden />}
            <span className={homeStyles.trustItem}>{stat.label}</span>
          </span>
        ))}
      </section>

      <FeaturedWorkGrid labels={content.featured_work} />

      <DifferenceSection section={content.difference_section} />

      <WhatWeDo section={content.what_we_do} />

      <PreconstructionBand band={content.what_we_do.preconstruction} />

      <BetterPlannedPath section={content.better_planned_path} stages={content.process_stages} />

      <QualityLayersInteractive section={content.quality_layers} />

      <TestimonialStrip section={content.testimonial_section} />

      <ClientConcerns section={content.client_concerns} />

      <PickYourPath section={content.pick_your_path} />

      <section className={homeStyles.closingCta}>
        <div className={homeStyles.closingCtaBg} aria-hidden>
          <img src={assetUrl(content.closing_cta.background_image_url ?? '/assets/ph-arch-1.png')} alt="" />
        </div>
        <div className={homeStyles.closingCtaOverlay} aria-hidden />
        <div className={homeStyles.closingCtaInner}>
          <h2 className={homeStyles.closingCtaTitle}>{content.closing_cta.title}</h2>
          {content.closing_cta.subtitle && (
            <p className={homeStyles.closingCtaSub}>{content.closing_cta.subtitle}</p>
          )}
          <div className={homeStyles.closingCtaActions}>
            <Link to={content.closing_cta.primary_url} className="btnPrimaryFill">{content.closing_cta.primary_label}</Link>
            <a href={content.closing_cta.phone_href} className={homeStyles.closingCtaPhone}>
              <span className={homeStyles.closingCtaPhonePrefix}>or call </span>{content.closing_cta.phone}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
