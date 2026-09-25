import React, { useState, useEffect, useRef, useMemo } from 'react';
import categoriesShowcaseData from '../../data/categoriesShowcaseData.json';

const CategoryCircleItem = ({
  categoryIdentifier,
  categoryTitle,
  categoryProductImages,
  isSelectedCategory,
  onSelectCategory,
  staggerOffsetMilliseconds = 0
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (categoryProductImages.length <= 1) return;

    const slideshowInterval = setInterval(() => {
      setActiveImageIndex((previousIndex) => (previousIndex + 1) % categoryProductImages.length);
    }, 2800 + staggerOffsetMilliseconds);

    return () => clearInterval(slideshowInterval);
  }, [categoryProductImages.length, staggerOffsetMilliseconds]);

  return (
    <button
      type="button"
      onClick={() => onSelectCategory(categoryIdentifier)}
      className="flex flex-col items-center flex-shrink-0 group cursor-pointer focus:outline-none transition-transform active:scale-95"
      aria-label={`Filtrar por ${categoryTitle}`}
    >
      <div
        className={`relative p-1 rounded-full transition-all duration-300 ${
          isSelectedCategory
            ? 'ring-3 ring-[#114B2B] shadow-md scale-105'
            : 'ring-2 ring-neutral-200/90 group-hover:ring-emerald-400 group-hover:scale-105 shadow-2xs'
        }`}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden relative shadow-inner bg-neutral-100">
          {categoryProductImages.length > 0 ? (
            categoryProductImages.map((imageUrl, imageIndex) => {
              const isCurrentImage = imageIndex === activeImageIndex;
              return (
                <img
                  key={imageUrl}
                  src={imageUrl}
                  alt={categoryTitle}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
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
              <span className="material-symbols-outlined text-2xl">storefront</span>
            </div>
          )}
        </div>
      </div>

      <span
        className={`text-[11px] sm:text-xs font-bold text-center leading-tight mt-2 max-w-[80px] sm:max-w-[96px] line-clamp-2 transition-colors ${
          isSelectedCategory
            ? 'text-[#114B2B] font-extrabold'
            : 'text-neutral-700 group-hover:text-[#114B2B]'
        }`}
      >
        {categoryTitle}
      </span>
    </button>
  );
};

export const CategoryCircleSlider = ({
  departmentsCatalogList,
  selectedDepartmentIdentifier,
  onSelectDepartmentFilter,
  productsCatalogList
}) => {
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

    setCanScrollLeft(scrollLeftPosition > 5);
    setCanScrollRight(scrollLeftPosition < maxScrollLeftPosition - 5);
  };

  useEffect(() => {
    checkScrollBoundaries();
    window.addEventListener('resize', checkScrollBoundaries);
    return () => window.removeEventListener('resize', checkScrollBoundaries);
  }, [departmentsCatalogList.length]);

  useEffect(() => {
    const autoAdvanceInterval = setInterval(() => {
      const sliderElement = sliderContainerReference.current;
      if (!sliderElement || isUserInteractingWithSlider) return;

      const maxScrollPosition = sliderElement.scrollWidth - sliderElement.clientWidth;
      if (maxScrollPosition <= 0) return;

      if (sliderElement.scrollLeft >= maxScrollPosition - 10) {
        sliderElement.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const cardStepWidth = sliderElement.clientWidth > 640 ? 240 : 160;
        sliderElement.scrollBy({ left: cardStepWidth, behavior: 'smooth' });
      }
      setTimeout(checkScrollBoundaries, 350);
    }, 4000);

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
    const scrollAmount = scrollDirection === 'left' ? -240 : 240;
    sliderElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(() => {
      checkScrollBoundaries();
      handleUserInteractionEnd();
    }, 350);
  };

  const allProductsImages = useMemo(() => {
    return productsCatalogList
      .filter((productEntry) => Boolean(productEntry.productImage))
      .map((productEntry) => productEntry.productImage)
      .slice(0, 5);
  }, [productsCatalogList]);

  const categoriesSliderEntries = useMemo(() => {
    return categoriesShowcaseData.map((categoryShowcaseItem, categoryIndex) => {
      const hasAssignedCategoryImage = Boolean(categoryShowcaseItem.categoryAssignedImage);

      let resolvedCategoryImages = [];
      if (hasAssignedCategoryImage) {
        resolvedCategoryImages = [categoryShowcaseItem.categoryAssignedImage];
      } else if (categoryShowcaseItem.categoryIdentifier === 'todos') {
        resolvedCategoryImages = allProductsImages;
      } else {
        const matchingProducts = productsCatalogList.filter((productEntry) =>
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
  }, [productsCatalogList, allProductsImages]);

  return (
    <div className="relative w-full py-2">
      <div
        className={`pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10 transition-opacity duration-300 ${
          canScrollLeft ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <button
        type="button"
        onClick={() => handleScrollSlider('left')}
        disabled={!canScrollLeft}
        className={`absolute left-0.5 sm:left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 bg-white/95 hover:bg-white text-neutral-700 hover:text-[#114B2B] rounded-full shadow-md border border-neutral-200 flex items-center justify-center transition-all cursor-pointer ${
          canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Desplazar categorías a la izquierda"
      >
        <span className="material-symbols-outlined text-lg">chevron_left</span>
      </button>

      <div
        ref={sliderContainerReference}
        onScroll={handleSliderScroll}
        className="flex items-start gap-4 sm:gap-6 overflow-x-auto scroll-smooth py-2 px-6 sm:px-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categoriesSliderEntries.map((categoryEntry) => (
          <CategoryCircleItem
            key={categoryEntry.categoryIdentifier}
            categoryIdentifier={categoryEntry.categoryIdentifier}
            categoryTitle={categoryEntry.categoryTitle}
            categoryProductImages={categoryEntry.categoryProductImages}
            isSelectedCategory={selectedDepartmentIdentifier === categoryEntry.categoryIdentifier}
            onSelectCategory={onSelectDepartmentFilter}
            staggerOffsetMilliseconds={categoryEntry.staggerOffsetMilliseconds}
          />
        ))}
      </div>

      <div
        className={`pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10 transition-opacity duration-300 ${
          canScrollRight ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <button
        type="button"
        onClick={() => handleScrollSlider('right')}
        disabled={!canScrollRight}
        className={`absolute right-0.5 sm:right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 bg-white/95 hover:bg-white text-neutral-700 hover:text-[#114B2B] rounded-full shadow-md border border-neutral-200 flex items-center justify-center transition-all cursor-pointer ${
          canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Desplazar categorías a la derecha"
      >
        <span className="material-symbols-outlined text-lg">chevron_right</span>
      </button>
    </div>
  );
};
