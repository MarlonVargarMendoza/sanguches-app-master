import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { Carousel } from "@material-tailwind/react";
import { useEffect, useRef } from 'react';

export function CarouselTransition() {
    const carouselRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (carouselRef.current) {
                carouselRef.current.goToNext(); // Cambio automático al siguiente slide
            }
        }, 5000); // 5 segundos
        return () => clearInterval(interval); // Limpiar el intervalo al desmontar
    }, []);

    return (
        <Carousel
            ref={carouselRef}
            transition={{ duration: 2 }}
            className="rounded-xl relative"
            prevArrow={({ handlePrev }) => (
                <button
                    onClick={handlePrev}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 focus:outline-none z-20"
                    aria-label="Previous Slide"
                >
                    <ChevronLeftIcon className="h-6 w-6 text-white" />
                </button>
            )}
            nextArrow={({ handleNext }) => (
                <button
                    onClick={handleNext}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 focus:outline-none z-20"
                    aria-label="Next Slide"
                >
                    <ChevronRightIcon className="h-6 w-6 text-white" />
                </button>
            )}
        >
            <img
                src="https://b2cqbano.vtexassets.com/assets/vtex.file-manager-graphql/images/9802c1ec-1af8-4b14-ac38-7a79baa8fb33___876663b4e8e94399f38dc15fffeccd30.jpg"
                alt="image 1"
                className="h-full w-full object-cover"
            />
            <img
                src="https://b2cqbano.vtexassets.com/assets/vtex.file-manager-graphql/images/edca71ad-3c41-47f7-828e-784db0dfa2c1___566a5214e2bbd2eaa5c51694fb797e05.jpg"
                alt="image 2"
                className="h-full w-full object-cover"
            />
            <img
                src="https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80"
                alt="image 3"
                className="h-full w-full object-cover"
            />
        </Carousel>
    );
}
