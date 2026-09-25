import React, { useState, useEffect, useRef, useMemo } from 'react';
import categoriesShowcaseData from '../../data/categoriesShowcaseData.json';
import productsCatalogData from '../../data/productsCatalogData.json';

const CategoryHomeCircleItem = ({
  categoryIdentifier,
  categoryTitle,
  categoryProductImages,
  onSelectCategory,
  staggerOffsetMilliseconds = 0
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (categoryProductImages.length <= 1) return;

    const slideshowInterval = setInterval(() => {
      setActiveImageIndex((previousIndex) => (previousIndex + 1) % categoryProductImages.length);
    }, 3200 + staggerOffsetMilliseconds);

    return () => clearInterval(slideshowInterval);
  }, [categoryProductImages.length, staggerOffsetMilliseconds]);

  return (
    <button
      type="button"
      onClick={() => onSelectCategory(categoryIdentifier)}
      className="flex flex-col items-center flex-shrink-0 group cursor-pointer focus:outline-none transition-transform active:scale-95 w-[104px] sm:w-[124px] md:w-[136px]"
      aria-label={`Explorar categoría ${categoryTitle}`}
    >
      <div className="relative p-1.5 rounded-full transition-all duration-300 ring-2 ring-neutral-200 group-hover:ring-[#114B2B] group-hover:scale-105 shadow-sm group-hover:shadow-md bg-white">
        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden relative shadow-inner bg-neutral-100 border border-neutral-200/80">
          {categoryProductImages.length > 0 ? (
            categoryProductImages.map((imageUrl, imageIndex) => {
              const isCurrentImage = imageIndex === activeImageIndex;
              return (
                <img
                  key={imageUrl}
                  src={imageUrl}
                  alt={categoryTitle}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                    isCurrentImage
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                  loading="lazy"
                />
              );
            })
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-[#114B2B]">
              <span className="material-symbols-outlined text-3xl">storefront</span>
            </div>
          )}
        </div>
      </div>

      <h3 className="text-xs sm:text-sm font-bold text-neutral-800 group-hover:text-[#114B2B] text-center mt-3 max-w-[100px] sm:max-w-[125px] leading-snug line-clamp-2 transition-colors">
        {categoryTitle}
      </h3>

      <span className="text-[11px] font-semibold text-[#114B2B] flex items-center gap-0.5 mt-1 transition-opacity opacity-75 group-hover:opacity-100">
        <span>Ver más</span>
        <span className="material-symbols-outlined text-[13px] group-hover:translate-x-0.5 transition-transform">
          arrow_forward
        </span>
      </span>
    </button>
  );
};

