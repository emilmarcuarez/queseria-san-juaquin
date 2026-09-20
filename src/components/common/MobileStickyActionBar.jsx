import React from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

export const MobileStickyActionBar = () => {
  const { totalItemsCount, openCartDrawer } = useShoppingCart();

  return (
    <div className="fixed bottom-5 right-4 z-40 lg:hidden pointer-events-auto">
      <button
        onClick={openCartDrawer}
        className="relative w-12 h-12 rounded-full bg-[#114B2B] hover:bg-[#0d3b22] text-white flex items-center justify-center shadow-2xl shadow-black/40 border-2 border-white transition-all active:scale-90 cursor-pointer"
        aria-label="Abrir carrito de compras"
      >
        <span className="material-symbols-outlined text-2xl">shopping_cart</span>
        {totalItemsCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[19px] h-4.5 px-1 bg-white text-[#114B2B] text-[10px] font-black rounded-full flex items-center justify-center shadow-md border border-neutral-100 animate-bounce">
            {totalItemsCount}
          </span>
        )}
      </button>
    </div>
  );
};
