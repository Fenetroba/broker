import React, { useState, useEffect } from "react";
import Heroimg1 from "../../assets/Hero2.png";
import Heroimg2 from "../../assets/Hero2.png";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const carouselItems = [
  {
    src: Heroimg1,
    alt: "Heroimg1",
    desc: "Description for Heroimg1",
  },
  {
    src: Heroimg2,
    alt: "Heroimg2",
    desc: "Description for Heroimg2",
  },
  
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === carouselItems.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselItems.length - 1 : prev - 1
    );
  };

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[200px] overflow-hidden rounded-lg sm:h-[550px] mt-1.5">
    {/* Carousel slides */}
    <div className="relative sm:h-full">
      {carouselItems.map((item, index) => (
        <div
        
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Background image */}
          <div className="relative h-full w-full">
          
              <img src={item.src} alt={`Slide ${index + 1}`}    className='cover p-4 text-center w-full ' />
            
           
          </div>

      
        </div>
      ))}
    </div>

    {/* Navigation arrows */}
    <button
      onClick={prevSlide}
      className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--two4m)] text-white backdrop-blur-sm transition-all  hover:bg-[var(--two3m)]"
      aria-label="Previous slide"
    >
      <ChevronLeft className="h-6 w-6  bg-[var(--parent1)] cursor-pointer" />
    </button>
    <button
      onClick={nextSlide}
      className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--two4m)] text-white backdrop-blur-sm transition-all hover:bg-[var(--two3m)]"
      aria-label="Next slide"
    >
      <ChevronRight className="h-6 w-6 bg-[var(--parent1)] cursor-pointer" />
    </button>

    {/* Pagination dots */}
    <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
      {carouselItems.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentSlide(index)}
          className={`h-2 w-2 rounded-full transition-all ${
            index === currentSlide ? "bg-black w-4" : "bg-white"
          }`}
          aria-label={`Go to slide ${index + 1}`}
        ></button>
      ))}
    </div>
  </div>
  );
};  

export default Hero;
