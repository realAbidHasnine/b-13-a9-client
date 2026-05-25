"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    bgClass: "bg-gradient-to-r from-indigo-900 to-indigo-700",
    headline: "Turn Your Ideas Into Reality",
    subheadline: "Join thousands of innovators sharing startup ideas",
  },
  {
    id: 2,
    bgClass: "bg-gradient-to-r from-emerald-900 to-teal-800",
    headline: "Collaborate and Grow Together",
    subheadline: "Find co-founders, get feedback, and build a community around your vision.",
  },
  {
    id: 3,
    bgClass: "bg-gradient-to-r from-slate-900 to-slate-800",
    headline: "Launch Faster Than Ever",
    subheadline: "Validate your concepts instantly with real-world feedback from early adopters.",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 4000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  return (
    <div 
      className="relative w-full h-[500px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex flex-col items-center justify-center text-center px-4 ${slide.bgClass} ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <div className="max-w-4xl mx-auto text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight drop-shadow-md">
              {slide.headline}
            </h1>
            <p className="text-lg md:text-2xl mb-10 text-white/90 drop-shadow-sm max-w-2xl mx-auto">
              {slide.subheadline}
            </p>
            <Link href="/ideas" className="btn-primary inline-flex bg-white text-indigo-900 hover:bg-zinc-100 px-8 py-3 text-lg rounded-full">
              Explore Ideas &rarr;
            </Link>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}