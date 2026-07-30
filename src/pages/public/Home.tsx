import { Link } from 'react-router-dom';
import { useProperties } from '../../hooks/useProperties';
import { useSitePage } from '../../hooks/useSitePage';
import { useSubmissions } from '../../hooks/useSubmissions';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import {
  CREDIBILITY_ITEMS, HOME_STARTING_POINTS, PROCESS_STAGES, WHY_CHOOSE_VALUES,
} from '../../data/iaContent';
import { SERVICE_AREAS } from '../../data/navigation';
import { isYouTubeUrl, parseYouTubeId, youTubeEmbedSrc } from '../../lib/youtube';
import homeStyles from './Home.module.css';
import ps from '../../styles/pages.module.css';

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

  const { hero, concierge, quality_gallery, testimonials_strip } = content;
  const galleryImages = quality_gallery?.length ? quality_gallery : [
    { image_url: '/assets/ph-arch-1.svg', caption: 'Placeholder' },
    { image_url: '/assets/ph-arch-2.svg', caption: 'Placeholder' },
    { image_url: '/assets/ph-arch-3.svg', caption: 'Placeholder' },
    { image_url: '/assets/ph-arch-4.svg', caption: 'Placeholder' },
  ];
  const testimonialQuotes = testimonials_strip?.length ? testimonials_strip : [
    { quote: concierge.quote, cite: concierge.cite },
  ];
  const youtubeId = hero.video_url && isYouTubeUrl(hero.video_url) ? parseYouTubeId(hero.video_url) : null;

  return (
    <main>
      <PageMeta title={page?.meta_title ?? "Bellevue's Custom Home Builder"} description={page?.meta_description} />

      {/* Hero */}
      <section className={homeStyles.hero}>
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
          <video className={`${homeStyles.heroImg} ${homeStyles.heroVideo}`} src={hero.video_url} poster={hero.image_url} autoPlay muted loop playsInline aria-hidden />
        ) : (
          <img src={hero.image_url} alt="" className={homeStyles.heroImg} />
        )}
        <div className={homeStyles.heroOverlay} />
        <div className={homeStyles.heroContent}>
          <div className={homeStyles.heroEyebrow}>{hero.eyebrow}</div>
          <h1 className={homeStyles.heroTitle}>{hero.title}<br /><em>{hero.title_emphasis}</em></h1>
          <p className={homeStyles.heroSub}>{hero.subtitle}</p>
          <div className={homeStyles.heroCtas}>
            <Link to="/custom-homes" data-cursor className={ps.btnPrimary}>Plan My Custom Home</Link>
            <Link to="/property-feasibility" data-cursor className={ps.btnLink}>Evaluate My Property <span>→</span></Link>
          </div>
        </div>
        <div className={homeStyles.marquee}>
          <div className={homeStyles.marqueeTrack}>
            <span>{hero.marquee}&nbsp;</span>
            <span>{hero.marquee}&nbsp;</span>
          </div>
        </div>
      </section>

      {/* Credibility strip */}
      <section className={homeStyles.credibility}>
        {CREDIBILITY_ITEMS.map((item) => (
          <span key={item} className={homeStyles.credItem}>{item}</span>
        ))}
      </section>

      {/* Choose Your Starting Point */}
      <section className={ps.section}>
        <div className={ps.sectionInner}>
          <RevealOnScroll>
            <span className={ps.eyebrow}>Choose Your Starting Point</span>
            <h2 className={ps.sectionTitle} style={{ marginTop: 18 }}>Where are you<br /><em>in the journey?</em></h2>
          </RevealOnScroll>
          <div className={homeStyles.tilesSection}>
            <TileGroup label="Tools" tiles={HOME_STARTING_POINTS.anchor} large />
            <TileGroup label="Core paths" tiles={HOME_STARTING_POINTS.core} />
            <TileGroup label="Also explore" tiles={HOME_STARTING_POINTS.secondary} small />
          </div>
        </div>
      </section>

      {/* Know Before You Build */}
      <section className={ps.sectionAlt}>
        <RevealOnScroll>
          <div className={homeStyles.splitBlock}>
            <div>
              <span className={ps.eyebrow}>Know Before You Build</span>
              <h2 className={ps.sectionTitle} style={{ marginTop: 18 }}>Preconstruction<br /><em>first.</em></h2>
            </div>
            <div>
              <p className={ps.bodyText}>Progressive estimates, feasibility, and design alignment — for custom homes and major renovations alike.</p>
              <ul className={homeStyles.bulletList}>
                <li>Feasibility & constructability review</li>
                <li>Progressive budget ranges</li>
                <li>Design coordination before breaking ground</li>
              </ul>
              <Link to="/preconstruction" className={ps.btnLink} style={{ marginTop: 20, display: 'inline-block' }}>Explore Preconstruction →</Link>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* Quality in Every Layer */}
      <section className={ps.sectionAlt}>
        <div className={ps.sectionInner}>
          <RevealOnScroll>
            <span className={ps.eyebrow}>Quality in Every Layer</span>
            <h2 className={ps.sectionTitle} style={{ marginTop: 18, marginBottom: 32 }}>Behind the walls.</h2>
          </RevealOnScroll>
          <div className={homeStyles.workGrid}>
            {galleryImages.map((item) => (
              <RevealOnScroll key={item.image_url + item.caption}>
                <div className={homeStyles.workImgWrap} style={{ marginBottom: 0 }}>
                  <img src={item.image_url} alt={item.caption ?? ''} className={ps.imageCover} />
                </div>
                {item.caption && <span className={homeStyles.galleryCaption}>{item.caption}</span>}
              </RevealOnScroll>
            ))}
          </div>
          <Link to="/portfolio" className={ps.btnLink} style={{ marginTop: 32, display: 'inline-block' }}>See finished work →</Link>
        </div>
      </section>

      {/* The Buchan Process */}
      <section className={ps.section}>
        <div className={ps.sectionInner}>
          <RevealOnScroll>
            <span className={ps.eyebrow}>The Buchan Process</span>
            <h2 className={ps.sectionTitle} style={{ marginTop: 18, marginBottom: 40 }}>Seven stages.<br /><em>One team.</em></h2>
          </RevealOnScroll>
          <div className={homeStyles.processGrid}>
            {PROCESS_STAGES.map((s) => (
              <RevealOnScroll key={s.n}>
                <div className={homeStyles.processStep}>
                  <span className={homeStyles.processN}>{s.n}</span>
                  <span className={homeStyles.processTitle}>{s.title}</span>
                </div>
              </RevealOnScroll>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/process" className={ps.btnLink}>Full process →</Link>
          </div>
        </div>
      </section>

      {/* Available Homes */}
      <section className={ps.sectionAlt}>
        <div className={ps.sectionInner}>
          <RevealOnScroll>
            <span className={ps.eyebrow}>Available Homes</span>
            <h2 className={ps.sectionTitle} style={{ marginTop: 18 }}>Move-in ready<br /><em>or coming soon.</em></h2>
          </RevealOnScroll>
          {availableSpotlight ? (
            <Link to={`/portfolio/${availableSpotlight.slug}`} className={homeStyles.spotlightCard} data-cursor>
              <img src={availableSpotlight.image_url || '/assets/ph-arch-1.svg'} alt="" />
              <div>
                <span className={homeStyles.spotlightStatus}>{availableSpotlight.status}</span>
                <h3 className={homeStyles.spotlightName}>{availableSpotlight.name}</h3>
                <p className={ps.bodyText}>{availableSpotlight.city}</p>
              </div>
            </Link>
          ) : (
            <p className={ps.bodyText} style={{ marginTop: 24 }}>No spec homes listed today — explore custom build paths below.</p>
          )}
          <div className={homeStyles.heroCtas} style={{ marginTop: 32 }}>
            <Link to="/available-homes" className={ps.btnPrimary}>View Available Homes</Link>
            <Link to="/custom-homes" className={ps.btnLink}>Or, build yours →</Link>
          </div>
        </div>
      </section>

      {/* Local Expertise */}
      <section className={ps.section}>
        <div className={ps.sectionInner}>
          <RevealOnScroll>
            <span className={ps.eyebrow}>Local Expertise</span>
            <h2 className={ps.sectionTitle} style={{ marginTop: 18, marginBottom: 32 }}>Areas we serve.</h2>
          </RevealOnScroll>
          <div className={homeStyles.areaChips}>
            {SERVICE_AREAS.map((area) => (
              <Link key={area} to="/areas-we-serve" className={homeStyles.areaChip} data-cursor>{area}</Link>
            ))}
          </div>
          <Link to="/areas-we-serve" className={ps.btnLink} style={{ marginTop: 24, display: 'inline-block' }}>Explore service areas →</Link>
        </div>
      </section>

      {/* Why Choose Buchan */}
      <section className={ps.sectionAlt}>
        <div className={ps.sectionInner}>
          <RevealOnScroll>
            <span className={ps.eyebrow}>Why Choose Buchan</span>
            <h2 className={ps.sectionTitle} style={{ marginTop: 18, marginBottom: 40 }}>Build with<br /><em>certainty.</em></h2>
          </RevealOnScroll>
          <div className={homeStyles.valuesGrid}>
            {WHY_CHOOSE_VALUES.map((v) => (
              <RevealOnScroll key={v.title}>
                <h3 className={homeStyles.valueTitle}>{v.title}</h3>
                <p className={ps.bodyText}>{v.body}</p>
              </RevealOnScroll>
            ))}
          </div>
          <p className={ps.bodyText} style={{ marginTop: 40, maxWidth: 640 }}>
            65 years on the Eastside means your project benefits from relationships, jurisdiction knowledge, and a reputation we protect on every job.
          </p>
        </div>
      </section>

      {/* After the Keys */}
      <section className={ps.section}>
        <RevealOnScroll>
          <div className={homeStyles.splitBlock}>
            <div>
              <span className={ps.eyebrow}>After the Keys</span>
              <h2 className={ps.sectionTitle} style={{ marginTop: 18 }}>Continuing<br /><em>care.</em></h2>
            </div>
            <div>
              <p className={ps.bodyText}>Warranty coverage, homeowner education, and Buchan Home Care — support that outlasts move-in day.</p>
              <div className={homeStyles.heroCtas} style={{ marginTop: 24, justifyContent: 'flex-start' }}>
                <Link to="/warranty" className={ps.btnPrimary}>Warranty & Client Care</Link>
                <Link to="/services/home-care" className={ps.btnLink}>Home Care →</Link>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* Testimonials */}
      <section className={ps.sectionAlt}>
        <div className={ps.sectionInner}>
          <RevealOnScroll>
            <span className={ps.eyebrow}>Client Testimonials</span>
            <h2 className={ps.sectionTitle} style={{ marginTop: 18, marginBottom: 40 }}>In their words.</h2>
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
          <Link to="/testimonials" className={ps.btnLink} style={{ marginTop: 32, display: 'inline-block' }}>All testimonials →</Link>
          <Link to="/case-studies/builder-transition" className={ps.btnLink} style={{ marginTop: 12, display: 'block' }}>Builder transition story →</Link>
        </div>
      </section>

      {/* Portfolio teaser */}
      <section className={ps.section}>
        <div className={ps.sectionInner}>
          <RevealOnScroll>
            <span className={ps.eyebrow}>Portfolio</span>
            <h2 className={ps.sectionTitle} style={{ marginTop: 18, marginBottom: 48 }}>Recent work.</h2>
          </RevealOnScroll>
          <div className={homeStyles.workGrid}>
            {featured.map((h) => (
              <RevealOnScroll key={h.id}>
                <Link to={`/portfolio/${h.slug}`} className={homeStyles.workCard} data-cursor>
                  <div className={homeStyles.workImgWrap}>
                    <img src={h.image_url || '/assets/ph-arch-1.svg'} alt={h.name} className={ps.imageCover} />
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
      <section className={ps.section}>
        <div className={ps.sectionInner}>
          <RevealOnScroll>
            <span className={ps.eyebrow}>Insights</span>
            <h2 className={ps.sectionTitle} style={{ marginTop: 18 }}>Articles &amp; updates.</h2>
            <p className={ps.bodyText} style={{ marginTop: 16, maxWidth: 560 }}>Planning guides, project stories, and Eastside market notes — more coming to the resource library.</p>
            <Link to="/blog" className={ps.btnLink} style={{ marginTop: 20, display: 'inline-block' }}>Read the blog →</Link>
          </RevealOnScroll>
        </div>
      </section>

      {/* Closing CTA */}
      <section className={ps.ctaSection}>
        <h2 className={ps.sectionTitle}>Ready to build with certainty?</h2>
        <div className={ps.ctaButtons}>
          <Link to="/contact" data-cursor className={ps.btnPrimary}>Start a Conversation</Link>
          <a href="tel:4258272266" data-cursor className={ps.btnLink}>425.827.2266</a>
        </div>
      </section>

      <section className={ps.section}>
        <RevealOnScroll>
          <div className={homeStyles.messageSection}>
            <h2 className={ps.sectionTitle}>Send us a message.</h2>
            <form onSubmit={handleMessage} className={homeStyles.messageForm}>
              <input name="name" type="text" required placeholder="Your name" className={homeStyles.input} />
              <input name="email" type="email" required placeholder="Email" className={homeStyles.input} />
              <textarea name="message" required placeholder="Tell us about your project" rows={4} className={homeStyles.input} />
              <button type="submit" data-cursor className={ps.btnPrimary}>Send Message</button>
              <p data-formmsg style={{ display: 'none', color: 'var(--color-accent-light)', marginTop: 16 }} />
            </form>
          </div>
        </RevealOnScroll>
      </section>
    </main>
  );
}

function TileGroup({ label, tiles, large, small }: {
  label: string;
  tiles: { title: string; description: string; link: string }[];
  large?: boolean;
  small?: boolean;
}) {
  return (
    <div className={homeStyles.tileGroup}>
      <span className={homeStyles.tileGroupLabel}>{label}</span>
      <div className={`${homeStyles.tileGrid} ${large ? homeStyles.tileGridLarge : ''} ${small ? homeStyles.tileGridSmall : ''}`}>
        {tiles.map((t) => (
          <Link key={t.title} to={t.link} className={homeStyles.tile} data-cursor>
            <strong>{t.title}</strong>
            <span>{t.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
