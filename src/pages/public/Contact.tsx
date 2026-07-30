import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSitePage } from '../../hooks/useSitePage';
import { useSubmissions } from '../../hooks/useSubmissions';
import { EstimatorLink } from '../../components/ui/EstimatorLink';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { HeroTitle } from '../../components/ui/HeroTitle';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import ps from '../../styles/pages.module.css';

const inputStyle: React.CSSProperties = {
  background: 'var(--color-bg-cream)',
  border: '1px solid var(--color-hairline-light-2)',
  color: 'var(--color-text-on-light)',
  padding: '16px 18px',
  fontFamily: 'var(--font-sans)',
  fontSize: 15,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

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
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', padding: '0 8vw' }}>
          <Link to="/contact?service=I want to build a custom home#inquiry" data-cursor className={ps.btnPrimary}>Custom Home</Link>
          <Link to="/contact?service=I'm planning a major renovation#inquiry" data-cursor className={ps.btnPrimary}>Renovation</Link>
          <Link to="/land-acquisition" data-cursor className={ps.btnPrimary}>Sell Land</Link>
          <Link to="/second-opinion" data-cursor className={ps.btnPrimary}>Second Opinion</Link>
        </div>
      </section>

      <section id="inquiry" className={ps.section}>
        <RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, maxWidth: 'var(--max-width)', margin: '0 auto' }}>
            <div>
              <h2 className={ps.sectionTitle}>{content.inquiry_title}</h2>
              {submitted ? (
                <p style={{ color: 'var(--color-accent-dark)', marginTop: 24, fontSize: 18 }}>
                  Thank you — we will be in touch within one business day.
                </p>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 32 }}>
                  <input name="name" type="text" required placeholder="Your name" style={inputStyle} />
                  <input name="email" type="email" required placeholder="Email" style={inputStyle} />
                  <input name="phone" type="tel" placeholder="Phone (optional)" style={inputStyle} />
                  <select id="jbh-service" name="subject" required style={inputStyle} defaultValue="">
                    <option value="" disabled>Select a topic</option>
                    {content.service_options.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <textarea name="message" required placeholder="Tell us about your project" rows={5} style={inputStyle} />
                  {error && <p style={{ color: '#e57373', fontSize: 14 }}>{error}</p>}
                  <button type="submit" data-cursor className={ps.btnPrimary} style={{ alignSelf: 'flex-start' }}>Send Message</button>
                </form>
              )}
            </div>
            <div>
              <h2 className={ps.sectionTitle}>{content.visit_title}</h2>
              <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>Phone</span>
                  <a href={content.phone_href} data-cursor style={{ display: 'block', marginTop: 8, fontSize: 20, fontFamily: 'var(--font-serif)', textDecoration: 'none' }}>{content.phone}</a>
                </div>
                <div>
                  <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>Office</span>
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

      <section className={ps.ctaSection}>
        <h2 className={ps.sectionTitle}>{content.cta_title}</h2>
        <EstimatorLink data-cursor className={ps.btnPrimary}>How Much Will My Project Cost?</EstimatorLink>
      </section>
    </main>
  );
}
