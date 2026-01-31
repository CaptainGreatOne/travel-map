import React, { useState, useEffect } from 'react';
import { Youtube, Instagram } from 'lucide-react';
import { fetchAboutContent } from '../services/aboutService';

function AboutPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      const data = await fetchAboutContent();
      if (data) {
        setContent(data);
      }
      setLoading(false);
    }
    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Page Header */}
      <div className="py-8 md:py-12 px-4 md:px-16 pb-6 md:pb-8 bg-gradient-to-br from-secondary to-secondary/80 text-white">
        <h1 className="m-0 mb-2 text-2xl md:text-4xl font-bold">
          About
        </h1>
        <p className="m-0 text-base md:text-lg opacity-90 font-light">
          Welcome to my journey around the world
        </p>
      </div>

      {/* Content Container */}
      <div className="max-w-[900px] mx-auto py-6 md:py-12 px-4 md:px-16">

        {/* YouTube Video Section */}
        <div className="mb-8 md:mb-12 bg-white rounded-xl overflow-hidden shadow-md">
          <div className="relative pb-[56.25%] h-0 overflow-hidden">
            <iframe
              className="absolute top-0 left-0 w-full h-full border-none"
              src={`https://www.youtube.com/embed/${content?.youtube_video_id || 'YOUR_VIDEO_ID'}`}
              title="Channel Welcome Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white p-4 md:p-10 rounded-xl shadow-md mb-8 md:mb-12">
          <h2 className="m-0 mb-4 md:mb-6 text-2xl md:text-3xl text-secondary font-semibold">
            My Story
          </h2>

          <p className="m-0 mb-4 md:mb-5 text-base md:text-lg leading-relaxed text-gray-800">
            {content?.bio_paragraph_1 || "Hi, I'm A BITCHIN MOOSE! I'm a travel enthusiast documenting my adventures around the globe. This interactive map showcases over 600 locations I've either visited or dream of exploring."}
          </p>

          <p className="m-0 mb-4 md:mb-5 text-base md:text-lg leading-relaxed text-gray-800">
            {content?.bio_paragraph_2 || "Through my YouTube channel, I share travel vlogs, guides, and tips to help you plan your own adventures. Each video is linked to specific locations on the map, making it easy to discover places and learn from my experiences."}
          </p>

          <p className="m-0 text-base md:text-lg leading-relaxed text-gray-800">
            {content?.bio_paragraph_3 || "Whether you're planning your next trip or just dreaming about future destinations, I hope this map inspires you to explore the world!"}
          </p>
        </div>

        {/* Social Links Section */}
        <div className="bg-white p-4 md:p-10 rounded-xl shadow-md">
          <h2 className="m-0 mb-4 md:mb-6 text-2xl md:text-3xl text-secondary font-semibold text-center">
            Connect With Me
          </h2>

          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8">
            {/* YouTube Link */}
            <a
              href={content?.youtube_url || 'https://youtube.com/@yourchannel'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-4 md:px-6 py-3 md:py-4 bg-red-600 text-white no-underline rounded-lg text-base md:text-lg font-semibold shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Youtube size={24} />
              YouTube
            </a>

            {/* Instagram Link */}
            <a
              href={content?.instagram_url || 'https://instagram.com/capt_gr8_1'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-4 md:px-6 py-3 md:py-4 bg-pink-600 text-white no-underline rounded-lg text-base md:text-lg font-semibold shadow-lg shadow-pink-600/30 hover:shadow-xl hover:shadow-pink-600/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Instagram size={24} />
              Instagram
            </a>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
          <div className="text-center p-4 md:p-8 bg-white rounded-xl shadow-md">
            <div className="text-3xl md:text-5xl font-bold text-primary mb-1 md:mb-2">
              {content?.location_count
                ? content.location_count.toLocaleString() + '+'
                : '600+'}
            </div>
            <div className="text-base md:text-lg text-gray-600">
              Locations
            </div>
          </div>

          <div className="text-center p-4 md:p-8 bg-white rounded-xl shadow-md">
            <div className="text-3xl md:text-5xl font-bold text-green-400 mb-1 md:mb-2">
              {content?.country_count
                ? content.country_count.toLocaleString()
                : '--'}
            </div>
            <div className="text-base md:text-lg text-gray-600">
              Countries Visited
            </div>
          </div>

          <div className="text-center p-4 md:p-8 bg-white rounded-xl shadow-md">
            <div className="text-3xl md:text-5xl font-bold text-blue-400 mb-1 md:mb-2">
              {content?.video_count
                ? content.video_count.toLocaleString()
                : '--'}
            </div>
            <div className="text-base md:text-lg text-gray-600">
              Videos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;