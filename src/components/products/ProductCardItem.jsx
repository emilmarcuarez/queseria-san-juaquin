import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useShoppingCart } from '../../hooks/useShoppingCart';
import { WeightSelectionModal } from './WeightSelectionModal';

export const ProductCardItem = ({ productItem, onSelectProduct, cardVariant = 'default' }) => {
  const { addProductToCart, exchangeRateBcv, cartItemList, preferredCurrency } = useShoppingCart();

  const [addedFeedbackActive, setAddedFeedbackActive] = useState(false);
  const [isMobileDetailsModalMounted, setIsMobileDetailsModalMounted] = useState(false);
  const [isMobileDetailsModalActive, setIsMobileDetailsModalActive] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [cardOriginCoordinates, setCardOriginCoordinates] = useState(null);

  useEffect(() => {
    const handleResizeScreen = () => {
      setIsMobileDevice(window.innerWidth < 768);
    };
    handleResizeScreen();
    window.addEventListener('resize', handleResizeScreen);
    return () => window.removeEventListener('resize', handleResizeScreen);
  }, []);

  const handleOpenMobileDetails = () => {
    setIsMobileDetailsModalMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsMobileDetailsModalActive(true);
      });
    });
  };

  const handleCloseMobileDetails = () => {
    if (!isMobileDetailsModalActive) return;
    setIsMobileDetailsModalActive(false);
    setTimeout(() => {
      setIsMobileDetailsModalMounted(false);
    }, 300);
  };

  useEffect(() => {
    if (!isMobileDetailsModalMounted) return;
    const previousOverflowValue = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscapeKeyDown = (keyboardEvent) => {
      if (keyboardEvent.key === 'Escape') {
        handleCloseMobileDetails();
      }
    };
    window.addEventListener('keydown', handleEscapeKeyDown);
    return () => {
      document.body.style.overflow = previousOverflowValue;
      window.removeEventListener('keydown', handleEscapeKeyDown);
    };
  }, [isMobileDetailsModalMounted, isMobileDetailsModalActive]);

  const priceBcvEquivalent = (productItem.productPriceUsd * exchangeRateBcv).toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const isWeightBased = productItem.departmentIdentifier === 'quesos-lacteos' && productItem.productPriceUnit === 'kg';
  const totalStock = productItem.availableStockQuantity ?? Infinity;
  const isOutOfStock = totalStock === 0;

  const kgConsumedByCart = cartItemList
    .filter((cartEntry) => cartEntry.productIdentifier === productItem.productIdentifier)
    .reduce((totalConsumed, cartEntry) => {
      if (isWeightBased && cartEntry.basePriceUsd) {
        const portionFactor = cartEntry.productPriceUsd / cartEntry.basePriceUsd;
        return totalConsumed + cartEntry.selectedQuantity * portionFactor;
      }
      return totalConsumed + cartEntry.selectedQuantity;
    }, 0);

  const remainingStockAfterCart = totalStock === Infinity ? Infinity : Math.max(0, totalStock - kgConsumedByCart);
  const isStockExhaustedInCart = remainingStockAfterCart <= 0 && totalStock !== Infinity;
  const stockIsLow = totalStock !== Infinity && remainingStockAfterCart > 0 && remainingStockAfterCart <= (isWeightBased ? 2 : 5);

  const formatStockAmount = (amountValue) => {
    if (!isWeightBased) return `${Math.round(amountValue)}`;
    if (amountValue === Math.floor(amountValue)) return `${amountValue} kg`;
    return `${amountValue.toFixed(2).replace(/\.?0+$/, '')} kg`;
  };

  const handleAddToCartClick = (clickEvent) => {
    clickEvent.stopPropagation();
    if (isOutOfStock || isStockExhaustedInCart) return;

    const productCardElement = clickEvent.currentTarget.closest('[data-product-card]') || clickEvent.currentTarget;
    const cardBoundingRect = productCardElement.getBoundingClientRect();
    const calculatedCoordinates = {
      coordinateX: cardBoundingRect.left + cardBoundingRect.width / 2,
      coordinateY: cardBoundingRect.top + cardBoundingRect.height / 2,
      cardStartX: cardBoundingRect.left,
      cardStartY: cardBoundingRect.top,
      cardWidth: cardBoundingRect.width,
      cardHeight: cardBoundingRect.height
    };
    setCardOriginCoordinates(calculatedCoordinates);

    if (isWeightBased) {
      setIsWeightModalOpen(true);
    } else {
      const addResult = addProductToCart(productItem, 1, 1, calculatedCoordinates);
      if (addResult?.stockLimitReached) return;
      setAddedFeedbackActive(true);
      setTimeout(() => {
        setAddedFeedbackActive(false);
      }, 1200);
    }
  };

  const handleConfirmWeightModal = ({ weightFraction, quantity, customNote }) => {
    addProductToCart(
      productItem,
      quantity,
      quantity,
      cardOriginCoordinates,
      customNote,
      { weightFraction }
    );
    setAddedFeedbackActive(true);
    setTimeout(() => {
      setAddedFeedbackActive(false);
    }, 1200);
  };

  const handleProductNavigation = (clickEvent) => {
    clickEvent.stopPropagation();
    if (onSelectProduct) {
      onSelectProduct(productItem);
    }
  };

  const isAddButtonDisabled = isOutOfStock || isStockExhaustedInCart;

  const cardContainerClasses = `h-full bg-white rounded-2xl border border-neutral-200/80 p-3 sm:p-4 flex flex-col justify-between shadow-sm sm:shadow-md hover:shadow-xl hover:border-amber-400/80 hover:-translate-y-1.5 transition-all duration-300 relative group ${isOutOfStock ? 'opacity-65' : ''}`;
  const cardImageWrapperClasses = 'w-full aspect-square rounded-xl bg-neutral-50/70 group-hover:bg-white overflow-hidden mb-3 relative cursor-pointer flex items-center justify-center border border-neutral-100 transition-colors';

  return (
    <>
      <div
        data-product-card="true"
        data-aos="fade-up"
        className={cardContainerClasses}
      >
        <div>
          <div
            onClick={handleProductNavigation}
            className={cardImageWrapperClasses}
          >
            <img
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              alt={productItem.productTitle}
              src={productItem.productImage}
              loading="lazy"
            />

            {productItem.promotionalBadgeText && !isOutOfStock && (
              <span className="absolute top-2 left-2 text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-gradient-to-r from-[#EA580C] to-[#F59E0B] text-white shadow-xs">
                {productItem.promotionalBadgeText}
              </span>
            )}

            <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-white/95 px-1.5 py-0.5 rounded-md border border-neutral-200/60 shadow-2xs text-[10px] font-black text-neutral-800 pointer-events-none">
              <span className="material-symbols-outlined text-[12px] text-[#F59E0B] fill-current">star</span>
              <span>5.0</span>
            </div>

            {isOutOfStock && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
                <span className="text-[10px] font-black text-neutral-600 uppercase tracking-wider bg-white px-2.5 py-1 rounded-full border border-neutral-200 shadow-xs">
                  Agotado
                </span>
              </div>
            )}
          </div>

          <div>
            <div className="mb-1">
              <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider line-clamp-1">
                {productItem.productCategoryName || 'Quesería & Charcutería'}
              </span>
            </div>

            <h3
              onClick={handleProductNavigation}
              title={productItem.productTitle}
              className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#0B3C1D] transition-colors leading-snug line-clamp-2 min-h-[2.2rem] sm:min-h-[2.5rem] cursor-pointer"
            >
              {productItem.productTitle}
            </h3>

            <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1 leading-snug font-normal">
              {productItem.productDescription}
            </p>

            {productItem.availableCutOptions && productItem.availableCutOptions.length > 0 && (
              <div className="flex items-center gap-1 mt-2.5 overflow-hidden">
                {productItem.availableCutOptions.slice(0, 3).map((cutOptionName, cutIndex) => (
                  <span
                    key={cutOptionName}
                    className={`text-[9.5px] px-2 py-0.5 rounded-md font-semibold truncate ${
                      cutIndex === 0
                        ? 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                        : 'bg-neutral-50 text-neutral-500 border border-neutral-100'
                    }`}
                  >
                    {cutOptionName}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-end justify-between gap-1.5 sm:gap-2">
          <div className="flex-1 min-w-0 pr-0.5">
            {preferredCurrency === 'BS' ? (
              <>
                <div className="flex items-baseline gap-0.5 sm:gap-1 flex-wrap">
                  <span className="text-[10px] sm:text-xs font-black text-neutral-500 uppercase leading-none">
                    Bs.
                  </span>
                  <span className="text-[13px] sm:text-base lg:text-lg font-black text-neutral-900 tracking-tight leading-none whitespace-nowrap">
                    {priceBcvEquivalent}
                  </span>
                  <span className="text-[9px] sm:text-xs font-semibold text-neutral-400 leading-none whitespace-nowrap">
                    /{productItem.productPriceUnit}
                  </span>
                </div>

                <div className="text-[10px] sm:text-[11px] font-bold text-neutral-500 mt-1 leading-none truncate">
                  Ref. ${productItem.productPriceUsd.toFixed(2)} USD
                </div>
              </>
            ) : (
              <>
                <div className="flex items-baseline gap-0.5 flex-wrap">
                  <span className="text-sm sm:text-base lg:text-lg font-black text-neutral-900 tracking-tight leading-none">
                    ${productItem.productPriceUsd.toFixed(2)}
                  </span>
                  <span className="text-[9.5px] sm:text-xs font-semibold text-neutral-400 leading-none">
                    /{productItem.productPriceUnit}
                  </span>
                </div>

                <div className="text-[10px] sm:text-[11px] font-bold text-neutral-500 mt-1 leading-none truncate">
                  Bs. {priceBcvEquivalent}
                </div>
              </>
            )}

            {stockIsLow && (
              <div className="text-[10px] font-bold text-amber-700 mt-1 truncate">
                Solo {formatStockAmount(remainingStockAfterCart)} disp.
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCartClick}
            disabled={isAddButtonDisabled}
            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs active:scale-90 shrink-0 ${
              isAddButtonDisabled
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed shadow-none'
                : addedFeedbackActive
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/40'
                  : 'bg-gradient-to-r from-[#EA580C] to-[#F97316] hover:from-[#C2410C] hover:to-[#EA580C] text-white shadow-sm hover:shadow-md hover:scale-105'
            }`}
            aria-label={`Agregar ${productItem.productTitle} al carrito`}
          >
            <span className="material-symbols-outlined text-lg sm:text-xl">
              {addedFeedbackActive
                ? 'check'
                : isWeightBased
                  ? 'scale'
                  : 'shopping_cart'}
            </span>
          </button>
        </div>
      </div>

      {isWeightBased && (
        <WeightSelectionModal
          isOpen={isWeightModalOpen}
          onClose={() => setIsWeightModalOpen(false)}
          productItem={productItem}
          exchangeRateBcv={exchangeRateBcv}
          onConfirmAddToCart={handleConfirmWeightModal}
        />
      )}
    </>
  );
};
