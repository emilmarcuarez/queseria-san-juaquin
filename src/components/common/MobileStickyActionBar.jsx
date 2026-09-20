import React from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

export const MobileStickyActionBar = () => {
  const { totalItemsCount, openCartDrawer, isCartBumpingActive } = useShoppingCart();

  return (
    <div className="fixed bottom-5 right-4 z-40 lg:hidden pointer-events-auto flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        <span
          className="absolute -inset-2.5 rounded-full bg-emerald-500/30 animate-radarGlow pointer-events-none"
        />

        <svg
          className="absolute -inset-2.5 w-[calc(100%+20px)] h-[calc(100%+20px)] pointer-events-none animate-spin"
          style={{ animationDuration: '3.2s' }}
          viewBox="0 0 72 72"
        >
          <circle
            cx="36"
            cy="36"
            r="32"
            fill="none"
            stroke="url(#dividedCartOrbitGradient)"
            strokeWidth="2.75"
            strokeDasharray="26 18 26 18"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="dividedCartOrbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>

        <button
          id="mobile-floating-cart-button"
          onClick={openCartDrawer}
          className={`relative w-[52px] h-[52px] rounded-full bg-gradient-to-tr from-[#0d3b22] via-[#114B2B] to-[#165a34] text-white flex items-center justify-center shadow-2xl shadow-emerald-950/60 border-2 border-white/90 transition-all duration-300 active:scale-90 cursor-pointer ${
            isCartBumpingActive
              ? 'scale-125 ring-4 ring-emerald-400 shadow-emerald-400/50'
              : 'scale-100'
          }`}
          aria-label="Abrir carrito de compras"
        >
          <span className="material-symbols-outlined text-2xl">shopping_cart</span>

          {totalItemsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[21px] h-[21px] px-1 bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-900 text-[10px] font-black rounded-full flex items-center justify-center shadow-md border-2 border-white animate-bounce">
              {totalItemsCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
