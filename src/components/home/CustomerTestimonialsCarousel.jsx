import React from 'react';

const testimonialsDataList = [
  {
    clientInitialsText: 'CR',
    clientFullName: 'Carmen R. Mendoza',
    clientContextLabel: 'Compra semanal para el hogar',
    avatarBackgroundClass: 'bg-primary text-white',
    testimonialQuoteText: 'Hacer el mercado de charcutería con Quesería San Joaquín me ahorra filas. El jamón viene rebanado delgadito y el queso de mano empacado en suero impecable.'
  },
  {
    clientInitialsText: 'GL',
    clientFullName: 'Gustavo López',
    clientContextLabel: 'Cliente verificado • Delivery',
    avatarBackgroundClass: 'bg-accent-bright text-neutral-dark',
    testimonialQuoteText: 'Excelente servicio por WhatsApp. Me enviaron el peso exacto en foto y pagué con Pago Móvil a tasa BCV sin recargos raros. Puntualidad 10/10.'
  },
  {
    clientInitialsText: 'MV',
    clientFullName: 'Mariana Valenzuela',
    clientContextLabel: 'Abastecimiento quincenal',
    avatarBackgroundClass: 'bg-neutral-dark text-white',
    testimonialQuoteText: 'Resolver la harina, el arroz, los quesos y los embutidos en un solo envío es una maravilla. Todo fresco y bien sellado.'
  }
];

export const CustomerTestimonialsCarousel = () => {
  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10" data-aos="fade-up">
          <span className="text-xs font-extrabold text-accent uppercase tracking-widest">
            Clientes Satisfechos
          </span>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-neutral-dark tracking-tight mt-1">
            Lo que dicen las familias que compran con nosotros
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialsDataList.map((testimonialItem, testimonialIndex) => {
            const animationDelayMilliseconds = (testimonialIndex + 1) * 100;

            return (
              <div
                key={testimonialItem.clientFullName}
                data-aos="fade-up"
                data-aos-delay={animationDelayMilliseconds}
                className="bg-surface-alt p-6 rounded-xl border border-neutral-border shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-accent-bright mb-3">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>

                  <p className="text-xs text-neutral-muted leading-relaxed italic mb-4">
                    "{testimonialItem.testimonialQuoteText}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-neutral-border/50">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${testimonialItem.avatarBackgroundClass}`}>
                    {testimonialItem.clientInitialsText}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-dark block">
                      {testimonialItem.clientFullName}
                    </span>
                    <span className="text-[11px] text-neutral-muted">
                      {testimonialItem.clientContextLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
