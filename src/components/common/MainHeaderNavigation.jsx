import React, { useState, useEffect, useRef } from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

export const MainHeaderNavigation = ({
  searchQueryString,
  onSearchChange,
  activePageIdentifier,
  onNavigateToPage
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const menuCloseTimerReference = useRef(null);

  const {
    totalItemsCount,
    openCartDrawer,
    preferredCurrency,
    togglePreferredCurrency,
    exchangeRateBcv
  } = useShoppingCart();

  const openMenu = () => {
    clearTimeout(menuCloseTimerReference.current);
    setIsMenuClosing(false);
    setIsMobileMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuClosing(true);
    menuCloseTimerReference.current = setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsMenuClosing(false);
    }, 200);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      clearTimeout(menuCloseTimerReference.current);
    };
  }, [isMobileMenuOpen]);

  const configuredPhoneNumber = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER || '584146770016';
  const cleanDestinationNumber = configuredPhoneNumber.replace(/[^\d]/g, '');
  const directWhatsAppHelpUrl = `https://wa.me/${cleanDestinationNumber}?text=${encodeURIComponent('Hola Quesería San Joaquín! Necesito asistencia con un pedido.')}`;

  const navigationMenuItems = [
    { labelText: 'Inicio', pageKey: 'inicio' },
    { labelText: 'Tienda', pageKey: 'tienda' },
    { labelText: 'Nosotros', pageKey: 'nosotros' },
    { labelText: 'Contáctanos', pageKey: 'contacto' }
  ];

  const handleSearchInputChange = (inputChangeEvent) => {
    if (activePageIdentifier !== 'tienda') {
      onNavigateToPage('tienda');
    }
    onSearchChange(inputChangeEvent.target.value);
  };

  const handleClearSearchQuery = () => {
    onSearchChange('');
  };

  const handleBrandLogoClick = (clickEvent) => {
    clickEvent.preventDefault();
    closeMenu();
    onNavigateToPage('inicio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigationSelect = (targetPageKey) => {
    closeMenu();
    onNavigateToPage(targetPageKey);
  };

  const formattedExchangeRate = typeof exchangeRateBcv === 'number'
    ? exchangeRateBcv.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '866,56';

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className={`fixed inset-0 z-30 bg-neutral-950/40 backdrop-blur-xs lg:hidden transition-opacity duration-200 ${
            isMenuClosing ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={closeMenu}
        />
      )}

      <div id="tour-header-wrapper" className="w-full bg-white border-b border-neutral-100 relative z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
          <div className="h-14 lg:h-16 flex items-center justify-between gap-3 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                id="tour-mobile-menu-btn"
                type="button"
                onClick={() => (isMobileMenuOpen ? closeMenu() : openMenu())}
                className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-neutral-100 text-neutral-800 transition-colors cursor-pointer active:scale-95"
                aria-label="Abrir menú de navegación"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="material-symbols-outlined text-2xl">
                  {isMobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleBrandLogoClick}
                className="flex items-center gap-2 text-left cursor-pointer"
              >
                <img
                  src="/images/queseria_san_juaquin_logo.png"
                  alt="Quesería San Joaquín"
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain transition-transform hover:scale-105"
                />
                <span className="font-sans font-black text-sm sm:text-base lg:text-lg text-neutral-900 tracking-tight leading-tight">
                  Quesería San Joaquín
                </span>
              </button>
            </div>

            <div className="hidden lg:flex flex-1 max-w-xl mx-6">
              <div className="w-full relative flex items-center">
                <span className="material-symbols-outlined text-neutral-400 absolute left-4 text-lg pointer-events-none">
                  search
                </span>
                <input
                  id="tour-search-bar"
                  className="w-full bg-neutral-50 border border-neutral-200/90 rounded-full pl-10 pr-9 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#8DC63F] focus:border-[#8DC63F] transition-all"
                  placeholder="Buscar productos..."
                  type="text"
                  value={searchQueryString}
                  onChange={handleSearchInputChange}
                />
                {searchQueryString && (
                  <button
                    type="button"
                    onClick={handleClearSearchQuery}
                    className="absolute right-3 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                    aria-label="Limpiar búsqueda"
                  >
                    <span className="material-symbols-outlined text-lg">cancel</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => togglePreferredCurrency()}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                title="Cambiar moneda de visualización"
              >
                <span className="w-5 h-5 rounded-md bg-[#F2F9E6] flex items-center justify-center text-xs font-black text-[#4C821D]">
                  {preferredCurrency === 'BS' ? 'Bs' : '$'}
                </span>
                <span className="hidden xl:inline text-neutral-500 font-medium">Tasa BCV:</span>
                <span className="font-bold text-neutral-900">Bs. {formattedExchangeRate}</span>
              </button>

              <button
                type="button"
                onClick={() => togglePreferredCurrency()}
                className="sm:hidden w-8 h-8 rounded-lg border border-neutral-300 text-neutral-800 flex items-center justify-center font-bold text-xs hover:bg-neutral-50 transition-colors cursor-pointer"
                aria-label="Alternar moneda"
              >
                <span>{preferredCurrency === 'BS' ? 'Bs' : '$'}</span>
              </button>

              <button
                type="button"
                onClick={openCartDrawer}
                className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg hover:bg-neutral-50 text-neutral-800 transition-colors cursor-pointer"
                aria-label="Ver carrito de compras"
              >
                <span className="material-symbols-outlined text-2xl sm:text-[26px]">
                  shopping_cart
                </span>
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#8DC63F] text-[#062612] text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                  {totalItemsCount}
                </span>
              </button>
            </div>
          </div>
        </div>

        <nav className="hidden lg:block w-full bg-white border-t border-neutral-100">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 h-10 flex items-center justify-start gap-8">
            {navigationMenuItems.map((menuItem) => {
              const isItemActive = activePageIdentifier === menuItem.pageKey;
              const borderActiveClass = isItemActive
                ? 'border-[#8DC63F] text-[#062612] font-black'
                : 'border-transparent text-neutral-600 hover:text-[#437521] font-semibold';

              return (
                <button
                  key={menuItem.pageKey}
                  id={menuItem.pageKey === 'tienda' ? 'tour-nav-store' : undefined}
                  onClick={() => handleNavigationSelect(menuItem.pageKey)}
                  className={`text-xs uppercase tracking-wider transition-colors cursor-pointer py-2 border-b-2 active:scale-95 ${borderActiveClass}`}
                >
                  {menuItem.labelText}
                </button>
              );
            })}
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className={`lg:hidden border-t border-neutral-100 bg-white ${
            isMenuClosing ? 'animate-slideUpDrawer' : 'animate-slideDownDrawer'
          }`}>
            <nav className="max-w-7xl mx-auto px-4 pt-3 pb-2 space-y-1">
              {navigationMenuItems.map((menuItem) => {
                const isItemActive = activePageIdentifier === menuItem.pageKey;
                return (
                  <button
                    key={menuItem.pageKey}
                    onClick={() => handleNavigationSelect(menuItem.pageKey)}
                    className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer ${
                      isItemActive
                        ? 'bg-[#F2F9E6] text-[#062612] font-black'
                        : 'text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100'
                    }`}
                  >
                    {menuItem.labelText}
                  </button>
                );
              })}
            </nav>

            <div className="max-w-7xl mx-auto px-4 pt-1 pb-4">
              <a
                href={directWhatsAppHelpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Asistencia por WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
