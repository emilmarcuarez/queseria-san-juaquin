import React from 'react';

const quickPerksList = [
  {
    iconName: 'payments',
    titleText: 'USD y BCV',
    subtitleText: 'Aceptamos tasa oficial del día'
  },
  {
    iconName: 'bolt',
    titleText: 'Mismo Día',
    subtitleText: 'Despacho express en Maracaibo'
  },
  {
    iconName: 'verified',
    titleText: '100% Fresco',
    subtitleText: 'Pesaje exacto y cadena fría'
  },
  {
    iconName: 'point_of_sale',
    titleText: 'Pagos Fáciles',
    subtitleText: 'Zelle, Pago Móvil y Punto'
  }
];

export const SupermarketQuickPerks = () => {
  return (
    <section className="hidden md:block relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 mb-8 sm:mb-12">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-neutral-900/5 border border-neutral-200/80 p-4 sm:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100">
          {quickPerksList.map((perkItem) => {
            return (
              <div
                key={perkItem.titleText}
                className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:px-4 first:pt-0 first:px-0"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 shadow-xs">
                  <span className="material-symbols-outlined text-2xl">
                    {perkItem.iconName}
                  </span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-extrabold text-neutral-dark tracking-tight leading-tight">
                    {perkItem.titleText}
                  </h4>
                  <p className="text-xs text-neutral-muted leading-tight mt-0.5 truncate">
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
