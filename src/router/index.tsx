import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { Home } from '../pages/public/Home';
import { About } from '../pages/public/About';
import { Services } from '../pages/public/Services';
import { Process } from '../pages/public/Process';
import { Testimonials } from '../pages/public/Testimonials';
import { Portfolio } from '../pages/public/Portfolio';
import { PortfolioDetail } from '../pages/public/PortfolioDetail';
import { Blog } from '../pages/public/Blog';
import { BlogPost } from '../pages/public/BlogPost';
import { Contact } from '../pages/public/Contact';
import { Faq } from '../pages/public/Faq';
import { Warranty } from '../pages/public/Warranty';
import { Awards } from '../pages/public/Awards';
import { CostEstimator } from '../pages/public/CostEstimator';
import { AvailableHomes } from '../pages/public/AvailableHomes';
import { BuilderTransitionCaseStudy } from '../pages/public/CaseStudies';
import {
  CustomHomes, Renovations, Preconstruction, WhyChooseBuchan, AreasWeServe,
  Adus, FireRestoration, PlanningBudgeting, RealEstate, FindYourLot,
  SellYourHome, SellToBuchan, HomeCare, LandAcquisition, SecondOpinion, PropertyFeasibility,
} from '../pages/public/IaPages';
import { AdminLogin } from '../pages/admin/Login';
import { AdminDashboard } from '../pages/admin/Dashboard';
import { AdminPosts } from '../pages/admin/Posts';
import { AdminProperties } from '../pages/admin/Properties';
import { AdminSubmissions } from '../pages/admin/Submissions';
import { AdminPages } from '../pages/admin/Pages';
import { AdminPageEdit } from '../pages/admin/PageEdit';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="custom-homes" element={<CustomHomes />} />
          <Route path="renovations" element={<Renovations />} />
          <Route path="preconstruction" element={<Preconstruction />} />
          <Route path="available-homes" element={<AvailableHomes />} />
          <Route path="cost-estimator" element={<CostEstimator />} />
          <Route path="case-studies/builder-transition" element={<BuilderTransitionCaseStudy />} />
          <Route path="why-choose-buchan" element={<WhyChooseBuchan />} />
          <Route path="areas-we-serve" element={<AreasWeServe />} />
          <Route path="land-acquisition" element={<LandAcquisition />} />
          <Route path="second-opinion" element={<SecondOpinion />} />
          <Route path="property-feasibility" element={<PropertyFeasibility />} />
          <Route path="services/adus" element={<Adus />} />
          <Route path="services/fire-restoration" element={<FireRestoration />} />
          <Route path="services/planning-budgeting" element={<PlanningBudgeting />} />
          <Route path="services/real-estate" element={<RealEstate />} />
          <Route path="services/real-estate/find-your-lot" element={<FindYourLot />} />
          <Route path="services/real-estate/sell-your-home" element={<SellYourHome />} />
          <Route path="services/real-estate/sell-to-buchan" element={<SellToBuchan />} />
          <Route path="services/home-care" element={<HomeCare />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="process" element={<Process />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="portfolio/:slug" element={<PortfolioDetail />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<Faq />} />
          <Route path="warranty" element={<Warranty />} />
          <Route path="awards" element={<Awards />} />
          <Route path="build" element={<Navigate to="/custom-homes" replace />} />
          <Route path="remodel" element={<Navigate to="/renovations" replace />} />
          <Route path="design" element={<Navigate to="/services/planning-budgeting" replace />} />
          <Route path="neighborhoods" element={<Navigate to="/areas-we-serve" replace />} />
        </Route>

        <Route path="admin/login" element={<AdminLogin />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="pages/:slug" element={<AdminPageEdit />} />
          <Route path="submissions" element={<AdminSubmissions />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
