import React, { useState, useEffect } from 'react';
import { getStoreCurrentScheduleStatus, STORE_OFFICIAL_DATA } from '../../services/storeScheduleService';
import { useShoppingCart } from '../../hooks/useShoppingCart';

export const TopAnnouncementBar = () => {
  const { exchangeRateBcv, preferredCurrency, togglePreferredCurrency } = useShoppingCart();
  const [storeStatus, setStoreStatus] = useState(getStoreCurrentScheduleStatus());

  useEffect(() => {
    const intervalTimer = setInterval(() => {
      setStoreStatus(getStoreCurrentScheduleStatus());
    }, 60000);

    return () => clearInterval(intervalTimer);
  }, []);

  const formattedExchangeRate = typeof exchangeRateBcv === 'number'
    ? exchangeRateBcv.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '66,56';

  return (
    <div className="bg-[#062413] text-white border-b border-[#04190d] py-1.5 px-3 sm:px-6 text-[11px] sm:text-xs font-medium relative z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 truncate">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              storeStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className="font-bold text-emerald-200 text-[10.5px] sm:text-xs shrink-0">
            {storeStatus.isOpen ? 'Abierto hoy hasta 7:00 PM' : storeStatus.statusBadgeText}
          </span>
          <span className="text-white/40 shrink-0">•</span>
          <span className="text-amber-300 font-bold text-[10.5px] sm:text-xs truncate">
            Tasa BCV: Bs. {formattedExchangeRate}
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 text-white/80 hover:text-white transition-colors truncate text-[11px]">
            <span className="material-symbols-outlined text-[14px] text-emerald-400 shrink-0">
              location_on
            </span>
            <span className="truncate">{STORE_OFFICIAL_DATA.shortAddress}</span>
          </div>

          <div className="inline-flex items-center bg-[#03150b] border border-emerald-900/90 rounded-full p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => togglePreferredCurrency('BS')}
              className={`px-2 py-0.5 rounded-full text-[11px] transition-all cursor-pointer ${
                preferredCurrency === 'BS'
                  ? 'bg-[#8DC63F] text-[#062612] font-black shadow-xs'
                  : 'text-white/60 hover:text-white font-semibold'
              }`}
              title="Mostrar precios en Bolívares oficiales"
              aria-label="Seleccionar moneda Bolívares"
            >
              Bs
            </button>
            <button
              type="button"
              onClick={() => togglePreferredCurrency('USD')}
              className={`px-2 py-0.5 rounded-full text-[11px] transition-all cursor-pointer ${
                preferredCurrency === 'USD'
                  ? 'bg-[#8DC63F] text-[#062612] font-black shadow-xs'
                  : 'text-white/60 hover:text-white font-semibold'
              }`}
              title="Mostrar precios en Dólares"
              aria-label="Seleccionar moneda Dólares"
            >
              $
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

