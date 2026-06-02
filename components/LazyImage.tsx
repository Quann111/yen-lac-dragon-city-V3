import React, { useState, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  placeholder: string;
  alt: string;
  className?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, placeholder, alt, className = '' }) => {
  const [isHDLoaded, setIsHDLoaded] = useState(false);
  const [showHD, setShowHD] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsHDLoaded(true);
      setTimeout(() => setShowHD(true), 100);
    };
  }, [src]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <img 
        src={placeholder}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          showHD ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ filter: 'blur(8px)', transform: 'scale(1.1)' }}
        aria-hidden="true"
      />
      <img 
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          showHD ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />
    </div>
  );
};

export default LazyImage;