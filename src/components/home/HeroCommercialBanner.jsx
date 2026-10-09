import React from 'react';
import { HeroOffersCarousel } from './HeroOffersCarousel';

export const HeroCommercialBanner = ({ onExploreCatalog }) => {
  const handleExploreClick = (clickEvent) => {
    if (onExploreCatalog) {
      clickEvent.preventDefault();
      onExploreCatalog();
    }
  };

  return (
    <section className="w-full bg-white pt-3 sm:pt-6 pb-3 sm:pb-6">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <div className="flex flex-col items-start pb-4 sm:pb-6" data-aos="fade-up">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
            Todo en un solo lugar
            <span className="text-[#3B7011] block mt-0.5 sm:mt-1 font-black">Frescura y Calidad a tu Mesa</span>
          </h1>

          <button
            type="button"
            onClick={handleExploreClick}
            className="inline-flex items-center justify-center mt-3 sm:mt-4 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#8DC63F] hover:bg-[#78AD2F] text-[#062612] font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95 border border-[#78AD2F]/40"
          >
            COMIENZA A COMPRAR
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 mt-4 w-full max-w-2xl">
            <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl border border-neutral-100 bg-white shadow-2xs hover:shadow-xs hover:border-[#8DC63F]/50 transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#F2F9E6] text-[#4C821D] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">workspace_premium</span>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
                  Calidad y Frescura Total
                </h4>
                <p className="text-[11px] sm:text-xs text-neutral-500 font-medium leading-tight mt-0.5">
                  Auténticos quesos tradicionales y víveres selectos a tu mesa.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl border border-neutral-100 bg-white shadow-2xs hover:shadow-xs hover:border-[#F59E0B]/50 transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">moped</span>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
                  Delivery Rápido y Seguro
                </h4>
                <p className="text-[11px] sm:text-xs text-neutral-500 font-medium leading-tight mt-0.5">
                  Despacho puntual y confiable directo a tu puerta en Maracaibo.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-1 sm:mt-2" data-aos="fade-up">
          <HeroOffersCarousel />
        </div>
      </div>
    </section>
  );
};
