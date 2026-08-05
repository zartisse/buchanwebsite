import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProcessTimeline } from '../../components/public/ProcessTimeline';
import { useProperties } from '../../hooks/useProperties';
import { useSitePage } from '../../hooks/useSitePage';
import { useSubmissions } from '../../hooks/useSubmissions';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import {
  CREDIBILITY_ITEMS, JOURNEY_PATHS, PROCESS_STAGES, WHY_CHOOSE_VALUES,
} from '../../data/iaContent';
import type { JourneyPathItem } from '../../data/iaContent';
import { SERVICE_AREAS } from '../../data/navigation';
import { resolveImageUrl } from '../../lib/placeholders';
import { isYouTubeUrl, parseYouTubeId, youTubeEmbedSrc } from '../../lib/youtube';
import homeStyles from './Home.module.css';

const JOURNEY_GROUPS: { label: string; group: JourneyPathItem['group'] }[] = [
  { label: 'Start here', group: 'anchor' },
  { label: 'Common paths', group: 'core' },
  { label: 'Also exploring', group: 'secondary' },
];

function getFeaturedProperties(properties: ReturnType<typeof useProperties>['properties']) {
  const featured = properties
    .filter((p) => p.featured && p.status !== 'Draft')
    .sort((a, b) => (a.featured_order ?? 0) - (b.featured_order ?? 0))
    .slice(0, 3);
  return featured.length > 0 ? featured : properties.filter((p) => p.status !== 'Draft').slice(0, 3);
}

