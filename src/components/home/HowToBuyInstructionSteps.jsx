import React from 'react';

const purchasingStepsList = [
  {
    stepNumberText: '1',
    stepTitleText: 'Arma tu lista o carrito',
    stepDescriptionText: 'Selecciona tus víveres, quesos y embutidos favoritos desde nuestro catálogo digital.',
    isAccentStyle: false
  },
  {
    stepNumberText: '2',
    stepTitleText: 'Envía tu pedido al WhatsApp',
    stepDescriptionText: 'Un operador de charcutería toma tu solicitud de inmediato y coordina tu preferencia de corte.',
    isAccentStyle: false
  },
  {
    stepNumberText: '3',
    stepTitleText: 'Recibe fotos y peso exacto',
    stepDescriptionText: 'Te enviamos el pesaje en balanza digital con el comprobante de corte antes de despachar.',
    isAccentStyle: false
  },
  {
    stepNumberText: '4',
    stepTitleText: 'Paga y recibe en tu puerta',
    stepDescriptionText: 'Paga por Pago Móvil, Punto de Venta al instante, Zelle o efectivo en mano.',
    isAccentStyle: true
  }
];

export const HowToBuyInstructionSteps = () => {
  return (
    <section className="py-12 sm:py-16 bg-white border-t border-neutral-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12" data-aos="fade-up">
          <span className="text-xs font-black text-[#EA580C] uppercase tracking-widest">
            Rápido, Fácil y Confiable
          </span>
          <h2 className="text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight mt-1">
            Cómo Comprar en Nuestro Supermercado Online
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 font-medium">
            Diseñado para que hagas tu compra semanal en 4 sencillos pasos con atención directa por WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {purchasingStepsList.map((stepItem, stepIndex) => {
            const numberBadgeClasses = stepItem.isAccentStyle
              ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-400/40'
              : 'bg-amber-50 text-[#EA580C] ring-1 ring-amber-200/50';

            const animationDelayMilliseconds = (stepIndex + 1) * 90;

            return (
              <div
                key={stepItem.stepNumberText}
                data-aos="fade-up"
                data-aos-delay={animationDelayMilliseconds}
                className="bg-neutral-50/70 p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs hover:shadow-md hover:border-amber-400/60 hover:bg-white transition-all duration-300 flex flex-col items-start relative group"
              >
                <div className={`w-10 h-10 rounded-xl font-black text-base flex items-center justify-center mb-4 shadow-2xs group-hover:scale-105 transition-transform ${numberBadgeClasses}`}>
                  {stepItem.stepNumberText}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 mb-1.5">
                  {stepItem.stepTitleText}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {stepItem.stepDescriptionText}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
