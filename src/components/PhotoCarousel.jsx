import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function PhotoCarousel({ photos }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 4000); // Change photo every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, photos.length, currentIndex]);

  // Resume auto-play after 5 seconds of no interaction
  useEffect(() => {
    if (!userInteracted) return;

    const resumeTimer = setTimeout(() => {
      setIsAutoPlaying(true);
      setUserInteracted(false);
    }, 5000); // Resume after 5 seconds

    return () => clearTimeout(resumeTimer);
  }, [userInteracted, currentIndex]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setUserInteracted(true);
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setUserInteracted(true);
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setUserInteracted(true);
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gray-900 overflow-hidden rounded-xl shadow-2xl">
      {/* Images */}
      {photos.map((photo, index) => (
        <div
          key={index}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={photo.url}
            alt={photo.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      ))}

      {/* Bottom overlay with caption and dots */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 sm:px-8 pt-6 sm:pt-8 pb-2 sm:pb-3 text-white z-10">
        {/* Caption */}
        <div className="mb-3 sm:mb-4">
          <h3 className="m-0 mb-0.5 text-base sm:text-xl md:text-2xl font-semibold truncate">
            {photos[currentIndex]?.title}
          </h3>
          {photos[currentIndex]?.location && (
            <p className="m-0 text-sm sm:text-base opacity-90 truncate">
              {photos[currentIndex].location}
            </p>
          )}
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-1.5 sm:gap-2.5">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 sm:h-3 rounded-md border-none cursor-pointer transition-all duration-300 ${index === currentIndex ? 'w-5 sm:w-8 bg-primary' : 'w-2 sm:w-3 bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Previous Button */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 bg-secondary/80 text-primary border-none rounded-full w-10 h-10 sm:w-[50px] sm:h-[50px] flex items-center justify-center cursor-pointer z-10 hover:bg-secondary hover:scale-110 transition-all duration-200"
      >
        <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
      </button>

      {/* Next Button */}
      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 bg-secondary/80 text-primary border-none rounded-full w-10 h-10 sm:w-[50px] sm:h-[50px] flex items-center justify-center cursor-pointer z-10 hover:bg-secondary hover:scale-110 transition-all duration-200"
      >
        <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
      </button>
    </div>
  );
}

export default PhotoCarousel;