import { lazy, Suspense, type ComponentType } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { ScrollToTop } from '../components/layout/ScrollToTop';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { PageSkeleton } from '../components/ui/PageSkeleton';
import { Home } from '../pages/public/Home';

const About = lazy(() => import('../pages/public/About').then((m) => ({ default: m.About })));
const Services = lazy(() => import('../pages/public/Services').then((m) => ({ default: m.Services })));
const Process = lazy(() => import('../pages/public/Process').then((m) => ({ default: m.Process })));
const Testimonials = lazy(() => import('../pages/public/Testimonials').then((m) => ({ default: m.Testimonials })));
const Portfolio = lazy(() => import('../pages/public/Portfolio').then((m) => ({ default: m.Portfolio })));
const PortfolioDetail = lazy(() => import('../pages/public/PortfolioDetail').then((m) => ({ default: m.PortfolioDetail })));
const Blog = lazy(() => import('../pages/public/Blog').then((m) => ({ default: m.Blog })));
const BlogPost = lazy(() => import('../pages/public/BlogPost').then((m) => ({ default: m.BlogPost })));
const Contact = lazy(() => import('../pages/public/Contact').then((m) => ({ default: m.Contact })));
const Faq = lazy(() => import('../pages/public/Faq').then((m) => ({ default: m.Faq })));
const Warranty = lazy(() => import('../pages/public/Warranty').then((m) => ({ default: m.Warranty })));
const Awards = lazy(() => import('../pages/public/Awards').then((m) => ({ default: m.Awards })));
const CostEstimator = lazy(() => import('../pages/public/CostEstimator').then((m) => ({ default: m.CostEstimator })));
const AvailableHomes = lazy(() => import('../pages/public/AvailableHomes').then((m) => ({ default: m.AvailableHomes })));
const BuilderTransitionCaseStudy = lazy(() => import('../pages/public/CaseStudies').then((m) => ({ default: m.BuilderTransitionCaseStudy })));

const AdminLogin = lazy(() => import('../pages/admin/Login').then((m) => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminPosts = lazy(() => import('../pages/admin/Posts').then((m) => ({ default: m.AdminPosts })));
const AdminProperties = lazy(() => import('../pages/admin/Properties').then((m) => ({ default: m.AdminProperties })));
const AdminSubmissions = lazy(() => import('../pages/admin/Submissions').then((m) => ({ default: m.AdminSubmissions })));
const AdminPages = lazy(() => import('../pages/admin/Pages').then((m) => ({ default: m.AdminPages })));
const AdminPageEdit = lazy(() => import('../pages/admin/PageEdit').then((m) => ({ default: m.AdminPageEdit })));
const AdminHubPages = lazy(() => import('../pages/admin/HubPages').then((m) => ({ default: m.AdminHubPages })));
const AdminHubPageEdit = lazy(() => import('../pages/admin/HubPageEdit').then((m) => ({ default: m.AdminHubPageEdit })));

const IA_LAZY: Record<string, ComponentType> = {
  CustomHomes: lazy(() => import('../pages/public/IaPages').then((m) => ({ default: m.CustomHomes }))),
  LandAndSite: lazy(() => import('../pages/public/IaPages').then((m) => ({ default: m.LandAndSite }))),
  Renovations: lazy(() => import('../pages/public/IaPages').then((m) => ({ default: m.Renovations }))),
  Preconstruction: lazy(() => import('../pages/public/IaPages').then((m) => ({ default: m.Preconstruction }))),
  WhyChooseBuchan: lazy(() => import('../pages/public/IaPages').then((m) => ({ default: m.WhyChooseBuchan }))),
  AreasWeServe: lazy(() => import('../pages/public/IaPages').then((m) => ({ default: m.AreasWeServe }))),
  Adus: lazy(() => import('../pages/public/IaPages').then((m) => ({ default: m.Adus }))),
  FireRestoration: lazy(() => import('../pages/public/IaPages').then((m) => ({ default: m.FireRestoration }))),
  PlanningBudgeting: lazy(() => import('../pages/public/IaPages').then((m) => ({ default: m.PlanningBudgeting }))),
  RealEstate: lazy(() => import('../pages/public/IaPages').then((m) => ({ default: m.RealEstate }))),
  FindYourLot: lazy(() => import('../pages/public/IaPages').then((m) => ({ default: m.FindYourLot }))),
  SellYourHome: lazy(() => import('../pages/public/IaPages').then((m) => ({ default: m.SellYourHome }))),
  SellToBuchan: lazy(() => import('../pages/public/IaPages').then((m) => ({ default: m.SellToBuchan }))),
  HomeCare: lazy(() => import('../pages/public/IaPages').then((m) => ({ default: m.HomeCare }))),
  LandAcquisition: lazy(() => import('../pages/public/IaPages').then((m) => ({ default: m.LandAcquisition }))),
  SecondOpinion: lazy(() => import('../pages/public/IaPages').then((m) => ({ default: m.SecondOpinion }))),
  PropertyFeasibility: lazy(() => import('../pages/public/IaPages').then((m) => ({ default: m.PropertyFeasibility }))),
};

function IaPageRoute({ name }: { name: keyof typeof IA_LAZY }) {
  const Component = IA_LAZY[name];
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Component />
    </Suspense>
  );
}

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>;
}

