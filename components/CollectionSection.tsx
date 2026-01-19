import React, { useState, useRef, useLayoutEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';

import img01 from '../image/anhtintuc/01.webp';
import img02 from '../image/anhtintuc/02.webp';
import img03 from '../image/anhtintuc/03.webp';
import img04 from '../image/anhtintuc/04.webp';
import img05 from '../image/anhtintuc/05.webp';
import img06 from '../image/anhtintuc/06.webp';
import img07 from '../image/anhtintuc/07.webp';

interface CollectionItemProps {
  title: string;
  image: string;
  onClick: () => void;
}

const CollectionItem: React.FC<CollectionItemProps> = ({ title, image, onClick }) => (
  <div 
    onClick={onClick}
    className="group relative overflow-hidden rounded-xl h-80 md:h-[500px] cursor-pointer shadow-xl reveal-on-scroll"
  >
    <img 
      src={image} 
      alt={title} 
      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
    />
    <div className="absolute inset-0 transition-colors duration-300
      bg-transparent group-hover:bg-black/10
      dark:bg-black/30 dark:group-hover:bg-black/50"
    ></div>
    
    <div className="absolute bottom-8 left-0 right-0 text-center">
      <div className="inline-block px-10 py-3 rounded-full backdrop-blur-md transition-all duration-300
        bg-black/60 text-gold-100 shadow-lg border border-gold-500/50"
      >
        <span className="font-serif text-lg md:text-xl font-medium tracking-wide">
          {title}
        </span>
      </div>
    </div>
  </div>
);

const galleryData: Record<string, string[]> = {
  "Shophouse": [img01, img02, img03, img04],
  "Biệt thự": [img05, img06, img07, img01],
  "Căn hộ cao cấp": [img02, img03, img05, img06]
};

const CollectionSection: React.FC = () => {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToAmenities = () => {
    document.getElementById('amenities')?.scrollIntoView({ behavior: 'smooth' });
    window.dispatchEvent(new CustomEvent('nav-change', { detail: 'amenities' }));
  };

  const openModal = (title: string) => {
    setSelectedCollection(title);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    if (modalRef.current && overlayRef.current && contentRef.current) {
        const tl = gsap.timeline({
            onComplete: () => setSelectedCollection(null)
        });
        tl.to(contentRef.current, { scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in" })
          .to(overlayRef.current, { opacity: 0, duration: 0.3 }, "-=0.2");
    } else {
        setSelectedCollection(null);
    }
  };

  useLayoutEffect(() => {
    if (selectedCollection && modalRef.current && overlayRef.current && contentRef.current) {
        const tl = gsap.timeline();
        tl.fromTo(overlayRef.current, 
            { opacity: 0 }, 
            { opacity: 1, duration: 0.3 }
        )
        .fromTo(contentRef.current,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.2)" },
            "-=0.1"
        );
    }
  }, [selectedCollection]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedCollection) return;
    const images = galleryData[selectedCollection];
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedCollection) return;
    const images = galleryData[selectedCollection];
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleContactClick = () => {
    closeModal();
    setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        window.dispatchEvent(new CustomEvent('nav-change', { detail: 'contact' }));
    }, 400);
  };

  return (
    <section className="relative py-24 transition-colors duration-500 bg-royal-50 dark:bg-navy-900">
      {/* Background Architecture Detail (Faint) */}
      <div className="absolute top-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover grayscale mix-blend-overlay" alt="texture"/>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="text-center mb-16 reveal-on-scroll">
          <h2 className="text-3xl md:text-5xl font-serif mb-4 transition-colors duration-300 text-royal-600 dark:text-gold-200">
            Bộ Sưu Tập Độc Quyền: Không <br className="hidden md:block"/> Gian Sống Riêng
          </h2>
          <p className="max-w-2xl mx-auto font-light transition-colors duration-300 text-gray-600 dark:text-gray-400">
            Khám phá những lựa chọn đẳng cấp, từ biệt thự sang trọng, căn hộ tinh tế đến shophouse đa năng, mỗi loại hình là một tuyên ngôn về phong cách và sự tiện nghi vượt trội.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <CollectionItem 
            title="Shophouse" 
            image="https://images.unsplash.com/photo-1555636222-cae831e670b3?q=80&w=2077&auto=format&fit=crop"
            onClick={() => openModal("Shophouse")}
          />
          <CollectionItem 
            title="Biệt thự" 
            image="https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop"
            onClick={() => openModal("Biệt thự")}
          />
          <CollectionItem 
            title="Căn hộ cao cấp" 
            image="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop"
            onClick={() => openModal("Căn hộ cao cấp")}
          />
        </div>

        <div className="text-center reveal-on-scroll">
           <button 
            onClick={scrollToAmenities}
            className="btn-luxury px-12 py-4 rounded-full uppercase tracking-widest font-serif text-sm font-bold shadow-lg transform hover:-translate-y-1 transition-all duration-300
              bg-black/40 backdrop-blur-md border-2 border-gold-400 text-gold-100 hover:bg-gold-500 hover:text-navy-900 hover:border-gold-500
              dark:bg-transparent dark:border-gold-400 dark:text-gold-200 dark:hover:bg-gold-500 dark:hover:text-navy-900 dark:shadow-glow-gold"
          >
            Khám Phá Tiện Ích
          </button>
        </div>
      </div>

      {/* GSAP Popup Gallery Modal */}
      {selectedCollection && (
        <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <div 
                ref={overlayRef}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={closeModal}
            ></div>

            {/* Content */}
            <div 
                ref={contentRef}
                className="relative w-full max-w-5xl bg-white dark:bg-navy-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
                {/* Image Section */}
                <div className="relative w-full md:w-2/3 h-64 md:h-auto bg-black group">
                    <img 
                        src={galleryData[selectedCollection][currentImageIndex]} 
                        alt={`${selectedCollection} ${currentImageIndex + 1}`} 
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Navigation Buttons */}
                    <button 
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button 
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronRight size={24} />
                    </button>

                    <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded-full text-white text-sm">
                        {currentImageIndex + 1} / {galleryData[selectedCollection].length}
                    </div>
                </div>

                {/* Info Section */}
                <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-2xl md:text-3xl font-serif text-royal-700 dark:text-gold-400">
                            {selectedCollection}
                        </h3>
                        <button 
                            onClick={closeModal}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <p className="text-gray-600 dark:text-gray-300 mb-6 font-light leading-relaxed">
                            Khám phá vẻ đẹp tinh tế và không gian sống đẳng cấp tại phân khu {selectedCollection}. 
                            Mỗi chi tiết đều được chăm chút tỉ mỉ để mang lại trải nghiệm hoàn hảo nhất cho cư dân.
                        </p>
                        
                        <div className="grid grid-cols-3 gap-2">
                            {galleryData[selectedCollection].map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                        currentImageIndex === idx 
                                            ? 'border-royal-500 dark:border-gold-500 opacity-100' 
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
                        <button 
                            onClick={handleContactClick}
                            className="w-full py-3 rounded-lg bg-royal-600 hover:bg-royal-700 text-white font-medium transition-colors shadow-lg"
                        >
                            Đăng Ký Tư Vấn
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </section>
  );
};

export default CollectionSection;