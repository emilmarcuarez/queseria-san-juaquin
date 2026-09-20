import React from 'react';
import { HeroOffersCarousel } from './HeroOffersCarousel';
import { useShoppingCart } from '../../hooks/useShoppingCart';

export const HeroCommercialBanner = ({ onExploreCatalog }) => {
  const { openCartDrawer } = useShoppingCart();

  const handleExploreClick = (clickEvent) => {
    if (onExploreCatalog) {
      clickEvent.preventDefault();
      onExploreCatalog();
    }
  };

  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] flex items-center overflow-hidden">
      <HeroOffersCarousel />

      <div className="absolute inset-0 bg-black/65 sm:bg-transparent z-15 pointer-events-none sm:hidden"></div>

      <div className="absolute left-0 top-0 bottom-0 w-full lg:w-[48rem] xl:w-[54rem] h-full z-20 bg-gradient-to-r from-black/90 via-black/75 to-transparent flex flex-col justify-center px-6 sm:px-10 lg:pl-16 xl:pl-20 lg:pr-12 py-12 lg:py-16">
        <div className="w-full max-w-xl xl:max-w-2xl flex flex-col items-start" data-aos="fade-right">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.12] tracking-tight mb-4 drop-shadow-md">
            Todo para tu Hogar en un Solo Lugar
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed mb-8 font-medium max-w-lg drop-shadow-xs">
            Charcutería fresca rebanada al gusto, quesos seleccionados y la despensa completa de tu casa con despacho directo a tu puerta con la mejor atención.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleExploreClick}
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#114B2B] hover:bg-[#0d3b22] text-white rounded-xl font-extrabold text-xs sm:text-sm shadow-xl transition-all active:scale-95 text-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg sm:text-xl">shopping_basket</span>
              <span>Explorar Tienda</span>
            </button>

            <button
              onClick={openCartDrawer}
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-xl active:scale-95 cursor-pointer text-center"
            >
              <span className="material-symbols-outlined text-lg sm:text-xl">shopping_cart</span>
              <span>Armar Mi Carrito</span>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-16 sm:h-24 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/40 to-transparent z-30 pointer-events-none"></div>
    </section>
  );
};
