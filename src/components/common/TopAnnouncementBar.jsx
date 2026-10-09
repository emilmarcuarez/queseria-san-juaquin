import React, { useState, useEffect } from 'react';
import { getStoreCurrentScheduleStatus, STORE_OFFICIAL_DATA } from '../../services/storeScheduleService';
import { useShoppingCart } from '../../hooks/useShoppingCart';

export const TopAnnouncementBar = ({ onNavigateToPortal }) => {
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
          {onNavigateToPortal && (
            <button
              type="button"
              onClick={onNavigateToPortal}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-white border border-emerald-500/40 text-[10.5px] font-bold transition-all cursor-pointer active:scale-95"
              title="Abrir menú de Delivery y Enlaces"
            >
              <span className="material-symbols-outlined text-[13px]">moped</span>
              <span>Delivery</span>
            </button>
          )}

          <a
            href={STORE_OFFICIAL_DATA.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-[11px] group"
            title="Síguenos en Instagram @sanjoaquinqueseria"
          >
            <svg className="w-3.5 h-3.5 fill-current text-pink-400 group-hover:text-white transition-colors" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span className="font-semibold">{STORE_OFFICIAL_DATA.instagramHandle}</span>
          </a>

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

