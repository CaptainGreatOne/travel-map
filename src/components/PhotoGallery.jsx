import React, { useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

function PhotoGallery({ photos }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const openLightbox = (index) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToNext = useCallback(() => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const goToPrevious = useCallback(() => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Handle keyboard navigation
  React.useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrevious();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, goToNext, goToPrevious]);

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8">
        {photos.map((photo, index) => (
          <div
            key={index}
            onClick={() => openLightbox(index)}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 group"
          >
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-cover"
            />

            {/* Hover overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="m-0 text-sm font-medium">
                {photo.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-8"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 bg-secondary/80 text-primary border-none rounded-full w-[50px] h-[50px] flex items-center justify-center cursor-pointer z-[10000] hover:bg-secondary hover:scale-110 transition-all duration-200"
          >
            <X size={28} />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-5 top-1/2 -translate-y-1/2 bg-secondary/80 text-primary border-none rounded-full w-[50px] h-[50px] flex items-center justify-center cursor-pointer z-[10000] hover:bg-secondary hover:scale-110 transition-all duration-200"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-5 top-1/2 -translate-y-1/2 bg-secondary/80 text-primary border-none rounded-full w-[50px] h-[50px] flex items-center justify-center cursor-pointer z-[10000] hover:bg-secondary hover:scale-110 transition-all duration-200"
          >
            <ChevronRight size={28} />
          </button>

          {/* Main Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90%] max-h-[90%] flex flex-col items-center"
          >
            <img
              src={photos[currentPhotoIndex].url}
              alt={photos[currentPhotoIndex].title}
              className="max-w-full max-h-[calc(90vh-100px)] object-contain rounded-lg"
            />

            {/* Photo Info */}
            <div className="mt-6 text-center text-white">
              <h3 className="m-0 mb-2 text-2xl font-semibold">
                {photos[currentPhotoIndex].title}
              </h3>
              {photos[currentPhotoIndex].location && (
                <p className="m-0 text-base opacity-90">
                  {photos[currentPhotoIndex].location}
                </p>
              )}
              <p className="mt-2 text-sm opacity-70">
                {currentPhotoIndex + 1} / {photos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PhotoGallery;