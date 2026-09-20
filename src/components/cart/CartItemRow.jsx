import React from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

export const CartItemRow = ({ cartItemEntry }) => {
  const { updateItemQuantity, removeProductFromCart, exchangeRateBcv } = useShoppingCart();

  const itemSubtotalUsd = (cartItemEntry.productPriceUsd * cartItemEntry.selectedQuantity).toFixed(2);
  const itemSubtotalBcv = (cartItemEntry.productPriceUsd * cartItemEntry.selectedQuantity * exchangeRateBcv).toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const handleDecreaseQuantity = () => {
    updateItemQuantity(
      cartItemEntry.productIdentifier,
      cartItemEntry.selectedCutOption,
      cartItemEntry.selectedQuantity - 1
    );
  };

  const handleIncreaseQuantity = () => {
    updateItemQuantity(
      cartItemEntry.productIdentifier,
      cartItemEntry.selectedCutOption,
      cartItemEntry.selectedQuantity + 1
    );
  };

  const handleRemoveItem = () => {
    removeProductFromCart(cartItemEntry.productIdentifier, cartItemEntry.selectedCutOption);
  };

  return (
    <div className="flex items-center gap-3 py-3 border-b border-neutral-border last:border-b-0">
      <img
        src={cartItemEntry.productImage}
        alt={cartItemEntry.productTitle}
        className="w-14 h-14 object-cover rounded-lg bg-surface-alt shrink-0 border border-neutral-border"
      />

      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-neutral-dark truncate leading-tight">
          {cartItemEntry.productTitle}
        </h4>

        {cartItemEntry.selectedCutOption && (
          <span className="inline-block text-[10px] font-semibold text-primary bg-primary-subtle px-1.5 py-0.5 rounded mt-0.5">
            {cartItemEntry.selectedCutOption}
          </span>
        )}

        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs font-black text-neutral-dark">
            ${itemSubtotalUsd}
          </span>
          <span className="text-[10px] font-semibold text-neutral-muted">
            Bs. {itemSubtotalBcv}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex items-center border border-neutral-border rounded-lg bg-surface-alt overflow-hidden">
          <button
            onClick={handleDecreaseQuantity}
            className="w-7 h-7 flex items-center justify-center text-neutral-dark hover:bg-neutral-border/50 text-sm font-bold cursor-pointer"
            aria-label="Disminuir cantidad"
          >
            -
          </button>
          <span className="w-7 text-center text-xs font-bold text-neutral-dark">
            {cartItemEntry.selectedQuantity}
          </span>
          <button
            onClick={handleIncreaseQuantity}
            className="w-7 h-7 flex items-center justify-center text-neutral-dark hover:bg-neutral-border/50 text-sm font-bold cursor-pointer"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        <button
          onClick={handleRemoveItem}
          className="text-neutral-muted hover:text-red-600 p-1 transition-colors cursor-pointer"
          aria-label="Eliminar producto"
        >
          <span className="material-symbols-outlined text-base">delete</span>
        </button>
      </div>
    </div>
  );
};
