import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Menu, X, Sun, Moon, ExternalLink } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import logo from '../image/logo/logoXoaBack.png';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme }) => {
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
        // Map 'collection' to 'architecture' so 'Kiến trúc' stays active
        const section = customEvent.detail === 'collection' ? 'architecture' : customEvent.detail;
        setActiveSection(section);
      }
    };

    window.addEventListener('nav-change', handleNavChange);
    return () => window.removeEventListener('nav-change', handleNavChange);
  }, []);

  const navLinks = [
    { name: 'Trang chủ', id: 'home' },
    { name: 'Kiến trúc', id: 'architecture' },
    { name: 'Tiện ích', id: 'amenities' },
    { name: 'Vị trí', id: 'location' },
    { name: 'Tin tức', id: 'news' },
    { name: 'Liên hệ', id: 'contact' },
  ];

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
        const baseUrl = import.meta.env.BASE_URL.endsWith('/') 
          ? import.meta.env.BASE_URL.slice(0, -1) 
          : import.meta.env.BASE_URL;
        window.history.pushState(null, '', `${baseUrl}/#${id}`);
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

  // Helper to determine text color based on Scroll state AND Theme
  // If NOT scrolled (transparent bg on dark hero): Always White
  // If Scrolled: Dark Text in Light Mode, White Text in Dark Mode
  const getTextColorClass = (isActive: boolean) => {
    // On News page, ensure visibility if header is over white background content
    // But let's assume NewsPage has a dark hero or image at top too.
    
    if (!isScrolled) {
      // Always white/gold on top (Hero Image)
      return isActive ? 'text-gold-400 font-bold' : 'text-white/90 hover:text-white';
    }
    // Scrolled state
    if (isDarkMode) {
       return isActive ? 'text-gold-400 font-bold drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]' : 'text-gray-300 hover:text-gold-200';
    } else {
       return isActive ? 'text-royal-800 font-bold drop-shadow-sm' : 'text-gray-600 hover:text-royal-600';
    }
  };

  const getLogoColorClass = () => {
    if (!isScrolled) return 'text-white';
    return isDarkMode ? 'text-white' : 'text-royal-600';
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? `backdrop-blur-md py-3 shadow-lg ${isDarkMode ? 'bg-navy-950/95 border-b border-white/5' : 'bg-white/95 border-b border-royal-600/10'}`
            : 'bg-transparent py-6'
        }`}
      >
        {/* Top Accent Line */}
        <div className={`absolute top-0 left-0 w-full h-[3px] transition-all duration-500 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-gold-700 via-gold-400 to-gold-700' 
            : 'bg-gradient-to-r from-royal-700 via-royal-400 to-royal-700'
          } ${isScrolled ? 'opacity-100' : 'opacity-0'}`}></div>

        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo Container */}
          <div className="relative group">
            {/* Logo */}
            <div 
              ref={logoButtonRef}
              className="cursor-pointer select-none p-2 rounded-lg transition-all duration-300 hover:bg-white/5"
              onClick={toggleLogoMenu}
            >
              <img 
                src={logo} 
                alt="Yên Lạc Dragon City" 
                className={`h-12 w-auto transition-all duration-500 transform group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] ${
                  (!isScrolled || isDarkMode) ? 'brightness-0 invert' : ''
                }`}
              />
            </div>

            {/* Dropdown Menu */}
            <div 
              ref={logoMenuRef}
              className={`absolute top-full left-0 mt-2 w-72 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-50
                ${isDarkMode 
                  ? 'bg-navy-900/90 border border-gold-500/30 shadow-gold-500/10' 
                  : 'bg-white/90 border border-royal-200 shadow-royal-900/10'}
              `}
            >
              <div className="p-2 flex flex-col gap-1">
                <a 
                  href="https://google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex items-center p-3 rounded-xl transition-all duration-300 group/item relative overflow-hidden
                    ${isDarkMode 
                      ? 'bg-navy-800/50 hover:bg-navy-700 text-gray-200 hover:text-gold-400 border border-transparent hover:border-gold-500/30' 
                      : 'bg-royal-50/50 hover:bg-white text-royal-800 hover:text-royal-600 border border-transparent hover:border-royal-200 shadow-sm hover:shadow-md'
                    }`}
                >
                  <div className={`mr-3 p-2 rounded-full transition-all duration-300 transform group-hover/item:scale-110 group-hover/item:rotate-12 flex-shrink-0
                    ${isDarkMode ? 'bg-gold-500/10 text-gold-400' : 'bg-royal-100 text-royal-600'}`}>
                    <ExternalLink size={18} />
                  </div>
                  <span className="text-sm font-bold truncate">Dự án 2</span>
                  <div className={`absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 pointer-events-none
                    ${isDarkMode 
                      ? 'bg-gradient-to-r from-gold-500/10 via-transparent to-transparent' 
                      : 'bg-gradient-to-r from-royal-500/10 via-transparent to-transparent'}`} 
                  />
                </a>
                
                <a 
                  href="https://google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex items-center p-3 rounded-xl transition-all duration-300 group/item relative overflow-hidden
                    ${isDarkMode 
                      ? 'bg-navy-800/50 hover:bg-navy-700 text-gray-200 hover:text-gold-400 border border-transparent hover:border-gold-500/30' 
                      : 'bg-royal-50/50 hover:bg-white text-royal-800 hover:text-royal-600 border border-transparent hover:border-royal-200 shadow-sm hover:shadow-md'
                    }`}
                >
                  <div className={`mr-3 p-2 rounded-full transition-all duration-300 transform group-hover/item:scale-110 group-hover/item:rotate-12 flex-shrink-0
                    ${isDarkMode ? 'bg-gold-500/10 text-gold-400' : 'bg-royal-100 text-royal-600'}`}>
                    <ExternalLink size={18} />
                  </div>
                  <span className="text-sm font-bold truncate">Dự án 3 - Khu đô thị mới</span>
                  <div className={`absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 pointer-events-none
                    ${isDarkMode 
                      ? 'bg-gradient-to-r from-gold-500/10 via-transparent to-transparent' 
                      : 'bg-gradient-to-r from-royal-500/10 via-transparent to-transparent'}`} 
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-sm uppercase tracking-widest transition-all duration-300 font-sans relative group py-2 font-medium ${getTextColorClass(isActive)}`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300 ease-out 
                    ${!isScrolled ? 'bg-gold-400' : (isDarkMode ? 'bg-gold-400' : 'bg-royal-600')}
                    ${isActive ? 'w-full shadow-glow' : 'w-0 group-hover:w-1/2'}`}>
                  </span>
                </button>
              );
            })}
            
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                !isScrolled 
                ? 'bg-white/10 text-white hover:bg-white/20' // On Hero: Glass effect
                : isDarkMode 
                  ? 'bg-white/10 text-gold-400 hover:bg-white/20' 
                  : 'bg-royal-50 text-royal-600 hover:bg-royal-100'
              }`}
              title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full ${!isScrolled ? 'text-white' : (isDarkMode ? 'text-gold-400' : 'text-royal-600')}`}
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button 
              className={`transition-colors ${!isScrolled ? 'text-white' : (isDarkMode ? 'text-white hover:text-gold-400' : 'text-royal-900 hover:text-royal-600')}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 flex items-center justify-center transition-all duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } ${isDarkMode ? 'bg-navy-950/98' : 'bg-white/98'}`}
      >
        <div className="flex flex-col items-center space-y-8">
          {navLinks.map((link) => {
             const isActive = activeSection === link.id;
             return (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`text-2xl font-serif transition-colors ${
                  isActive 
                  ? (isDarkMode ? 'text-gold-400' : 'text-royal-600 font-bold') 
                  : (isDarkMode ? 'text-white hover:text-gold-400' : 'text-gray-800 hover:text-royal-600')
                }`}
              >
                {link.name}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navbar;