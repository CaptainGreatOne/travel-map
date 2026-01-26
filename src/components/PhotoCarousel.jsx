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
    <div className="relative w-full h-[500px] bg-gray-900 overflow-hidden rounded-xl shadow-2xl">
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

          {/* Photo caption */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-8 pt-8 pb-6 text-white">
            <h3 className="m-0 mb-1 text-2xl font-semibold">
              {photo.title}
            </h3>
            {photo.location && (
              <p className="m-0 text-base opacity-90">
                {photo.location}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Previous Button */}
      <button
        onClick={goToPrevious}
        className="absolute left-5 top-1/2 -translate-y-1/2 bg-secondary/80 text-primary border-none rounded-full w-[50px] h-[50px] flex items-center justify-center cursor-pointer z-10 hover:bg-secondary hover:scale-110 transition-all duration-200"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Next Button */}
      <button
        onClick={goToNext}
        className="absolute right-5 top-1/2 -translate-y-1/2 bg-secondary/80 text-primary border-none rounded-full w-[50px] h-[50px] flex items-center justify-center cursor-pointer z-10 hover:bg-secondary hover:scale-110 transition-all duration-200"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-md border-none cursor-pointer transition-all duration-300 ${index === currentIndex ? 'w-8 bg-primary' : 'w-3 bg-white/50'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default PhotoCarousel;