import React, { useState, useEffect, useRef } from 'react';
import promotionsShowcaseData from '../../data/promotionsShowcaseData.json';

export const PromotionalBannersCarousel = ({ onSelectPromotion }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const touchStartPositionRef = useRef(0);
  const touchEndPositionRef = useRef(0);

  const totalSlidesCount = promotionsShowcaseData.length;

  useEffect(() => {
    if (isCarouselPaused || totalSlidesCount <= 1) return;

    const autoSlideInterval = setInterval(() => {
      setCurrentSlideIndex((previousIndex) => (previousIndex + 1) % totalSlidesCount);
    }, 4500);

    return () => clearInterval(autoSlideInterval);
  }, [isCarouselPaused, totalSlidesCount]);

  const handleNextSlide = () => {
    setCurrentSlideIndex((previousIndex) => (previousIndex + 1) % totalSlidesCount);
  };

  const handlePreviousSlide = () => {
    setCurrentSlideIndex((previousIndex) => (previousIndex - 1 + totalSlidesCount) % totalSlidesCount);
  };

  const handleDotClick = (targetIndex) => {
    setCurrentSlideIndex(targetIndex);
  };

  const handleTouchStart = (touchEvent) => {
    touchStartPositionRef.current = touchEvent.targetTouches[0].clientX;
  };

  const handleTouchMove = (touchEvent) => {
    touchEndPositionRef.current = touchEvent.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeHorizontalDistance = touchStartPositionRef.current - touchEndPositionRef.current;
    const minimumSwipeDistance = 50;

    if (swipeHorizontalDistance > minimumSwipeDistance) {
      handleNextSlide();
    } else if (swipeHorizontalDistance < -minimumSwipeDistance) {
      handlePreviousSlide();
    }
  };

  const handleBannerClick = (promoEntry) => {
    if (onSelectPromotion) {
      onSelectPromotion(promoEntry);
    }
  };

  return (
    <div
      data-aos="fade-up"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5"
    >
      <div
        className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md group select-none bg-neutral-900 aspect-[16/9] sm:aspect-[21/9] max-h-[340px]"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-600 ease-out will-change-transform"
          style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
        >
          {promotionsShowcaseData.map((promoEntry) => (
            <div
              key={promoEntry.promoIdentifier}
              onClick={() => handleBannerClick(promoEntry)}
              className="w-full h-full flex-shrink-0 relative cursor-pointer overflow-hidden group/slide"
            >
              <img
                src={promoEntry.promoBannerImage}
                alt={promoEntry.promoTitle}
                className="w-full h-full object-cover object-center group-hover/slide:scale-[1.02] transition-transform duration-500"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/slide:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-6">
                <span className="text-white text-xs sm:text-sm font-bold bg-[#114B2B] hover:bg-[#0d3b22] px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transition-all">
                  <span>Ver productos del combo</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={(clickEvent) => {
            clickEvent.stopPropagation();
            handlePreviousSlide();
          }}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-xs"
          aria-label="Promoción anterior"
        >
          <span className="material-symbols-outlined text-lg sm:text-xl">chevron_left</span>
        </button>

        <button
          type="button"
          onClick={(clickEvent) => {
            clickEvent.stopPropagation();
            handleNextSlide();
          }}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-xs"
          aria-label="Promoción siguiente"
        >
          <span className="material-symbols-outlined text-lg sm:text-xl">chevron_right</span>
        </button>

        <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full">
          {promotionsShowcaseData.map((indicatorItem, indicatorIndex) => {
            const isIndicatorActive = indicatorIndex === currentSlideIndex;
            return (
              <button
                key={indicatorItem.promoIdentifier}
                type="button"
                onClick={(clickEvent) => {
                  clickEvent.stopPropagation();
                  handleDotClick(indicatorIndex);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isIndicatorActive
                    ? 'w-5 sm:w-6 h-1.5 bg-yellow-400'
                    : 'w-1.5 h-1.5 bg-white/60 hover:bg-white'
                }`}
                aria-label={`Ir a promoción ${indicatorIndex + 1}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
