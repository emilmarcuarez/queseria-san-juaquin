import React, { useState, useEffect } from 'react';

const weeklyPromotionalOffersList = [
  {
    offerIdentifier: 'oferta-charcuteria-san-joaquin',
    imageSourceUrl: '/images/hero-venezuelan-deli.jpg',
    imageAltText: 'Selección de charcutería y quesos artesanales',
    bannerTitle: 'Charcutería selecta y quesos frescos',
    bannerSubtitle: 'Rebanados al momento para tus mejores recetas'
  },
  {
    offerIdentifier: 'oferta-desayuno-venezolano',
    imageSourceUrl: '/images/hero-venezuelan-breakfast.jpg',
    imageAltText: 'Arepas doradas tradicionales con queso blanco',
    bannerTitle: 'Sabor Criollo & Tradición del Llano',
    bannerSubtitle: 'Los mejores quesos de Venezuela directos a tu mesa'
  },
  {
    offerIdentifier: 'oferta-supermercado-maracaibo',
    imageSourceUrl: '/images/hero-venezuelan-market.jpg',
    imageAltText: 'Charcutería selecta y quesería artesanal',
    bannerTitle: 'Todo para tu despensa y tu hogar',
    bannerSubtitle: 'Víveres, embutidos y productos de primera calidad'
  }
];

export const HeroOffersCarousel = () => {
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
    }, 5500);

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

  return (
    <div
      onMouseEnter={() => setIsCarouselPaused(true)}
      onMouseLeave={() => setIsCarouselPaused(false)}
      onTouchStart={handleTouchStartGesture}
      onTouchEnd={handleTouchEndGesture}
      className="relative w-full h-44 sm:h-56 md:h-64 lg:h-72 rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-100 group select-none shadow-xs border border-neutral-100"
    >
      {weeklyPromotionalOffersList.map((offerItem, offerIndex) => {
        const isCurrentSlideActive = offerIndex === activeSlideIndex;

        return (
          <div
            key={offerItem.offerIdentifier}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isCurrentSlideActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={offerItem.imageSourceUrl}
              alt={offerItem.imageAltText}
              className={`w-full h-full object-cover object-center transition-transform duration-1000 ease-out ${
                isCurrentSlideActive ? 'scale-102' : 'scale-100'
              }`}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/70 via-neutral-950/30 to-transparent flex flex-col justify-center px-6 sm:px-10 lg:px-14">
              <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#8DC63F] mb-1">
                Promoción Especial
              </span>
              <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-white max-w-md leading-tight drop-shadow-xs">
                {offerItem.bannerTitle}
              </h3>
              <p className="text-xs sm:text-sm text-white/90 max-w-sm mt-1 font-medium drop-shadow-xs hidden sm:block">
                {offerItem.bannerSubtitle}
              </p>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={handlePreviousSlide}
        className="hidden lg:flex absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-neutral-800 items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer active:scale-95 shadow-md"
        aria-label="Oferta anterior"
      >
        <span className="material-symbols-outlined text-lg">chevron_left</span>
      </button>

      <button
        type="button"
        onClick={handleNextSlide}
        className="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-neutral-800 items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer active:scale-95 shadow-md"
        aria-label="Siguiente oferta"
      >
        <span className="material-symbols-outlined text-lg">chevron_right</span>
      </button>

      <div className="absolute bottom-3.5 left-6 sm:left-10 z-30 flex items-center gap-1.5">
        {weeklyPromotionalOffersList.map((dotIndicatorItem, dotIndex) => {
          const isDotActive = dotIndex === activeSlideIndex;

          return (
            <button
              key={dotIndicatorItem.offerIdentifier}
              onClick={() => handleSelectSpecificSlide(dotIndex)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                isDotActive ? 'w-6 bg-white shadow-xs' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Ver diapositiva ${dotIndex + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};
