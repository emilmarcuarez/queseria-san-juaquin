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
      aria-label="¿Cómo comprar? — Iniciar tutorial"
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#114B2B] hover:bg-[#0d3b22] text-white rounded-l-xl shadow-lg cursor-pointer transition-colors duration-200 flex items-center justify-center px-2.5 py-4"
      style={{ writingMode: 'vertical-rl' }}
    >
      <span className="flex items-center gap-1.5" style={{ transform: 'rotate(180deg)' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>help</span>
        <span className="text-[10px] font-black uppercase tracking-[0.18em] whitespace-nowrap">Cómo comprar</span>
      </span>
    </button>
  );
};
