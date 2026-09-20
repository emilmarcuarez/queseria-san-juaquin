import React from 'react';
import { STORE_OFFICIAL_DATA } from '../../services/storeScheduleService';

export const MainFooterSection = () => {
  const cleanDestinationNumber = STORE_OFFICIAL_DATA.phoneNumber.replace(/[^\d]/g, '');
  const directWhatsAppUrl = `https://wa.me/${cleanDestinationNumber}?text=${encodeURIComponent('Hola Quesería San Joaquín! Quisiera más información sobre sus productos y envíos.')}`;

  return (
    <footer className="w-full bg-white border-t border-neutral-border pt-12 pb-16 lg:pb-8 text-neutral-dark">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-neutral-border">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img
                src="/images/queseria_san_juaquin_logo.png"
                alt="Quesería San Joaquín"
                className="w-10 h-10 object-contain drop-shadow-xs"
              />
              <span className="font-extrabold text-base text-primary uppercase">Quesería San Joaquín</span>
            </div>
            <p className="text-xs font-semibold text-accent uppercase tracking-wider">Mercado &amp; Charcutería</p>
            <p className="text-xs text-neutral-muted leading-relaxed">
              Tu supermercado moderno de confianza para víveres, charcutería fresca y quesos seleccionados con despacho puntual y garantía total de frescura en Maracaibo.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-neutral-dark uppercase tracking-wider">Horarios &amp; Sede</h4>
            <div className="space-y-2 text-xs text-neutral-muted">
              <p className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">location_on</span>
                <span>{STORE_OFFICIAL_DATA.fullAddress}</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">schedule</span>
                <span>{STORE_OFFICIAL_DATA.scheduleSummary}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base shrink-0">moped</span>
                <span>Entregas express y pick-up en tienda el mismo día.</span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-neutral-dark uppercase tracking-wider">Formas de Pago</h4>
            <p className="text-xs text-neutral-muted">Aceptamos todos los canales cómodos y oficiales:</p>
            <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded bg-surface-alt border border-neutral-border text-neutral-dark">
                Pago Móvil
              </span>
              <span className="px-2.5 py-1 rounded bg-surface-alt border border-neutral-border text-neutral-dark">
                Zelle
              </span>
              <span className="px-2.5 py-1 rounded bg-surface-alt border border-neutral-border text-neutral-dark">
                Efectivo USD
              </span>
              <span className="px-2.5 py-1 rounded bg-surface-alt border border-neutral-border text-neutral-dark">
                Punto de Venta
              </span>
            </div>
            <p className="text-[11px] text-neutral-muted mt-2">
              Tasas transparentes referenciadas estrictamente al BCV del día.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-neutral-dark uppercase tracking-wider">Atención WhatsApp</h4>
            <p className="text-xs text-neutral-muted">
              Haz tu pedido o consulta disponibilidad en tiempo real con nuestros charcuteros al {STORE_OFFICIAL_DATA.formattedPhone}.
            </p>
            <a
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
              href={directWhatsAppUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              <span>Escribir al {STORE_OFFICIAL_DATA.formattedPhone}</span>
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-muted">
          <p>© 2026 Quesería San Joaquín - Mercado &amp; Charcutería. Maracaibo, Zulia.</p>
          <div className="flex items-center gap-4">
            <a className="hover:text-primary transition-colors" href="#destacados">Precios &amp; BCV</a>
            <a className="hover:text-primary transition-colors" href="#destacados">Envíos y Cobertura</a>
            <a className="hover:text-primary transition-colors" href="#destacados">Términos del Servicio</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
