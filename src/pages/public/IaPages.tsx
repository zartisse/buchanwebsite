import { IA_PAGES } from '../../data/iaContent';
import { HubPage } from '../../components/public/HubPage';

function page(key: keyof typeof IA_PAGES) {
  return function IaPageRoute() {
    return <HubPage data={IA_PAGES[key]} />;
  };
}

export const CustomHomes = page('custom-homes');
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
