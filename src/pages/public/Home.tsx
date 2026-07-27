import { Link } from 'react-router-dom';
import { useProperties } from '../../hooks/useProperties';
import { useSitePage } from '../../hooks/useSitePage';
import { useSubmissions } from '../../hooks/useSubmissions';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import homeStyles from './Home.module.css';
import ps from '../../styles/pages.module.css';

function getFeaturedProperties(properties: ReturnType<typeof useProperties>['properties']) {
  const featured = properties
    .filter((p) => p.featured && p.status !== 'Draft')
    .sort((a, b) => (a.featured_order ?? 0) - (b.featured_order ?? 0))
    .slice(0, 3);
  return featured.length > 0 ? featured : properties.slice(0, 3);
}

export function Home() {
  const { page } = useSitePage('home');
  const { properties } = useProperties({ publicOnly: true });
  const { createSubmission } = useSubmissions();
  const content = page?.content ?? getDemoPageContent('home');
  const featured = getFeaturedProperties(properties);

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

  const { hero, legacy, services, recent_work, concierge } = content;

  return (
    <main>
      <PageMeta title={page?.meta_title ?? "Bellevue's Custom Home Builder"} description={page?.meta_description} />

      <section className={homeStyles.hero}>
        {hero.video_url ? (
          <video
            className={`${homeStyles.heroImg} ${homeStyles.heroVideo}`}
            src={hero.video_url}
            poster={hero.image_url}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
          />
        ) : (
          <img src={hero.image_url} alt="" className={homeStyles.heroImg} />
        )}
        <div className={homeStyles.heroOverlay} />
        <div className={homeStyles.heroContent}>
          <div className={homeStyles.heroEyebrow}>{hero.eyebrow}</div>
          <h1 className={homeStyles.heroTitle}>
            {hero.title}<br /><em>{hero.title_emphasis}</em>
          </h1>
          <p className={homeStyles.heroSub}>{hero.subtitle}</p>
          <div className={homeStyles.heroCtas}>
            <a href={hero.cta_primary_url} target="_blank" rel="noopener noreferrer" data-cursor className={ps.btnPrimary}>{hero.cta_primary_label}</a>
            <Link to="/portfolio" data-cursor className={ps.btnLink}>View Portfolio <span>→</span></Link>
          </div>
        </div>
        <div className={homeStyles.marquee}>
          <div className={homeStyles.marqueeTrack}>
            <span>{hero.marquee}&nbsp;</span>
            <span>{hero.marquee}&nbsp;</span>
          </div>
        </div>
      </section>

      <section className={ps.section}>
        <RevealOnScroll>
          <div className={homeStyles.legacyGrid}>
            <h2 className={homeStyles.legacyTitle}>
              {legacy.title}<br />
              {legacy.title_line2 && <>{legacy.title_line2}<br /></>}
              <em>{legacy.title_emphasis}</em>
            </h2>
            <div>
              <span className={ps.eyebrow}>{legacy.eyebrow}</span>
              {legacy.paragraphs.map((p, i) => (
                <p key={i} className={ps.bodyText} style={{ marginTop: i === 0 ? 24 : 24 }}>{p}</p>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <section className={ps.sectionAlt}>
        <div className={ps.sectionInner}>
          <RevealOnScroll>
            <span className={ps.eyebrow}>{services.eyebrow}</span>
            <h2 className={ps.sectionTitle} style={{ marginTop: 18 }}>
              {services.title}<br /><em>{services.title_emphasis}</em>
            </h2>
          </RevealOnScroll>
          <div className={homeStyles.servicesGrid}>
            {services.items.map((s) => (
              <RevealOnScroll key={s.title}>
                <div className={homeStyles.serviceCard}>
                  <div className={homeStyles.serviceImgWrap}>
                    <img src={s.image_url} alt="" className={ps.imageCover} />
                  </div>
                  <div className={ps.divider} />
                  <h3 className={homeStyles.serviceTitle}>{s.title}</h3>
                  <p className={ps.bodyText}>{s.description}</p>
                  <Link to={s.link} data-cursor className={ps.btnLink} style={{ marginTop: 16 }}>Learn More →</Link>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className={ps.section}>
        <div className={ps.sectionInner}>
          <RevealOnScroll>
            <span className={ps.eyebrow}>{recent_work.eyebrow}</span>
            <h2 className={ps.sectionTitle} style={{ marginTop: 18, marginBottom: 48 }}>{recent_work.title}</h2>
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
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/portfolio" data-cursor className={ps.btnPrimary}>View All Homes</Link>
          </div>
        </div>
      </section>

      <section className={ps.sectionAlt}>
        <RevealOnScroll>
          <div className={homeStyles.concierge}>
            <img src={concierge.image_url} alt="" className={homeStyles.conciergeImg} />
            <div>
              <span className={ps.eyebrow}>{concierge.eyebrow}</span>
              <blockquote className={homeStyles.quote}>
                &ldquo;{concierge.quote}&rdquo;
              </blockquote>
              <cite className={homeStyles.cite}>{concierge.cite}</cite>
            </div>
          </div>
        </RevealOnScroll>
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
