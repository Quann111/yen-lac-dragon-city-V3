import React from 'react';
import heroBg from '../image/TongThe.png';

const HeroSection: React.FC = () => {
  const scrollToArchitecture = () => {
    document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', '/yen-lac-dragon-city-V3/#architecture');
    window.dispatchEvent(new CustomEvent('nav-change', { detail: 'architecture' }));
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Zoom Effect */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg}
          alt="Yên Lạc Dragon City" 
          className="w-full h-full object-cover md:object-cover object-[72%_center] md:object-center transition-all duration-1000 brightness-110 scale-100 md:scale-105"
        />
        {/* Gradient Overlay - Dark bottom, bright top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="absolute bottom-10 md:bottom-10 left-3 md:left-10 lg:left-20 z-10 text-left max-w-[95%] md:max-w-5xl reveal-on-scroll drop-shadow-2xl">
        {/* Badge */}
        <div className="inline-block bg-[#FDB913] text-black font-body font-bold px-4 py-1.5 md:px-4 md:py-1.5 rounded-full md:rounded-md text-[10px] md:text-xs mb-3 md:mb-6 tracking-widest uppercase shadow-lg border-none">
           Bất Động Sản
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-qbone mb-2 md:mb-6 leading-none drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] font-bold tracking-wide md:tracking-widest text-white md:whitespace-nowrap">
          <span className="block md:inline mr-0 md:mr-4">Yên Lạc</span>
          <span className="block md:inline">Dragon City</span>
        </h1>

        {/* Description */}
        <p className="font-body font-normal text-sm md:text-sm text-white/90 max-w-lg leading-relaxed drop-shadow-md mb-0 text-justify md:text-left pr-4 md:pr-0 [text-wrap:pretty]">
          Lấy cảm hứng từ những đô thị phồn hoa bậc nhất, từ trái tim Yên Lạc – Thủ Phủ Thương Nghiệp Miền Bắc, một đô thị đầu tiên đạt chuẩn hiện đại đang hình thành, kiến tạo hài hòa giữa tiện nghi, thẩm mỹ và giá trị đầu tư bền vững.
        </p>
      </div>

      {/* Scroll Indicator */}
      <div 
        onClick={scrollToArchitecture}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer p-2 z-20 group"
        aria-label="Scroll down"
      >
        <div className="w-2 h-2 border-r border-b border-white rotate-45 mx-auto"></div>
      </div>
    </section>
  );
};

export default HeroSection;
