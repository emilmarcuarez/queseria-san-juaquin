import React, { useState, useEffect } from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

export const MainHeaderNavigation = ({
  searchQueryString,
  onSearchChange,
  activePageIdentifier,
  onNavigateToPage
}) => {
  const { totalItemsCount, openCartDrawer } = useShoppingCart();
  const [isMobileMenuDrawerOpen, setIsMobileMenuDrawerOpen] = useState(false);

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

  const configuredPhoneNumber = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER || '584146770016';
  const cleanDestinationNumber = configuredPhoneNumber.replace(/[^\d]/g, '');
  const directWhatsAppHelpUrl = `https://wa.me/${cleanDestinationNumber}?text=${encodeURIComponent('Hola Quesería San Joaquín! Necesito asistencia con un pedido.')}`;

  const navigationMenuItems = [
    { labelText: 'Inicio', pageKey: 'inicio', iconName: 'home' },
    { labelText: 'Tienda', pageKey: 'tienda', iconName: 'storefront' },
    { labelText: 'Nosotros', pageKey: 'nosotros', iconName: 'info' },
    { labelText: 'Contáctanos', pageKey: 'contacto', iconName: 'support_agent' }
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
    <div className="w-full bg-white border-b border-neutral-100 relative z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuDrawerOpen(true)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-neutral-200 text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer active:scale-95"
              aria-label="Abrir menú de navegación"
              aria-expanded={isMobileMenuDrawerOpen}
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
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

      <div
        onClick={() => setIsMobileMenuDrawerOpen(false)}
        className={`fixed inset-0 bg-neutral-950/60 backdrop-blur-xs z-50 transition-opacity duration-300 ease-out lg:hidden ${
          isMobileMenuDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <div
        className={`fixed inset-y-0 left-0 w-[82%] max-w-xs bg-white text-neutral-900 z-50 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out lg:hidden ${
          isMobileMenuDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
            <div className="flex items-center gap-2.5">
              <img
                src="/images/queseria_san_juaquin_logo.png"
                alt="Quesería San Joaquín"
                className="w-9 h-9 object-contain"
              />
              <div>
                <span className="font-extrabold text-sm text-[#114B2B] tracking-tight uppercase block leading-tight">
                  Quesería San Joaquín
                </span>
                <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
                  Mercado &amp; Charcutería
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuDrawerOpen(false)}
              className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer active:scale-95"
              aria-label="Cerrar menú"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <div className="px-3 py-4 space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-3 block mb-2">
              Secciones
            </span>
            {navigationMenuItems.map((menuItem) => {
              const isItemActive = activePageIdentifier === menuItem.pageKey;
              return (
                <button
                  key={menuItem.pageKey}
                  onClick={() => handleNavigationSelect(menuItem.pageKey)}
                  className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isItemActive
                      ? 'bg-[#114B2B] text-white shadow-xs'
                      : 'text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-lg opacity-80">
                      {menuItem.iconName}
                    </span>
                    <span>{menuItem.labelText}</span>
                  </div>
                  <span className="material-symbols-outlined text-sm opacity-50">chevron_right</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 space-y-3">
          <a
            href={directWhatsAppHelpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-base">chat</span>
            <span>Asistencia WhatsApp</span>
          </a>

          <div className="text-[10.5px] text-neutral-500 text-center space-y-0.5">
            <span className="block font-medium">Av. 10 con Calle 66, Maracaibo</span>
            <span className="block text-[10px] text-neutral-400">Lun-Vie 7am-7pm | Sáb 7am-6pm</span>
          </div>
        </div>
      </div>
    </div>
  );
};
