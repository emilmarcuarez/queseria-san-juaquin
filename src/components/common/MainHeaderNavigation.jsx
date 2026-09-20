import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

export const MainHeaderNavigation = ({
  searchQueryString,
  onSearchChange,
  activePageIdentifier,
  onNavigateToPage
}) => {
  const { totalItemsCount, openCartDrawer } = useShoppingCart();
  const [isMobileMenuDrawerOpen, setIsMobileMenuDrawerOpen] = useState(false);
  const mobileMenuDrawerRef = useRef(null);
  const [drawerBottomPosition, setDrawerBottomPosition] = useState(null);

  useEffect(() => {
    if (isMobileMenuDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuDrawerOpen]);

  useLayoutEffect(() => {
    if (isMobileMenuDrawerOpen) {
      const updateDrawerPosition = () => {
        if (mobileMenuDrawerRef.current) {
          const drawerBoundingRectangle = mobileMenuDrawerRef.current.getBoundingClientRect();
          setDrawerBottomPosition(drawerBoundingRectangle.bottom);
        }
      };

      updateDrawerPosition();
      window.addEventListener('resize', updateDrawerPosition);
      return () => {
        window.removeEventListener('resize', updateDrawerPosition);
      };
    } else {
      setDrawerBottomPosition(null);
    }
  }, [isMobileMenuDrawerOpen]);

  const configuredPhoneNumber = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER || '584147675878';
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
    setIsMobileMenuDrawerOpen(false);
    onNavigateToPage('inicio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigationSelect = (targetPageKey) => {
    setIsMobileMenuDrawerOpen(false);
    onNavigateToPage(targetPageKey);
  };

  return (
    <div className="w-full bg-white border-b border-neutral-100 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuDrawerOpen(!isMobileMenuDrawerOpen)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-neutral-200 text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
              aria-label="Alternar menú de navegación"
              aria-expanded={isMobileMenuDrawerOpen}
            >
              <span className="material-symbols-outlined text-2xl">
                {isMobileMenuDrawerOpen ? 'close' : 'menu'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleBrandLogoClick}
              className="flex items-center gap-2.5 sm:gap-3 text-left cursor-pointer"
            >
              <img
                src="/images/queseria_san_juaquin_logo.png"
                alt="Quesería San Joaquín Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain transition-transform hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-sm sm:text-lg lg:text-xl text-[#114B2B] tracking-tight uppercase leading-tight">
                  Quesería San Joaquín
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-neutral-500 tracking-wider uppercase">
                  Mercado &amp; Charcutería
                </span>
              </div>
            </button>
          </div>

          {activePageIdentifier !== 'tienda' ? (
            <div className="hidden lg:flex flex-1 max-w-2xl mx-6">
              <div className="w-full relative flex items-center">
                <span className="material-symbols-outlined text-neutral-400 absolute left-3.5 text-xl pointer-events-none">
                  search
                </span>
                <input
                  id="desktop-header-search-input"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-11 pr-10 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#114B2B] focus:border-transparent transition-all"
                  placeholder="Buscar víveres, quesos llaneros, jamones, café, refrescos..."
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
                    <span className="material-symbols-outlined text-xl">cancel</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex flex-1" />
          )}

          <div className="hidden sm:flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              id="desktop-header-cart-button"
              onClick={openCartDrawer}
              className="relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#114B2B] hover:bg-[#0d3b22] text-white text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer active:scale-95"
              aria-label="Abrir mi lista de compras"
            >
              <span className="material-symbols-outlined text-lg sm:text-xl">shopping_cart</span>
              <span>Mi Lista</span>
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-black rounded-full bg-white text-[#114B2B] shadow-xs">
                {totalItemsCount}
              </span>
            </button>
          </div>
        </div>

        {activePageIdentifier !== 'tienda' && (
          <div className="lg:hidden pb-3 pt-1">
            <div className="w-full relative flex items-center">
              <span className="material-symbols-outlined text-neutral-400 absolute left-3.5 text-lg pointer-events-none">
                search
              </span>
              <input
                id="mobile-header-search-input"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-9 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#114B2B] focus:border-transparent transition-all"
                placeholder="Buscar víveres, quesos, jamones..."
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
        )}
      </div>

      <nav className="hidden lg:block w-full bg-[#114B2B] text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-11 flex items-center justify-start gap-8">
          {navigationMenuItems.map((menuItem) => {
            const isItemActive = activePageIdentifier === menuItem.pageKey;
            const borderActiveClass = isItemActive
              ? 'border-white text-white font-extrabold'
              : 'border-transparent text-white/80 hover:text-white font-semibold';

            return (
              <button
                key={menuItem.pageKey}
                onClick={() => handleNavigationSelect(menuItem.pageKey)}
                className={`text-xs uppercase tracking-wider transition-colors cursor-pointer py-2 border-b-2 active:scale-95 ${borderActiveClass}`}
              >
                {menuItem.labelText}
              </button>
            );
          })}
        </div>
      </nav>

      {isMobileMenuDrawerOpen && (
        <div className="lg:hidden">
          <div
            ref={mobileMenuDrawerRef}
            className="relative z-50 bg-[#114B2B] text-white shadow-2xl border-t border-[#0d3b22]"
          >
            <div className="px-5 py-4 space-y-3">
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest block">
                Navegación
              </span>
              <div className="flex flex-col gap-2">
                {navigationMenuItems.map((menuItem) => {
                  const isItemActive = activePageIdentifier === menuItem.pageKey;
                  return (
                    <button
                      key={menuItem.pageKey}
                      onClick={() => handleNavigationSelect(menuItem.pageKey)}
                      className={`flex items-center justify-between text-left py-2 px-3 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                        isItemActive ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10'
                      }`}
                    >
                      <span>{menuItem.labelText}</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-white flex flex-col gap-2.5">
              <a
                href={directWhatsAppHelpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                <span>Asistencia WhatsApp</span>
              </a>
            </div>
          </div>

          {drawerBottomPosition !== null && (
            <div
              onClick={() => setIsMobileMenuDrawerOpen(false)}
              className="fixed inset-x-0 bottom-0 bg-black/60 backdrop-blur-md z-40 cursor-pointer"
              style={{ top: `${drawerBottomPosition}px` }}
            />
          )}
        </div>
      )}
    </div>
  );
};
