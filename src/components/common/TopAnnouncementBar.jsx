import React, { useState, useEffect } from 'react';
import { getStoreCurrentScheduleStatus, STORE_OFFICIAL_DATA } from '../../services/storeScheduleService';

export const TopAnnouncementBar = () => {
  const [storeStatus, setStoreStatus] = useState(getStoreCurrentScheduleStatus());

  useEffect(() => {
    const intervalTimer = setInterval(() => {
      setStoreStatus(getStoreCurrentScheduleStatus());
    }, 60000);

    return () => clearInterval(intervalTimer);
  }, []);

  return (
    <div className="relative z-50">
      <div className="bg-[#181308] border-b border-amber-500/20 text-amber-300 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2.5 text-center text-[10.5px] sm:text-xs">
          <span className="font-bold text-amber-400">{storeStatus.statusBadgeText}</span>
          <span className="hidden sm:inline text-amber-500/40 font-light">|</span>
          <span className="text-amber-200/90 font-medium">{storeStatus.statusDetailText}</span>
        </div>
      </div>

      <div className="bg-[#0b331c] text-white border-b border-emerald-950/50 py-1.5 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-center md:justify-between gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-white/80 hover:text-white transition-colors truncate">
            <span className="material-symbols-outlined text-[15px] text-emerald-400 shrink-0">location_on</span>
            <span className="truncate">{STORE_OFFICIAL_DATA.shortAddress}</span>
          </div>

          <a
            href={`https://wa.me/${STORE_OFFICIAL_DATA.phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-white/90 hover:text-emerald-300 transition-colors text-[11px] shrink-0 font-semibold"
          >
            <span className="material-symbols-outlined text-[15px] text-emerald-400">chat</span>
            <span>Atención: {STORE_OFFICIAL_DATA.formattedPhone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
