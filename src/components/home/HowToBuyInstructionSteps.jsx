import React from 'react';

const purchasingStepsList = [
  {
    stepNumberText: '1',
    stepTitleText: 'Arma tu lista o carrito',
    stepDescriptionText: 'Selecciona tus víveres y productos de charcutería favoritos desde nuestro catálogo digital.',
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
    stepTitleText: 'Paga y recibe tu pedido',
    stepDescriptionText: 'Paga por Pago Móvil, Punto de Venta al instante, Zelle o efectivo en mano.',
    isAccentStyle: true
  }
];

export const HowToBuyInstructionSteps = () => {
  return (
    <section className="py-14 bg-surface-alt border-b border-neutral-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12" data-aos="fade-up">
          <span className="text-xs font-extrabold text-primary uppercase tracking-widest">
            Rápido, Fácil y Confiable
          </span>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-neutral-dark tracking-tight mt-1">
            Cómo Comprar en Nuestro Supermercado Online
          </h2>
          <p className="text-sm text-neutral-muted mt-2 font-medium">
            Diseñado para que hagas tu compra semanal en 4 sencillos pasos con atención directa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {purchasingStepsList.map((stepItem, stepIndex) => {
            const numberBadgeClasses = stepItem.isAccentStyle
              ? 'bg-accent-light text-accent-hover ring-1 ring-accent/30'
              : 'bg-primary-subtle text-primary ring-1 ring-primary/20';

            const animationDelayMilliseconds = (stepIndex + 1) * 90;

            return (
              <div
                key={stepItem.stepNumberText}
                data-aos="fade-up"
                data-aos-delay={animationDelayMilliseconds}
                className="bg-white p-6 rounded-xl border border-neutral-border shadow-xs hover:shadow-md transition-all flex flex-col items-start relative"
              >
                <div className={`w-10 h-10 rounded-lg font-black text-lg flex items-center justify-center mb-4 ${numberBadgeClasses}`}>
                  {stepItem.stepNumberText}
                </div>
                <h4 className="text-base font-bold text-neutral-dark mb-1">
                  {stepItem.stepTitleText}
                </h4>
                <p className="text-xs text-neutral-muted leading-relaxed">
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
