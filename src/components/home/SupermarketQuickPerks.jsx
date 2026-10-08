import React from 'react';

const quickPerksList = [
  {
    iconName: 'payments',
    titleText: 'USD y BCV al Día',
    subtitleText: 'Tasa oficial sin recargos ocultos'
  },
  {
    iconName: 'bolt',
    titleText: 'Despacho Express',
    subtitleText: 'Entrega directa el mismo día'
  },
  {
    iconName: 'verified',
    titleText: '100% Fresco y Pesaje',
    subtitleText: 'Balanza digital y cadena de frío'
  },
  {
    iconName: 'point_of_sale',
    titleText: 'Pagos Flexibles',
    subtitleText: 'Zelle, Pago Móvil, Punto y Efectivo'
  }
];

export const SupermarketQuickPerks = () => {
  return (
    <section className="hidden md:block relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 mb-8 sm:mb-12">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg shadow-neutral-900/5 border border-neutral-200/90 p-3.5 sm:p-6 backdrop-blur-md">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 divide-y-0">
          {quickPerksList.map((perkItem) => {
            return (
              <div
                key={perkItem.titleText}
                className="flex items-center gap-3 p-2 sm:p-2.5 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-50 text-[#EA580C] flex items-center justify-center shrink-0 border border-amber-200/60 shadow-2xs">
                  <span className="material-symbols-outlined text-xl sm:text-2xl">
                    {perkItem.iconName}
                  </span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-extrabold text-neutral-900 tracking-tight leading-tight">
                    {perkItem.titleText}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-neutral-500 leading-tight mt-0.5 truncate">
                    {perkItem.subtitleText}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
