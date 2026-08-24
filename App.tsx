import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ArrowUp } from 'lucide-react';
import zaloIcon from './image/logo/icon-zalo.png';
import telephoneIcon from './image/logo/telephone.png';

// Lazy load pages for performance optimization
const HomePage = lazy(() => import('./components/HomePage'));
const NewsPage = lazy(() => import('./components/NewsPage'));
const RecruitmentPage = lazy(() => import('./components/recruitment/RecruitmentPage'));
const JobDetailPage = lazy(() => import('./components/recruitment/JobDetailPage'));
const AdminLoginPage = lazy(() => import('./components/recruitment/AdminLoginPage'));
const AdminGuard = lazy(() => import('./components/recruitment/AdminGuard'));
const AdminLayout = lazy(() => import('./components/recruitment/AdminLayout'));
const AdminJobsPage = lazy(() => import('./components/recruitment/AdminJobsPage'));
const AdminApplicationsPage = lazy(() => import('./components/recruitment/AdminApplicationsPage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-royal-50 transition-colors duration-500">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-royal-600"></div>
  </div>
);

const AppShell: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Ensure Light Mode
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Scroll to Top visibility logic
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
      <div className="w-full min-h-screen overflow-x-hidden font-sans relative transition-colors duration-500 bg-white">
        {!isAdmin && <Navbar />}
        
        <main>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/tuyen-dung" element={<RecruitmentPage />} />
              <Route path="/tuyen-dung/:slug" element={<JobDetailPage />} />
              <Route path="/admin/dang-nhap" element={<AdminLoginPage />} />
              <Route element={<AdminGuard />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<Navigate to="/admin/tuyen-dung" replace />} />
                  <Route path="/admin/tuyen-dung" element={<AdminJobsPage />} />
                  <Route path="/admin/ung-vien" element={<AdminApplicationsPage />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        {!isAdmin && <Footer />}

        {/* Social Buttons */}
        {!isAdmin && <div className={`fixed bottom-8 right-8 z-40 flex flex-col gap-3 transition-all duration-500 animate-shake-occasionally ${
          showScrollTop 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-12 pointer-events-none lg:opacity-100 lg:translate-y-0 lg:pointer-events-auto'
        }`}>
          <a 
            href="https://zalo.me/0986037396" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 shadow-xl transition-transform duration-300 hover:scale-110 flex items-center justify-center bg-transparent overflow-hidden rounded-full"
          >
             <img src={zaloIcon} alt="Zalo" className="w-full h-full object-contain" />
          </a>
          <a 
            href="tel:0986037396" 
            className="w-10 h-10 shadow-xl transition-transform duration-300 hover:scale-110 flex items-center justify-center bg-transparent overflow-hidden rounded-full"
          >
             <img src={telephoneIcon} alt="Hotline" className="w-full h-full object-contain" />
          </a>
        </div>}

        {/* Scroll To Top Button */}
        {!isAdmin && <button
          onClick={scrollToTop}
          className={`fixed bottom-36 right-8 z-40 w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 bg-royal-600 text-white border border-royal-500 hover:bg-royal-700 shadow-glow-royal ${
            showScrollTop 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 translate-y-12 pointer-events-none'
          }`}
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>}
      </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppShell />
    </Router>
  );
};

export default App;
