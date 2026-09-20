import React, { useState, useEffect } from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

const weeklyPromotionalOffersList = [
  {
    offerIdentifier: 'oferta-charcuteria-san-joaquin',
    imageSourceUrl: '/images/hero-venezuelan-deli.jpg',
    imageAltText: 'Selección de charcutería y quesos artesanales'
  },
  {
    offerIdentifier: 'oferta-desayuno-venezolano',
    imageSourceUrl: '/images/hero-venezuelan-breakfast.jpg',
    imageAltText: 'Arepas doradas tradicionales con queso blanco'
  },
  {
    offerIdentifier: 'oferta-supermercado-maracaibo',
    imageSourceUrl: '/images/hero-venezuelan-market.jpg',
    imageAltText: 'Charcutería selecta y quesería artesanal'
  }
];

export const HeroOffersCarousel = () => {
  const { exchangeRateBcv } = useShoppingCart();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [touchStartCoordinateX, setTouchStartCoordinateX] = useState(null);

  useEffect(() => {
    if (isCarouselPaused) {
      return;
    }

    const slideRotationInterval = setInterval(() => {
      setActiveSlideIndex((previousSlideIndex) => {
        return (previousSlideIndex + 1) % weeklyPromotionalOffersList.length;
      });
    }, 5000);

    return () => {
      clearInterval(slideRotationInterval);
    };
  }, [isCarouselPaused]);

  const handleSelectSpecificSlide = (targetSlideIndex) => {
    setActiveSlideIndex(targetSlideIndex);
  };

  const handleNextSlide = () => {
    setActiveSlideIndex((previousSlideIndex) => {
      return (previousSlideIndex + 1) % weeklyPromotionalOffersList.length;
    });
  };

  const handlePreviousSlide = () => {
    setActiveSlideIndex((previousSlideIndex) => {
      return (previousSlideIndex - 1 + weeklyPromotionalOffersList.length) % weeklyPromotionalOffersList.length;
    });
  };

  const handleTouchStartGesture = (touchEvent) => {
    setTouchStartCoordinateX(touchEvent.touches[0].clientX);
  };

  const handleTouchEndGesture = (touchEvent) => {
    if (!touchStartCoordinateX) {
      return;
    }
    const touchEndCoordinateX = touchEvent.changedTouches[0].clientX;
    const swipeDistanceDelta = touchStartCoordinateX - touchEndCoordinateX;

    if (swipeDistanceDelta > 45) {
      handleNextSlide();
    } else if (swipeDistanceDelta < -45) {
      handlePreviousSlide();
    }
    setTouchStartCoordinateX(null);
  };

  const formattedExchangeRate = exchangeRateBcv.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <div
      onMouseEnter={() => setIsCarouselPaused(true)}
      onMouseLeave={() => setIsCarouselPaused(false)}
      onTouchStart={handleTouchStartGesture}
      onTouchEnd={handleTouchEndGesture}
      className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-900 group select-none"
    >
      {weeklyPromotionalOffersList.map((offerItem, offerIndex) => {
        const isCurrentSlideActive = offerIndex === activeSlideIndex;

        return (
          <div
            key={offerItem.offerIdentifier}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isCurrentSlideActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={offerItem.imageSourceUrl}
              alt={offerItem.imageAltText}
              className={`w-full h-full object-cover transition-transform duration-1200 ease-out ${
                isCurrentSlideActive ? 'scale-105' : 'scale-100'
              }`}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-black/50"></div>
          </div>
        );
      })}

      <div className="hidden sm:flex absolute top-6 right-8 z-30 items-center gap-2">
        <div className="bg-black/75 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-lg border border-white/20">
          Tasa BCV: Bs. {formattedExchangeRate}
        </div>
      </div>

      <button
        type="button"
        onClick={handlePreviousSlide}
        className="hidden lg:flex absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-xs text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer active:scale-95 shadow-lg"
        aria-label="Oferta anterior"
      >
        <span className="material-symbols-outlined text-xl">chevron_left</span>
      </button>

      <button
        type="button"
        onClick={handleNextSlide}
        className="hidden lg:flex absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-xs text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer active:scale-95 shadow-lg"
        aria-label="Siguiente oferta"
      >
        <span className="material-symbols-outlined text-xl">chevron_right</span>
      </button>

      <div className="absolute bottom-6 right-8 sm:right-12 z-30 flex items-center gap-2">
        {weeklyPromotionalOffersList.map((dotIndicatorItem, dotIndex) => {
          const isDotActive = dotIndex === activeSlideIndex;

          return (
            <button
              key={dotIndicatorItem.offerIdentifier}
              onClick={() => handleSelectSpecificSlide(dotIndex)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                isDotActive ? 'w-7 bg-white shadow-md' : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Ver diapositiva ${dotIndex + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};
