import React from 'react';
import { Trees, Landmark, Building2, MapPin, Car } from 'lucide-react';

const AmenitiesSection: React.FC = () => {
  const scrollToLocation = () => {
    document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', '/yen-lac-dragon-city-V3/#location');
    window.dispatchEvent(new CustomEvent('nav-change', { detail: 'location' }));
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
            Dự án khu đô thị Yên Lạc Dragon City với quy mô 50 ha và mật độ xây dựng chỉ gần 56%, dự án dành tới 20 ha cho không gian cây xanh, mặt nước để kiến tạo lên những mảng tiện ích xanh như hồ điều hòa, công viên Gym, công viên...
          </p>
          <p>
            Bên cạnh đó, hướng đến sự thoải mái và thuận tiện tối ưu, Khu đô thị Yên Lạc được quy hoạch với hệ thống tiện ích khép kín, đáp ứng mọi nhu cầu của cư dân.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Cultural & Admin */}
          <div className="flex flex-col items-center gap-4 group cursor-pointer bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-royal-200 hover:bg-white transition-all duration-300 h-full shadow-lg">
            <div className="w-20 h-20 rounded-full border border-royal-200 bg-royal-50 flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110 group-hover:bg-royal-600 group-hover:text-white shrink-0">
               <Landmark className="w-10 h-10 text-royal-600 group-hover:text-inherit transition-colors" />
            </div>
            <h3 className="text-royal-900 font-body font-bold tracking-wide text-lg uppercase text-shadow-sm h-14 flex items-center justify-center text-center transition-colors">Văn Hoá & Hành Chính</h3>
          </div>

          {/* Mixed Use Complex */}
          <div className="flex flex-col items-center gap-4 group cursor-pointer bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-royal-200 hover:bg-white transition-all duration-300 h-full shadow-lg">
            <div className="w-20 h-20 rounded-full border border-royal-200 bg-royal-50 flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110 group-hover:bg-royal-600 group-hover:text-white shrink-0">
               <Building2 className="w-10 h-10 text-royal-600 group-hover:text-inherit transition-colors" />
            </div>
            <h3 className="text-royal-900 font-body font-bold tracking-wide text-lg uppercase text-shadow-sm h-14 flex items-center justify-center text-center transition-colors">Công Trình Hỗn Hợp</h3>
          </div>

          {/* Square & Parking */}
          <div className="flex flex-col items-center gap-4 group cursor-pointer bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-royal-200 hover:bg-white transition-all duration-300 h-full shadow-lg">
            <div className="w-20 h-20 rounded-full border border-royal-200 bg-royal-50 flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110 group-hover:bg-royal-600 group-hover:text-white shrink-0">
               <Car className="w-10 h-10 text-royal-600 group-hover:text-inherit transition-colors" />
            </div>
            <h3 className="text-royal-900 font-body font-bold tracking-wide text-lg uppercase text-shadow-sm h-14 flex items-center justify-center text-center transition-colors">Quảng Trường & Khu Vực Đỗ Xe</h3>
          </div>
        </div>

        <button 
          onClick={scrollToLocation}
          className="btn-luxury inline-flex items-center gap-2 px-10 py-4 rounded-full backdrop-blur-md border border-white/30 text-white uppercase tracking-widest font-body font-bold text-sm shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300
          bg-black/40 border-gold-400 text-gold-100 hover:bg-gold-500 hover:text-navy-900 hover:border-gold-500"
        >
          <MapPin size={18} /> Xem Vị Trí
        </button>
      </div>
    </section>
  );
};

export default AmenitiesSection;