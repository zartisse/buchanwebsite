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
import { CREDIBILITY_LINE } from '../../data/iaContent';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import { isYouTubeUrl, parseYouTubeId, youTubeEmbedSrc } from '../../lib/youtube';
import homeStyles from './Home.module.css';

const DEFAULT_HERO_VIDEO = 'https://www.youtube.com/watch?v=PMeek4pvZOI';
const HERO_POSTER = '/assets/ph-arch-1.png';

export function Home() {
  const { page } = useSitePage('home');
  const content = page?.content ?? getDemoPageContent('home');
  const { hero, concierge } = content;

  const videoUrl = hero.video_url || DEFAULT_HERO_VIDEO;
  const youtubeId = isYouTubeUrl(videoUrl) ? parseYouTubeId(videoUrl) : null;
  const fileVideoSrc = !youtubeId && videoUrl.startsWith('/') ? videoUrl : !youtubeId ? videoUrl : null;

  const testimonial = content.testimonials_strip?.[0] ?? {
    quote: concierge.quote,
    cite: concierge.cite,
  };

  return (
    <main className={homeStyles.homePage}>
      <PageMeta title={page?.meta_title ?? 'Build with Certainty | John Buchan Homes'} description={page?.meta_description} />

      {/* 1. Hero */}
      <section className={homeStyles.heroLight}>
        <div className={homeStyles.heroCompact}>
          <h1 className={homeStyles.heroTitleLight}>Build with <em>Certainty.</em></h1>
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
          <p className={homeStyles.heroSubLight}>
            Thoughtful planning, experienced guidance, and exceptional construction for custom homes and remodels.
          </p>
          <div className={homeStyles.heroCtas}>
            <Link to="/contact" className={homeStyles.btnPrimaryLight}>Start a Conversation</Link>
            <Link to="#featured-work" className={homeStyles.btnLinkLight}>Explore Our Work <span>→</span></Link>
          </div>
        </div>
      </section>

      {/* 2. Credibility line */}
      <section className={homeStyles.credibilityLine}>
        <p>{CREDIBILITY_LINE}</p>
      </section>

      {/* 3. Featured Work */}
      <FeaturedWorkGrid />

      {/* 4. What We Do */}
      <WhatWeDo />

      {/* 5. Client concerns */}
      <ClientConcerns />

      {/* 6. Better-Planned Path */}
      <BetterPlannedPath />

      {/* 7. Quality in Every Layer */}
      <QualityLayersInteractive />

      {/* 8. Client proof — one testimonial */}
      <section className={homeStyles.sectionDark}>
        <div className={homeStyles.sectionInner}>
          <RevealOnScroll>
            <span className={homeStyles.eyebrowDark}>Client Testimonials</span>
            <h2 className={homeStyles.sectionTitleDark} style={{ marginTop: 18, marginBottom: 40 }}>In their words.</h2>
            <blockquote className={homeStyles.testimonialSingle}>
              <p className={homeStyles.testimonialQuote}>&ldquo;{testimonial.quote}&rdquo;</p>
              <cite className={homeStyles.cite}>{testimonial.cite}</cite>
            </blockquote>
            <Link to="/testimonials" className={homeStyles.btnLinkDark} style={{ marginTop: 32, display: 'inline-flex' }}>
              All client stories <span>→</span>
            </Link>
          </RevealOnScroll>
        </div>
      </section>

      {/* 9. Pick Your Path */}
      <PickYourPath />

      {/* 10. Closing CTA */}
      <section className={homeStyles.ctaSection}>
        <h2 className={homeStyles.sectionTitleDark}>Ready to Build with Certainty?</h2>
        <div className={homeStyles.ctaButtons}>
          <Link to="/contact" className={homeStyles.btnPrimaryDark}>Start a Conversation</Link>
          <a href="tel:4258272266" className={homeStyles.btnLinkDark}>425.827.2266</a>
        </div>
      </section>
    </main>
  );
}
