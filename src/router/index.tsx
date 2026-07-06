import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { Home } from '../pages/public/Home';
import { About } from '../pages/public/About';
import { Services } from '../pages/public/Services';
import { Build, Design, Remodel } from '../pages/public/ServicePages';
import { Process } from '../pages/public/Process';
import { Neighborhoods } from '../pages/public/Neighborhoods';
import { Testimonials } from '../pages/public/Testimonials';
import { Portfolio } from '../pages/public/Portfolio';
import { PortfolioDetail } from '../pages/public/PortfolioDetail';
import { Blog } from '../pages/public/Blog';
import { BlogPost } from '../pages/public/BlogPost';
import { Contact } from '../pages/public/Contact';
import { Faq } from '../pages/public/Faq';
import { Warranty } from '../pages/public/Warranty';
import { Awards } from '../pages/public/Awards';
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
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="build" element={<Build />} />
          <Route path="design" element={<Design />} />
          <Route path="remodel" element={<Remodel />} />
          <Route path="process" element={<Process />} />
          <Route path="neighborhoods" element={<Neighborhoods />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="portfolio/:slug" element={<PortfolioDetail />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<Faq />} />
          <Route path="warranty" element={<Warranty />} />
          <Route path="awards" element={<Awards />} />
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
