import { Button } from "@/components/ui/button";
import {  ChevronDown, CreativeCommons, List, ListCheck, Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Product1 from '../../assets/Product1.jpg'
import Product2 from '../../assets/product2.jpg'

import { FaProductHunt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Create_product from "@/components/LocalShoper/ProductDetail/Create_product";
import ListProducts from "@/components/LocalShoper/ProductDetail/ListProducts";
const MyProduct = () => {
  // Images for slider
  const images = [Product1, Product2, Product1, Product2];
  const [current, setCurrent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef(null);

  const next = () => setCurrent((c) => (c + 1) % images.length);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const goTo = (idx) => setCurrent(idx);

  useEffect(() => {
    if (isHovering) return; // pause on hover
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length);
    }, 3500);
    return () => clearInterval(intervalRef.current);
  }, [isHovering, images.length]);

  return (
    <section className="p-3 sm:p-6">
      <div className="shadow rounded-2xl bg-gradient-to-br from-[var(--two5m)]/70 to-[var(--two3m)]/70 ring-1 ring-black/5">
        <div className="px-3 pt-3">
          <Popover>
            <PopoverTrigger className="flex items-center justify-center rounded-xl cursor-pointer bg-[var(--two2m)] text-[var(--two5m)] font-semibold text-center px-4 py-2 w-full sm:w-[40%] shadow-sm hover:shadow">
              <span>My Product</span>
              <span className="ml-2"><ChevronDown /></span>
            </PopoverTrigger>
            <PopoverContent className="border-0 p-3 space-y-3">
              <Create_product />
              <Link to="/local_shop/product-list">
                <Button className="bg-[var(--two2m)] hover:bg-green-900 text-[var(--two5m)]">
                  <ListCheck className="mr-2 h-4 w-4" /> List Of Products
                </Button>
              </Link>
            </PopoverContent>
          </Popover>
        </div>

        <div className="sm:flex sm:space-x-6 max-sm:space-y-6 items-stretch sm:m-8 m-4">
          {/* Slider */}
          <div
            className="relative sm:w-[55%] w-full h-[46vh] sm:h-[60vh] overflow-hidden rounded-3xl bg-black/10 backdrop-blur"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Slides */}
            <div
              className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {images.map((src, idx) => (
                <div key={idx} className="min-w-full h-full">
                  <img src={src} alt={`slide-${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Gradient overlays for better readability */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/30 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/30 to-transparent" />

            {/* Controls */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-900 rounded-full p-2 shadow"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-900 rounded-full p-2 shadow"
              aria-label="Next"
            >
              ›
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => goTo(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    current === idx ? "w-6 bg-white" : "w-2.5 bg-white/60 hover:bg-white/90"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Side panel */}
          <div className="flex-1 grid grid-rows-2 gap-6">
            <div className="rounded-2xl overflow-hidden ring-1 ring-black/5 bg-white dark:bg-neutral-900">
              <img src={Product2} alt="preview" className="w-full h-full object-cover max-h-60" />
            </div>
            <div className="rounded-2xl p-4 ring-1 ring-black/5 bg-white dark:bg-neutral-900">
              <h3 className="text-lg font-semibold mb-2 text-[var(--two2m)]">Highlights</h3>
              <ul className="text-sm list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>High-quality product imagery</li>
                <li>Autoplay slider with manual controls</li>
                <li>Responsive and accessible UI</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyProduct;
