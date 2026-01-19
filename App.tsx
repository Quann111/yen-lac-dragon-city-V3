import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import { ArrowUp, Phone } from 'lucide-react';
import zaloIconImg from './image/logo/zaloimage.png';

// Lazy load pages for performance optimization
const HomePage = lazy(() => import('./components/HomePage'));
const NewsPage = lazy(() => import('./components/NewsPage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-royal-50 dark:bg-navy-950 transition-colors duration-500">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-royal-600 dark:border-gold-500"></div>
  </div>
);

const App: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  // Default to Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const scrollTopBtnRef = useRef<HTMLButtonElement>(null);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  // Toggle Theme Function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply Theme to HTML tag
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDarkMode]);

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
      <div className="w-full min-h-screen overflow-x-hidden font-sans relative transition-colors duration-500 bg-white dark:bg-navy-950">
        
        {/* Preloader */}
        {isLoading && <Preloader onComplete={handlePreloaderComplete} />}

        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        
        <main>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage isDarkMode={isDarkMode} />} />
              <Route path="/news" element={<NewsPage isDarkMode={isDarkMode} />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />

        {/* Scroll To Top Button */}
        <button 
          ref={scrollTopBtnRef}
          onClick={scrollToTop}
          className={`fixed bottom-48 right-8 z-40 p-4 rounded-full shadow-lg transition-colors duration-300 hover:scale-110 opacity-0 translate-y-12
            ${isDarkMode 
              ? 'bg-gold-500 text-white border border-gold-400 hover:bg-gold-600 shadow-glow-gold' 
              : 'bg-royal-600 text-white border border-royal-500 hover:bg-royal-700 shadow-glow-royal'
            }`
          }
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>

        {/* Contact Buttons */}
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 items-center">
            {/* Zalo */}
            <a 
              href="https://zalo.me/0972979717" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 block overflow-hidden"
              aria-label="Chat on Zalo"
              title="Nhắn tin Zalo: 0972 979 717"
            >
              <img src={zaloIconImg} alt="Zalo" className="w-full h-full object-cover" />
            </a>

            {/* Phone */}
            <a 
              href="tel:0972979717" 
              className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 bg-red-600 text-white border-2 border-white"
              aria-label="Call Now"
              title="Gọi ngay: 0972 979 717"
            >
              <Phone size={24} />
            </a>
        </div>
      </div>
    </Router>
  );
};

export default App;
