import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { CarImage } from '../types/index.js';

interface CarCarouselProps {
  images: CarImage[];
  carName: string;
}

export const CarCarousel: React.FC<CarCarouselProps> = ({ images, carName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullScreen, setFullScreen] = useState(false);

  const fallbackImages = [
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
  ];

  const imageList = images && images.length > 0
    ? images.map(img => img.image_url)
    : fallbackImages;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      
      {/* MAIN CAROUSEL IMAGE DISPLAY */}
      <div className="relative h-96 md:h-[480px] rounded-3xl overflow-hidden bg-ag-surface border border-ag-border/80 group">
        <img
          src={imageList[currentIndex]}
          alt={`${carName} photo ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
        />

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-ag-dark/70 via-transparent to-black/20 pointer-events-none" />

        {/* NAVIGATION BUTTONS */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-ag-dark/70 backdrop-blur-md border border-ag-border/80 text-white flex items-center justify-center hover:bg-ag-cyan hover:text-slate-950 transition-all shadow-xl"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-ag-dark/70 backdrop-blur-md border border-ag-border/80 text-white flex items-center justify-center hover:bg-ag-cyan hover:text-slate-950 transition-all shadow-xl"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* FULLSCREEN BUTTON */}
        <button
          onClick={() => setFullScreen(true)}
          className="absolute top-4 right-4 p-2.5 rounded-xl bg-ag-dark/80 backdrop-blur-md border border-ag-border/80 text-slate-200 hover:text-ag-cyan hover:scale-105 transition-all shadow-lg"
          title="View Fullscreen"
        >
          <Maximize2 className="w-5 h-5" />
        </button>

        {/* COUNTER BADGE */}
        <div className="absolute bottom-4 left-4 bg-ag-dark/80 backdrop-blur-md border border-ag-border/80 px-3 py-1 rounded-full text-xs font-medium text-slate-300">
          {currentIndex + 1} / {imageList.length}
        </div>
      </div>

      {/* THUMBNAIL NAVIGATION STRIP */}
      {imageList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                currentIndex === idx
                  ? 'border-ag-cyan scale-105 shadow-md'
                  : 'border-ag-border/60 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* FULLSCREEN MODAL */}
      {fullScreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <button
            onClick={() => setFullScreen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-ag-surface text-white hover:text-ag-cyan transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={imageList[currentIndex]}
            alt="Fullscreen view"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl border border-ag-border"
          />
        </div>
      )}

    </div>
  );
};
