import React from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

export const TopAnnouncementBar = () => {
  const { exchangeRateBcv, isLiveRateActive } = useShoppingCart();
  const storeScheduleText = import.meta.env.VITE_STORE_SCHEDULE || 'Lun-Dom 8:00 AM - 8:00 PM';

  const formattedExchangeRate = exchangeRateBcv.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <div className="bg-[#0f4426] text-white border-b border-emerald-950/40 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex md:hidden flex-col items-center justify-center py-1.5 gap-1 text-[11px]">
          <div className="flex items-center gap-1.5 bg-emerald-950/70 px-3 py-0.5 rounded-full border border-emerald-700/50">
            {isLiveRateActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
            <span className="text-white/80">Tasa Oficial BCV:</span>
            <span className="text-white font-black tracking-wide">Bs. {formattedExchangeRate}</span>
          </div>

          <div className="flex items-center gap-1.5 text-white/80 text-[10px]">
            <span className="material-symbols-outlined text-xs text-emerald-400">schedule</span>
            <span>{storeScheduleText}</span>
          </div>
        </div>

        <div className="hidden md:flex h-9 items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-white/90 truncate">
              Entregas express en Maracaibo • Calidad fresca garantizada
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1 rounded-lg text-white border border-emerald-700/40">
              {isLiveRateActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
              <span className="text-white/80">Tasa Oficial BCV:</span>
              <span className="text-white font-extrabold tracking-wide">Bs. {formattedExchangeRate}</span>
            </div>

            <div className="flex items-center gap-1.5 text-white/80">
              <span className="material-symbols-outlined text-sm text-emerald-400">schedule</span>
              <span>{storeScheduleText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