export function AppRouter() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="custom-homes" element={<IaPageRoute name="CustomHomes" />} />
          <Route path="custom-homes/land-and-site" element={<IaPageRoute name="LandAndSite" />} />
          <Route path="renovations" element={<IaPageRoute name="Renovations" />} />
          <Route path="preconstruction" element={<IaPageRoute name="Preconstruction" />} />
          <Route path="available-homes" element={<Lazy><AvailableHomes /></Lazy>} />
          <Route path="cost-estimator" element={<Lazy><CostEstimator /></Lazy>} />
          <Route path="case-studies/builder-transition" element={<Lazy><BuilderTransitionCaseStudy /></Lazy>} />
          <Route path="why-choose-buchan" element={<IaPageRoute name="WhyChooseBuchan" />} />
          <Route path="areas-we-serve" element={<IaPageRoute name="AreasWeServe" />} />
          <Route path="land-acquisition" element={<IaPageRoute name="LandAcquisition" />} />
          <Route path="second-opinion" element={<IaPageRoute name="SecondOpinion" />} />
          <Route path="property-feasibility" element={<IaPageRoute name="PropertyFeasibility" />} />
          <Route path="services/adus" element={<IaPageRoute name="Adus" />} />
          <Route path="services/fire-restoration" element={<IaPageRoute name="FireRestoration" />} />
          <Route path="services/planning-budgeting" element={<IaPageRoute name="PlanningBudgeting" />} />
          <Route path="services/real-estate" element={<IaPageRoute name="RealEstate" />} />
          <Route path="services/real-estate/find-your-lot" element={<IaPageRoute name="FindYourLot" />} />
          <Route path="services/real-estate/sell-your-home" element={<IaPageRoute name="SellYourHome" />} />
          <Route path="services/real-estate/sell-to-buchan" element={<IaPageRoute name="SellToBuchan" />} />
          <Route path="services/home-care" element={<IaPageRoute name="HomeCare" />} />
          <Route path="about" element={<Lazy><About /></Lazy>} />
          <Route path="services" element={<Lazy><Services /></Lazy>} />
          <Route path="process" element={<Lazy><Process /></Lazy>} />
          <Route path="testimonials" element={<Lazy><Testimonials /></Lazy>} />
          <Route path="portfolio" element={<Lazy><Portfolio /></Lazy>} />
          <Route path="portfolio/:slug" element={<Lazy><PortfolioDetail /></Lazy>} />
          <Route path="blog" element={<Lazy><Blog /></Lazy>} />
          <Route path="blog/:slug" element={<Lazy><BlogPost /></Lazy>} />
          <Route path="contact" element={<Lazy><Contact /></Lazy>} />
          <Route path="faq" element={<Lazy><Faq /></Lazy>} />
          <Route path="warranty" element={<Lazy><Warranty /></Lazy>} />
          <Route path="awards" element={<Lazy><Awards /></Lazy>} />
          <Route path="build" element={<Navigate to="/custom-homes" replace />} />
          <Route path="remodel" element={<Navigate to="/renovations" replace />} />
          <Route path="design" element={<Navigate to="/services/planning-budgeting" replace />} />
          <Route path="neighborhoods" element={<Navigate to="/areas-we-serve" replace />} />
        </Route>

        <Route path="admin/login" element={<Lazy><AdminLogin /></Lazy>} />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Lazy><AdminDashboard /></Lazy>} />
          <Route path="posts" element={<Lazy><AdminPosts /></Lazy>} />
          <Route path="properties" element={<Lazy><AdminProperties /></Lazy>} />
          <Route path="pages" element={<Lazy><AdminPages /></Lazy>} />
          <Route path="pages/:slug" element={<Lazy><AdminPageEdit /></Lazy>} />
          <Route path="hub-pages" element={<Lazy><AdminHubPages /></Lazy>} />
          <Route path="hub-pages/:slug" element={<Lazy><AdminHubPageEdit /></Lazy>} />
          <Route path="submissions" element={<Lazy><AdminSubmissions /></Lazy>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
