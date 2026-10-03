import React from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

export const PromotionalAisleBanner = ({ onShowAllProducts }) => {
  const { openCartDrawer } = useShoppingCart();

  return (
    <section className="py-8 sm:py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div
          data-aos="fade-up"
          className="bg-gradient-to-r from-[#0d3b22] via-[#114B2B] to-[#1a6e3e] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl text-center md:text-left">
              <span className="bg-[#FFB703] text-neutral-900 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-block mb-3 shadow-xs">
                Despensa y Charcutería
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Haz tu mercado completo y recíbelo hoy mismo
              </h3>
              <p className="text-white/85 text-sm sm:text-base mt-2 font-medium leading-relaxed">
                Combina tus quesos criollos favoritos, charcutería rebanada al gusto y los víveres de la semana con precios justos y despacho express.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <button
                type="button"
                onClick={openCartDrawer}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#FFB703] hover:bg-[#ffa900] text-neutral-900 font-black text-xs sm:text-sm text-center shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">receipt_long</span>
                <span>Enviar Lista al WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={onShowAllProducts}
                className="w-full sm:w-auto px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm text-center border border-white/25 transition-all cursor-pointer active:scale-95"
              >
                Ver Todo el Catálogo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
