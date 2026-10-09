import React, { useState, useEffect } from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';
import { WeightSelectionModal } from './WeightSelectionModal';

export const ProductCardItem = ({ productItem, onSelectProduct }) => {
  const { addProductToCart, exchangeRateBcv, cartItemList, preferredCurrency } = useShoppingCart();

  const [addedFeedbackActive, setAddedFeedbackActive] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [cardOriginCoordinates, setCardOriginCoordinates] = useState(null);

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
      }, 1000);
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
    }, 1000);
  };

  const handleProductNavigation = (clickEvent) => {
    clickEvent.stopPropagation();
    if (onSelectProduct) {
      onSelectProduct(productItem);
    }
  };

  const isAddButtonDisabled = isOutOfStock || isStockExhaustedInCart;

  return (
    <>
      <div
        data-product-card="true"
        data-aos="fade-up"
        className={`h-full bg-white rounded-2xl border border-neutral-200 shadow-md hover:shadow-xl hover:border-[#8DC63F]/60 p-3 sm:p-4 flex flex-col justify-between transition-all duration-200 relative group ${
          isOutOfStock ? 'opacity-60' : ''
        }`}
      >
        <div>
          <div
            onClick={handleProductNavigation}
            className="w-full h-32 sm:h-36 rounded-xl bg-white overflow-hidden mb-2 relative cursor-pointer flex items-center justify-center"
          >
            <img
              className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
              alt={productItem.productTitle}
              src={productItem.productImage}
              loading="lazy"
            />

            {productItem.promotionalBadgeText && !isOutOfStock && (
              <span className="absolute top-1 left-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#8DC63F] text-[#062612] shadow-2xs">
                {productItem.promotionalBadgeText}
              </span>
            )}

            {isOutOfStock && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-neutral-200 shadow-2xs">
                  Agotado
                </span>
              </div>
            )}
          </div>

          <div>
            <h3
              onClick={handleProductNavigation}
              title={productItem.productTitle}
              className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#437521] transition-colors leading-tight line-clamp-2 min-h-[2.4rem] cursor-pointer"
            >
              {productItem.productTitle}
            </h3>

            <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mt-1 truncate">
              {productItem.productCategoryName || 'PERECEDEROS'}
            </div>

            <div className="flex items-center gap-0.5 my-1 text-neutral-300 text-xs">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>

            <div className="text-[11px] text-neutral-500 font-normal">
              Exento de IVA
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div className="min-w-0">
            {preferredCurrency === 'BS' ? (
              <div>
                <div className="text-sm sm:text-base font-extrabold text-neutral-900 leading-none truncate">
                  Bs. {priceBcvEquivalent}
                </div>
                <div className="text-[10px] text-neutral-400 font-medium mt-0.5 truncate">
                  Ref. ${productItem.productPriceUsd.toFixed(2)}
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm sm:text-base font-extrabold text-neutral-900 leading-none truncate">
                  $ {productItem.productPriceUsd.toFixed(2)}
                </div>
                <div className="text-[10px] text-neutral-400 font-medium mt-0.5 truncate">
                  Bs. {priceBcvEquivalent}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCartClick}
            disabled={isAddButtonDisabled}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer shrink-0 ${
              isAddButtonDisabled
                ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed border border-neutral-200'
                : addedFeedbackActive
                  ? 'bg-[#8DC63F] text-[#062612] border border-[#78AD2F]'
                  : 'border border-[#8DC63F] text-[#4C821D] hover:bg-[#F2F9E6] active:scale-90 shadow-2xs'
            }`}
            aria-label={`Agregar ${productItem.productTitle} al carrito`}
          >
            <span className="material-symbols-outlined text-lg">
              {addedFeedbackActive
                ? 'check'
                : isWeightBased
                  ? 'scale'
                  : 'add_shopping_cart'}
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
