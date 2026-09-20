import React, { useEffect } from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

export const CartToastNotification = () => {
  const {
    activeToastNotification,
    hideToastNotification,
    openCartDrawer,
    undoLastCartAddition
  } = useShoppingCart();

  useEffect(() => {
    if (!activeToastNotification.isVisible) {
      return;
    }

    const autoDismissTimer = setTimeout(() => {
      hideToastNotification();
    }, 4500);

    return () => {
      clearTimeout(autoDismissTimer);
    };
  }, [activeToastNotification.isVisible, activeToastNotification.toastTimestampKey]);

  if (!activeToastNotification.isVisible) {
    return null;
  }

  const handleOpenCartFromToast = () => {
    hideToastNotification();
    openCartDrawer();
  };

  const handleUndoCartAddition = () => {
    undoLastCartAddition();
  };

  return (
    <div
      key={activeToastNotification.toastTimestampKey || 'cart_toast'}
      className="fixed top-20 sm:top-24 right-4 sm:right-6 z-50 max-w-sm w-[calc(100%-2rem)] sm:w-full animate-slideDownDrawer shadow-2xl"
    >
      <div className="bg-white border-2 border-emerald-500/30 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
        <div className="p-3.5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-surface-alt border border-neutral-border overflow-hidden shrink-0 shadow-xs">
            <img
              src={activeToastNotification.productImage}
              alt={activeToastNotification.productTitle}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-emerald-700">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider">
                ¡Agregado al Carrito!
              </span>
            </div>

            <h4 className="text-xs font-bold text-neutral-900 truncate mt-0.5">
              {activeToastNotification.productTitle}
            </h4>

            <div className="flex items-center gap-2 mt-1.5">
              <button
                type="button"
                onClick={handleUndoCartAddition}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md transition-colors cursor-pointer active:scale-95"
                title="Deshacer y devolver producto agregado por accidente"
              >
                <span className="material-symbols-outlined text-xs">undo</span>
                <span>Devolver</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenCartFromToast}
              className="px-3 py-1.5 bg-[#114B2B] hover:bg-[#0d3b22] text-white rounded-lg text-[11px] font-extrabold transition-all cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
            >
              Ver Carrito
            </button>

            <button
              type="button"
              onClick={hideToastNotification}
              className="text-neutral-400 hover:text-neutral-600 text-center text-[10px] font-bold cursor-pointer transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>

        <div className="h-1 bg-neutral-100 w-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-[#114B2B] animate-toastProgressBar" />
        </div>
      </div>
    </div>
  );
};
