import React, { useState, useEffect } from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';
import { getStoreCurrentScheduleStatus, STORE_OFFICIAL_DATA } from '../../services/storeScheduleService';

export const TopAnnouncementBar = () => {
  const { exchangeRateBcv, isLiveRateActive } = useShoppingCart();
  const [storeStatus, setStoreStatus] = useState(getStoreCurrentScheduleStatus());

  useEffect(() => {
    // Actualizar estado cada 60 segundos
    const intervalTimer = setInterval(() => {
      setStoreStatus(getStoreCurrentScheduleStatus());
    }, 60000);

    return () => clearInterval(intervalTimer);
  }, []);

  const formattedExchangeRate = exchangeRateBcv.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <div className="bg-[#0b331c] text-white border-b border-emerald-950/40 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Vista Móvil */}
        <div className="flex md:hidden flex-col items-center justify-center py-1.5 gap-1 text-[11px]">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Indicador Abierto / Cerrado */}
            <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-black ${storeStatus.badgeBgClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${storeStatus.dotPulseClass} ${storeStatus.isOpen ? 'animate-pulse' : ''}`} />
              <span>{storeStatus.statusBadgeText}</span>
            </div>

            {/* Tasa BCV */}
            <div className="flex items-center gap-1 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
              {isLiveRateActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
              <span className="text-white/80 text-[10px]">Tasa BCV:</span>
              <span className="text-white font-black text-[11px]">Bs. {formattedExchangeRate}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-white/70 text-[9.5px]">
            <span>{storeStatus.statusDetailText}</span>
          </div>
        </div>

        {/* Vista Desktop / Tablet */}
        <div className="hidden md:flex h-9 items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
            {/* Badge de Horario en Vivo */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-black ${storeStatus.badgeBgClass}`}>
              <span className={`w-2 h-2 rounded-full ${storeStatus.dotPulseClass} ${storeStatus.isOpen ? 'animate-pulse' : ''}`} />
              <span>{storeStatus.statusBadgeText}</span>
              <span className="font-normal opacity-90 hidden lg:inline">• {storeStatus.statusDetailText}</span>
            </div>

            <span className="text-white/80 truncate">
              📍 {STORE_OFFICIAL_DATA.shortAddress}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1 rounded-lg text-white border border-emerald-700/40">
              {isLiveRateActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
              <span className="text-white/80">Tasa Oficial BCV:</span>
              <span className="text-white font-extrabold tracking-wide">Bs. {formattedExchangeRate}</span>
            </div>

            <div className="flex items-center gap-1.5 text-white/80 text-[11px]">
              <span className="material-symbols-outlined text-sm text-emerald-400">schedule</span>
              <span>{STORE_OFFICIAL_DATA.scheduleSummary}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
