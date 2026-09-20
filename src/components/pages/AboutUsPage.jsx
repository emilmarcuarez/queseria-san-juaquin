import React, { useEffect } from 'react';

export const AboutUsPage = ({ onNavigateToStore }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="w-full bg-[#fafafa] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4" data-aos="fade-up">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-extrabold tracking-wider uppercase">
            Nuestra Esencia
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-dark tracking-tight">
            Tradición, Frescura y la Mejor Charcutería de la Región
          </h1>
          <p className="text-sm sm:text-base text-neutral-muted leading-relaxed font-medium">
            En <strong className="text-primary">Quesería San Joaquín</strong> combinamos el sabor autóctono del queso venezolano con una rigurosa selección de embutidos, lácteos y víveres de primera línea para abastecer a las familias con total confianza.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="100">
          <div className="bg-white p-7 rounded-2xl border border-neutral-border shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-2xl">workspace_premium</span>
            </div>
            <h3 className="text-lg font-bold text-neutral-dark">Autenticidad &amp; Sabor Zuliano</h3>
            <p className="text-xs sm:text-sm text-neutral-muted leading-relaxed">
              Trabajamos de la mano con productores llaneros y centrales lecheras certificadas para ofrecer queso semiduro, telita, palmito y de mano en su punto óptimo de maduración y salinidad.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-neutral-border shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-accent text-neutral-dark flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-2xl">scale</span>
            </div>
            <h3 className="text-lg font-bold text-neutral-dark">Pesaje Digital Exacto</h3>
            <p className="text-xs sm:text-sm text-neutral-muted leading-relaxed">
              Respetamos rigurosamente tu presupuesto. Nuestras balanzas de alta precisión garantizan que pagues al gramo justo el peso real de tu corte, evitando redondeos aproximados.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-neutral-border shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-2xl">ac_unit</span>
            </div>
            <h3 className="text-lg font-bold text-neutral-dark">Cadena de Frío &amp; Empaque Higiénico</h3>
            <p className="text-xs sm:text-sm text-neutral-muted leading-relaxed">
              Sellado hermético y empaque en suero higiénico que conservan frescura, humedad y aromas naturales desde nuestras cavas refrigeradas hasta la puerta de tu hogar.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-border p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5" data-aos="fade-right">
            <span className="text-xs font-extrabold text-accent uppercase tracking-widest">
              Nuestro Compromiso
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark tracking-tight">
              Llevamos el Mercado Completo a tu Mesa
            </h2>
            <p className="text-xs sm:text-sm text-neutral-muted leading-relaxed font-medium">
              Más allá de quesos y charcutería selecta, hemos enriquecido nuestra propuesta para ofrecerte despensa básica, panes artesanales, salsas, granos, café y confitería, facilitando tus compras en un solo lugar con la mejor atención personalizada.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onNavigateToStore}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-extrabold shadow-md transition-all cursor-pointer active:scale-95"
              >
                <span>Explorar la Tienda</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4" data-aos="fade-left">
            <div className="bg-surface-alt p-5 rounded-2xl border border-neutral-border text-center space-y-1">
              <span className="block text-3xl sm:text-4xl font-black text-primary">+1,200</span>
              <span className="text-xs font-bold text-neutral-dark">Familias Surtidas</span>
              <p className="text-[11px] text-neutral-muted">En toda Maracaibo y San Francisco</p>
            </div>

            <div className="bg-surface-alt p-5 rounded-2xl border border-neutral-border text-center space-y-1">
              <span className="block text-3xl sm:text-4xl font-black text-accent">100%</span>
              <span className="text-xs font-bold text-neutral-dark">Garantía de Frescura</span>
              <p className="text-[11px] text-neutral-muted">Inspección de lotes diaria</p>
            </div>

            <div className="bg-surface-alt p-5 rounded-2xl border border-neutral-border text-center space-y-1">
              <span className="block text-3xl sm:text-4xl font-black text-primary">Tasa BCV</span>
              <span className="text-xs font-bold text-neutral-dark">Transparencia Total</span>
              <p className="text-[11px] text-neutral-muted">Precios oficiales actualizados</p>
            </div>

            <div className="bg-surface-alt p-5 rounded-2xl border border-neutral-border text-center space-y-1">
              <span className="block text-3xl sm:text-4xl font-black text-emerald-600">Express</span>
              <span className="text-xs font-bold text-neutral-dark">Despacho Inmediato</span>
              <p className="text-[11px] text-neutral-muted">Punto de venta al recibir</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
