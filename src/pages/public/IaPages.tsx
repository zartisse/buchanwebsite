import type { HubPageSlug } from '../../types';
import { useHubPage } from '../../hooks/useHubPage';
import { HubPage } from '../../components/public/HubPage';
import { getDemoHubPage, mergeHubContent } from '../../data/hubContentDefaults';

function page(slug: HubPageSlug) {
  return function IaPageRoute() {
    const { page: hubPage, loading } = useHubPage(slug);
    if (loading) return <div className="page-loading">Loading…</div>;
    const demo = getDemoHubPage(slug);
    const resolved = hubPage ?? demo;
    return <HubPage page={{ ...resolved, content: mergeHubContent(resolved.content, slug) }} />;
  };
}

export const CustomHomes = page('custom-homes');
export const LandAndSite = page('land-and-site');
export const Renovations = page('renovations');
export const Preconstruction = page('preconstruction');
export const WhyChooseBuchan = page('why-choose-buchan');
export const AreasWeServe = page('areas-we-serve');
export const Adus = page('adus');
export const FireRestoration = page('fire-restoration');
export const PlanningBudgeting = page('planning-budgeting');
export const RealEstate = page('real-estate');
export const FindYourLot = page('find-your-lot');
export const SellYourHome = page('sell-your-home');
export const SellToBuchan = page('sell-to-buchan');
export const HomeCare = page('home-care');
export const LandAcquisition = page('land-acquisition');
export const SecondOpinion = page('second-opinion');
export const PropertyFeasibility = page('property-feasibility');
