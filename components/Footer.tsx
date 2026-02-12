import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import facebookIcon from '../image/logo/facebookicon.png';
import youtubeIcon from '../image/logo/youtube.png';
import tiktokIcon from '../image/logo/tiktok.png';

const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    
    if (id === 'news') {
      navigate('/news');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      // Update URL with full base path
      window.history.pushState(null, '', `/yen-lac-dragon-city-V3/#${id}`);
      window.dispatchEvent(new CustomEvent('nav-change', { detail: id }));
    }
  };

  return (
    <footer className="transition-colors duration-500 pt-16 pb-8 font-body
      bg-royal-900 text-gray-300 border-t border-white/10"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="text-2xl font-body font-bold text-white mb-4">Yên Lạc Dragon City</h3>
            <p className="mb-6 text-sm leading-relaxed">
              Yên Lạc Dragon City - Nơi Kiến Tạo Cuộc Sống Đẳng Cấp, mang đến những giá trị bền vững và phong cách sống thượng lưu cho cộng đồng.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-transform duration-300 hover:scale-110"
              >
                <img src={facebookIcon} alt="Facebook" className="w-8 h-8 object-contain" />
              </a>
              <a 
                href="https://www.youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-transform duration-300 hover:scale-110"
              >
                <img src={youtubeIcon} alt="Youtube" className="w-8 h-8 object-contain" />
              </a>
              <a 
                href="https://www.tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-transform duration-300 hover:scale-110"
              >
                <img src={tiktokIcon} alt="Tiktok" className="w-8 h-8 object-contain" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="col-span-1 hidden md:block">
             <h4 className="text-white font-body font-bold mb-6 text-lg">Liên kết nhanh</h4>
             <ul className="space-y-3 text-sm">
               <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="hover:text-white transition-colors">Tổng quan</a></li>
               <li><a href="#location" onClick={(e) => handleNavClick(e, 'location')} className="hover:text-white transition-colors">Vị trí</a></li>
               <li><a href="#collection" onClick={(e) => handleNavClick(e, 'collection')} className="hover:text-white transition-colors">Sản phẩm</a></li>
               <li><a href="#amenities" onClick={(e) => handleNavClick(e, 'amenities')} className="hover:text-white transition-colors">Tiện ích</a></li>
               <li><a href="#news" onClick={(e) => handleNavClick(e, 'news')} className="hover:text-white transition-colors">Tin tức</a></li>
               <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="hover:text-white transition-colors">Liên hệ</a></li>
             </ul>
          </div>

           {/* Contact Info */}
           <div className="col-span-1 lg:col-span-2">
             <h4 className="text-white font-body font-bold mb-6 text-lg">Liên hệ:</h4>
             <ul className="space-y-4 text-sm">
               <li className="flex items-start gap-3">
                 <MapPin size={18} className="mt-0.5 shrink-0 text-gold-400" />
                 <span>Địa chỉ: VPBH Dragon City, đường Nguyễn Khắc Cần, Yên Lạc, Phú Thọ</span>
               </li>
               <li className="flex items-center gap-3">
                 <Phone size={18} className="shrink-0 text-gold-400" />
                 <span>0388 591 596</span>
               </li>
               <li className="flex items-center gap-3">
                 <Mail size={18} className="shrink-0 text-gold-400" />
                 <span>sale@dragonctiy.com.vn</span>
               </li>
               <li className="flex items-center gap-3">
                 <Clock size={18} className="shrink-0 text-gold-400" />
                <span>Mở cửa T2 - CN</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;