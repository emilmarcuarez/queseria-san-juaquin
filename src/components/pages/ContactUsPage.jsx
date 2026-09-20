import React, { useState, useEffect } from 'react';

export const ContactUsPage = () => {
  const configuredPhoneNumber = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER || '584147675878';
  const cleanDestinationNumber = configuredPhoneNumber.replace(/[^\d]/g, '');
  const storeScheduleText = import.meta.env.VITE_STORE_SCHEDULE || 'Lunes a Domingo: 8:00 AM - 8:00 PM';

  const [customerSenderName, setCustomerSenderName] = useState('');
  const [customerContactPhone, setCustomerContactPhone] = useState('');
  const [customerInquiryMessage, setCustomerInquiryMessage] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleInquiryFormSubmit = (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    const formattedMessage = `Hola Quesería San Joaquín! Mi nombre es ${customerSenderName || 'Cliente'}. Mi número de contacto es ${customerContactPhone || 'No especificado'}. Consulta: ${customerInquiryMessage}`;
    const directWhatsAppUrl = `https://wa.me/${cleanDestinationNumber}?text=${encodeURIComponent(formattedMessage)}`;
    window.open(directWhatsAppUrl, '_blank');
  };

  return (
    <div className="w-full bg-[#fafafa] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4" data-aos="fade-up">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-extrabold tracking-wider uppercase">
            Atención al Cliente
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-dark tracking-tight">
            Estamos Listos para Atenderte
          </h1>
          <p className="text-sm sm:text-base text-neutral-muted leading-relaxed font-medium">
            ¿Tienes dudas sobre disponibilidad, pedidos al mayor o despachos a domicilio? Escríbenos o visítanos directamente.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6" data-aos="fade-right">
            <div className="bg-white p-7 rounded-2xl border border-neutral-border shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-neutral-dark">Información de Contacto</h2>

              <div className="space-y-4 text-xs sm:text-sm text-neutral-dark">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-surface-alt border border-neutral-border flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-xl">location_on</span>
                  </div>
                  <div>
                    <span className="font-extrabold block text-neutral-dark">Ubicación y Despacho</span>
                    <span className="text-neutral-muted">Maracaibo, Estado Zulia. Cobertura en toda la ciudad.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-surface-alt border border-neutral-border flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-xl">schedule</span>
                  </div>
                  <div>
                    <span className="font-extrabold block text-neutral-dark">Horario de Atención</span>
                    <span className="text-neutral-muted">{storeScheduleText}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-surface-alt border border-neutral-border flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-xl">call</span>
                  </div>
                  <div>
                    <span className="font-extrabold block text-neutral-dark">Línea Telefónica &amp; WhatsApp</span>
                    <span className="text-neutral-muted">+{configuredPhoneNumber}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-surface-alt border border-neutral-border flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-xl">payments</span>
                  </div>
                  <div>
                    <span className="font-extrabold block text-neutral-dark">Métodos de Pago Aceptados</span>
                    <span className="text-neutral-muted">Pago Móvil (Tasa BCV oficial), Punto de Venta al recibir, Zelle y Efectivo USD.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${cleanDestinationNumber}?text=${encodeURIComponent('Hola Quesería San Joaquín! Quisiera comunicarme con un asesor de ventas.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg">chat</span>
                  <span>Escribir por WhatsApp Directo</span>
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7" data-aos="fade-left">
            <div className="bg-white p-7 sm:p-10 rounded-2xl border border-neutral-border shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-dark">Envíanos un Mensaje</h2>
                <p className="text-xs sm:text-sm text-neutral-muted mt-1">
                  Completa tus datos y te responderemos a la brevedad posible vía WhatsApp.
                </p>
              </div>

              <form onSubmit={handleInquiryFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-dark mb-1" htmlFor="customer-sender-name">
                      Tu Nombre y Apellido
                    </label>
                    <input
                      id="customer-sender-name"
                      required
                      type="text"
                      value={customerSenderName}
                      onChange={(inputEvent) => setCustomerSenderName(inputEvent.target.value)}
                      placeholder="Ej. Carmen Rodríguez"
                      className="w-full bg-surface-alt border border-neutral-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-dark mb-1" htmlFor="customer-contact-phone">
                      Número Telefónico / WhatsApp
                    </label>
                    <input
                      id="customer-contact-phone"
                      required
                      type="tel"
                      value={customerContactPhone}
                      onChange={(inputEvent) => setCustomerContactPhone(inputEvent.target.value)}
                      placeholder="Ej. 0414-1234567"
                      className="w-full bg-surface-alt border border-neutral-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-dark mb-1" htmlFor="customer-inquiry-message">
                    ¿En qué podemos ayudarte?
                  </label>
                  <textarea
                    id="customer-inquiry-message"
                    required
                    rows="4"
                    value={customerInquiryMessage}
                    onChange={(inputEvent) => setCustomerInquiryMessage(inputEvent.target.value)}
                    placeholder="Escribe aquí tu consulta sobre productos, pedidos especiales o delivery..."
                    className="w-full bg-surface-alt border border-neutral-border rounded-xl p-4 text-xs sm:text-sm text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-xs resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                  <span>Enviar Consulta Directa</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
