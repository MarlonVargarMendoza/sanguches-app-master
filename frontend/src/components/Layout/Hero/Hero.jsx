import { useMediaQuery } from '@mui/material';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Button from "../../ui/Button";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasClicked, setHasClicked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState(0);
    const timeoutRef = useRef(null);
    const nextImageRef = useRef(null);

    // Breakpoints responsivos
    const isMobile = useMediaQuery('(max-width:640px)');
    const isTablet = useMediaQuery('(min-width:641px) and (max-width:1024px)');

    const carouselImages = [
        {
            src: "public/assets/hero/hero12.webp",
            alt: "Promoción especial de sándwiches",
        },
        {
            src: "public/assets/hero/hero21.webp",
            alt: "Nuevos productos destacados",
        },
        {
            src: "public/assets/banner.png",
            alt: "Ofertas especiales del día",
        }
    ];

    const totalImages = carouselImages.length;

    const handleImageLoad = () => {
        setLoadedImages(prev => prev + 1);
    };

    useEffect(() => {
        if (loadedImages === totalImages) {
            setLoading(false);
        }
    }, [loadedImages, totalImages]);

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

    useEffect(() => {
        timeoutRef.current = setTimeout(nextSlide, 5000);
        return () => timeoutRef.current && clearTimeout(timeoutRef.current);
    }, [currentIndex, nextSlide]);

   

    return (
        <div className="relative h-dvh w-screen overflow-x-hidden">
            {loading && (
                <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-[#FFC603]">
                    <div className="three-body">
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                    </div>
                </div>
            )}

            <div
                id="image-frame"
                className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-[#FFC603]/10"
            >
                <div className="relative h-full w-full">
                    {carouselImages.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                                index === currentIndex ? "translate-x-0" : "translate-x-full"
                            }`}
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className={`h-full w-full object-cover transition-opacity duration-300
                                    ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                                loading={index === 0 ? "eager" : "lazy"}
                                onLoad={handleImageLoad}
                            />
                        </div>
                    ))}

                    {/* Controles de navegación */}
                    <div className={`absolute inset-x-4 top-1/2 z-10 flex -translate-y-1/2 items-center justify-between
                        ${isMobile ? 'px-2' : 'px-6'}`}>
                        <button
                            onClick={prevSlide}
                            className={`flex items-center justify-center rounded-full bg-white/20 text-white 
                                backdrop-blur-sm transition-all hover:bg-white/40
                                ${isMobile ? 'h-8 w-8' : 'h-12 w-12'}`}
                            aria-label="Anterior"
                        >
                            <ChevronLeft className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
                        </button>

                        <button
                            onClick={nextSlide}
                            className={`flex items-center justify-center rounded-full bg-white/20 text-white 
                                backdrop-blur-sm transition-all hover:bg-white/40
                                ${isMobile ? 'h-8 w-8' : 'h-12 w-12'}`}
                            aria-label="Siguiente"
                        >
                            <ChevronRight className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
                        </button>
                    </div>

                    {/* Contenido superpuesto */}
                    <div className="md:hidden absolute left-0 top-0 z-40 size-full">
                        <div className="mt-24 px-5 sm:px-10">
                            <h1 className="text-4xl font-black border-b text-white mb-4">
                                Sanguches
                            </h1>

                            <p className="mb-5 max-w-64 text-white font-medium">
                                Los mejores sándwiches <br /> 
                            </p>

                           
                        </div>
                        <Button
                                buttonText="Ver Menú"
                                leftIcon={<TiLocationArrow />}
                                containerClass="bg-[#FFC603] flex-center gap-1"
                            />
                    </div>
                </div>
            </div>

            {/* Indicadores */}
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
    );
};

export default Hero;