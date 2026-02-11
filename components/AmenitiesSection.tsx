import React from 'react';
import { Trees, ShoppingBag, GraduationCap, MapPin, Car, Phone, Heart } from 'lucide-react';

const AmenitiesSection: React.FC = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', '/yen-lac-dragon-city-V3/#contact');
    window.dispatchEvent(new CustomEvent('nav-change', { detail: 'contact' }));
  };

  return (
    <section className="relative min-h-[90vh] w-full flex flex-col items-center justify-center py-20">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2070&auto=format&fit=crop" 
          alt="Green City Park Lake" 
          className="w-full h-full object-cover transition-all duration-700"
        />
        {/* 
          Light Mode: No overlay (Day time)
        */}
        <div className="absolute inset-0 transition-opacity duration-700 opacity-0 bg-black/80"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center reveal-on-scroll">
        <h2 className="text-xl md:text-3xl font-body font-bold text-white mb-8 drop-shadow-lg leading-tight transition-colors duration-500 uppercase whitespace-nowrap">
          Tiện ích
        </h2>
        
        <div className="hidden md:block text-white font-body text-base md:text-lg max-w-5xl mx-auto mb-16 space-y-6 text-justify md:text-center transition-colors duration-500 bg-black/40 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border border-white/10">
          <p>
            Yên Lạc Dragon City kiến tạo không gian sống đẳng cấp với quần thể công viên cây xanh đa năng, khu vui chơi sáng tạo và khu BBQ ngoài trời. Trong bán kính vàng, cư dân dễ dàng tiếp cận với bệnh viên, khu thể thao cùng hệ thống giáo dục liên cấp mầm non tới cấp 3.
          </p>
          <p>
            Đặc biệt, dự án ôm trọn khu vực Quảng Trường Trung Tâm và Sân Vận Động – nơi hội tụ các sự kiện văn hóa, giải trí và hoạt động thương mại sôi động bậc nhất khu vực.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Commercial Center */}
          <div className="flex flex-col items-center gap-4 group cursor-pointer bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-royal-200 hover:bg-white transition-all duration-300 h-full shadow-lg">
            <div className="w-20 h-20 rounded-full border border-royal-200 bg-royal-50 flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110 group-hover:bg-royal-600 group-hover:text-white shrink-0">
               <ShoppingBag className="w-10 h-10 text-royal-600 group-hover:text-inherit transition-colors" />
            </div>
            <h3 className="text-royal-900 font-body font-bold tracking-wide text-lg uppercase text-shadow-sm h-14 flex items-center justify-center text-center transition-colors">Trung tâm Thương mại Dịch vụ</h3>
          </div>

          {/* International School */}
          <div className="flex flex-col items-center gap-4 group cursor-pointer bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-royal-200 hover:bg-white transition-all duration-300 h-full shadow-lg">
            <div className="w-20 h-20 rounded-full border border-royal-200 bg-royal-50 flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110 group-hover:bg-royal-600 group-hover:text-white shrink-0">
               <GraduationCap className="w-10 h-10 text-royal-600 group-hover:text-inherit transition-colors" />
            </div>
            <h3 className="text-royal-900 font-body font-bold tracking-wide text-lg uppercase text-shadow-sm h-14 flex items-center justify-center text-center transition-colors">Trường Liên cấp Quốc Tế</h3>
          </div>

          {/* Park, Parking & Health */}
          <div className="flex flex-col items-center gap-4 group cursor-pointer bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-royal-200 hover:bg-white transition-all duration-300 h-full shadow-lg">
            <div className="w-20 h-20 rounded-full border border-royal-200 bg-royal-50 flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110 group-hover:bg-royal-600 group-hover:text-white shrink-0">
               <Heart className="w-10 h-10 text-royal-600 group-hover:text-inherit transition-colors" />
            </div>
            <h3 className="text-royal-900 font-body font-bold tracking-wide text-lg uppercase text-shadow-sm h-14 flex items-center justify-center text-center transition-colors">Công viên, Parking & Hệ thống chăm sóc sức khoẻ</h3>
          </div>
        </div>

        <button 
          onClick={scrollToContact}
          className="btn-luxury inline-flex items-center gap-2 px-10 py-4 rounded-full backdrop-blur-md border border-white/30 text-white uppercase tracking-widest font-body font-bold text-sm shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300
          bg-black/40 border-gold-400 text-gold-100 hover:bg-gold-500 hover:text-navy-900 hover:border-gold-500"
        >
          <Phone size={18} /> Liên Hệ Ngay
        </button>
      </div>
    </section>
  );
};

export default AmenitiesSection;