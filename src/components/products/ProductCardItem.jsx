import React, { useState } from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';
import { WeightSelectionModal } from './WeightSelectionModal';

export const ProductCardItem = ({ productItem, onSelectProduct }) => {
  const { addProductToCart, exchangeRateBcv, cartItemList } = useShoppingCart();

  const [addedFeedbackActive, setAddedFeedbackActive] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [cardOriginCoordinates, setCardOriginCoordinates] = useState(null);

  const priceBcvEquivalent = (productItem.productPriceUsd * exchangeRateBcv).toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const isWeightBased = productItem.productPriceUnit === 'kg';

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

  const formatStockAmount = (amount) => {
    if (!isWeightBased) return `${Math.round(amount)}`;
    if (amount === Math.floor(amount)) return `${amount} kg`;
    return `${amount.toFixed(2).replace(/\.?0+$/, '')} kg`;
  };

  const handleAddToCartClick = (clickEvent) => {
    clickEvent.stopPropagation();

    if (isOutOfStock || isStockExhaustedInCart) return;

    const productCardElement = clickEvent.currentTarget.closest('[data-product-card]') || clickEvent.currentTarget;
    const cardBoundingRect = productCardElement.getBoundingClientRect();
    const originCoordinates = {
      coordinateX: cardBoundingRect.left + cardBoundingRect.width / 2,
      coordinateY: cardBoundingRect.top + cardBoundingRect.height / 2,
      cardStartX: cardBoundingRect.left,
      cardStartY: cardBoundingRect.top,
      cardWidth: cardBoundingRect.width,
      cardHeight: cardBoundingRect.height
    };
    setCardOriginCoordinates(originCoordinates);

    if (isWeightBased) {
      setIsWeightModalOpen(true);
    } else {
      const addResult = addProductToCart(productItem, 1, 1, originCoordinates);
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

  const handleToggleDetailsExpand = (clickEvent) => {
    clickEvent.stopPropagation();
    setIsDetailsExpanded((previousState) => !previousState);
  };

  const badgeBackgroundClass = productItem.promotionalBadgeStyle === 'bright'
    ? 'bg-accent-bright text-neutral-dark'
    : productItem.promotionalBadgeStyle === 'accent'
      ? 'bg-accent text-neutral-dark'
      : 'bg-primary text-white';

  const isAddButtonDisabled = isOutOfStock || isStockExhaustedInCart;

  const stockBadgeContent = () => {
    if (isOutOfStock) {
      return { text: 'Agotado', className: 'bg-neutral-100 text-neutral-500 border border-neutral-200', icon: 'remove_shopping_cart' };
    }
    if (isStockExhaustedInCart) {
      return { text: 'Límite alcanzado', className: 'bg-amber-50 text-amber-700 border border-amber-200', icon: 'block' };
    }
    if (stockIsLow) {
      return { text: `Solo ${formatStockAmount(remainingStockAfterCart)} disponible${!isWeightBased && remainingStockAfterCart === 1 ? '' : 's'}`, className: 'bg-red-50 text-red-600 border border-red-200', icon: 'inventory_2' };
    }
    return { text: `${formatStockAmount(remainingStockAfterCart)} disponibles`, className: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: 'inventory_2' };
  };

  const stockBadge = totalStock !== Infinity ? stockBadgeContent() : null;

  return (
    <>
      <div
        data-product-card="true"
        data-aos="fade-up"
        className={`h-full bg-white rounded-2xl border border-neutral-200/90 p-3 sm:p-4 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all relative group ${isOutOfStock ? 'opacity-60' : ''}`}
      >
        <div>
          <div
            onClick={handleProductNavigation}
            className="w-full aspect-square rounded-xl bg-surface-alt overflow-hidden mb-2.5 relative cursor-pointer"
          >
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              alt={productItem.productTitle}
              src={productItem.productImage}
              loading="lazy"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <span className="text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-neutral-200">
                  Agotado
                </span>
              </div>
            )}
          </div>

          <div>
            <h3
              onClick={handleProductNavigation}
              title={productItem.productTitle}
              className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-primary transition-colors leading-snug line-clamp-2 min-h-[2.2rem] sm:min-h-[2.5rem] cursor-pointer"
            >
              {productItem.productTitle}
            </h3>
          </div>
        </div>

        <div className="mt-auto pt-2.5 border-t border-neutral-100 flex flex-col gap-2">
          <div>
            <div className="text-base sm:text-lg font-black text-neutral-900 leading-tight">
              ${productItem.productPriceUsd.toFixed(2)}{' '}
              <span className="text-[10px] sm:text-xs font-normal text-neutral-400">
                / {productItem.productPriceUnit}
              </span>
            </div>

            {stockBadge && (
              <div className={`inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${stockBadge.className}`}>
                <span className="material-symbols-outlined text-[11px]">
                  {stockBadge.icon}
                </span>
                {stockBadge.text}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleToggleDetailsExpand}
            className="w-full py-1.5 px-2 text-[11px] font-semibold text-neutral-600 hover:text-primary hover:bg-neutral-50 rounded-lg flex items-center justify-center gap-1 transition-colors border border-dashed border-neutral-200 cursor-pointer"
          >
            <span>{isDetailsExpanded ? 'Ocultar detalles' : 'Ver detalles'}</span>
            <span className={`material-symbols-outlined text-[15px] transition-transform duration-200 ${isDetailsExpanded ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>

          {isDetailsExpanded && (
            <div className="pt-2 pb-1 border-t border-neutral-100 flex flex-col gap-2 text-left">
              <div className="flex flex-wrap items-center gap-1.5">
                {productItem.promotionalBadgeText && (
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${badgeBackgroundClass}`}>
                    {productItem.promotionalBadgeText}
                  </span>
                )}
                {productItem.productCategoryName && (
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    {productItem.productCategoryName}
                  </span>
                )}
              </div>

              {productItem.productDescription && (
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  {productItem.productDescription}
                </p>
              )}

              {isWeightBased && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50/70 p-1.5 rounded-md border border-emerald-100">
                  <span className="material-symbols-outlined text-[13px]">scale</span>
                  <span>Porciones: 250g • 500g • 1 Kg • Personalizado</span>
                </div>
              )}

              <div className="text-[11px] font-bold text-emerald-800">
                Ref. BCV: Bs. {priceBcvEquivalent}
              </div>

              {onSelectProduct && (
                <button
                  type="button"
                  onClick={handleProductNavigation}
                  className="text-[11px] font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer pt-0.5"
                >
                  <span>Ver ficha completa</span>
                  <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleAddToCartClick}
            disabled={isAddButtonDisabled}
            className={`w-full py-2.5 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs ${
              isAddButtonDisabled
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed shadow-none'
                : addedFeedbackActive
                  ? 'bg-emerald-600 text-white shadow-emerald-200 cursor-pointer active:scale-98'
                  : 'bg-primary hover:bg-primary-dark text-white cursor-pointer active:scale-98'
            }`}
            aria-label={`Agregar ${productItem.productTitle} al carrito`}
          >
            <span className="material-symbols-outlined text-base">
              {isAddButtonDisabled
                ? (isOutOfStock ? 'remove_shopping_cart' : 'block')
                : addedFeedbackActive ? 'check_circle' : (isWeightBased ? 'scale' : 'add_shopping_cart')}
            </span>
            <span>
              {isOutOfStock
                ? 'Sin stock'
                : isStockExhaustedInCart
                  ? 'Límite en carrito'
                  : addedFeedbackActive
                    ? '¡Agregado!'
                    : isWeightBased ? 'Elegir Peso y Agregar' : 'Agregar'}
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
