import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import logo from '../image/logo/logoXoaBack.png';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef({ value: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            y: -50,
            duration: 0.8,
            ease: "power3.inOut",
            onComplete: onComplete
          });
        }
      });

      // Initial Logo Animation
      tl.fromTo(logoRef.current, 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
      );

      // Progress Counter Animation
      tl.to(progressRef.current, {
        value: 100,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: () => {
          setProgress(Math.round(progressRef.current.value));
        }
      }, "-=0.2");

      // Text Fade In/Out
      tl.fromTo(textRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5 },
        "<"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-colors duration-300"
    >
      <div className="relative flex flex-col items-center">
        {/* Logo Container */}
        <div className="mb-8 p-4 rounded-2xl bg-white/50 backdrop-blur-sm">
          <img 
            ref={logoRef}
            src={logo} 
            alt="Yên Lạc Dragon City" 
            className="h-24 md:h-32 w-auto object-contain drop-shadow-lg"
          />
        </div>

        {/* Loading Bar & Text */}
        <div ref={textRef} className="flex flex-col items-center gap-2">
          <div className="text-royal-900 font-qbone text-3xl md:text-5xl font-bold tracking-widest tabular-nums">
            {progress}%
          </div>
          <div className="text-gray-400 text-xs uppercase tracking-[0.2em] font-qbone font-medium">
            Loading Experience
          </div>
          
          {/* Simple Progress Bar */}
          <div className="w-48 h-[2px] bg-gray-100 mt-4 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-royal-600 to-gold-400"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
