import React, { useState, useEffect, useRef } from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

export const MainHeaderNavigation = ({
  searchQueryString,
  onSearchChange,
  activePageIdentifier,
  onNavigateToPage,
  onSelectDepartment,
  storeInitialDepartmentKey = 'todos'
}) => {
  const { totalItemsCount, openCartDrawer } = useShoppingCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const menuCloseTimerReference = useRef(null);

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



  return (
    <>
      {isMobileMenuOpen && (
        <div
          className={`fixed inset-0 z-30 bg-neutral-950/50 backdrop-blur-sm lg:hidden transition-opacity duration-200 ${
            isMenuClosing ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={closeMenu}
        />
      )}

      <div id="tour-header-wrapper" className="w-full bg-white border-b border-neutral-100 relative z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
          <div className="h-14 sm:h-18 flex items-center justify-between gap-2.5 sm:gap-6">
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                id="tour-mobile-menu-btn"
                type="button"
                onClick={() => (isMobileMenuOpen ? closeMenu() : openMenu())}
                className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/90 text-neutral-800 transition-colors cursor-pointer active:scale-95 shadow-2xs"
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
                className="flex items-center gap-2.5 text-left cursor-pointer"
              >
                <img
                  src="/images/queseria_san_juaquin_logo.png"
                  alt="Quesería San Joaquín Logo"
                  className="w-9 h-9 sm:w-11 sm:h-11 object-contain transition-transform hover:scale-105"
                />
                <div className="flex flex-col">
                  <span className="font-sans font-black text-sm sm:text-base lg:text-lg text-neutral-900 tracking-tight uppercase leading-tight">
                    Quesería San Joaquín
                  </span>
                  <span className="text-[9px] sm:text-[10.5px] font-bold text-[#C27803] tracking-widest uppercase">
                    Mercado &amp; Charcutería
                  </span>
                </div>
              </button>
            </div>

            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <div className="w-full relative flex items-center">
                <span className="material-symbols-outlined text-neutral-400 absolute left-4 text-xl pointer-events-none">
                  search
                </span>
                <input
                  id="tour-search-bar"
                  className="w-full bg-neutral-50/90 border border-neutral-200/90 rounded-full pl-11 pr-28 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#114B2B] focus:border-transparent transition-all shadow-2xs"
                  placeholder="Buscar víveres, quesos llaneros, jamones, café, refrescos..."
                  type="text"
                  value={searchQueryString}
                  onChange={handleSearchInputChange}
                />
                {searchQueryString ? (
                  <button
                    type="button"
                    onClick={handleClearSearchQuery}
                    className="absolute right-3.5 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                    aria-label="Limpiar búsqueda"
                  >
                    <span className="material-symbols-outlined text-xl">cancel</span>
                  </button>
                ) : (
                  <div className="absolute right-3 pointer-events-none">
                    <span className="text-[10px] font-black tracking-wider text-neutral-400 bg-white border border-neutral-200/90 px-2.5 py-1 rounded-full shadow-2xs uppercase">
                      Maracaibo
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                id="tour-cart-button"
                onClick={openCartDrawer}
                className="relative inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#114B2B] hover:bg-[#0d3b22] text-white text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                aria-label="Abrir mi lista de compras"
              >
                <span className="material-symbols-outlined text-lg sm:text-xl">shopping_cart</span>
                <span className="hidden sm:inline">Mi Lista</span>
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-black rounded-full bg-[#E8590C] text-white shadow-xs">
                  {totalItemsCount}
                </span>
              </button>
            </div>
          </div>

          <div className="lg:hidden pb-2.5 pt-0.5">
            <div className="w-full relative flex items-center">
              <span className="material-symbols-outlined text-neutral-400 absolute left-3.5 text-lg pointer-events-none">
                search
              </span>
              <input
                id="mobile-header-search-input"
                className="w-full bg-neutral-50/90 border border-neutral-200/90 rounded-xl pl-10 pr-24 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#114B2B] transition-all shadow-2xs"
                placeholder="Busca queso telita, jamón ahumado, harina..."
                type="text"
                value={searchQueryString}
                onChange={handleSearchInputChange}
              />
              {searchQueryString ? (
                <button
                  type="button"
                  onClick={handleClearSearchQuery}
                  className="absolute right-3 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                  aria-label="Limpiar búsqueda"
                >
                  <span className="material-symbols-outlined text-lg">cancel</span>
                </button>
              ) : (
                <div className="absolute right-2.5 pointer-events-none">
                  <span className="text-[9px] font-black tracking-wider text-neutral-400 bg-white border border-neutral-200/90 px-2 py-0.5 rounded-md shadow-2xs uppercase">
                    Maracaibo
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <nav className="hidden lg:block w-full bg-[#114B2B] text-white">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 h-11 flex items-center justify-start gap-8">
            {navigationMenuItems.map((menuItem) => {
              const isItemActive = activePageIdentifier === menuItem.pageKey;
              const borderActiveClass = isItemActive
                ? 'border-white text-white font-extrabold'
                : 'border-transparent text-white/80 hover:text-white font-semibold';

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
            <nav className="max-w-7xl mx-auto px-3 pt-2 pb-1">
              {navigationMenuItems.map((menuItem) => {
                const isItemActive = activePageIdentifier === menuItem.pageKey;
                return (
                  <button
                    key={menuItem.pageKey}
                    onClick={() => handleNavigationSelect(menuItem.pageKey)}
                    className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer ${
                      isItemActive
                        ? 'bg-[#114B2B] text-white'
                        : 'text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100'
                    }`}
                  >
                    {menuItem.labelText}
                  </button>
                );
              })}
            </nav>

            <div className="max-w-7xl mx-auto px-3 pt-1 pb-3">
              <a
                href={directWhatsAppHelpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors"
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
