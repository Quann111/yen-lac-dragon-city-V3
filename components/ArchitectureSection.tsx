import React from 'react';

const ArchitectureSection: React.FC = () => {
  const scrollToCollection = () => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', '/yen-lac-dragon-city-V3/#collection');
    window.dispatchEvent(new CustomEvent('nav-change', { detail: 'collection' }));
  };

  return (
    <section className="relative h-[80vh] w-full flex items-end pb-20 md:pb-32 overflow-hidden bg-white">
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
        "></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12 flex flex-col items-start gap-6 max-w-4xl reveal-on-scroll pt-20 md:pt-0">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight transition-colors duration-300
          text-royal-600"
        >
          Tổng quan dự án
        </h2>
        
        <p className="text-base md:text-lg font-bold leading-relaxed max-w-3xl pl-6 border-l-4 transition-colors duration-300
          text-black border-royal-500 drop-shadow-sm"
        >
          Tọa lạc tại vị trí trung tâm Yên Lạc – Thủ Phủ Thương Nghiệp miền Bắc, Yên Lạc Dragon City kiến tạo một chuẩn mực đô thị hiện đại lần đầu tiên xuất hiện tại khu vực. Với quy mô hơn 38ha, quy hoạch đồng bộ với đa dạng loại hình bất động sản từ Shophouse, nhà phố, Biệt thự song lập, chung cư cao tầng. Yên Lạc Dragon City không chỉ là nơi an cư lý tưởng mà còn được kỳ vọng trở thành biểu tượng đô thị của tỉnh Phú Thọ trong kỷ nguyên phát triển mới.
        </p>

        <button 
          onClick={scrollToCollection}
          className="btn-luxury mt-8 px-10 py-3 rounded-full font-serif uppercase text-sm tracking-widest transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg
            bg-black/40 backdrop-blur-md shadow-lg border-2 border-gold-400 text-gold-100 hover:bg-gold-500 hover:text-navy-900 hover:border-gold-500"
        >
          Hành Trình Kiến Tạo +
        </button>
      </div>
    </section>
  );
};

export default ArchitectureSection;
