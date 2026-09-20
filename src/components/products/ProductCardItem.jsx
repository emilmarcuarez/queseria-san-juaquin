import React, { useState } from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

export const ProductCardItem = ({ productItem, onSelectProduct }) => {
  const { addProductToCart, exchangeRateBcv } = useShoppingCart();

  const [addedFeedbackActive, setAddedFeedbackActive] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const priceBcvEquivalent = (productItem.productPriceUsd * exchangeRateBcv).toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const handleAddToCartClick = (clickEvent) => {
    clickEvent.stopPropagation();
    const buttonBoundingRect = clickEvent.currentTarget.getBoundingClientRect();
    const originCoordinates = {
      coordinateX: buttonBoundingRect.left + buttonBoundingRect.width / 2,
      coordinateY: buttonBoundingRect.top + buttonBoundingRect.height / 2
    };
    addProductToCart(productItem, 1, 1, originCoordinates);
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

  return (
    <div
      data-product-card="true"
      data-aos="fade-up"
      onClick={handleCardClick}
      className="h-full bg-white rounded-2xl border border-neutral-200/90 p-3 sm:p-4 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all relative group cursor-pointer"
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
          <div className="text-base sm:text-lg font-black text-neutral-900 leading-tight">
            ${productItem.productPriceUsd.toFixed(2)}{' '}
            <span className="text-[10px] sm:text-xs font-normal text-neutral-400">
              / {productItem.productPriceUnit}
            </span>
          </div>
          <div className="text-[11px] sm:text-xs font-bold text-emerald-800 mt-0.5">
            Ref. BCV: Bs. {priceBcvEquivalent}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCartClick}
          className={`w-full py-2.5 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98 ${
            addedFeedbackActive
              ? 'bg-emerald-600 text-white shadow-emerald-200'
              : 'bg-primary hover:bg-primary-dark text-white'
          }`}
          aria-label={`Agregar ${productItem.productTitle} al carrito`}
        >
          <span className="material-symbols-outlined text-base">
            {addedFeedbackActive ? 'check_circle' : 'add_shopping_cart'}
          </span>
          <span>{addedFeedbackActive ? '¡Agregado!' : 'Agregar'}</span>
        </button>
      </div>
    </div>
  );
};
