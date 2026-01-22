import React from 'react';

const ArchitectureSection: React.FC = () => {
  const scrollToCollection = () => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', '/yen-lac-dragon-city-V3/#collection');
    window.dispatchEvent(new CustomEvent('nav-change', { detail: 'collection' }));
  };

  return (
    <section className="relative min-h-[80vh] h-auto lg:h-[80vh] w-full flex items-end pb-20 lg:pb-32 overflow-hidden bg-white">
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

      <div className="relative z-10 container mx-auto px-6 lg:px-12 flex flex-col items-start gap-6 max-w-4xl reveal-on-scroll pt-20 lg:pt-0 font-body">
        <div className="bg-white/90 backdrop-blur-xl p-8 lg:p-12 rounded-2xl shadow-2xl border border-white/50 transform transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <h2 className="text-xl md:text-2xl lg:text-4xl font-body font-bold leading-tight transition-colors duration-300
            text-royal-600 drop-shadow-md mb-6 uppercase whitespace-nowrap"
          >
            Tổng quan dự án
          </h2>
          
          <p className="text-base lg:text-lg font-body font-bold leading-relaxed transition-colors duration-300
            text-navy-900 drop-shadow-sm text-justify [text-wrap:pretty]"
          >
            Tọa lạc tại vị trí trung tâm Yên Lạc – Thủ Phủ Thương Nghiệp miền Bắc, Yên Lạc Dragon City kiến tạo một chuẩn mực đô thị hiện đại lần đầu tiên xuất hiện tại khu vực. Với quy mô hơn 38ha, quy hoạch đồng bộ với đa dạng loại hình bất động sản từ Shophouse, nhà phố, Biệt thự song lập, chung cư cao tầng. Yên Lạc Dragon City không chỉ là nơi an cư lý tưởng mà còn được kỳ vọng trở thành biểu tượng đô thị của tỉnh Phú Thọ trong kỷ nguyên phát triển mới.
          </p>

          <button 
            onClick={scrollToCollection}
            className="btn-luxury mt-8 px-10 py-3 rounded-full font-body font-bold uppercase text-sm tracking-widest transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg
              bg-royal-600 text-white shadow-lg hover:bg-royal-700 border-2 border-transparent hover:border-gold-400"
          >
            Hành Trình Kiến Tạo +
          </button>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
