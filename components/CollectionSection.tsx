import React, { useState, useRef, useLayoutEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';

import img01 from '../image/anhtintuc/01.webp';
import img02 from '../image/anhtintuc/02.webp';
import img03 from '../image/anhtintuc/03.webp';
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
    className="group cursor-pointer reveal-on-scroll"
  >
    {/* Title - Centered, Blue, Bold */}
    <h3 className="text-center text-royal-700 text-lg md:text-xl font-body font-bold uppercase mb-4 group-hover:text-royal-600 transition-colors">
      {title}
    </h3>

    {/* Image Container */}
    <div className="relative overflow-hidden rounded-lg h-64 md:h-72 shadow-md mb-6">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
    </div>
  </div>
);

interface CollectionData {
  images: string[];
  description: string;
  details: { label: string; value: string }[];
}

const galleryData: Record<string, CollectionData> = {
  "Biệt thự": {
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop", 
      img05, img06, img07
    ],
    description: "Khám phá vẻ đẹp tinh tế và không gian sống đẳng cấp tại phân khu Biệt thự. Được thiết kế theo phong cách tân cổ điển sang trọng, mỗi căn biệt thự là một tác phẩm nghệ thuật, mang đến sự riêng tư tuyệt đối và đẳng cấp thượng lưu.",
    details: [
      { label: "Diện tích:", value: "từ 160m² đến 862m²" },
      { label: "Chiều cao:", value: "3 tầng" },
      { label: "Mật độ xd:", value: "50-60%" }
    ]
  },
  "Liền kề": {
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=2070&auto=format&fit=crop", 
      img01, img02, img03
    ],
    description: "Khu nhà ở liền kề sở hữu kiến trúc hiện đại, tối ưu công năng sử dụng. Phù hợp cho cả mục đích an cư và kinh doanh, tạo nên một cộng đồng sầm uất và văn minh ngay tại trung tâm dự án.",
    details: [
      { label: "Diện tích:", value: "90m² - 120m²" },
      { label: "Chiều cao:", value: "5 tầng" },
      { label: "Mật độ xd:", value: "80%" }
    ]
  },
  "Nhà ở xã hội": {
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop", 
      img02, img03, img05
    ],
    description: "Giải pháp nhà ở thông minh, đầy đủ tiện nghi với chi phí hợp lý. Các căn hộ được thiết kế tối ưu ánh sáng và gió trời, mang lại không gian sống trong lành và thoải mái cho cư dân.",
    details: [
      { label: "Diện tích:", value: "45m² - 70m²" },
      { label: "Số phòng ngủ:", value: "1 và 2 PN" },
      { label: "Loại căn hộ:", value: "Nhà ở xã hội" }
    ]
  }
};

const CollectionSection: React.FC = () => {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToAmenities = () => {
    document.getElementById('amenities')?.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', '/yen-lac-dragon-city-V3/#amenities');
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
    const images = galleryData[selectedCollection].images;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedCollection) return;
    const images = galleryData[selectedCollection].images;
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
    <section className="relative py-24 transition-colors duration-500 bg-royal-50">
      {/* Background Architecture Detail (Faint) */}
      <div className="absolute top-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover grayscale mix-blend-overlay" alt="texture"/>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="text-center mb-16 reveal-on-scroll">
          <h2 className="text-xl md:text-3xl font-body font-bold mb-4 transition-colors duration-300 text-royal-600 uppercase whitespace-nowrap">
            Sản Phẩm
          </h2>
          <p className="max-w-2xl mx-auto font-body transition-colors duration-300 text-gray-600">
            Khám phá những lựa chọn đẳng cấp, từ biệt thự sang trọng, căn hộ tinh tế đến shophouse đa năng, mỗi loại hình là một tuyên ngôn về phong cách và sự tiện nghi vượt trội.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {Object.entries(galleryData).map(([key, data]) => (
            <CollectionItem 
              key={key}
              title={key}
              image={data.images[0]}
              onClick={() => openModal(key)}
            />
          ))}
        </div>

        <div className="text-center reveal-on-scroll">
           <button 
            onClick={scrollToAmenities}
            className="btn-luxury px-12 py-4 rounded-full uppercase tracking-widest font-body font-bold text-sm shadow-lg transform hover:-translate-y-1 transition-all duration-300
              bg-black/40 backdrop-blur-md border-2 border-gold-400 text-gold-100 hover:bg-gold-500 hover:text-navy-900 hover:border-gold-500"
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
                className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
                {/* Image Section */}
                <div className="relative w-full md:w-2/3 h-64 md:h-auto bg-black group">
                    <img 
                        src={galleryData[selectedCollection].images[currentImageIndex]} 
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
                        {currentImageIndex + 1} / {galleryData[selectedCollection].images.length}
                    </div>
                </div>

                {/* Info Section */}
                <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-2xl md:text-3xl font-body font-bold text-royal-700">
                            {selectedCollection}
                        </h3>
                        <button 
                            onClick={closeModal}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <p className="text-gray-600 mb-6 font-body leading-relaxed">
                            {galleryData[selectedCollection].description}
                        </p>
                        
                        {/* Technical Details in Modal */}
                        <div className="mb-6 bg-gray-50 p-4 rounded-lg space-y-2 border border-gray-100">
                             {galleryData[selectedCollection].details.map((detail, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-body font-medium">{detail.label}</span>
                                    <span className="text-royal-800 font-body font-bold">{detail.value}</span>
                                </div>
                             ))}
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {galleryData[selectedCollection].images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                        currentImageIndex === idx 
                                            ? 'border-royal-500 opacity-100' 
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <button 
                            onClick={handleContactClick}
                            className="w-full py-3 rounded-lg bg-royal-600 hover:bg-royal-700 text-white font-body font-bold transition-colors shadow-lg"
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