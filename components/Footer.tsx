import React from 'react';
import { Facebook, Twitter, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    
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
              <a href="#" className="p-2 rounded-full transition-colors bg-white/5 hover:bg-white/20 hover:text-white"><Facebook size={18} /></a>
              <a href="#" className="p-2 rounded-full transition-colors bg-white/5 hover:bg-white/20 hover:text-white"><Twitter size={18} /></a>
              <a href="#" className="p-2 rounded-full transition-colors bg-white/5 hover:bg-white/20 hover:text-white"><Instagram size={18} /></a>
            </div>
          </div>

          {/* Links */}
          <div className="col-span-1 hidden md:block">
             <h4 className="text-white font-body font-bold mb-6 text-lg">Liên kết nhanh</h4>
             <ul className="space-y-3 text-sm">
               <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="hover:text-white transition-colors">Trang chủ</a></li>
               <li><a href="#collection" onClick={(e) => handleNavClick(e, 'collection')} className="hover:text-white transition-colors">Dự án</a></li>
               <li><a href="#architecture" onClick={(e) => handleNavClick(e, 'architecture')} className="hover:text-white transition-colors">Giới thiệu</a></li>
               <li><a href="#amenities" onClick={(e) => handleNavClick(e, 'amenities')} className="hover:text-white transition-colors">Tiện ích</a></li>
               <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="hover:text-white transition-colors">Liên hệ</a></li>
             </ul>
          </div>

           {/* Contact Info */}
           <div className="col-span-1 lg:col-span-2">
             <h4 className="text-white font-body font-bold mb-6 text-lg">Liên hệ chúng tôi</h4>
             <ul className="space-y-4 text-sm">
               <li className="flex items-start gap-3">
                 <MapPin size={18} className="mt-0.5 shrink-0 text-gold-400" />
                 <span>Tầng 05, Tòa New Skyline, KĐT Văn Quán, Hà Đông</span>
               </li>
               <li className="flex items-center gap-3">
                 <Phone size={18} className="shrink-0 text-gold-400" />
                 <span>0978.32.98.33</span>
               </li>
               <li className="flex items-center gap-3">
                 <Mail size={18} className="shrink-0 text-gold-400" />
                 <span>contact@yenlacdragoncity.com</span>
               </li>
               <li className="flex items-center gap-3">
                 <div className="w-[18px] text-center font-body font-bold shrink-0 text-gold-400">@</div>
                 <span>yenlacdragoncity.com</span>
               </li>
               <li className="flex items-center gap-3">
                 <div className="w-[18px] text-center font-body font-bold shrink-0 text-gold-400">©</div>
                 <span>Mã cửa T2 - CN</span>
               </li>
             </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center text-xs text-gray-500">
           © 2023 Yên Lạc Dragon City. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;