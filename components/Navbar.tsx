import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Menu, X, ExternalLink } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import logo from '../image/logo/logoXoaBack.png';
import facebookIcon from '../image/logo/facebookicon.png';
import youtubeIcon from '../image/logo/youtube.png';
import tiktokIcon from '../image/logo/tiktok.png';

const navLinks = [
  { name: 'Tổng quan', id: 'home' },
  { name: 'Vị trí', id: 'location' },
  { name: 'Sản phẩm', id: 'collection' },
  { name: 'Tiện ích', id: 'amenities' },
  { name: 'Tin tức', id: 'news' },
  { name: 'Liên hệ', id: 'contact' },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoMenuOpen, setIsLogoMenuOpen] = useState(false);
  const logoMenuRef = useRef<HTMLDivElement>(null);
  const logoButtonRef = useRef<HTMLDivElement>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const [activeSection, setActiveSection] = useState(location.pathname === '/news' ? 'news' : 'home');

  // Sync active section with path
  useEffect(() => {
    if (location.pathname === '/news') {
      setActiveSection('news');
    }
  }, [location.pathname]);

  // Set initial state for Logo Menu
  useLayoutEffect(() => {
    if (logoMenuRef.current) {
      gsap.set(logoMenuRef.current, { display: 'none', opacity: 0, y: -20 });
    }
  }, []);

  // Handle Logo Menu Animation
  useEffect(() => {
    const menu = logoMenuRef.current;
    if (!menu) return;

    if (isLogoMenuOpen) {
      gsap.fromTo(menu, 
        { opacity: 0, y: -20, display: 'none' },
        { opacity: 1, y: 0, display: 'block', duration: 0.3, ease: 'power2.out' }
      );
    } else {
      gsap.to(menu, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(menu, { display: 'none' });
        }
      });
    }
  }, [isLogoMenuOpen]);

  const toggleLogoMenu = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsLogoMenuOpen(!isLogoMenuOpen);
  };

  // Close Logo Menu on Click Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isLogoMenuOpen &&
        logoMenuRef.current &&
        !logoMenuRef.current.contains(event.target as Node) &&
        logoButtonRef.current &&
        !logoButtonRef.current.contains(event.target as Node)
      ) {
        setIsLogoMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLogoMenuOpen]);

  // Handle scroll spy
  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 100; // Offset for sticky header

      // Check if we are at the bottom of the page
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        setActiveSection('contact');
        return;
      }

      for (const link of navLinks) {
        if (link.id === 'news') continue; // Skip news as it's a separate page
        
        const element = document.getElementById(link.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(link.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy);
    // Initial check
    handleScrollSpy();
    
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [location.pathname]);

  // Handle Navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for custom navigation events
  useEffect(() => {
    const handleNavChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        // Update active section directly
        setActiveSection(customEvent.detail);
      }
    };

    window.addEventListener('nav-change', handleNavChange);
    return () => window.removeEventListener('nav-change', handleNavChange);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    setActiveSection(id);

    if (id === 'news') {
      navigate('/news');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        
        // Update hash without scrolling again
        window.history.pushState(null, '', `/yen-lac-dragon-city-V3/#${id}`);
      }
    }
  };

  // Handle scroll from other pages via Hash
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const targetId = location.hash.replace('#', '');
      
      // Retry mechanism to ensure element exists before scrolling
      const attemptScroll = (attempts: number) => {
        const element = document.getElementById(targetId);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        } else if (attempts > 0) {
          setTimeout(() => attemptScroll(attempts - 1), 100);
        }
      };

      // Try for up to 2 seconds
      attemptScroll(20);
    }
  }, [location.pathname, location.hash]);

  // Helper to determine text color based on Scroll state
  const getTextColorClass = (isActive: boolean) => {
    if (!isScrolled) {
      // Always white/gold on top (Hero Image)
      return isActive ? 'text-gold-400 font-bold' : 'text-white/90 hover:text-white';
    }
    // Scrolled state
    return isActive ? 'text-royal-800 font-bold drop-shadow-sm' : 'text-gray-600 hover:text-royal-600';
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isMobileMenuOpen 
            ? 'bg-white py-4 shadow-md'
            : isScrolled
              ? 'backdrop-blur-md py-3 shadow-lg bg-white/95 border-b border-royal-600/10'
              : 'bg-transparent py-6'
        }`}
      >
        {/* Top Accent Line */}
        <div className={`absolute top-0 left-0 w-full h-[3px] transition-all duration-500 bg-gradient-to-r from-royal-700 via-royal-400 to-royal-700 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}></div>

        <div className="w-full px-6 md:px-10 lg:px-20 flex items-center justify-between">
          {/* Logo Container */}
          <div className="relative group -ml-2">
            {/* Logo */}
            <div 
              ref={logoButtonRef}
              className="cursor-pointer select-none p-2 rounded-lg transition-all duration-300 hover:bg-white/5"
              onClick={toggleLogoMenu}
            >
              <img 
                src={logo} 
                alt="Yên Lạc Dragon City" 
                className="h-9 md:h-12 w-auto transition-all duration-500 transform group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
              />
            </div>

            {/* Dropdown Menu */}
            <div 
              ref={logoMenuRef}
              className="absolute top-full left-0 mt-2 w-72 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-50 bg-white/90 border border-royal-200 shadow-royal-900/10"
            >
              <div className="p-2 flex flex-col gap-1">
                <a 
                  href="https://google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-3 rounded-xl transition-all duration-300 group/item relative overflow-hidden bg-royal-50/50 hover:bg-white text-royal-800 hover:text-royal-600 border border-transparent hover:border-royal-200 shadow-sm hover:shadow-md"
                >
                  <div className="mr-3 p-2 rounded-full transition-all duration-300 transform group-hover/item:scale-110 group-hover/item:rotate-12 flex-shrink-0 bg-royal-100 text-royal-600">
                    <ExternalLink size={18} />
                  </div>
                  <span className="text-sm font-bold truncate">Dự án 2</span>
                  <div className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-royal-500/10 via-transparent to-transparent" />
                </a>
                
                <a 
                  href="https://google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-3 rounded-xl transition-all duration-300 group/item relative overflow-hidden bg-royal-50/50 hover:bg-white text-royal-800 hover:text-royal-600 border border-transparent hover:border-royal-200 shadow-sm hover:shadow-md"
                >
                  <div className="mr-3 p-2 rounded-full transition-all duration-300 transform group-hover/item:scale-110 group-hover/item:rotate-12 flex-shrink-0 bg-royal-100 text-royal-600">
                    <ExternalLink size={18} />
                  </div>
                  <span className="text-sm font-bold truncate">Dự án 3 - Khu đô thị mới</span>
                  <div className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-royal-500/10 via-transparent to-transparent" />
                </a>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden xl:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-sm uppercase tracking-widest transition-all duration-300 font-body relative group py-2 font-medium ${getTextColorClass(isActive)}`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300 ease-out 
                    ${!isScrolled ? 'bg-gold-400' : 'bg-royal-600'}
                    ${isActive ? 'w-full shadow-glow' : 'w-0 group-hover:w-1/2'}`}>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Social Icons & Tools (Right) */}
          <div className="hidden xl:flex items-center gap-4 ml-6">
             <a 
               href="https://www.facebook.com/dragoncity.yenlac/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="transition-transform duration-300 hover:scale-110"
             >
               <img src={facebookIcon} alt="Facebook" className="w-8 h-8 object-contain" />
             </a>
             <a 
               href="https://www.youtube.com/results?search_query=yên+lạc+dragon+city" 
               target="_blank" 
               rel="noopener noreferrer"
               className="transition-transform duration-300 hover:scale-110"
             >
               <img src={youtubeIcon} alt="Youtube" className="w-8 h-8 object-contain" />
             </a>
             <a 
               href="https://www.tiktok.com/search?q=yên%20lạc%20dragon%20city" 
               target="_blank" 
               rel="noopener noreferrer"
               className="transition-transform duration-300 hover:scale-110"
             >
               <img src={tiktokIcon} alt="Tiktok" className="w-8 h-8 object-contain" />
             </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 xl:hidden">
            <button 
              className={`transition-colors ${(!isScrolled && !isMobileMenuOpen) ? 'text-white' : 'text-royal-900 hover:text-royal-600'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={32} strokeWidth={3} /> : <Menu size={32} strokeWidth={3} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Container */}
      <div 
        className={`fixed inset-x-0 bottom-0 top-[84px] z-40 xl:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Drawer */}
        <div 
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col px-6 transition-transform duration-500 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col w-full">
            {navLinks.map((link) => {
               const isActive = activeSection === link.id;
               return (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`w-full text-left py-5 border-b border-royal-100 font-body uppercase tracking-widest text-sm transition-all duration-300 ${
                    isActive 
                    ? 'text-royal-800 font-bold pl-2 bg-royal-50/50' 
                    : 'text-gray-600 hover:text-royal-600 hover:pl-2 hover:bg-royal-50/30'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
