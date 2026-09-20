import React, { useEffect } from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

export const CartToastNotification = () => {
  const {
    activeToastNotification,
    hideToastNotification,
    openCartDrawer
  } = useShoppingCart();

  useEffect(() => {
    if (!activeToastNotification.isVisible) {
      return;
    }

    const autoDismissTimer = setTimeout(() => {
      hideToastNotification();
    }, 3200);

    return () => {
      clearTimeout(autoDismissTimer);
    };
  }, [activeToastNotification.isVisible]);

  if (!activeToastNotification.isVisible) {
    return null;
  }

  const handleOpenCartFromToast = () => {
    hideToastNotification();
    openCartDrawer();
  };

  return (
    <div className="fixed top-20 sm:top-24 right-4 sm:right-6 z-50 max-w-sm w-[calc(100%-2rem)] sm:w-full animate-slideDownDrawer shadow-2xl">
      <div className="bg-white border-2 border-primary/30 rounded-xl p-3.5 shadow-xl flex items-center gap-3 backdrop-blur-md">
        <div className="w-12 h-12 rounded-lg bg-surface-alt border border-neutral-border overflow-hidden shrink-0">
          <img
            src={activeToastNotification.productImage}
            alt={activeToastNotification.productTitle}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 text-primary">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider">
              ¡Agregado al Carrito!
            </span>
          </div>

          <h4 className="text-xs font-bold text-neutral-dark truncate mt-0.5">
            {activeToastNotification.productTitle}
          </h4>

          {activeToastNotification.selectedCutOption && (
            <span className="text-[10px] font-semibold text-neutral-muted block">
              Corte: {activeToastNotification.selectedCutOption}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 shrink-0">
          <button
            onClick={handleOpenCartFromToast}
            className="px-2.5 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-md text-[11px] font-extrabold transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Ver Carrito
          </button>

          <button
            onClick={hideToastNotification}
            className="text-neutral-muted hover:text-neutral-dark text-center text-[10px] font-bold cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
