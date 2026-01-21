import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import { ArrowUp } from 'lucide-react';

// Lazy load pages for performance optimization
const HomePage = lazy(() => import('./components/HomePage'));
const NewsPage = lazy(() => import('./components/NewsPage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-royal-50 transition-colors duration-500">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-royal-600"></div>
  </div>
);

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollTopBtnRef = useRef<HTMLButtonElement>(null);

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

  // GSAP Animation for Button
  useEffect(() => {
    if (showScrollTop) {
      gsap.to(scrollTopBtnRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
        pointerEvents: 'auto'
      });
    } else {
      gsap.to(scrollTopBtnRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
        pointerEvents: 'none'
      });
    }
  }, [showScrollTop]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Router basename="/yen-lac-dragon-city-V3">
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      
      <div className="w-full min-h-screen overflow-x-hidden font-sans relative transition-colors duration-500 bg-white">
        <Navbar />
        
        <main>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/news" element={<NewsPage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />

        {/* Scroll To Top Button */}
        <button 
          ref={scrollTopBtnRef}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-4 rounded-full shadow-lg transition-colors duration-300 hover:scale-110 opacity-0 translate-y-12 bg-royal-600 text-white border border-royal-500 hover:bg-royal-700 shadow-glow-royal"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      </div>
    </Router>
  );
};

export default App;
