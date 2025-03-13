import { useMediaQuery } from '@mui/material';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';
import Button from "../../ui/Button";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState(0);
    const timeoutRef = useRef(null);
    const navigate = useNavigate();
    const [dragStart, setDragStart] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    // Breakpoints responsivos
    const isMobile = useMediaQuery('(max-width:640px)');
    const isTablet = useMediaQuery('(min-width:641px) and (max-width:1024px)');

    const carouselImages = [
        {
            src: "assets/hero/hero12.webp",
            alt: "Promoción especial de sándwiches",
        },
        {
            src: "assets/hero/hero21.webp",
            alt: "Nuevos productos destacados",
        },
        {
            src: "assets/banner.png",
            alt: "Ofertas especiales del día",
        }
    ];

    const totalImages = carouselImages.length;

    // Drag handling
    const handleDragStart = (e) => {
        setIsDragging(true);
        setDragStart(e.touches ? e.touches[0].clientX : e.clientX);
    };
    
    const handleDragEnd = (e) => {
        if (!isDragging) return;

        const dragEnd = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        const dragThreshold = window.innerWidth * 0.15;

        if (Math.abs(dragEnd - dragStart) > dragThreshold) {
            if (dragEnd < dragStart) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        setIsDragging(false);
    };

    const handleImageLoad = () => {
        setLoadedImages(prev => prev + 1);
    };

    const nextSlide = useCallback(() => {
        setCurrentIndex(prevIndex =>
            prevIndex === totalImages - 1 ? 0 : prevIndex + 1
        );
    }, [totalImages]);

    const prevSlide = useCallback(() => {
        setCurrentIndex(prevIndex =>
            prevIndex === 0 ? totalImages - 1 : prevIndex - 1
        );
    }, [totalImages]);

    // Auto-slide effect
    useEffect(() => {
        timeoutRef.current = setTimeout(nextSlide, 5000);
        return () => timeoutRef.current && clearTimeout(timeoutRef.current);
    }, [currentIndex, nextSlide]);

    // Calcular altura dinámica basada en el tamaño de la pantalla
    const heroHeight = isMobile 
        ? "h-[calc(100vh-60px)]" // móvil
        : isTablet 
            ? "h-[calc(100vh-120px)]" // tablet
            : "h-[calc(100vh-110px)]"; // desktop

    return (
        <section 
            className={`relative ${heroHeight} w-full overflow-hidden bg-gradient-to-b from-[#FFC603]/20 to-[#FFC603]/10`}
        >
            {/* Contenedor principal del carrusel */}
            <div className="relative h-full w-full overflow-hidden">
                {/* Imágenes del carrusel */}
                {carouselImages.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-transform duration-700 ease-in-out 
                            ${index === currentIndex ? "translate-x-0" : "translate-x-full"}`}
                        onTouchStart={handleDragStart}
                        onTouchEnd={handleDragEnd}
                    >
                        <img
                            src={image.src}
                            alt={image.alt}
                            className={`h-full w-full object-cover transition-opacity duration-300
                                ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                            loading={index === 0 ? "eager" : "lazy"}
                            onLoad={handleImageLoad}
                            draggable="false"
                        />
                        
                        {/* Overlay para mejorar visibilidad del contenido */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/20"></div>
                    </div>
                ))}

                {/* Controles de navegación */}
                <div className={`absolute inset-x-4 top-1/2 z-20 flex -translate-y-1/2 items-center justify-between
                    ${isMobile ? 'px-2' : 'px-6'}`}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            prevSlide();
                        }}
                        className={`flex items-center justify-center rounded-full bg-white/20 text-white 
                            backdrop-blur-sm transition-all hover:bg-white/40 active:scale-95
                            ${isMobile ? 'h-8 w-8' : 'h-12 w-12'}`}
                        aria-label="Anterior"
                    >
                        <ChevronLeft className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            nextSlide();
                        }}
                        className={`flex items-center justify-center rounded-full bg-white/20 text-white 
                            backdrop-blur-sm transition-all hover:bg-white/40 active:scale-95
                            ${isMobile ? 'h-8 w-8' : 'h-12 w-12'}`}
                        aria-label="Siguiente"
                    >
                        <ChevronRight className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
                    </button>
                </div>

                {/* Botón CTA para móvil - Reposicionado */}
                {isMobile && (
                    <div className="absolute bottom-28 left-0 right-0 z-30 flex justify-center">
                        <Button
                            buttonText="Ver Menú"
                            leftIcon={<TiLocationArrow />}
                            containerClass="bg-[#FFC603] button-3 flex-center gap-1 shadow-lg"
                            onClick={() => navigate('/menuSanguches')}
                        />
                    </div>
                )}

                {/* Indicadores de diapositiva */}
                <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                    {carouselImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-1.5 rounded-full transition-all
                                ${isMobile ? 'h-1' : 'md:h-2'} 
                                ${currentIndex === index
                                    ? `w-6 bg-white ${isMobile ? '' : 'md:w-12'}`
                                    : `w-3 bg-white/50 hover:bg-white/80 ${isMobile ? '' : 'md:w-6'}`
                                }`}
                            aria-label={`Ir a diapositiva ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;