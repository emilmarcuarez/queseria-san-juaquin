import React, { useState } from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

export const ProductCardItem = ({ productItem, onSelectProduct }) => {
  const { addProductToCart, exchangeRateBcv } = useShoppingCart();

  const [addedFeedbackActive, setAddedFeedbackActive] = useState(false);

  const priceBcvEquivalent = (productItem.productPriceUsd * exchangeRateBcv).toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const handleAddToCartClick = (clickEvent) => {
    clickEvent.stopPropagation();
    addProductToCart(productItem, 1);
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

  const badgeBackgroundClass = productItem.promotionalBadgeStyle === 'bright'
    ? 'bg-accent-bright text-neutral-dark'
    : productItem.promotionalBadgeStyle === 'accent'
      ? 'bg-accent text-neutral-dark'
      : 'bg-primary text-white';

  return (
    <div
      data-aos="fade-up"
      onClick={handleCardClick}
      className="bg-white rounded-xl border border-neutral-border p-4 flex flex-col shadow-xs hover:shadow-md transition-all relative group cursor-pointer"
    >
      {productItem.promotionalBadgeText && (
        <div className={`absolute top-3 left-3 z-10 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded shadow-xs ${badgeBackgroundClass}`}>
          {productItem.promotionalBadgeText}
        </div>
      )}

      <div className="w-full aspect-[4/3] rounded-lg bg-surface-alt overflow-hidden mb-3 relative">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          alt={productItem.productTitle}
          src={productItem.productImage}
          loading="lazy"
        />
      </div>

      <div className="flex flex-col flex-1">
        <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
          {productItem.productCategoryName}
        </span>

        <h3 className="text-base font-bold text-neutral-dark group-hover:text-primary transition-colors mt-0.5 leading-snug">
          {productItem.productTitle}
        </h3>

        <p className="text-xs text-neutral-muted mt-1 mb-3 line-clamp-2 leading-relaxed">
          {productItem.productDescription}
        </p>

        <div className="mt-auto pt-3 border-t border-neutral-border/70 flex items-center justify-between gap-2">
          <div>
            <div className="text-xl font-black text-neutral-dark leading-none">
              ${productItem.productPriceUsd.toFixed(2)}{' '}
              <span className="text-xs font-normal text-neutral-muted">/ {productItem.productPriceUnit}</span>
            </div>
            <div className="text-xs font-bold text-emerald-800 mt-0.5">
              Ref. BCV: Bs. {priceBcvEquivalent}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCartClick}
            className={`px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95 ${
              addedFeedbackActive
                ? 'bg-accent-bright text-neutral-dark'
                : 'bg-primary hover:bg-primary-dark text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {addedFeedbackActive ? 'check_circle' : 'add_shopping_cart'}
            </span>
            <span>{addedFeedbackActive ? '¡Listo!' : 'Agregar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
