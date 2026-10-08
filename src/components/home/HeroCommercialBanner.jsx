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
    <section className="relative w-full min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] flex items-center overflow-hidden">
      <HeroOffersCarousel />

      <div className="absolute inset-0 bg-[#0a2f1b]/75 sm:bg-transparent z-15 pointer-events-none sm:hidden"></div>

      <div className="absolute left-0 top-0 bottom-0 w-full lg:w-[48rem] xl:w-[54rem] h-full z-20 bg-gradient-to-r from-[#0a2f1b]/95 via-[#0a2f1b]/75 to-transparent flex flex-col justify-center px-6 sm:px-10 lg:pl-16 xl:pl-20 lg:pr-12 py-12 lg:py-16">
        <div className="w-full max-w-xl xl:max-w-2xl flex flex-col items-start" data-aos="fade-right">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.12] tracking-tight mb-4 drop-shadow-md">
            Todo para tu Hogar en un Solo Lugar
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed mb-6 font-medium max-w-lg drop-shadow-xs">
            Charcutería fresca rebanada al gusto, quesos seleccionados y la despensa completa de tu casa con despacho directo a tu puerta con la mejor atención.
          </p>

          <h2 className="font-sans text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight mb-8">
            Sabor Criollo &amp; <span className="text-amber-300">Fresco a tu Mesa</span>
          </h2>

          <div className="w-full sm:w-auto">
            <button
              type="button"
              onClick={handleExploreClick}
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2.5 px-8 py-3.5 sm:py-4 bg-[#114B2B] hover:bg-[#0d3b22] text-white rounded-2xl font-black text-sm sm:text-base shadow-xl shadow-black/30 hover:shadow-2xl transition-all active:scale-95 text-center cursor-pointer border border-emerald-400/30"
            >
              <span className="material-symbols-outlined text-xl text-amber-300">shopping_bag</span>
              <span>Explorar Catálogo</span>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-16 sm:h-24 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/40 to-transparent z-30 pointer-events-none"></div>
    </section>
  );
};
