import React from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';
import { launchShoppingTour } from '../../services/shoppingTourService';

export const HowToBuyFloatingButton = () => {
  const { openCartDrawer } = useShoppingCart();

  const handleLaunchTour = () => {
    launchShoppingTour({ openCartDrawer });
  };

  return (
    <button
      type="button"
      id="tour-help-button"
      onClick={handleLaunchTour}
      aria-label="¿Cómo comprar? — Iniciar tutorial interactivo"
      className="fixed bottom-5 left-4 z-30 bg-white/95 hover:bg-emerald-50 text-[#114B2B] border border-neutral-200/90 shadow-md hover:shadow-lg rounded-full px-3.5 py-2 flex items-center gap-1.5 text-xs font-bold backdrop-blur-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
    >
      <span className="material-symbols-outlined text-base text-[#114B2B]">
        help
      </span>
      <span className="tracking-tight">¿Cómo comprar?</span>
    </button>
  );
};

