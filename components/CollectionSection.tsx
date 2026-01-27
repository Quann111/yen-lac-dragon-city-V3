import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, Move } from 'lucide-react';
import gsap from 'gsap';


interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  onNext?: () => void;
  onPrev?: () => void;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({ src, alt, className, onNext, onPrev }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [showHint, setShowHint] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number, y: number } | null>(null);
  
  const [imgSize, setImgSize] = useState<{w: number, h: number} | null>(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  // Measure container size
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
        const { width, height } = containerRef.current!.getBoundingClientRect();
        setContainerSize({ w: width, h: height });
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Reset when image source changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setShowHint(true);
    // Reset imgSize to force recalculation on new load
    setImgSize(null);
    const timer = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(timer);
  }, [src]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImgSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight });
  };

  // Calculate rendering dimensions
  let isWider = false;
  let renderedWidth = 0;
  let renderedHeight = 0;
  
  if (imgSize && containerSize.w > 0 && containerSize.h > 0) {
      const containerRatio = containerSize.w / containerSize.h;
      const imageRatio = imgSize.w / imgSize.h;
      isWider = imageRatio > containerRatio;
      
      if (isWider) {
          // Image is wider than container: Match height, width overflows
          renderedHeight = containerSize.h;
          renderedWidth = renderedHeight * imageRatio;
      } else {
          // Image is taller than container: Match width, height overflows
          renderedWidth = containerSize.w;
          renderedHeight = renderedWidth / imageRatio;
      }
  }

  const canDrag = scale > 1 || (renderedWidth > containerSize.w + 1) || (renderedHeight > containerSize.h + 1);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newScale = Math.min(Math.max(scale - e.deltaY * 0.001, 1), 3);
    setScale(newScale);
    
    // Recalculate position to keep within bounds
    if (containerSize.w > 0 && containerSize.h > 0) {
        const currentW = renderedWidth * newScale;
        const currentH = renderedHeight * newScale;
        
        const maxTranslateX = Math.max(0, (currentW - containerSize.w) / 2);
        const maxTranslateY = Math.max(0, (currentH - containerSize.h) / 2);
        
        setPosition(prev => ({
            x: Math.max(Math.min(prev.x, maxTranslateX), -maxTranslateX),
            y: Math.max(Math.min(prev.y, maxTranslateY), -maxTranslateY)
        }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (canDrag) {
      e.preventDefault();
      setIsDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && canDrag) {
      e.preventDefault();
      
      let newX = e.clientX - startPos.x;
      let newY = e.clientY - startPos.y;
      
      const currentW = renderedWidth * scale;
      const currentH = renderedHeight * scale;
      
      const maxTranslateX = Math.max(0, (currentW - containerSize.w) / 2);
      const maxTranslateY = Math.max(0, (currentH - containerSize.h) / 2);
      
      // Clamp values
      newX = Math.max(Math.min(newX, maxTranslateX), -maxTranslateX);
      newY = Math.max(Math.min(newY, maxTranslateY), -maxTranslateY);

      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };

    if (canDrag) {
      setIsDragging(true);
      setStartPos({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (canDrag && isDragging) {
       e.preventDefault();
       const touch = e.touches[0];
       
       let newX = touch.clientX - startPos.x;
       let newY = touch.clientY - startPos.y;

       const currentW = renderedWidth * scale;
       const currentH = renderedHeight * scale;
       
       const maxTranslateX = Math.max(0, (currentW - containerSize.w) / 2);
       const maxTranslateY = Math.max(0, (currentH - containerSize.h) / 2);

       newX = Math.max(Math.min(newX, maxTranslateX), -maxTranslateX);
       newY = Math.max(Math.min(newY, maxTranslateY), -maxTranslateY);

       setPosition({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false);

    if (scale === 1 && touchStartRef.current) {
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0 && onPrev) {
                onPrev();
            } else if (deltaX < 0 && onNext) {
                onNext();
            }
        }
    }
    touchStartRef.current = null;
  };

  const toggleZoom = () => {
    if (scale > 1) {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    } else {
        setScale(2);
    }
  };

  return (
    <div 
        ref={containerRef}
        className="relative w-full h-full overflow-hidden bg-black cursor-move touch-none"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
    >
        <img 
            src={src} 
            alt={alt} 
            draggable={false}
            onLoad={onImageLoad}
            className={`transition-transform duration-100 ease-out select-none ${imgSize ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: isWider ? 'auto' : '100%',
                height: isWider ? '100%' : 'auto',
                maxWidth: 'none',
                maxHeight: 'none',
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
                cursor: canDrag ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
        />

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
            <button 
                onClick={(e) => { e.stopPropagation(); setScale(prev => Math.min(prev + 0.5, 3)); }}
                className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-sm transition-colors"
                title="Zoom In"
            >
                <ZoomIn size={20} />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); setScale(prev => Math.max(prev - 0.5, 1)); if(scale <= 1.5) setPosition({x:0,y:0}); }}
                className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-sm transition-colors"
                title="Zoom Out"
            >
                <ZoomOut size={20} />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); setScale(1); setPosition({x:0,y:0}); }}
                className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-sm transition-colors"
                title="Reset"
            >
                <Maximize size={20} />
            </button>
        </div>

        {/* Hint Notification */}
        <div className={`absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-body flex items-center gap-2 pointer-events-none transition-opacity duration-500 z-20 ${showHint ? 'opacity-100' : 'opacity-0'}`}>
            <Move size={16} />
            <span>Phóng to & Kéo để xem chi tiết</span>
        </div>
    </div>
  );
};


import shophouse04 from '../image/sanpham/shophouse/slide_4.avif';
import shophouse05 from '../image/sanpham/shophouse/slide_5.avif';
import shophouse06 from '../image/sanpham/shophouse/slide_6.avif';
import shophouse07 from '../image/sanpham/shophouse/slide_7.avif';
import shophouse08 from '../image/sanpham/shophouse/slide_8.avif';
import shophouse09 from '../image/sanpham/shophouse/slide_9.avif';

import lienke11 from '../image/sanpham/nhapholienke/slide_11.avif';
import lienke12 from '../image/sanpham/nhapholienke/slide_12.avif';
import lienke13 from '../image/sanpham/nhapholienke/slide_13.avif';
import lienke14 from '../image/sanpham/nhapholienke/slide_14.avif';
import lienke15 from '../image/sanpham/nhapholienke/slide_15.avif';
import lienke16 from '../image/sanpham/nhapholienke/slide_16.avif';
import lienke17 from '../image/sanpham/nhapholienke/slide_17.avif';
import lienke18 from '../image/sanpham/nhapholienke/slide_18.avif';
import lienke19 from '../image/sanpham/nhapholienke/slide_19.avif';
import lienke20 from '../image/sanpham/nhapholienke/slide_20.avif';
import lienke21 from '../image/sanpham/nhapholienke/slide_21.avif';

import songlap23 from '../image/sanpham/bietthusonglap/slide_23.avif';
import songlap24 from '../image/sanpham/bietthusonglap/slide_24.avif';
import songlap25 from '../image/sanpham/bietthusonglap/slide_25.avif';
import songlap26 from '../image/sanpham/bietthusonglap/slide_26.avif';

import donlap28 from '../image/sanpham/bietthuonlap/slide_28.avif';
import donlap29 from '../image/sanpham/bietthuonlap/slide_29.avif';
import donlap30 from '../image/sanpham/bietthuonlap/slide_30.avif';
import donlap31 from '../image/sanpham/bietthuonlap/slide_31.avif';

import bieutuong33 from '../image/sanpham/congtrinhbieutuong/slide_33.avif';
import bieutuong34 from '../image/sanpham/congtrinhbieutuong/slide_34.avif';
import bieutuong35 from '../image/sanpham/congtrinhbieutuong/slide_35.avif';
import bieutuong36 from '../image/sanpham/congtrinhbieutuong/slide_36.avif';
import bieutuong37 from '../image/sanpham/congtrinhbieutuong/slide_37.avif';
import bieutuong38 from '../image/sanpham/congtrinhbieutuong/slide_38.avif';

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
    <div className="relative overflow-hidden rounded-lg shadow-md mb-6 aspect-[4/3]">
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
  "SHOPHOUSE": {
    images: [
      shophouse07,
      shophouse04, 
      shophouse05,
      shophouse06,
      shophouse08,
      shophouse09
    ],
    description: "Mô hình nhà phố thương mại hiện đại, tọa lạc tại các trục đường huyết mạch sầm uất. Thiết kế tối ưu công năng kép: vừa ở vừa kinh doanh, mang lại cơ hội sinh lời bền vững.",
    details: [
      { label: "Diện tích:", value: "100m² - 150m²" },
      { label: "Mặt tiền:", value: "5m - 7m" },
      { label: "Chiều cao:", value: "5 tầng" }
    ]
  },
  "NHÀ PHỐ LIỀN KỀ": {
    images: [
      lienke19,
      lienke11,
      lienke12,
      lienke13,
      lienke14,
      lienke15,
      lienke16,
      lienke17,
      lienke18,
      lienke20,
      lienke21
    ],
    description: "Kiến trúc hiện đại, thanh lịch, tạo nên một cộng đồng cư dân văn minh và gắn kết. Không gian sống được bố trí khoa học, tận dụng tối đa ánh sáng tự nhiên.",
    details: [
      { label: "Diện tích:", value: "90m² - 120m²" },
      { label: "Chiều cao:", value: "4 - 5 tầng" },
      { label: "Pháp lý:", value: "Sổ đỏ lâu dài" }
    ]
  },
  "BIỆT THỰ SONG LẬP": {
    images: [
      songlap25,
      songlap23, 
      songlap24,
      songlap26
    ],
    description: "Vẻ đẹp cân xứng hài hòa, sở hữu 3 mặt thoáng hướng ra sân vườn xanh mát. Nơi lý tưởng để gia đình đa thế hệ tận hưởng cuộc sống bình yên và đẳng cấp.",
    details: [
      { label: "Diện tích:", value: "160m² - 200m²" },
      { label: "Mật độ XD:", value: "50% - 60%" },
      { label: "Chiều cao:", value: "3.5 tầng" }
    ]
  },
  "BIỆT THỰ ĐƠN LẬP": {
    images: [
      donlap31,
      donlap28,
      donlap29,
      donlap30
    ],
    description: "Biểu tượng của quyền uy và vị thế thượng lưu. Mỗi căn biệt thự đơn lập là một ốc đảo riêng biệt, được bao quanh bởi thiên nhiên, mang lại sự riêng tư tuyệt đối.",
    details: [
      { label: "Diện tích:", value: "300m² - 862m²" },
      { label: "Mật độ XD:", value: "40% - 50%" },
      { label: "Đặc quyền:", value: "View hồ/Công viên" }
    ]
  },
  "CÔNG TRÌNH BIỂU TƯỢNG": {
    images: [
      bieutuong36,
      bieutuong33,
      bieutuong34,
      bieutuong35,
      bieutuong37,
      bieutuong38
    ],
    description: "Những kiệt tác kiến trúc điểm nhấn, định hình diện mạo đô thị hiện đại và thịnh vượng của Yên Lạc Dragon City. Nơi hội tụ các dịch vụ, tiện ích và giải trí đỉnh cao.",
    details: [
      { label: "Quy mô:", value: "Tổ hợp đa năng" },
      { label: "Chức năng:", value: "TM - DV - Văn phòng" },
      { label: "Vị trí:", value: "Trung tâm dự án" }
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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedCollection) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCollection]);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedCollection) return;
    const images = galleryData[selectedCollection].images;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
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
          <p className="max-w-2xl mx-auto font-body transition-colors duration-300 text-gray-600 [text-wrap:pretty]">
            Khám phá những lựa chọn đẳng cấp, từ biệt thự sang trọng, căn hộ tinh tế đến shophouse đa năng, mỗi loại hình là một tuyên ngôn về phong cách và sự tiện nghi vượt trội.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-20">
          {Object.entries(galleryData).map(([key, data]) => (
            <div key={key} className="w-full md:w-[calc(33.333%-1.5rem)]">
              <CollectionItem 
                title={key}
                image={data.images[0]}
                onClick={() => openModal(key)}
              />
            </div>
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
                <div className="relative w-full md:w-2/3 h-64 md:h-auto bg-black group shrink-0">
                    <ZoomableImage 
                        src={galleryData[selectedCollection].images[currentImageIndex]} 
                        alt={`${selectedCollection} ${currentImageIndex + 1}`} 
                        className="w-full h-full object-cover"
                        onNext={() => nextImage()}
                        onPrev={() => prevImage()}
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
                <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col flex-1 md:flex-none overflow-hidden">
                    <div className="flex justify-between items-center mb-4 shrink-0">
                        <h3 className="text-base md:text-lg font-body font-bold text-royal-700 whitespace-nowrap pt-1">
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