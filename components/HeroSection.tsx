import React from 'react';

const HeroSection: React.FC = () => {
  const scrollToArchitecture = () => {
    document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' });
    window.dispatchEvent(new CustomEvent('nav-change', { detail: 'architecture' }));
  };

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Zoom Effect */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Building Exterior" 
          className="w-full h-full object-cover transition-all duration-1000 brightness-100 dark:brightness-[0.5] scale-105 dark:animate-[pulse_30s_ease-in-out_infinite]"
        />
        {/* Gradient Overlay - Only visible in Dark Mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70 opacity-0 dark:opacity-100 transition-opacity duration-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 reveal-on-scroll">
        <h2 className="text-gold-400 font-marschel tracking-[0.2em] text-sm md:text-base uppercase mb-4 drop-shadow-lg font-bold transition-colors duration-300">
          Tinh Hoa Bất Động Sản
        </h2>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-marschel text-gold-100 mb-6 leading-tight drop-shadow-xl font-bold tracking-tight transition-colors duration-300">
          Yên Lạc <span className="text-gold-500 transition-colors duration-300">Dragon City</span>
        </h1>
        <div className="h-[2px] w-24 bg-gold-500 mx-auto mb-8 shadow-glow-gold transition-colors duration-300"></div>
        <p className="font-marschel font-medium text-lg md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow-lg text-shadow transition-colors duration-300">
          <span className="bg-black/50 backdrop-blur-md rounded px-2 py-0.5 box-decoration-clone text-gray-100 dark:bg-transparent dark:backdrop-blur-none transition-all duration-300">
            Kiến tạo những kiệt tác sống vượt thời gian, nơi đẳng cấp hội tụ cùng sự thịnh vượng bền vững.
          </span>
        </p>
        
        {/* Button - Gold theme in both Light and Dark Mode */}
        <button 
          onClick={scrollToArchitecture}
          className="btn-luxury group relative px-10 py-4 rounded-full font-marschel uppercase tracking-widest transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-2xl
          bg-black/40 backdrop-blur-md shadow-lg border-2
          border-gold-400 text-gold-100 hover:bg-gold-500 hover:text-navy-900 hover:border-gold-500"
        >
          <span className="relative z-10 font-bold text-lg">Khám Phá Ngay</span>
        </button>
      </div>

      {/* Scroll Indicator */}
      <div 
        onClick={scrollToArchitecture}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer p-4 z-20 group"
        aria-label="Scroll down"
      >
        <div className="w-[2px] h-16 bg-gradient-to-b from-transparent via-white to-transparent group-hover:h-20 transition-all duration-500 shadow-glow-gold"></div>
      </div>
    </section>
  );
};

export default HeroSection;