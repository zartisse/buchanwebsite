import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSitePage } from '../../hooks/useSitePage';
import { PageMeta } from '../../components/ui/PageMeta';
import { PageCta } from '../../components/ui/PageCta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import { HeroTitle } from '../../components/ui/HeroTitle';
import { InquiryForm } from '../../components/public/InquiryForm';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import { resolveImageUrl } from '../../lib/placeholders';
import { SOCIAL_LINKS } from '../../data/navigation';
import { OfficeMapEmbed } from '../../components/public/OfficeMapEmbed';
import { SocialBrandIcon } from '../../components/ui/SocialBrandIcon';
import ps from '../../styles/pages.module.css';

export function Contact() {
  const { page } = useSitePage('contact');
  const content = page?.content ?? getDemoPageContent('contact');
  const [params] = useSearchParams();
  const defaultSubject = params.get('service') ?? undefined;

  useEffect(() => {
    if (defaultSubject) {
      document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [defaultSubject]);

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
              <InquiryForm
                variant="contact"
                serviceOptions={content.service_options}
                defaultSubject={defaultSubject}
                subjectSelectId="jbh-service"
              />
            </div>
            <div>
              <span className={ps.eyebrow}>Visit</span>
              <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <span className={ps.formLabel}>Phone</span>
                  <div className={ps.contactPhoneBlock}>
                    <a href={content.phone_href} className={ps.contactPhoneRow}>
                      <svg className={ps.contactPhoneIcon} viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span className={ps.contactPhoneNumber}>{content.phone}</span>
                    </a>
                  </div>
                </div>
                <div>
                  <span className={ps.formLabel}>Social</span>
                  <ul className={ps.socialList}>
                    {SOCIAL_LINKS.map((s) => (
                      <li key={s.label}>
                        <a href={s.href} target="_blank" rel="noopener noreferrer" className={ps.socialLink} aria-label={`${s.label}: ${s.handle}`}>
                          <SocialBrandIcon platform={s.label as 'LinkedIn' | 'Facebook' | 'Instagram'} className={ps.socialBrandIcon} />
                          <span className={ps.socialHandleText}>{s.handle}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
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

      <section className={ps.sectionAlt}>
        <RevealOnScroll>
          <div className={ps.sectionInner}>
            <span className={ps.eyebrow}>Location</span>
            <h2 className={ps.sectionTitle} style={{ marginTop: 16 }}>Find us in Bellevue</h2>
            <OfficeMapEmbed />
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
