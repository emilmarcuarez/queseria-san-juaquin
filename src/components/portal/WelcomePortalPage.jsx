import React from 'react';
import { STORE_OFFICIAL_DATA } from '../../services/storeScheduleService';

export const WelcomePortalPage = ({ onEnterStore }) => {
  const sanitizedPhoneNumber = STORE_OFFICIAL_DATA.phoneNumber.replace(/[^\d]/g, '');
  const deliveryWhatsAppUrl = `https://wa.me/${sanitizedPhoneNumber}?text=${encodeURIComponent(
    '¡Hola Quesería San Joaquín! 🛵 Deseo realizar un pedido con servicio de Delivery en Maracaibo.'
  )}`;
  const generalWhatsAppUrl = `https://wa.me/${sanitizedPhoneNumber}?text=${encodeURIComponent(
    '¡Hola Quesería San Joaquín! Quisiera consultar información sobre sus productos.'
  )}`;
  const instagramProfileUrl = STORE_OFFICIAL_DATA.instagramUrl;

  const handleDeliveryButtonClick = () => {
    window.open(deliveryWhatsAppUrl, '_blank', 'noopener,noreferrer');
  };

  const handleWebStoreButtonClick = () => {
    onEnterStore();
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-white via-[#FCFDF9] to-[#F2F9E6]/30 flex flex-col justify-between select-none">
      <style>{`
        @keyframes floatBuoyantUp {
          from {
            transform: translate3d(0, 0px, 0);
          }
          to {
            transform: translate3d(0, -15px, 0);
          }
        }
        @keyframes floatBuoyantDown {
          from {
            transform: translate3d(0, 0px, 0);
          }
          to {
            transform: translate3d(0, 15px, 0);
          }
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-20 w-[420px] h-[420px] rounded-full bg-[#8DC63F]/10 blur-3xl" />
        <div className="absolute top-1/4 -right-24 w-[420px] h-[420px] rounded-full bg-[#F2F9E6] blur-3xl" />
        <div className="absolute bottom-32 left-1/3 w-[360px] h-[360px] rounded-full bg-[#FEF3C7]/40 blur-3xl" />
      </div>

      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-8 sm:pt-12 pb-4">
        <div className="w-full max-w-sm sm:max-w-md mx-auto p-6 sm:p-8 md:p-9 flex flex-col items-center text-center bg-white/95 md:bg-white md:shadow-xl md:shadow-[#062612]/5 md:border md:border-neutral-100 md:rounded-3xl transition-all">
          <div className="relative mb-3">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white p-2 border-2 border-[#8DC63F] shadow-xs flex items-center justify-center">
              <img
                src="/images/queseria_san_juaquin_logo.png"
                alt="Quesería San Joaquín"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <h1 className="text-xl sm:text-2xl font-black text-[#062612] tracking-tight text-center">
              Quesería San Joaquín
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-[#4C821D] tracking-wide">
              Delivery y Pickup
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <a
              href={instagramProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-neutral-200/90 hover:border-[#8DC63F] flex items-center justify-center text-neutral-600 hover:text-[#4C821D] transition-colors shadow-2xs"
              aria-label="Perfil de Instagram"
              title={`Instagram ${STORE_OFFICIAL_DATA.instagramHandle}`}
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-neutral-200/90 hover:border-[#8DC63F] flex items-center justify-center text-neutral-600 hover:text-[#4C821D] transition-colors shadow-2xs"
              aria-label="Atención al Cliente por WhatsApp"
              title="Escribir al WhatsApp"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </a>

            <a
              href={STORE_OFFICIAL_DATA.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-neutral-200/90 hover:border-[#8DC63F] flex items-center justify-center text-neutral-600 hover:text-[#4C821D] transition-colors shadow-2xs"
              aria-label="Ubicación de la sede en Google Maps"
              title="Ver ubicación en Google Maps"
            >
              <span className="material-symbols-outlined text-base">location_on</span>
            </a>
          </div>

          <div className="w-full space-y-3">
            <button
              type="button"
              onClick={handleWebStoreButtonClick}
              className="w-full bg-white hover:bg-neutral-50/90 text-neutral-900 rounded-full py-3.5 px-5 flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200 border border-neutral-200/90 hover:border-[#8DC63F] active:scale-98 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-[#F2F9E6] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-base text-[#4C821D]">
                  storefront
                </span>
              </div>

              <span className="text-sm sm:text-base font-bold text-[#062612] text-center flex-1">
                Página Web
              </span>

              <span className="material-symbols-outlined text-neutral-300 group-hover:text-[#4C821D] text-lg transition-colors">
                chevron_right
              </span>
            </button>

            <button
              type="button"
              onClick={handleDeliveryButtonClick}
              className="w-full bg-white hover:bg-neutral-50/90 text-neutral-900 rounded-full py-3.5 px-5 flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200 border border-neutral-200/90 hover:border-[#22C55E] active:scale-98 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>

              <span className="text-sm sm:text-base font-bold text-[#062612] text-center flex-1">
                WhatsApp
              </span>

              <span className="material-symbols-outlined text-neutral-300 group-hover:text-[#16A34A] text-lg transition-colors">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full overflow-visible leading-none mt-auto pointer-events-none flex flex-col items-center pt-8 sm:pt-12 md:pt-16">
        <div className="absolute inset-x-0 bottom-0 w-full overflow-hidden leading-none pointer-events-none z-0">
          <svg
            className="w-full h-36 sm:h-44 md:h-52 lg:h-64"
            viewBox="0 0 1440 160"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,75 Q360,25 720,65 T1440,45 L1440,160 L0,160 Z"
              fill="#F2F9E6"
            />
            <path
              d="M0,105 Q360,60 720,100 T1440,85 L1440,160 L0,160 Z"
              fill="#E2F2CD"
            />
          </svg>
        </div>

        <div className="relative z-10 w-full max-w-7xl px-3 sm:px-6 flex items-end justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 pb-6 sm:pb-8 md:pb-10 overflow-visible">
          <div
            className="hidden lg:flex shrink-0 items-center justify-center pt-6 pb-1 overflow-visible"
            style={{
              animation: 'floatBuoyantDown 2.7s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate',
              animationDelay: '-0.4s',
              willChange: 'transform'
            }}
          >
            <svg viewBox="0 0 80 80" className="w-12 h-12 md:w-20 md:h-20 lg:w-24 lg:h-24 drop-shadow-sm" style={{ overflow: 'visible' }} fill="none">
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

          <div
            className="hidden md:flex shrink-0 items-center justify-center pt-6 pb-1 overflow-visible"
            style={{
              animation: 'floatBuoyantUp 2.9s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate',
              animationDelay: '-1.5s',
              willChange: 'transform'
            }}
          >
            <svg viewBox="0 0 80 90" className="w-12 h-14 md:w-20 md:h-24 lg:w-24 lg:h-28 drop-shadow-sm" style={{ overflow: 'visible' }} fill="none">
              <path d="M38,20 C40,12 43,10 44,18" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
              <path d="M26,24 C33,26 38,21 40,24 C42,21 47,26 54,24 C51,28 47,28 45,31 C40,28 35,31 26,24 Z" fill="#22C55E" />
              <path d="M23,30 C20,44 26,62 38,76 C41,79 43,79 45,76 C58,62 63,44 60,30 C53,26 31,26 23,30 Z" fill="#E11D48" />
              <circle cx="34" cy="39" r="1.5" fill="#FDE047" />
              <circle cx="48" cy="40" r="1.5" fill="#FDE047" />
              <circle cx="30" cy="49" r="1.5" fill="#FDE047" />
              <circle cx="42" cy="51" r="1.5" fill="#FDE047" />
              <circle cx="53" cy="50" r="1.5" fill="#FDE047" />
              <circle cx="37" cy="62" r="1.5" fill="#FDE047" />
              <circle cx="47" cy="63" r="1.5" fill="#FDE047" />
            </svg>
          </div>

          <div
            className="hidden sm:flex shrink-0 items-center justify-center pt-6 pb-1 overflow-visible"
            style={{
              animation: 'floatBuoyantDown 2.5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate',
              animationDelay: '-0.8s',
              willChange: 'transform'
            }}
          >
            <svg viewBox="0 0 80 95" className="w-12 h-14 sm:w-14 sm:h-16 md:w-20 md:h-24 lg:w-24 lg:h-28 drop-shadow-sm" style={{ overflow: 'visible' }} fill="none">
              <path d="M38,20 C39,12 43,10 44,19" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
              <path d="M43,18 C51,14 55,18 52,24 C47,25 44,22 43,18 Z" fill="#22C55E" />
              <path d="M40,28 C32,28 30,38 25,50 C18,63 22,80 40,80 C58,80 62,63 55,50 C50,38 48,28 40,28 Z" fill="#84CC16" />
              <ellipse cx="31" cy="58" rx="4" ry="10" fill="#FFFFFF" opacity="0.32" transform="rotate(-15 31 58)" />
            </svg>
          </div>

          <div
            className="shrink-0 flex items-center justify-center pt-6 pb-1 overflow-visible"
            style={{
              animation: 'floatBuoyantUp 2.6s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate',
              animationDelay: '-1.2s',
              willChange: 'transform'
            }}
          >
            <svg viewBox="0 0 80 90" className="w-12 h-14 sm:w-14 sm:h-16 md:w-20 md:h-24 lg:w-24 lg:h-28 drop-shadow-sm" style={{ overflow: 'visible' }} fill="none">
              <path d="M38,22 C40,14 43,12 45,24" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M43,21 C53,16 58,20 54,28 C47,28 44,24 43,21 Z" fill="#4ADE80" />
              <ellipse cx="40" cy="54" rx="28" ry="29" fill="#EF4444" />
              <ellipse cx="29" cy="42" rx="5" ry="11" fill="#FFFFFF" opacity="0.32" transform="rotate(-25 29 42)" />
            </svg>
          </div>

          <div
            className="shrink-0 flex items-center justify-center pt-6 pb-1 overflow-visible"
            style={{
              animation: 'floatBuoyantDown 2.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate',
              animationDelay: '-0.2s',
              willChange: 'transform'
            }}
          >
            <svg viewBox="0 0 80 80" className="w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 drop-shadow-sm" style={{ overflow: 'visible' }} fill="none">
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

          <div
            className="shrink-0 flex items-center justify-center pt-6 pb-1 overflow-visible scale-105 sm:scale-110"
            style={{
              animation: 'floatBuoyantUp 3.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate',
              animationDelay: '-1.8s',
              willChange: 'transform'
            }}
          >
            <svg viewBox="0 0 120 100" className="w-20 h-16 sm:w-24 sm:h-20 md:w-32 md:h-28 lg:w-40 lg:h-32 drop-shadow-md" style={{ overflow: 'visible' }} fill="none">
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

          <div
            className="shrink-0 flex items-center justify-center pt-6 pb-1 overflow-visible"
            style={{
              animation: 'floatBuoyantDown 2.6s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate',
              animationDelay: '-0.9s',
              willChange: 'transform'
            }}
          >
            <svg viewBox="0 0 80 95" className="w-12 h-14 sm:w-14 sm:h-16 md:w-20 md:h-24 lg:w-24 lg:h-28 drop-shadow-sm" style={{ overflow: 'visible' }} fill="none">
              <path d="M34,24 C34,14 38,12 42,17" stroke="#15803D" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M42,20 C48,15 54,18 52,25 C47,26 44,23 42,20 Z" fill="#22C55E" />
              <circle cx="26" cy="32" r="9.5" fill="#8B5CF6" />
              <circle cx="45" cy="32" r="9.5" fill="#7C3AED" />
              <circle cx="35" cy="46" r="9.5" fill="#6D28D9" />
              <circle cx="53" cy="46" r="9.5" fill="#8B5CF6" />
              <circle cx="44" cy="60" r="9.5" fill="#5B21B6" />
              <circle cx="60" cy="60" r="9.5" fill="#7C3AED" />
              <circle cx="52" cy="74" r="9" fill="#4C1D95" />
              <circle cx="23" cy="30" r="3" fill="#C4B5FD" opacity="0.6" />
            </svg>
          </div>

          <div
            className="shrink-0 flex items-center justify-center pt-6 pb-1 overflow-visible"
            style={{
              animation: 'floatBuoyantUp 2.7s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate',
              animationDelay: '-1.4s',
              willChange: 'transform'
            }}
          >
            <svg viewBox="0 0 80 95" className="w-12 h-14 sm:w-14 sm:h-16 md:w-20 md:h-24 lg:w-24 lg:h-28 drop-shadow-sm" style={{ overflow: 'visible' }} fill="none">
              <path d="M40,16 C30,16 22,26 20,42 C17,58 24,80 40,80 C56,80 63,58 60,42 C58,26 50,16 40,16 Z" fill="#14532D" />
              <path d="M40,20 C32,20 25,29 24,43 C22,57 28,76 40,76 C52,76 58,57 56,43 C55,29 48,20 40,20 Z" fill="#BEF264" />
              <circle cx="40" cy="57" r="16" fill="#FEF08A" />
              <ellipse cx="40" cy="57" rx="12" ry="14" fill="#78350F" />
              <ellipse cx="36" cy="52" rx="3" ry="5" fill="#FFFFFF" opacity="0.4" transform="rotate(-20 36 52)" />
            </svg>
          </div>

          <div
            className="hidden sm:flex shrink-0 items-center justify-center pt-6 pb-1 overflow-visible"
            style={{
              animation: 'floatBuoyantDown 3.0s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate',
              animationDelay: '-0.5s',
              willChange: 'transform'
            }}
          >
            <svg viewBox="0 0 80 90" className="w-12 h-14 sm:w-14 sm:h-16 md:w-20 md:h-24 lg:w-24 lg:h-28 drop-shadow-sm" style={{ overflow: 'visible' }} fill="none">
              <path d="M38,20 C40,12 43,10 44,18" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
              <path d="M26,24 C33,26 38,21 40,24 C42,21 47,26 54,24 C51,28 47,28 45,31 C40,28 35,31 26,24 Z" fill="#22C55E" />
              <path d="M23,30 C20,44 26,62 38,76 C41,79 43,79 45,76 C58,62 63,44 60,30 C53,26 31,26 23,30 Z" fill="#E11D48" />
              <circle cx="34" cy="39" r="1.5" fill="#FDE047" />
              <circle cx="48" cy="40" r="1.5" fill="#FDE047" />
              <circle cx="30" cy="49" r="1.5" fill="#FDE047" />
              <circle cx="42" cy="51" r="1.5" fill="#FDE047" />
              <circle cx="53" cy="50" r="1.5" fill="#FDE047" />
              <circle cx="37" cy="62" r="1.5" fill="#FDE047" />
              <circle cx="47" cy="63" r="1.5" fill="#FDE047" />
            </svg>
          </div>

          <div
            className="hidden md:flex shrink-0 items-center justify-center pt-6 pb-1 overflow-visible"
            style={{
              animation: 'floatBuoyantUp 2.5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate',
              animationDelay: '-1.1s',
              willChange: 'transform'
            }}
          >
            <svg viewBox="0 0 80 80" className="w-12 h-12 md:w-20 md:h-20 lg:w-24 lg:h-24 drop-shadow-sm" style={{ overflow: 'visible' }} fill="none">
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

          <div
            className="hidden lg:flex shrink-0 items-center justify-center pt-6 pb-1 overflow-visible"
            style={{
              animation: 'floatBuoyantDown 2.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate',
              animationDelay: '-0.3s',
              willChange: 'transform'
            }}
          >
            <svg viewBox="0 0 80 90" className="w-12 h-14 md:w-20 md:h-24 lg:w-24 lg:h-28 drop-shadow-sm" style={{ overflow: 'visible' }} fill="none">
              <path d="M38,22 C40,14 43,12 45,24" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M43,21 C53,16 58,20 54,28 C47,28 44,24 43,21 Z" fill="#4ADE80" />
              <ellipse cx="40" cy="54" rx="28" ry="29" fill="#EF4444" />
              <ellipse cx="29" cy="42" rx="5" ry="11" fill="#FFFFFF" opacity="0.32" transform="rotate(-25 29 42)" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
