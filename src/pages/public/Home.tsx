import { useEffect } from 'react';
import { Craftsmanship } from '../../components/public/landing/Craftsmanship';
import { HeroSection } from '../../components/public/landing/HeroSection';
import { HistorySection } from '../../components/public/landing/HistorySection';
import { ProcessPreview } from '../../components/public/landing/ProcessPreview';
import { RecentWork } from '../../components/public/landing/RecentWork';
import { ServicesSection } from '../../components/public/landing/ServicesSection';
import { StartConversation } from '../../components/public/landing/StartConversation';
import { TrustSection } from '../../components/public/landing/TrustSection';
import { useSitePage } from '../../hooks/useSitePage';
import { PageMeta } from '../../components/ui/PageMeta';
import { mergeHomeContent } from '../../data/homeContentDefaults';
import { getDemoPageContent } from '../../data/sitePagesDemo';
import { resolveImageUrl, supabaseImageUrl, supabaseSrcSet } from '../../lib/placeholders';
import homeStyles from './Home.module.css';

/**
 * Homepage sequence (Heather's direction, Nov 2026):
 * Hero, History, Recent Work, Craftsmanship, Services, Process, Client Trust, Start a Conversation.
 * Hero photos and the services cards still come from the admin-managed home content.
 */
export function Home() {
  const { page } = useSitePage('home');
  const rawContent = page?.content ?? getDemoPageContent('home');
  const content = mergeHomeContent(rawContent);
  const { hero } = content;
  const heroSlides = hero.image_urls?.length ? hero.image_urls : [hero.image_url];

  useEffect(() => {
    const heroSrc = resolveImageUrl(heroSlides[0] ?? '/assets/ph-arch-1.webp', 'home-hero');
    const existing = document.querySelector('link[data-home-hero-preload]');
    if (existing) existing.remove();
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    // Preload the same resized variant the hero <img> will request (avoids a double download).
    link.href = supabaseImageUrl(heroSrc, 1920);
    const srcSet = supabaseSrcSet(heroSrc);
    if (srcSet) {
      link.setAttribute('imagesrcset', srcSet);
      link.setAttribute('imagesizes', '100vw');
    }
    link.setAttribute('fetchpriority', 'high');
    link.setAttribute('data-home-hero-preload', 'true');
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, [heroSlides]);

  return (
    <main className={homeStyles.homePage}>
      <PageMeta title={page?.meta_title ?? 'Build with Certainty | John Buchan Homes'} description={page?.meta_description} />
      <HeroSection slides={heroSlides} />
      <HistorySection />
      <RecentWork />
      <Craftsmanship />
      <ServicesSection section={content.what_we_do} />
      <ProcessPreview />
      <TrustSection reviewsUrl={content.google_reviews_section.fallback_maps_url} />
      <StartConversation />
    </main>
  );
}
