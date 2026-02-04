import React, { useState, useEffect } from 'react';
import PhotoCarousel from '../components/PhotoCarousel';
import { fetchPhotos } from '../services/photoService';

function PhotographyPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPhotos() {
      setLoading(true);
      const data = await fetchPhotos();

      if (data) {
        setPhotos(data);
        setError(null);
      } else {
        setError('Unable to load photos. Please try again later.');
      }

      setLoading(false);
    }

    loadPhotos();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Page Header */}
      <div className="py-8 md:py-12 px-4 md:px-16 pb-6 md:pb-8 bg-gradient-to-br from-secondary to-secondary/80 text-white">
        <h1 className="m-0 mb-2 text-2xl md:text-4xl font-bold">
          Photography
        </h1>
        <p className="m-0 text-base md:text-lg opacity-90 font-light">
          Capturing moments from around the world
        </p>
      </div>

      {/* Content Container */}
      <div className="max-w-[1400px] mx-auto py-6 md:py-12 px-4 md:px-16">

        {/* Featured Carousel */}
        <div className="mb-8 md:mb-16">
          <h2 className="m-0 mb-4 md:mb-6 text-2xl md:text-3xl text-secondary font-semibold">
            Featured Photos
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-16 bg-gray-50 rounded-xl">
              <p className="text-gray-500">Loading photos...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-16 bg-red-50 rounded-xl border border-red-200">
              <p className="text-red-600">{error}</p>
            </div>
          ) : photos.length === 0 ? (
            <div className="flex items-center justify-center py-16 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No photos available yet.</p>
            </div>
          ) : (
            <PhotoCarousel photos={photos} />
          )}
        </div>

        {/* Instagram Section */}
        <div className="text-center py-8 md:py-12 px-4 md:px-8 bg-white rounded-xl shadow-md">
          <h2 className="m-0 mb-3 md:mb-4 text-2xl md:text-3xl text-secondary font-semibold">
            Follow My Journey
          </h2>
          <p className="m-0 mb-6 md:mb-8 text-base md:text-lg text-gray-600">
            See more photos and daily updates on Instagram
          </p>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-pink-600 text-white no-underline rounded-lg text-base md:text-lg font-semibold shadow-lg shadow-pink-600/30 hover:shadow-xl hover:shadow-pink-600/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            📸 @yourhandle
          </a>
        </div>
      </div>
    </div>
  );
}

export default PhotographyPage;