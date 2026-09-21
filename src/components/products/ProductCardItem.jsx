import React, { useState } from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';
import { WeightSelectionModal } from './WeightSelectionModal';

export const ProductCardItem = ({ productItem, onSelectProduct }) => {
  const { addProductToCart, exchangeRateBcv, cartItemList } = useShoppingCart();

  const [addedFeedbackActive, setAddedFeedbackActive] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [cardOriginCoordinates, setCardOriginCoordinates] = useState(null);

  const priceBcvEquivalent = (productItem.productPriceUsd * exchangeRateBcv).toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const isWeightBased = productItem.productPriceUnit === 'kg';

  const totalStock = productItem.availableStockQuantity ?? Infinity;
  const isOutOfStock = totalStock === 0;

  const quantityCurrentlyInCart = cartItemList
    .filter((cartEntry) => cartEntry.productIdentifier === productItem.productIdentifier)
    .reduce((totalQty, cartEntry) => totalQty + cartEntry.selectedQuantity, 0);

  const remainingStockAfterCart = totalStock === Infinity ? Infinity : totalStock - quantityCurrentlyInCart;
  const isStockExhaustedInCart = remainingStockAfterCart <= 0 && totalStock !== Infinity;

  const stockIsLow = totalStock !== Infinity && totalStock > 0 && totalStock <= 5;

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

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(productItem);
    }
  };

  const handleToggleDescriptionExpand = (clickEvent) => {
    clickEvent.stopPropagation();
    setIsDescriptionExpanded((previousState) => !previousState);
  };

  const badgeBackgroundClass = productItem.promotionalBadgeStyle === 'bright'
    ? 'bg-accent-bright text-neutral-dark'
    : productItem.promotionalBadgeStyle === 'accent'
      ? 'bg-accent text-neutral-dark'
      : 'bg-primary text-white';

  const isDescriptionLong = productItem.productDescription && productItem.productDescription.length > 50;

  const isAddButtonDisabled = isOutOfStock || isStockExhaustedInCart;

  const stockBadgeContent = () => {
    if (isOutOfStock) {
      return { text: 'Agotado', className: 'bg-neutral-100 text-neutral-500 border border-neutral-200' };
    }
    if (isStockExhaustedInCart) {
      return { text: 'Límite alcanzado', className: 'bg-amber-50 text-amber-700 border border-amber-200' };
    }
    if (stockIsLow) {
      return { text: `Solo ${totalStock} disponibles`, className: 'bg-red-50 text-red-600 border border-red-200' };
    }
    return { text: `${totalStock} en stock`, className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' };
  };

  const stockBadge = totalStock !== Infinity ? stockBadgeContent() : null;

  return (
    <>
      <div
        data-product-card="true"
        data-aos="fade-up"
        onClick={handleCardClick}
        className={`h-full bg-white rounded-2xl border border-neutral-200/90 p-3 sm:p-4 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all relative group cursor-pointer ${isOutOfStock ? 'opacity-60' : ''}`}
      >
        <div>
          {productItem.promotionalBadgeText && (
            <div className={`absolute top-2.5 left-2.5 z-10 text-[9px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-xs ${badgeBackgroundClass}`}>
              {productItem.promotionalBadgeText}
            </div>
          )}

          <div className="w-full aspect-square rounded-xl bg-surface-alt overflow-hidden mb-2.5 relative">
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
            <span className="text-[10px] sm:text-[11px] font-bold text-primary uppercase tracking-wider block mb-0.5 truncate">
              {productItem.productCategoryName}
            </span>

            <h3
              title={productItem.productTitle}
              className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-primary transition-colors leading-snug line-clamp-2 min-h-[2.2rem] sm:min-h-[2.5rem]"
            >
              {productItem.productTitle}
            </h3>

            <div className="text-[10px] sm:text-[11px] text-neutral-500 leading-relaxed mt-1 mb-2">
              {isDescriptionLong ? (
                <span>
                  {isDescriptionExpanded
                    ? productItem.productDescription
                    : `${productItem.productDescription.slice(0, 48)}...`}
                  <button
                    type="button"
                    onClick={handleToggleDescriptionExpand}
                    className="text-[10px] font-bold text-[#114B2B] hover:underline ml-1 cursor-pointer inline-block"
                  >
                    {isDescriptionExpanded ? 'ver menos' : 'ver más'}
                  </button>
                </span>
              ) : (
                <span>{productItem.productDescription}</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-2.5 border-t border-neutral-100 flex flex-col gap-2">
          <div>
            {isWeightBased && (
              <div className="mb-1 flex items-center gap-1 text-[10px] font-extrabold text-emerald-800">
                <span className="material-symbols-outlined text-[12px]">scale</span>
                <span>Porciones: 250g • 500g • 1 Kg • Personalizado</span>
              </div>
            )}
            <div className="text-base sm:text-lg font-black text-neutral-900 leading-tight">
              ${productItem.productPriceUsd.toFixed(2)}{' '}
              <span className="text-[10px] sm:text-xs font-normal text-neutral-400">
                / {productItem.productPriceUnit}
              </span>
            </div>
            <div className="text-[11px] sm:text-xs font-bold text-emerald-800 mt-0.5">
              Ref. BCV: Bs. {priceBcvEquivalent}
            </div>

            {stockBadge && (
              <div className={`inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${stockBadge.className}`}>
                <span className="material-symbols-outlined text-[11px]">
                  {isOutOfStock ? 'remove_shopping_cart' : isStockExhaustedInCart ? 'block' : 'inventory_2'}
                </span>
                {stockBadge.text}
              </div>
            )}
          </div>

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
