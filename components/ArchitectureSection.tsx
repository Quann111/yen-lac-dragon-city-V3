import React from 'react';

const ArchitectureSection: React.FC = () => {
  const scrollToCollection = () => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
    window.dispatchEvent(new CustomEvent('nav-change', { detail: 'collection' }));
  };

  return (
    <section className="relative h-[80vh] w-full flex items-end pb-20 md:pb-32 overflow-hidden bg-white dark:bg-navy-900">
       {/* Background Image */}
       <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop" 
          alt="Luxury Entrance" 
          className="w-full h-full object-cover"
        />
        {/* Theme-aware Gradient Overlay */}
        <div className="absolute inset-0 transition-colors duration-500
          bg-gradient-to-t from-white/95 via-white/60 to-transparent
          dark:bg-gradient-to-t dark:from-navy-950/95 dark:via-navy-900/60 dark:to-transparent
        "></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12 flex flex-col items-start gap-6 max-w-4xl reveal-on-scroll">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight transition-colors duration-300
          text-royal-600 dark:text-gold-200"
        >
          Kiến Trúc Tinh Hoa, Định <br /> Hình Phong Cách
        </h2>
        
        <p className="text-base md:text-lg font-light leading-relaxed max-w-2xl pl-6 border-l-4 transition-colors duration-300
          text-gray-700 border-royal-500
          dark:text-gray-300 dark:border-gold-500"
        >
          Mỗi công trình là một kiệt tác, nơi sự sáng tạo hòa quyện cùng công năng, mang đến không gian sống vượt thời gian. Sự tỉ mỉ trong từng đường nét, vật liệu cao cấp, và thiết kế độc đáo tạo nên một biểu tượng kiến trúc.
        </p>

        <button 
          onClick={scrollToCollection}
          className="btn-luxury mt-8 px-10 py-3 rounded-full font-serif uppercase text-sm tracking-widest transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg
            bg-black/40 backdrop-blur-md shadow-lg border-2 border-gold-400 text-gold-100 hover:bg-gold-500 hover:text-navy-900 hover:border-gold-500
            dark:bg-transparent dark:border dark:border-gold-400 dark:text-gold-200 dark:hover:bg-gold-500 dark:hover:text-navy-900 dark:shadow-glow-gold"
        >
          Hành Trình Kiến Tạo +
        </button>
      </div>
    </section>
  );
};

export default ArchitectureSection;