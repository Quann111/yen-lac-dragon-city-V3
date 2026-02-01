import React from 'react';
import { MapPin, Phone } from 'lucide-react';
import architectureBg from '../image/TT006_optimized.jpg';

const ArchitectureSection: React.FC = () => {
  const scrollToCollection = () => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', '/yen-lac-dragon-city-V3/#collection');
    window.dispatchEvent(new CustomEvent('nav-change', { detail: 'collection' }));
  };

  const scrollToLocation = () => {
    document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', '/yen-lac-dragon-city-V3/#location');
    window.dispatchEvent(new CustomEvent('nav-change', { detail: 'location' }));
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', '/yen-lac-dragon-city-V3/#contact');
    window.dispatchEvent(new CustomEvent('nav-change', { detail: 'contact' }));
  };

  return (
    <section className="relative min-h-screen lg:h-[80vh] w-full overflow-hidden bg-white flex flex-col justify-center lg:block">
       {/* Background Image */}
       <div className="absolute inset-0 z-0">
        <img 
          src={architectureBg} 
          alt="Tổng quan dự án" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 w-full h-full flex items-center justify-center lg:block">
        {/* Mobile View - Card Style */}
        <div className="lg:hidden w-[90%] min-h-[60vh] flex flex-col justify-center bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/50 transform transition-all duration-500">
          <h2 className="text-xl font-body font-bold leading-tight text-royal-600 mb-4 uppercase text-center">
            Tổng quan dự án
          </h2>
          
          <p className="text-sm font-body font-medium leading-relaxed text-navy-900 text-left">
            Tọa lạc tại vị trí trung tâm Yên Lạc – Thủ Phủ Thương Nghiệp miền Bắc, Yên Lạc Dragon City kiến tạo một chuẩn mực đô thị hiện đại lần đầu tiên xuất hiện tại khu vực. Với quy mô hơn 38ha, quy hoạch đồng bộ với đa dạng loại hình bất động sản từ Shophouse, nhà phố, Biệt thự song lập, chung cư cao tầng. Yên Lạc Dragon City không chỉ là nơi an cư lý tưởng mà còn được kỳ vọng trở thành biểu tượng đô thị của tỉnh Phú Thọ trong kỷ nguyên phát triển mới.
          </p>

          <div className="flex justify-center w-full mt-6">
            <button 
              onClick={scrollToContact}
              className="btn-luxury flex items-center justify-center gap-2 px-8 py-3 rounded-full font-body font-bold uppercase text-xs tracking-widest transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg
                bg-royal-600 text-white shadow-lg hover:bg-royal-700 border-2 border-transparent hover:border-gold-400"
            >
              <Phone size={16} /> Liên Hệ Ngay
            </button>
          </div>
        </div>

        {/* Desktop View - Overlay Style */}
        <div className="hidden lg:block absolute bottom-20 left-0 z-10 w-full p-6 pb-4 reveal-on-scroll font-body">
            <h2 className="text-4xl font-body font-bold leading-tight transition-colors duration-300
              text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-2 uppercase whitespace-nowrap"
            >
              Tổng quan dự án
            </h2>
            
            <p className="text-base font-body font-medium leading-relaxed transition-colors duration-300
              text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-left max-w-lg"
            >
              Tọa lạc tại vị trí trung tâm Yên Lạc – Thủ Phủ Thương Nghiệp miền Bắc, Yên Lạc Dragon City kiến tạo một chuẩn mực đô thị hiện đại lần đầu tiên xuất hiện tại khu vực. Với quy mô hơn 38ha, quy hoạch đồng bộ với đa dạng loại hình bất động sản từ Shophouse, nhà phố, Biệt thự song lập, chung cư cao tầng. Yên Lạc Dragon City không chỉ là nơi an cư lý tưởng mà còn được kỳ vọng trở thành biểu tượng đô thị của tỉnh Phú Thọ trong kỷ nguyên phát triển mới.
            </p>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
