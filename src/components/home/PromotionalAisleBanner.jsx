import React from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

export const PromotionalAisleBanner = ({ onShowAllProducts }) => {
  const { openCartDrawer } = useShoppingCart();

  return (
    <section className="py-10 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div
          data-aos="fade-up"
          className="bg-gradient-to-r from-primary-dark via-primary to-[#186b3c] rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-accent-bright/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl text-center md:text-left">
              <span className="bg-accent-bright text-neutral-dark px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-block mb-3 shadow-sm">
                Despensa de Ahorro
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Haz tu mercado completo y recíbelo hoy mismo
              </h3>
              <p className="text-white/85 text-sm sm:text-base mt-2 font-medium leading-relaxed">
                Combina tus quesos favoritos, charcutería rebanada a tu gusto y los víveres de la semana con precios mayoristas en pedidos familiares.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={openCartDrawer}
                className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-accent-bright hover:bg-accent text-neutral-dark font-extrabold text-sm text-center shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-base">receipt_long</span>
                <span>Enviar Lista al WhatsApp</span>
              </button>

              <button
                onClick={onShowAllProducts}
                className="w-full sm:w-auto px-5 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-sm text-center border border-white/20 transition-colors cursor-pointer"
              >
                Ver Todos los Productos
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
