import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import logoImg from '../image/logo/logoXoaBack.png';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
            // Animate out
            gsap.to(containerRef.current, {
                yPercent: -100,
                duration: 1.2,
                ease: 'power4.inOut',
                onComplete: onComplete
            });
        }
      });

      // Logo Animation
      tl.fromTo(logoRef.current,
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'back.out(1.7)' }
      );

      // Animate Counter
      const counterObj = { value: 0 };
      tl.to(counterObj, {
        value: 100,
        duration: 2.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          setCounter(Math.round(counterObj.value));
        }
      }, "-=0.5");

      // Animate Progress Bar width
      tl.to(progressRef.current, {
        width: '100%',
        duration: 2.5,
        ease: 'power2.inOut'
      }, "<");

      // Text Reveal
      tl.fromTo(textRef.current, 
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        "<+0.2"
      );

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col justify-center items-center bg-navy-950 text-gold-100 overflow-hidden"
    >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop" 
                alt="Luxury Background" 
                className="w-full h-full object-cover opacity-20 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-950/90 to-navy-950"></div>
        </div>

      <div className="w-full max-w-4xl px-8 relative z-10 flex flex-col items-center gap-8">
        {/* Logo */}
        <img 
            ref={logoRef}
            src={logoImg} 
            alt="Yên Lạc Dragon City Logo" 
            className="w-32 md:w-48 h-auto object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]"
        />

        {/* Progress Bar Container */}
        <div className="w-full h-1 bg-navy-800/50 relative overflow-hidden rounded-full">
            {/* Animated Fill */}
            <div 
                ref={progressRef}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 w-0 shadow-[0_0_10px_#D4AF37]"
            ></div>
        </div>

        {/* Counter Text */}
        <div className="w-full flex justify-between items-end text-gold-200 font-marschel tracking-widest uppercase text-sm md:text-base">
            <span ref={textRef} className="opacity-0">Loading Experience</span>
            <span className="font-bold text-2xl md:text-4xl text-gold-400 tabular-nums leading-none">
                {counter}%
            </span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
