import { Link } from 'react-router-dom';
import { BetterPlannedPath } from '../../components/public/home/BetterPlannedPath';
import { ClientConcerns } from '../../components/public/home/ClientConcerns';
import { FeaturedWorkGrid } from '../../components/public/home/FeaturedWorkGrid';
import { PickYourPath } from '../../components/public/home/PickYourPath';
import { QualityLayersInteractive } from '../../components/public/home/QualityLayersInteractive';
import { WhatWeDo } from '../../components/public/home/WhatWeDo';
import { useSitePage } from '../../hooks/useSitePage';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { mergeHomeContent } from '../../data/homeContentDefaults';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import { isYouTubeUrl, parseYouTubeId, youTubeEmbedSrc } from '../../lib/youtube';
import homeStyles from './Home.module.css';

const DEFAULT_HERO_VIDEO = 'https://www.youtube.com/watch?v=PMeek4pvZOI';
const HERO_POSTER = '/assets/ph-arch-1.png';

export function Home() {
  const { page } = useSitePage('home');
  const content = mergeHomeContent(page?.content ?? getDemoPageContent('home'));
  const { hero } = content;

  const videoUrl = hero.video_url || DEFAULT_HERO_VIDEO;
  const youtubeId = isYouTubeUrl(videoUrl) ? parseYouTubeId(videoUrl) : null;
  const fileVideoSrc = !youtubeId && videoUrl.startsWith('/') ? videoUrl : !youtubeId ? videoUrl : null;

  const heroTitle = hero.title_emphasis
    ? <>{hero.title} <em>{hero.title_emphasis}</em></>
    : hero.title;

  const secondaryCtaUrl = hero.cta_secondary_url ?? '#featured-work';
  const secondaryCtaIsHash = secondaryCtaUrl.startsWith('#');

  return (
    <main className={homeStyles.homePage}>
      <PageMeta title={page?.meta_title ?? 'Build with Certainty | John Buchan Homes'} description={page?.meta_description} />

      <section className={homeStyles.heroLight}>
        <div className={homeStyles.heroCompact}>
          <h1 className={homeStyles.heroTitleLight}>{heroTitle}</h1>
        </div>
        <div className={homeStyles.heroMediaLarge}>
          {youtubeId ? (
            <div className={homeStyles.heroYoutube} aria-hidden>
              <iframe
                src={youTubeEmbedSrc(youtubeId)}
                title="John Buchan Homes"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          ) : fileVideoSrc ? (
            <video
              src={fileVideoSrc}
              poster={hero.image_url ?? HERO_POSTER}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden
            />
          ) : (
            <img src={hero.image_url ?? HERO_POSTER} alt="" />
          )}
        </div>
        <div className={homeStyles.heroBelow}>
          <p className={homeStyles.heroSubLight}>{hero.subtitle}</p>
          <div className={homeStyles.heroCtas}>
            <Link to={hero.cta_primary_url} className={homeStyles.btnPrimaryLight}>{hero.cta_primary_label}</Link>
            {secondaryCtaIsHash ? (
              <a href={secondaryCtaUrl} className={homeStyles.btnLinkLight}>{hero.cta_secondary_label ?? 'Explore Our Work'} <span>→</span></a>
            ) : (
              <Link to={secondaryCtaUrl} className={homeStyles.btnLinkLight}>{hero.cta_secondary_label ?? 'Explore Our Work'} <span>→</span></Link>
            )}
          </div>
        </div>
      </section>

      <section className={homeStyles.credibilityLine}>
        <p>{content.credibility_line}</p>
      </section>

      <FeaturedWorkGrid labels={content.featured_work} />

      <WhatWeDo section={content.what_we_do} />

      <ClientConcerns section={content.client_concerns} />

      <BetterPlannedPath section={content.better_planned_path} stages={content.process_stages} />

      <QualityLayersInteractive section={content.quality_layers} />

      <section className={homeStyles.sectionDark}>
        <div className={homeStyles.sectionInner}>
          <RevealOnScroll>
            <span className={homeStyles.eyebrowDark}>{content.testimonial_section.eyebrow}</span>
            <h2 className={homeStyles.sectionTitleDark} style={{ marginTop: 18, marginBottom: 40 }}>{content.testimonial_section.title}</h2>
            <blockquote className={homeStyles.testimonialSingle}>
              <p className={homeStyles.testimonialQuote}>&ldquo;{content.testimonial_section.quote}&rdquo;</p>
              <cite className={homeStyles.cite}>{content.testimonial_section.cite}</cite>
            </blockquote>
            <Link to={content.testimonial_section.cta_link} className={homeStyles.btnLinkDark} style={{ marginTop: 32, display: 'inline-flex' }}>
              {content.testimonial_section.cta_label} <span>→</span>
            </Link>
          </RevealOnScroll>
        </div>
      </section>

      <PickYourPath section={content.pick_your_path} />

      <section className={homeStyles.ctaSection}>
        <h2 className={homeStyles.sectionTitleDark}>{content.closing_cta.title}</h2>
        <div className={homeStyles.ctaButtons}>
          <Link to={content.closing_cta.primary_url} className={homeStyles.btnPrimaryDark}>{content.closing_cta.primary_label}</Link>
          <a href={content.closing_cta.phone_href} className={homeStyles.btnLinkDark}>{content.closing_cta.phone}</a>
        </div>
      </section>
    </main>
  );
}
