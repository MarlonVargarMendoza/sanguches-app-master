import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from "react"
import Button from "../ui/Button"

export function OptimizedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timeoutRef = useRef(null)
  
  const carouselImages = [
    {
      src: "/assets/hero/hero-1.png",      alt: "Promoción especial de sándwiches",
      mobilePosition: "object-[70%_center]"
    },
    {
      src: "https://b2cqbano.vtexassets.com/assets/vtex.file-manager-graphql/images/edca71ad-3c41-47f7-828e-784db0dfa2c1___566a5214e2bbd2eaa5c51694fb797e05.jpg",
      alt: "Nuevos productos destacados",
      mobilePosition: "object-center"
    },
    {
      src: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3",
      alt: "Ofertas especiales del día",
      mobilePosition: "object-center"
    }
  ]

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
    )
  }, [carouselImages.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    )
  }, [carouselImages.length])

  useEffect(() => {
    timeoutRef.current = setTimeout(nextSlide, 5000)
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentIndex, nextSlide])

  return (
    <div className="relative h-[60vh] w-full overflow-hidden sm:h-[70vh] md:h-[80v]">
      {carouselImages.map((image, index) => (
        <div
          key={index}
          className={`absolute h-full w-full transform transition-transform duration-700 ease-in-out ${
            index === currentIndex ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <img
            src={image.src}
            alt={image.alt}
            className={`h-full w-full ${image.mobilePosition} sm:object-center object-cover`}
          />
        </div>
      ))}

      {/* Navigation Buttons */}
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <Button
          onClick={prevSlide}
          className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 sm:h-10 sm:w-10"
        >
          <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
          <span className="sr-only">Previous slide</span>
        </Button>

        <Button
          onClick={nextSlide}
          className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 sm:h-10 sm:w-10"
        >
          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            className={`h-1 rounded-full transition-all ${
              currentIndex === index ? "w-8 bg-white" : "w-4 bg-white/50"
            }`}
            onClick={() => setCurrentIndex(index)}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

