import React, { useState, useEffect } from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

export const FloatingCartQuickButton = () => {
  const {
    totalItemsCount = 0,
    openCartDrawer,
    totalCartAmountUsd = 0,
    totalCartAmountBcv = 0,
    preferredCurrency = 'USD'
  } = useShoppingCart();

  const [hasRecentItemAdded, setHasRecentItemAdded] = useState(false);

  useEffect(() => {
    if (totalItemsCount > 0) {
      setHasRecentItemAdded(true);
      const timerIdentifier = setTimeout(() => {
        setHasRecentItemAdded(false);
      }, 700);
      return () => clearTimeout(timerIdentifier);
    }
  }, [totalItemsCount]);

  const safeAmountBcv = typeof totalCartAmountBcv === 'number' ? totalCartAmountBcv : 0;
  const safeAmountUsd = typeof totalCartAmountUsd === 'number' ? totalCartAmountUsd : 0;

  const formattedDisplayedPrice = preferredCurrency === 'BS'
    ? `Bs. ${safeAmountBcv.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `$${safeAmountUsd.toFixed(2)}`;

  return (
    <div className="fixed bottom-[72px] lg:bottom-7 right-4 lg:right-7 z-40 flex items-center">
      <button
        id="mobile-floating-cart-button"
        type="button"
        onClick={openCartDrawer}
        aria-label={`Ver carrito de compras con ${totalItemsCount} productos por ${formattedDisplayedPrice}`}
        className={`group relative w-[54px] h-[54px] sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#EA580C] via-[#F97316] to-[#F59E0B] hover:from-[#C2410C] hover:to-[#EA580C] text-white shadow-xl hover:shadow-2xl shadow-orange-950/30 border-2 border-white/90 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 ${
          hasRecentItemAdded ? 'scale-115 ring-4 ring-amber-400/60' : ''
        }`}
      >
        <span className="material-symbols-outlined text-2xl sm:text-[26px] transition-transform group-hover:scale-105">
          shopping_cart
        </span>

        {totalItemsCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1.5 rounded-full bg-[#0B3C1D] text-white font-black text-[11px] flex items-center justify-center border-2 border-white shadow-md animate-scaleIn leading-none">
            {totalItemsCount}
          </span>
        )}

        <span className="sr-only">Abrir carrito de compras</span>
      </button>

      {totalItemsCount > 0 && (
        <div className="hidden lg:group-hover:flex absolute right-16 bg-neutral-900/90 text-white text-xs font-bold py-1.5 px-3 rounded-xl whitespace-nowrap shadow-lg backdrop-blur-xs pointer-events-none transition-opacity">
          <span>{totalItemsCount} {totalItemsCount === 1 ? 'producto' : 'productos'} • {formattedDisplayedPrice}</span>
        </div>
      )}
    </div>
  );
};
