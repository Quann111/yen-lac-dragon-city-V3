import React from 'react';
import heroBg from '../image/anhTintuc/06.webp';

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
          className="w-full h-full object-cover md:object-cover object-center transition-all duration-1000 brightness-100 scale-100 md:scale-105"
        />
        {/* Gradient Overlay - Dark bottom, bright top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90"></div>
      </div>

      {/* Content */}
      <div className="absolute bottom-20 md:bottom-12 left-6 md:left-20 z-10 text-left max-w-5xl reveal-on-scroll drop-shadow-2xl">
        {/* Badge */}
        <div className="inline-block bg-[#FDB913] text-black font-bold px-4 py-1.5 rounded-md text-xs md:text-sm mb-6 tracking-widest uppercase shadow-[0_4px_10px_rgba(0,0,0,0.5)] border border-white/20 backdrop-blur-sm">
           Bất Động Sản
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-orbitron mb-6 leading-tight drop-shadow-[0_8px_8px_rgba(0,0,0,0.9)] font-bold tracking-widest md:whitespace-nowrap uppercase text-white">
          <span className="font-qbone block md:inline mb-2 md:mb-0 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 filter drop-shadow-[0_5px_5px_rgba(0,0,0,1)]">Yên Lạc</span>
          <span className="block md:inline text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 filter drop-shadow-[0_5px_5px_rgba(0,0,0,1)]">Dragon City</span>
        </h1>

        {/* Divider */}
        <div className="h-[1px] w-full max-w-2xl bg-white mb-8 shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
        
        {/* Description */}
        <p className="font-medium text-lg md:text-xl text-white max-w-3xl leading-relaxed drop-shadow-[0_4px_4px_rgba(0,0,0,1)] mb-0 text-shadow-lg">
          Lấy cảm hứng từ những đô thị phồn hoa bậc nhất, từ trái tim Yên Lạc – Thủ Phủ Thương Nghiệp Miền Bắc, một đô thị đầu tiên đạt chuẩn hiện đại đang hình thành, kiến tạo hài hòa giữa tiện nghi, thẩm mỹ và giá trị đầu tư bền vững.
        </p>
      </div>

      {/* Scroll Indicator */}
      <div 
        onClick={scrollToArchitecture}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer p-2 z-20 group"
        aria-label="Scroll down"
      >
        <div className="w-2 h-2 border-r border-b border-white rotate-45 mx-auto"></div>
      </div>
    </section>
  );
};

export default HeroSection;
