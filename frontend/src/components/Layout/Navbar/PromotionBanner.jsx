import gsap from 'gsap';
import React, { useEffect, useRef } from 'react';

const PromotionBanner = () => {
  const bannerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const banner = bannerRef.current;
    const text = textRef.current;

    // Initial animation for banner
    gsap.fromTo(banner, 
      { opacity: 0, height: 0 },
      { 
        opacity: 1, 
        height: 'auto', 
        duration: 0.5,
        ease: 'power2.out'
      }
    );

    // Infinite text scroll animation
    const scrollAnimation = gsap.to(text, {
      xPercent: -100,
      duration: 25,
      ease: 'none',
      repeat: -1
    });

    return () => {
      scrollAnimation.kill();
    };
  }, []);

  return (
    <div 
      ref={bannerRef}
      className="bg-[#C8151B] text-white h-7 overflow-hidden"
    >
      <div 
        ref={textRef}
        className="flex items-center gap-2 justify-center text-xs sm:text-sm whitespace-nowrap px-4"
      >
        <span className="font-semibold inline-flex items-center">
          🚀 Sangudays <span className="hidden sm:inline ml-1">Especial:</span>
        </span>
        <span className="font-bold bg-white text-[#C8151B] px-2 py-0.5 rounded-full">
          $22.900
        </span>
        <span className="italic truncate max-w-[150px] sm:max-w-none">
          Mejores ingredientes, mejor sabor
        </span>
      </div>
    </div>
  );
};

export default React.memo(PromotionBanner);