export const DepartmentGridShowcase = ({ onSelectDepartment }) => {
  const sliderContainerReference = useRef(null);
  const interactionTimeoutReference = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isUserInteractingWithSlider, setIsUserInteractingWithSlider] = useState(false);

  const checkScrollBoundaries = () => {
    const sliderElement = sliderContainerReference.current;
    if (!sliderElement) return;

    const scrollLeftPosition = sliderElement.scrollLeft;
    const maxScrollLeftPosition = sliderElement.scrollWidth - sliderElement.clientWidth;

    setCanScrollLeft(scrollLeftPosition > 10);
    setCanScrollRight(scrollLeftPosition < maxScrollLeftPosition - 10);
  };

  useEffect(() => {
    checkScrollBoundaries();
    window.addEventListener('resize', checkScrollBoundaries);
    return () => window.removeEventListener('resize', checkScrollBoundaries);
  }, []);

  useEffect(() => {
    const autoAdvanceInterval = setInterval(() => {
      const sliderElement = sliderContainerReference.current;
      if (!sliderElement || isUserInteractingWithSlider) return;

      const maxScrollPosition = sliderElement.scrollWidth - sliderElement.clientWidth;
      if (maxScrollPosition <= 0) return;

      if (sliderElement.scrollLeft >= maxScrollPosition - 15) {
        sliderElement.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const cardStepWidth = sliderElement.clientWidth > 640 ? 260 : 170;
        sliderElement.scrollBy({ left: cardStepWidth, behavior: 'smooth' });
      }
      setTimeout(checkScrollBoundaries, 400);
    }, 3800);

    return () => clearInterval(autoAdvanceInterval);
  }, [isUserInteractingWithSlider]);

  const handleUserInteractionStart = () => {
    setIsUserInteractingWithSlider(true);
    if (interactionTimeoutReference.current) {
      clearTimeout(interactionTimeoutReference.current);
    }
  };

  const handleUserInteractionEnd = () => {
    if (interactionTimeoutReference.current) {
      clearTimeout(interactionTimeoutReference.current);
    }
    interactionTimeoutReference.current = setTimeout(() => {
      setIsUserInteractingWithSlider(false);
    }, 2800);
  };

  const handleSliderScroll = () => {
    checkScrollBoundaries();
  };

  const handleScrollSlider = (scrollDirection) => {
    const sliderElement = sliderContainerReference.current;
    if (!sliderElement) return;

    handleUserInteractionStart();
    const scrollAmount = scrollDirection === 'left' ? -280 : 280;
    sliderElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(() => {
      checkScrollBoundaries();
      handleUserInteractionEnd();
    }, 350);
  };

  const allProductsImages = useMemo(() => {
    return productsCatalogData
      .filter((productEntry) => Boolean(productEntry.productImage))
      .map((productEntry) => productEntry.productImage)
      .slice(0, 5);
  }, []);

  const categoryShowcaseEntries = useMemo(() => {
    return categoriesShowcaseData.map((categoryShowcaseItem, categoryIndex) => {
      const hasAssignedCategoryImage = Boolean(categoryShowcaseItem.categoryAssignedImage);

      let resolvedCategoryImages = [];
      if (hasAssignedCategoryImage) {
        resolvedCategoryImages = [categoryShowcaseItem.categoryAssignedImage];
      } else if (categoryShowcaseItem.categoryIdentifier === 'todos') {
        resolvedCategoryImages = allProductsImages;
      } else {
        const matchingProducts = productsCatalogData.filter((productEntry) =>
          categoryShowcaseItem.matchingProductIds.includes(productEntry.productIdentifier)
        );

        const matchingImages = matchingProducts
          .filter((productEntry) => Boolean(productEntry.productImage))
          .map((productEntry) => productEntry.productImage)
          .slice(0, 5);

        resolvedCategoryImages = matchingImages.length > 0 ? matchingImages : allProductsImages.slice(0, 3);
      }

      return {
        categoryIdentifier: categoryShowcaseItem.categoryIdentifier,
        categoryTitle: categoryShowcaseItem.categoryTitle,
        categoryProductImages: resolvedCategoryImages,
        staggerOffsetMilliseconds: (categoryIndex + 1) * 350
      };
    });
  }, [allProductsImages]);

  return (
    <section className="pt-10 pb-12 sm:pt-14 sm:pb-16 bg-white scroll-mt-36" id="departamentos">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3" data-aos="fade-up">
          <div>
            <span className="text-xs font-extrabold text-accent uppercase tracking-widest">
              Catálogo Completo
            </span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-neutral-dark tracking-tight mt-1">
              Explora por Categorías
            </h2>
          </div>
          <p className="text-sm text-neutral-muted max-w-md font-medium">
            Todo lo necesario para surtir tu cocina y mesa sin salir de casa.
          </p>
        </div>

        <div
          className="relative w-full py-2 group/slider"
          data-aos="fade-up"
          data-aos-delay="100"
          onMouseEnter={handleUserInteractionStart}
          onMouseLeave={handleUserInteractionEnd}
          onTouchStart={handleUserInteractionStart}
          onTouchEnd={handleUserInteractionEnd}
        >
          <div
            className={`pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10 transition-opacity duration-300 ${
              canScrollLeft ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <button
            type="button"
            onClick={() => handleScrollSlider('left')}
            disabled={!canScrollLeft}
            className={`absolute left-0.5 sm:left-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/95 hover:bg-white text-neutral-700 hover:text-[#114B2B] rounded-full shadow-lg border border-neutral-200 flex items-center justify-center transition-all cursor-pointer ${
              canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Desplazar categorías a la izquierda"
          >
            <span className="material-symbols-outlined text-xl">chevron_left</span>
          </button>

          <div
            ref={sliderContainerReference}
            onScroll={handleSliderScroll}
            className="flex items-start justify-start gap-3 sm:gap-6 overflow-x-auto scroll-smooth py-3 pl-3 sm:pl-6 pr-14 sm:pr-20"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categoryShowcaseEntries.map((categoryItem) => (
              <CategoryHomeCircleItem
                key={categoryItem.categoryIdentifier}
                categoryIdentifier={categoryItem.categoryIdentifier}
                categoryTitle={categoryItem.categoryTitle}
                categoryProductImages={categoryItem.categoryProductImages}
                onSelectCategory={onSelectDepartment}
                staggerOffsetMilliseconds={categoryItem.staggerOffsetMilliseconds}
              />
            ))}
          </div>

          <div
            className={`pointer-events-none absolute right-0 top-0 bottom-0 w-14 sm:w-24 bg-gradient-to-l from-white via-white/50 to-transparent z-10 transition-opacity duration-300 ${
              canScrollRight ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <button
            type="button"
            onClick={() => handleScrollSlider('right')}
            disabled={!canScrollRight}
            className={`absolute right-0.5 sm:right-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/95 hover:bg-white text-neutral-700 hover:text-[#114B2B] rounded-full shadow-lg border border-neutral-200 flex items-center justify-center transition-all cursor-pointer ${
              canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Desplazar categorías a la derecha"
          >
            <span className="material-symbols-outlined text-xl">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
};
