import React, { useState, useEffect } from 'react';
import { STORE_OFFICIAL_DATA, getStoreCurrentScheduleStatus } from '../../services/storeScheduleService';

export const ContactUsPage = () => {
  const [storeStatus, setStoreStatus] = useState(getStoreCurrentScheduleStatus());
  const [customerSenderName, setCustomerSenderName] = useState('');
  const [customerContactPhone, setCustomerContactPhone] = useState('');
  const [customerInquiryMessage, setCustomerInquiryMessage] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const intervalTimer = setInterval(() => {
      setStoreStatus(getStoreCurrentScheduleStatus());
    }, 60000);
    return () => clearInterval(intervalTimer);
  }, []);

  const cleanDestinationNumber = STORE_OFFICIAL_DATA.phoneNumber.replace(/[^\d]/g, '');

  const handleInquiryFormSubmit = (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    const formattedMessage = `Hola Quesería San Joaquín! Mi nombre es ${customerSenderName || 'Cliente'}. Mi número de contacto es ${customerContactPhone || 'No especificado'}. Consulta: ${customerInquiryMessage}`;
    const directWhatsAppUrl = `https://wa.me/${cleanDestinationNumber}?text=${encodeURIComponent(formattedMessage)}`;
    window.open(directWhatsAppUrl, '_blank');
  };

  return (
    <div className="w-full bg-white py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-12 sm:space-y-16">
        {/* Encabezado Principal */}
        <div className="text-center max-w-3xl mx-auto space-y-4" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-subtle text-primary text-xs font-black tracking-wider uppercase">
            <span>Atención al Cliente • Maracaibo</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-dark tracking-tight">
            Estamos Listos para Atenderte
          </h1>

          <p className="text-sm sm:text-base text-neutral-muted leading-relaxed font-medium">
            Visítanos en nuestra sede en Maracaibo para comprar al corte o retirar tu pedido, o escríbenos para despachos express directo a tu hogar.
          </p>

          {/* Badge de Horario en Vivo */}
          <div className="pt-1 flex justify-center">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black shadow-2xs ${storeStatus.badgeBgClass}`}>
              <span className={`w-2 h-2 rounded-full ${storeStatus.dotPulseClass} ${storeStatus.isOpen ? 'animate-pulse' : ''}`} />
              <span>{storeStatus.statusBadgeText}:</span>
              <span className="font-semibold text-neutral-700">{storeStatus.statusDetailText}</span>
            </div>
          </div>
        </div>

        {/* Fila: Datos de Contacto y Formulario */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tarjeta de Información Oficial */}
          <div className="lg:col-span-5 space-y-6" data-aos="fade-right">
            <div className="bg-white p-7 rounded-2xl border border-neutral-border shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-neutral-dark">Información de Nuestra Sede</h2>

              <div className="space-y-4 text-xs sm:text-sm text-neutral-dark">
                {/* Dirección */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-xl">location_on</span>
                  </div>
                  <div>
                    <span className="font-extrabold block text-neutral-dark">Dirección de la Sede</span>
                    <span className="text-neutral-700 font-medium leading-relaxed block">
                      {STORE_OFFICIAL_DATA.fullAddress}
                    </span>
                    <span className="text-[11px] text-emerald-800 font-bold block mt-0.5">
                      Punto de referencia: Al lado de Ame-Zulia.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-surface-alt border border-neutral-border flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-xl">schedule</span>
                  </div>
                  <div>
                    <span className="font-extrabold block text-neutral-dark">Horario de Atención</span>
                    <span className="text-neutral-600 block">Lunes a Viernes: 7:00 AM - 7:00 PM</span>
                    <span className="text-neutral-600 block">Sábados: 7:00 AM - 6:00 PM</span>
                    <span className="text-neutral-400 text-[11px] block">Domingos: Cerrado</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                    <span className="material-symbols-outlined text-xl">call</span>
                  </div>
                  <div>
                    <span className="font-extrabold block text-neutral-dark">Línea Directa & WhatsApp</span>
                    <span className="text-emerald-800 font-black text-sm block">
                      {STORE_OFFICIAL_DATA.formattedPhone}
                    </span>
                    <span className="text-[11px] text-neutral-500">Atención rápida por nuestro equipo de charcutería.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600 shrink-0">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-extrabold block text-neutral-dark">Instagram Oficial</span>
                    <a
                      href={STORE_OFFICIAL_DATA.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700 font-black text-sm block transition-colors"
                    >
                      {STORE_OFFICIAL_DATA.instagramHandle}
                    </a>
                    <span className="text-[11px] text-neutral-500">Publicaciones, ofertas y novedades de la tienda.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-surface-alt border border-neutral-border flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-xl">payments</span>
                  </div>
                  <div>
                    <span className="font-extrabold block text-neutral-dark">Formas de Pago Cómodas</span>
                    <span className="text-neutral-600">
                      Pago Móvil a tasa oficial BCV, Punto de Venta en local, Zelle y Efectivo USD.
                    </span>
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

          {/* Formulario de Mensajes */}
          <div className="lg:col-span-7" data-aos="fade-left">
            <div className="bg-white p-7 sm:p-10 rounded-2xl border border-neutral-border shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-dark">Envíanos un Mensaje Directo</h2>
                <p className="text-xs sm:text-sm text-neutral-muted mt-1">
                  ¿Preguntas sobre disponibilidad de un queso o víveres? Te responderemos a la brevedad.
                </p>
              </div>

              <form onSubmit={handleInquiryFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-dark mb-1" htmlFor="customer-sender-name">
                      Tu Nombre y Apellido:
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
                      Número Telefónico / WhatsApp:
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
                    ¿En qué podemos ayudarte?:
                  </label>
                  <textarea
                    id="customer-inquiry-message"
                    required
                    rows="4"
                    value={customerInquiryMessage}
                    onChange={(inputEvent) => setCustomerInquiryMessage(inputEvent.target.value)}
                    placeholder="Escribe aquí tu consulta sobre productos, pedidos especiales o despacho..."
                    className="w-full bg-surface-alt border border-neutral-border rounded-xl p-4 text-xs sm:text-sm text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-xs resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                  <span>Enviar Consulta al WhatsApp</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Sección del Mapa Interactivo de Google Maps */}
        <div className="bg-white rounded-3xl border border-neutral-border p-6 sm:p-10 shadow-xs space-y-6" data-aos="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-primary uppercase tracking-wider mb-1">
                <span className="material-symbols-outlined text-base">map</span>
                <span>Ubicación en el Mapa</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-dark tracking-tight">
                Visítanos en Nuestra Tienda Física
              </h2>
              <p className="text-xs sm:text-sm text-neutral-muted mt-0.5">
                {STORE_OFFICIAL_DATA.fullAddress}
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <a
                href={STORE_OFFICIAL_DATA.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-base">directions</span>
                <span>Abrir en Google Maps</span>
              </a>
            </div>
          </div>

          {/* Iframe Interactivo de Google Maps */}
          <div className="w-full h-[360px] sm:h-[440px] rounded-2xl overflow-hidden border border-neutral-200 shadow-inner relative bg-neutral-100">
            <iframe
              title="Ubicación Quesería San Joaquín en Maracaibo"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${STORE_OFFICIAL_DATA.embedMapQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
            />
          </div>

          {/* Indicaciones para Retiro Express */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-surface-alt border border-neutral-border text-center sm:text-left flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">directions_car</span>
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-dark block">Fácil Acceso</span>
                <span className="text-[11px] text-neutral-muted leading-tight">
                  Conexión directa desde Cecilio Acosta y Avenida Bella Vista.
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-alt border border-neutral-border text-center sm:text-left flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">local_parking</span>
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-dark block">Estacionamiento</span>
                <span className="text-[11px] text-neutral-muted leading-tight">
                  Puestos cómodos frente al local para retiro express de víveres.
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-alt border border-neutral-border text-center sm:text-left flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">storefront</span>
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-dark block">Retiro en Mostrador</span>
                <span className="text-[11px] text-neutral-muted leading-tight">
                  Tu pedido empacado y refrigerado listo para llevar sin demoras.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