export function Home() {
  const { page } = useSitePage('home');
  const { properties } = useProperties({ publicOnly: true });
  const { createSubmission } = useSubmissions();
  const content = page?.content ?? getDemoPageContent('home');
  const featured = getFeaturedProperties(properties);
  const availableSpotlight = properties.find((p) => p.status === 'Available') ?? properties.find((p) => p.status === 'Coming Soon');

  const handleMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    await createSubmission({
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      phone: '',
      subject: 'Message from homepage',
      message: String(fd.get('message') ?? ''),
      source: 'Home page',
    });
    form.reset();
    const msg = form.querySelector('[data-formmsg]') as HTMLElement;
    if (msg) {
      msg.style.display = 'block';
      msg.textContent = 'Thank you — we will be in touch within one business day.';
    }
    form.querySelectorAll('input, textarea, button').forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });
  };

  const [showAllPaths, setShowAllPaths] = useState(false);

  const { hero, concierge, quality_gallery, testimonials_strip, services } = content;
  const galleryImages = quality_gallery?.length ? quality_gallery : [
    { image_url: '/assets/ph-arch-1.png', caption: 'Hand-chosen framing' },
    { image_url: '/assets/ph-arch-2.png', caption: 'Built for the rain' },
    { image_url: '/assets/ph-arch-3.png', caption: 'Quieter by design' },
    { image_url: '/assets/ph-arch-4.png', caption: 'The extra mile' },
  ];
  const testimonialQuotes = testimonials_strip?.length ? testimonials_strip : [
    { quote: concierge.quote, cite: concierge.cite },
  ];
  const youtubeId = hero.video_url && isYouTubeUrl(hero.video_url) ? parseYouTubeId(hero.video_url) : null;

  const numberedPaths = JOURNEY_PATHS.map((item, i) => ({
    ...item,
    index: String(i + 1).padStart(2, '0'),
  }));

  const visibleGroups = JOURNEY_GROUPS.filter(({ group }) => showAllPaths || group !== 'secondary');

  const renderPathRow = (item: typeof numberedPaths[number], featured?: boolean) => {
    const rowClass = `${homeStyles.pathRow} ${featured ? homeStyles.pathRowFeatured : ''}`;
    const rowContent = (
      <>
        <span className={homeStyles.pathIndex}>{item.index}</span>
        {item.image_url && (
          <img
            src={resolveImageUrl(item.image_url, item.title)}
            alt=""
            className={featured ? homeStyles.pathThumbLarge : homeStyles.pathThumb}
          />
        )}
        <div className={homeStyles.pathCopy}>
          <strong>{item.title}</strong>
          <span>{item.description}</span>
        </div>
        <span className={homeStyles.pathArrow} aria-hidden>→</span>
      </>
    );
    return item.external ? (
      <a key={item.title} href={item.link} target="_blank" rel="noopener noreferrer" className={rowClass} data-cursor>
        {rowContent}
      </a>
    ) : (
      <Link key={item.title} to={item.link} className={rowClass} data-cursor>
        {rowContent}
      </Link>
    );
  };

  return (
    <main className={homeStyles.homePage}>
      <PageMeta title={page?.meta_title ?? 'Build with Certainty | John Buchan Homes'} description={page?.meta_description} />

      {/* Hero — editorial light */}
      <section className={homeStyles.heroLight}>
        <div className={homeStyles.heroInner}>
          <span className={homeStyles.eyebrowLight}>{hero.eyebrow}</span>
          <h1 className={homeStyles.heroTitleLight}>{hero.title}<br /><em>{hero.title_emphasis}</em></h1>
          <div className={homeStyles.heroMedia}>
            {youtubeId ? (
              <div className={homeStyles.heroYoutube} aria-hidden>
                <iframe
                  src={youTubeEmbedSrc(youtubeId)}
                  title="John Buchan Homes"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            ) : hero.video_url ? (
              <video src={hero.video_url} poster={hero.image_url} autoPlay muted loop playsInline aria-hidden />
            ) : (
              <img src={hero.image_url} alt="" />
            )}
          </div>
        </div>
        <div className={homeStyles.heroBelow}>
          <p className={homeStyles.heroSubLight}>{hero.subtitle}</p>
          <div className={homeStyles.heroCtas}>
            <Link to="/custom-homes" data-cursor className={homeStyles.btnPrimaryLight}>Plan My Custom Home</Link>
            <Link to="/property-feasibility" data-cursor className={homeStyles.btnLinkLight}>Evaluate My Property <span>→</span></Link>
          </div>
        </div>
      </section>

      {/* Credibility strip */}
      <section className={`${homeStyles.credibility} ${homeStyles.textureBand}`}>
        {CREDIBILITY_ITEMS.map((item) => (
          <span key={item} className={homeStyles.credItem}>{item}</span>
        ))}
      </section>

      {/* Three ways to build — photo row */}
      {services && (
        <section className={homeStyles.sectionWhite}>
          <div className={homeStyles.sectionInner}>
            <RevealOnScroll>
              <span className={homeStyles.eyebrow}>{services.eyebrow}</span>
              <h2 className={homeStyles.sectionTitle} style={{ marginTop: 18, marginBottom: 40 }}>
                {services.title}<br /><em>{services.title_emphasis}</em>
              </h2>
            </RevealOnScroll>
            <div className={homeStyles.servicesGrid}>
              {services.items.map((s) => (
                <RevealOnScroll key={s.title}>
                  <Link to={s.link ?? '#'} className={homeStyles.serviceCard} data-cursor>
                    <div className={homeStyles.serviceImgWrap}>
                      <img src={resolveImageUrl(s.image_url, s.title)} alt="" />
                    </div>
                    <strong>{s.title}</strong>
                    <span>{s.description}</span>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quality in Every Layer — moved up for photo rhythm */}
      <section className={homeStyles.sectionCream}>
        <div className={homeStyles.sectionInner}>
          <RevealOnScroll>
            <span className={homeStyles.eyebrow}>Quality in Every Layer</span>
            <h2 className={homeStyles.sectionTitle} style={{ marginTop: 18, marginBottom: 32 }}>Behind the walls.</h2>
          </RevealOnScroll>
          <div className={homeStyles.workGrid}>
            {galleryImages.map((item) => (
              <RevealOnScroll key={item.image_url + item.caption}>
                <div className={homeStyles.workImgWrap} style={{ marginBottom: 0 }}>
                  <img src={resolveImageUrl(item.image_url, item.caption)} alt={item.caption ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                {item.caption && <span className={homeStyles.galleryCaption}>{item.caption}</span>}
              </RevealOnScroll>
            ))}
          </div>
          <Link to="/portfolio" className={homeStyles.btnLinkLight} style={{ marginTop: 32, display: 'inline-flex' }}>See finished work <span>→</span></Link>
        </div>
      </section>

      {/* Choose Your Starting Point — condensed */}
      <section className={`${homeStyles.sectionWhite} ${homeStyles.textureBand}`}>
        <div className={homeStyles.sectionInner}>
          <RevealOnScroll>
            <span className={homeStyles.eyebrow}>Choose Your Starting Point</span>
            <h2 className={homeStyles.sectionTitle} style={{ marginTop: 18 }}>Where are you<br /><em>in the journey?</em></h2>
          </RevealOnScroll>
          <div className={homeStyles.pathList}>
            {visibleGroups.map(({ label, group }) => {
              const items = numberedPaths.filter((p) => p.group === group);
              if (!items.length) return null;
              return (
                <div key={group} className={homeStyles.pathGroup}>
                  <h3 className={homeStyles.pathGroupLabel}>{label}</h3>
                  {items.map((item, i) => renderPathRow(item, group === 'anchor' && i === 0))}
                </div>
              );
            })}
          </div>
          {!showAllPaths && (
            <div style={{ marginTop: 24 }}>
              <button type="button" className={homeStyles.pathExpandBtn} onClick={() => setShowAllPaths(true)}>
                View all paths
              </button>
              <Link to="/property-feasibility" className={homeStyles.btnLinkLight} style={{ marginLeft: 24, display: 'inline-flex' }}>
                Explore property options <span>→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Know Before You Build */}
      <section className={homeStyles.sectionCream}>
        <RevealOnScroll>
          <div className={homeStyles.splitBlockWithImage}>
            <div>
              <span className={homeStyles.eyebrow}>Know Before You Build</span>
              <h2 className={homeStyles.sectionTitle} style={{ marginTop: 18 }}>Preconstruction<br /><em>first.</em></h2>
              <p className={homeStyles.bodyText} style={{ marginTop: 20 }}>Progressive estimates, feasibility, and design alignment — for custom homes and major renovations alike.</p>
              <ul className={homeStyles.bulletList}>
                <li>Feasibility & constructability review</li>
                <li>Progressive budget ranges</li>
                <li>Design coordination before breaking ground</li>
              </ul>
              <Link to="/preconstruction" className={homeStyles.btnLinkLight} style={{ marginTop: 20, display: 'inline-flex' }}>Explore Preconstruction <span>→</span></Link>
            </div>
            <img src="/assets/ph-arch-2.png" alt="" className={homeStyles.splitBlockPhoto} />
          </div>
        </RevealOnScroll>
      </section>

      {/* The Buchan Process */}
      <section className={homeStyles.sectionCream}>
        <div className={homeStyles.sectionInner}>
          <RevealOnScroll>
            <span className={homeStyles.eyebrow}>The Buchan Process</span>
            <h2 className={homeStyles.sectionTitle} style={{ marginTop: 18, marginBottom: 40 }}>Seven stages.<br /><em>One team.</em></h2>
          </RevealOnScroll>
          <ProcessTimeline stages={PROCESS_STAGES} />
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/process" className={homeStyles.btnLinkLight}>Full process <span>→</span></Link>
          </div>
        </div>
      </section>

      {/* Available Homes */}
      <section className={homeStyles.sectionWhite}>
        <div className={homeStyles.sectionInner}>
          <RevealOnScroll>
            <span className={homeStyles.eyebrow}>Available Homes</span>
            <h2 className={homeStyles.sectionTitle} style={{ marginTop: 18 }}>Move-in ready<br /><em>or coming soon.</em></h2>
          </RevealOnScroll>
          {availableSpotlight ? (
            <Link to={`/portfolio/${availableSpotlight.slug}`} className={homeStyles.spotlightCard} data-cursor>
              <img src={resolveImageUrl(availableSpotlight.image_url, availableSpotlight.slug)} alt="" />
              <div>
                <span className={homeStyles.spotlightStatus}>{availableSpotlight.status}</span>
                <h3 className={homeStyles.spotlightName}>{availableSpotlight.name}</h3>
                <p className={homeStyles.bodyText}>{availableSpotlight.city}</p>
              </div>
            </Link>
          ) : (
            <p className={homeStyles.bodyText} style={{ marginTop: 24 }}>No spec homes listed today — explore custom build paths below.</p>
          )}
          <div className={homeStyles.heroCtas} style={{ marginTop: 32 }}>
            <Link to="/available-homes" className={homeStyles.btnPrimaryLight}>View Available Homes</Link>
            <Link to="/custom-homes" className={homeStyles.btnLinkLight}>Or, build yours <span>→</span></Link>
          </div>
        </div>
      </section>

      {/* Local Expertise */}
      <section className={homeStyles.sectionCream}>
        <div className={homeStyles.sectionInner}>
          <RevealOnScroll>
            <span className={homeStyles.eyebrow}>Local Expertise</span>
            <h2 className={homeStyles.sectionTitle} style={{ marginTop: 18, marginBottom: 32 }}>Areas we serve.</h2>
          </RevealOnScroll>
          <div className={homeStyles.areaChips}>
            {SERVICE_AREAS.map((area) => (
              <Link key={area} to="/areas-we-serve" className={homeStyles.areaChip} data-cursor>{area}</Link>
            ))}
          </div>
          <Link to="/areas-we-serve" className={homeStyles.btnLinkLight} style={{ marginTop: 24, display: 'inline-flex' }}>Explore service areas <span>→</span></Link>
        </div>
      </section>

      {/* Why Choose Buchan */}
      <section className={homeStyles.sectionWhite}>
        <div className={homeStyles.sectionInner}>
          <RevealOnScroll>
            <span className={homeStyles.eyebrow}>Why Choose Buchan</span>
            <h2 className={homeStyles.sectionTitle} style={{ marginTop: 18, marginBottom: 40 }}>Build with<br /><em>certainty.</em></h2>
          </RevealOnScroll>
          <div className={homeStyles.whyChooseSplit}>
            <img src="/assets/ph-arch-1.png" alt="" className={homeStyles.whyChoosePhoto} />
            <div className={homeStyles.valuesGrid}>
              {WHY_CHOOSE_VALUES.slice(0, 4).map((v) => (
                <RevealOnScroll key={v.title}>
                  <h3 className={homeStyles.valueTitle}>{v.title}</h3>
                  <p className={homeStyles.bodyText}>{v.body}</p>
                </RevealOnScroll>
              ))}
            </div>
          </div>
          <p className={homeStyles.bodyText} style={{ marginTop: 40, maxWidth: 640 }}>
            65 years on the Eastside means your project benefits from relationships, jurisdiction knowledge, and a reputation we protect on every job.
          </p>
        </div>
      </section>

      {/* After the Keys */}
      <section className={`${homeStyles.sectionCream} ${homeStyles.textureBand}`}>
        <RevealOnScroll>
          <div className={homeStyles.splitBlockWithImage}>
            <img src="/assets/ph-arch-3.png" alt="" className={homeStyles.splitBlockPhoto} />
            <div>
              <span className={homeStyles.eyebrow}>After the Keys</span>
              <h2 className={homeStyles.sectionTitle} style={{ marginTop: 18 }}>Continuing<br /><em>care.</em></h2>
              <p className={homeStyles.bodyText} style={{ marginTop: 20 }}>Warranty coverage, homeowner education, and Buchan Home Care — support that outlasts move-in day.</p>
              <div className={homeStyles.heroCtas} style={{ marginTop: 24 }}>
                <Link to="/warranty" className={homeStyles.btnPrimaryLight}>Warranty & Client Care</Link>
                <Link to="/services/home-care" className={homeStyles.btnLinkLight}>Home Care <span>→</span></Link>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* Testimonials — the one dark moment */}
      <section className={homeStyles.sectionDark}>
        <div className={homeStyles.sectionInner}>
          <RevealOnScroll>
            <span className={homeStyles.eyebrowDark}>Client Testimonials</span>
            <h2 className={homeStyles.sectionTitleDark} style={{ marginTop: 18, marginBottom: 40 }}>In their words.</h2>
          </RevealOnScroll>
          <div className={homeStyles.testimonialGrid}>
            {testimonialQuotes.map((t) => (
              <RevealOnScroll key={t.cite}>
                <blockquote className={homeStyles.testimonialCard}>
                  <p className={homeStyles.testimonialQuote}>&ldquo;{t.quote}&rdquo;</p>
                  <cite className={homeStyles.cite}>{t.cite}</cite>
                </blockquote>
              </RevealOnScroll>
            ))}
          </div>
          <Link to="/testimonials" className={homeStyles.btnLinkDark} style={{ marginTop: 32, display: 'inline-flex' }}>All testimonials <span>→</span></Link>
          <Link to="/case-studies/builder-transition" className={homeStyles.btnLinkDark} style={{ marginTop: 12, display: 'block' }}>Builder transition story <span>→</span></Link>
        </div>
      </section>

      {/* Portfolio teaser */}
      <section className={homeStyles.sectionWhite}>
        <div className={homeStyles.sectionInner}>
          <RevealOnScroll>
            <span className={homeStyles.eyebrow}>Portfolio</span>
            <h2 className={homeStyles.sectionTitle} style={{ marginTop: 18, marginBottom: 48 }}>Recent work.</h2>
          </RevealOnScroll>
          <div className={homeStyles.workGrid}>
            {featured.map((h) => (
              <RevealOnScroll key={h.id}>
                <Link to={`/portfolio/${h.slug}`} className={homeStyles.workCard} data-cursor>
                  <div className={homeStyles.workImgWrap}>
                    <img src={resolveImageUrl(h.image_url, h.slug)} alt={h.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div className={homeStyles.workMeta}>
                    <span className={homeStyles.workName}>{h.name}</span>
                    <span className={homeStyles.workCity}>{h.city}</span>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Insights preview */}
      <section className={homeStyles.sectionCream}>
        <div className={homeStyles.sectionInner}>
          <RevealOnScroll>
            <span className={homeStyles.eyebrow}>Insights</span>
            <h2 className={homeStyles.sectionTitle} style={{ marginTop: 18 }}>Articles &amp; updates.</h2>
            <p className={homeStyles.bodyText} style={{ marginTop: 16, maxWidth: 560 }}>Planning guides, project stories, and Eastside market notes — more coming to the resource library.</p>
            <Link to="/blog" className={homeStyles.btnLinkLight} style={{ marginTop: 20, display: 'inline-flex' }}>Read the blog <span>→</span></Link>
          </RevealOnScroll>
        </div>
      </section>

      {/* Closing CTA */}
      <section className={homeStyles.ctaSection}>
        <h2 className={homeStyles.sectionTitleDark}>Ready to build with certainty?</h2>
        <div className={homeStyles.ctaButtons}>
          <Link to="/contact" data-cursor className={homeStyles.btnPrimaryDark}>Start a Conversation</Link>
          <a href="tel:4258272266" data-cursor className={homeStyles.btnLinkDark}>425.827.2266</a>
        </div>
      </section>

      {/* Send a message */}
      <section className={homeStyles.sectionWhite}>
        <RevealOnScroll>
          <div className={homeStyles.messageSection}>
            <h2 className={homeStyles.sectionTitle}>Send us a message.</h2>
            <form onSubmit={handleMessage} className={homeStyles.messageForm}>
              <input name="name" type="text" required placeholder="Your name" className={homeStyles.input} />
              <input name="email" type="email" required placeholder="Email" className={homeStyles.input} />
              <textarea name="message" required placeholder="Tell us about your project" rows={4} className={homeStyles.input} />
              <button type="submit" data-cursor className={homeStyles.btnSubmit}>Send Message</button>
              <p data-formmsg style={{ display: 'none', color: 'var(--color-accent-dark)', marginTop: 16, fontSize: 14 }} />
            </form>
          </div>
        </RevealOnScroll>
      </section>
    </main>
  );
}
