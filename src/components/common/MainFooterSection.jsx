import React from 'react';
import { STORE_OFFICIAL_DATA } from '../../services/storeScheduleService';

export const MainFooterSection = ({ onNavigateToPage }) => {
  const cleanDestinationNumber = STORE_OFFICIAL_DATA.phoneNumber.replace(/[^\d]/g, '');
  const directWhatsAppUrl = `https://wa.me/${cleanDestinationNumber}?text=${encodeURIComponent(
    '¡Hola Quesería San Joaquín! Quisiera más información sobre sus productos y envíos.'
  )}`;

  const navigationLinksList = [
    { labelText: 'Inicio', pageIdentifier: 'inicio' },
    { labelText: 'Tienda', pageIdentifier: 'tienda' },
    { labelText: 'Nosotros', pageIdentifier: 'nosotros' },
    { labelText: 'Contáctanos', pageIdentifier: 'contacto' }
  ];

  const paymentMethodsList = [
    'Pago Móvil',
    'Zelle',
    'Efectivo USD',
    'Punto de Venta',
    'Tasa BCV'
  ];

  const handleNavigationClick = (clickEvent, targetPageIdentifier) => {
    if (onNavigateToPage) {
      clickEvent.preventDefault();
      onNavigateToPage(targetPageIdentifier);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full relative overflow-hidden bg-[#0A3319] text-white pt-12 sm:pt-16 pb-24 lg:pb-10 border-t border-[#062612] select-none">
      <div className="absolute top-0 right-0 h-full w-full lg:w-1/2 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-12 right-28 sm:right-48 lg:right-44 w-60 h-60 sm:w-76 sm:h-76 md:w-92 md:h-92 rounded-full bg-[#EA580C] opacity-95 transition-transform" />

        <div className="absolute top-32 sm:top-36 right-44 sm:right-60 lg:right-56 w-52 h-52 sm:w-68 sm:h-68 md:w-80 md:h-80 rounded-full bg-[#8DC63F] opacity-95 transition-transform" />

        <div className="absolute -top-4 -right-16 sm:-right-20 w-60 h-60 sm:w-76 sm:h-76 md:w-92 md:h-92 rounded-full bg-[#DC2626] opacity-95 transition-transform" />

        <div className="absolute top-10 right-36 sm:right-52 lg:right-48 filter drop-shadow-2xl">
          <svg viewBox="0 0 120 100" className="w-24 h-20 sm:w-32 sm:h-26" fill="none">
            <path
              d="M12,78 L47,24 C54,18 67,18 74,24 L108,78 C74,89 46,89 12,78 Z"
              fill="#F59E0B"
            />
            <ellipse cx="60.5" cy="24" rx="22" ry="9" fill="#FDE68A" />
            <circle cx="36" cy="52" r="5.5" fill="#D97706" />
            <circle cx="61" cy="45" r="6.5" fill="#D97706" />
            <circle cx="86" cy="58" r="6" fill="#D97706" />
            <circle cx="51" cy="68" r="5" fill="#D97706" />
            <circle cx="71" cy="71" r="4.5" fill="#D97706" />
          </svg>
        </div>

        <div className="absolute top-28 right-20 sm:right-28 filter drop-shadow-xl">
          <svg viewBox="0 0 80 80" className="w-16 h-16 sm:w-20 sm:h-20" fill="none">
            <circle cx="40" cy="40" r="30" fill="#F97316" />
            <circle cx="40" cy="40" r="26.5" fill="#FEF3C7" />
            <circle cx="40" cy="40" r="22.5" fill="#EA580C" />
            <circle cx="40" cy="40" r="4.5" fill="#FEF3C7" />
            <path
              d="M40,17.5 L40,62.5 M17.5,40 L62.5,40 M24,24 L56,56 M24,56 L56,24"
              stroke="#FEF3C7"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="absolute bottom-12 right-52 sm:right-68 filter drop-shadow-2xl">
          <svg viewBox="0 0 80 95" className="w-16 h-20 sm:w-20 sm:h-24" fill="none">
            <path
              d="M40,16 C30,16 22,26 20,42 C17,58 24,80 40,80 C56,80 63,58 60,42 C58,26 50,16 40,16 Z"
              fill="#14532D"
            />
            <path
              d="M40,20 C32,20 25,29 24,43 C22,57 28,76 40,76 C52,76 58,57 56,43 C55,29 48,20 40,20 Z"
              fill="#BEF264"
            />
            <circle cx="40" cy="57" r="16" fill="#FEF08A" />
            <ellipse cx="40" cy="57" rx="12" ry="14" fill="#78350F" />
            <ellipse cx="36" cy="52" rx="3" ry="5" fill="#FFFFFF" opacity="0.4" transform="rotate(-20 36 52)" />
          </svg>
        </div>

        <div className="absolute top-4 right-4 sm:right-8 filter drop-shadow-xl">
          <svg viewBox="0 0 80 90" className="w-16 h-18 sm:w-20 sm:h-22" fill="none">
            <path d="M38,22 C40,14 43,12 45,24" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M43,21 C53,16 58,20 54,28 C47,28 44,24 43,21 Z" fill="#4ADE80" />
            <ellipse cx="40" cy="54" rx="28" ry="29" fill="#EF4444" />
            <ellipse cx="29" cy="42" rx="5" ry="11" fill="#FFFFFF" opacity="0.32" transform="rotate(-25 29 42)" />
          </svg>
        </div>

        <div className="absolute bottom-6 right-16 sm:right-24 filter drop-shadow-xl">
          <svg viewBox="0 0 80 95" className="w-16 h-20 sm:w-20 sm:h-24" fill="none">
            <path d="M34,24 C34,14 38,12 42,17" stroke="#15803D" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M42,20 C48,15 54,18 52,25 C47,26 44,23 42,20 Z" fill="#22C55E" />
            <circle cx="26" cy="32" r="9.5" fill="#8B5CF6" />
            <circle cx="45" cy="32" r="9.5" fill="#7C3AED" />
            <circle cx="35" cy="46" r="9.5" fill="#6D28D9" />
            <circle cx="53" cy="46" r="9.5" fill="#8B5CF6" />
            <circle cx="44" cy="60" r="9.5" fill="#5B21B6" />
            <circle cx="60" cy="60" r="9.5" fill="#7C3AED" />
            <circle cx="52" cy="74" r="9" fill="#4C1D95" />
          </svg>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-white/10">
          <div className="lg:col-span-4 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-white p-1.5 border-2 border-[#8DC63F] shadow-sm flex items-center justify-center shrink-0">
                  <img
                    src="/images/queseria_san_juaquin_logo.png"
                    alt="Quesería San Joaquín"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase leading-none">
                    Quesería San Joaquín
                  </h3>
                  <span className="text-xs font-bold text-[#8DC63F] tracking-wider uppercase block mt-1">
                    Mercado &amp; Charcutería
                  </span>
                </div>
              </div>

              <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mt-2">
                RIF. J-50341829-0
              </p>

              <p className="text-xs sm:text-sm text-white/80 leading-relaxed mt-3 max-w-sm">
                Tu punto de encuentro en Maracaibo para los mejores quesos tradicionales venezolanos, charcutería fresca, lácteos y víveres de primera categoría.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#8DC63F] hover:bg-[#78AD2F] text-[#062612] font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                <span>Pedir por WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8DC63F]" />
              <span>Sucursales &amp; Sede</span>
            </h4>

            <div className="space-y-2.5 text-xs text-white/80">
              <div>
                <span className="font-bold text-white block">Sede Principal:</span>
                <p className="mt-0.5 leading-relaxed text-white/75">{STORE_OFFICIAL_DATA.fullAddress}</p>
                <span className="text-[11px] text-[#8DC63F] font-semibold block mt-0.5">
                  Ref: Al lado de Ame-Zulia
                </span>
              </div>

              <div className="pt-1">
                <span className="font-bold text-white block">Contacto Directo:</span>
                <p className="mt-0.5 text-[#8DC63F] font-bold text-sm tracking-wide">
                  {STORE_OFFICIAL_DATA.formattedPhone}
                </p>
              </div>

              <div className="pt-1">
                <span className="font-bold text-white block">Horarios de Atención:</span>
                <p className="mt-0.5 text-white/75 leading-relaxed">
                  {STORE_OFFICIAL_DATA.scheduleSummary}
                </p>
                <span className="text-[11px] text-white/50 block">Domingos: Cerrado</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              <span>Nosotros</span>
            </h4>

            <ul className="space-y-2 text-xs font-semibold text-white/80">
              {navigationLinksList.map((navigationItem) => (
                <li key={navigationItem.pageIdentifier}>
                  <a
                    href={`#${navigationItem.pageIdentifier}`}
                    onClick={(clickEvent) => handleNavigationClick(clickEvent, navigationItem.pageIdentifier)}
                    className="hover:text-[#8DC63F] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span className="text-white/40">›</span>
                    <span>{navigationItem.labelText}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 flex flex-col justify-between space-y-6">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-sm space-y-3">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Visítanos en Redes
                </span>
                <span className="text-[11px] text-white/70 block mt-0.5">
                  Fotos de nuestros productos, cortes y promociones:
                </span>
              </div>

              <a
                href={STORE_OFFICIAL_DATA.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 w-full p-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#DC2626] hover:from-[#D97706] hover:to-[#B91C1C] text-white font-bold text-xs shadow-md transition-all group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div className="flex-1 truncate">
                  <span className="block text-white leading-tight font-black">{STORE_OFFICIAL_DATA.instagramHandle}</span>
                  <span className="text-[10px] text-white/80 font-normal">Instagram Oficial</span>
                </div>
                <span className="material-symbols-outlined text-sm text-white/70 group-hover:translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </a>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-sm space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Formas de Pago
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {paymentMethodsList.map((paymentMethod) => (
                  <span
                    key={paymentMethod}
                    className="px-2 py-0.5 rounded-full bg-white/15 border border-white/20 text-white text-[11px] font-semibold"
                  >
                    {paymentMethod}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-center sm:text-left">
            <p>© 2026 Quesería San Joaquín - Mercado &amp; Charcutería. Maracaibo, Zulia.</p>
            <span className="hidden sm:inline text-white/30">•</span>
            <p className="font-medium text-white/70">
              Hecho por <span className="font-bold text-white">EM Projects</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-white/60 text-xs">
            <a
              href="#tienda"
              onClick={(clickEvent) => handleNavigationClick(clickEvent, 'tienda')}
              className="hover:text-[#8DC63F] transition-colors"
            >
              Catálogo &amp; Precios
            </a>
            <a
              href="#contacto"
              onClick={(clickEvent) => handleNavigationClick(clickEvent, 'contacto')}
              className="hover:text-[#8DC63F] transition-colors"
            >
              Envíos y Cobertura
            </a>
            <a
              href={STORE_OFFICIAL_DATA.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#8DC63F] transition-colors"
            >
              Instagram {STORE_OFFICIAL_DATA.instagramHandle}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
