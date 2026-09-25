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
    <div className="bg-[#0b331c] text-white border-b border-emerald-950/40 py-1 px-3 sm:px-6 text-[11px] sm:text-xs font-medium relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 truncate mx-auto md:mx-0">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              storeStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className="font-bold text-amber-300 text-[10.5px] sm:text-xs shrink-0">
            {storeStatus.statusBadgeText}
          </span>
          <span className="text-emerald-500/60 hidden sm:inline">•</span>
          <span className="text-white/85 text-[10px] sm:text-xs truncate">
            {storeStatus.statusDetailText}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors truncate">
            <span className="material-symbols-outlined text-[14px] text-emerald-400 shrink-0">
              location_on
            </span>
            <span className="truncate">{STORE_OFFICIAL_DATA.shortAddress}</span>
          </div>

          <a
            href={`https://wa.me/${STORE_OFFICIAL_DATA.phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-white/90 hover:text-emerald-300 transition-colors text-[11px] font-semibold"
          >
            <span className="material-symbols-outlined text-[14px] text-emerald-400">
              chat
            </span>
            <span>{STORE_OFFICIAL_DATA.formattedPhone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

