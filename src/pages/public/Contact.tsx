import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSitePage } from '../../hooks/useSitePage';
import { useSubmissions } from '../../hooks/useSubmissions';
import { PageMeta } from '../../components/ui/PageMeta';
import { PageCta } from '../../components/ui/PageCta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { HeroTitle } from '../../components/ui/HeroTitle';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import { resolveImageUrl } from '../../lib/placeholders';
import ps from '../../styles/pages.module.css';

export function Contact() {
  const { page } = useSitePage('contact');
  const content = page?.content ?? getDemoPageContent('contact');
  const { createSubmission } = useSubmissions();
  const [params] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const service = params.get('service');
    if (service) {
      const select = document.getElementById('jbh-service') as HTMLSelectElement;
      if (select) select.value = service;
      document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [params]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      await createSubmission({
        name: String(fd.get('name') ?? ''),
        email: String(fd.get('email') ?? ''),
        phone: String(fd.get('phone') ?? ''),
        subject: String(fd.get('subject') ?? ''),
        message: String(fd.get('message') ?? ''),
        source: 'Contact page',
      });
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send message. Please try again.');
    }
  };

  const officeLines = content.office.split('\n');

  return (
    <main>
      <PageMeta title={page?.meta_title ?? 'Contact'} description={page?.meta_description} />
      <section className={ps.hero}>
        <div className={ps.heroInner}>
          <span className={ps.eyebrow}>{content.hero.eyebrow}</span>
          <HeroTitle hero={content.hero} />
        </div>
      </section>

      <section className={ps.sectionAlt}>
        <div className={ps.quickLinks}>
          <Link to="/contact?service=I want to build a custom home#inquiry" className={ps.btnGhost}>Custom Home</Link>
          <Link to="/contact?service=I'm planning a major renovation#inquiry" className={ps.btnGhost}>Renovation</Link>
          <Link to="/land-acquisition" className={ps.btnGhost}>Sell Land</Link>
          <Link to="/second-opinion" className={ps.btnGhost}>Second Opinion</Link>
        </div>
      </section>

      <section id="inquiry" className={ps.section}>
        <RevealOnScroll>
          <div className={ps.formGrid}>
            <div>
              <span className={ps.eyebrow}>Inquiry</span>
              <h2 className={ps.sectionTitle} style={{ marginTop: 16 }}>{content.inquiry_title}</h2>
              {submitted ? (
                <p className={ps.formSuccess}>
                  Thank you. We will be in touch within one business day.
                </p>
              ) : (
                <form onSubmit={handleSubmit} className={ps.formStack}>
                  <input name="name" type="text" required placeholder="Your name" className={ps.formInput} />
                  <input name="email" type="email" required placeholder="Email" className={ps.formInput} />
                  <input name="phone" type="tel" placeholder="Phone (optional)" className={ps.formInput} />
                  <select id="jbh-service" name="subject" required className={ps.formInput} defaultValue="">
                    <option value="" disabled>Select a topic</option>
                    {content.service_options.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <textarea name="message" required placeholder="Tell us about your project" rows={5} className={ps.formInput} />
                  {error && <p className={ps.formError}>{error}</p>}
                  <button type="submit" className={ps.btnPrimary} style={{ alignSelf: 'flex-start' }}>Send Message</button>
                </form>
              )}
            </div>
            <div>
              <span className={ps.eyebrow}>Visit</span>
              <h2 className={ps.sectionTitle} style={{ marginTop: 16 }}>{content.visit_title}</h2>
              <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <span className={ps.formLabel}>Phone</span>
                  <a href={content.phone_href} style={{ display: 'block', marginTop: 8, fontSize: 22, fontFamily: 'var(--font-serif)', textDecoration: 'none', color: 'var(--color-text-on-light)' }}>{content.phone}</a>
                </div>
                <div>
                  <span className={ps.formLabel}>Office</span>
                  <p className={ps.bodyText} style={{ marginTop: 8 }}>
                    {officeLines.map((line, i) => (
                      <span key={i}>{line}{i < officeLines.length - 1 && <br />}</span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <PageCta
        title={content.cta_title}
        primaryLabel="How Much Will My Project Cost?"
        primaryUrl="https://estimator.buchan.com/"
        primaryExternal
        backgroundImage={resolveImageUrl(content.cta_background_image_url ?? '/assets/ph-arch-2.png', 'contact-cta')}
      />
    </main>
  );
}
