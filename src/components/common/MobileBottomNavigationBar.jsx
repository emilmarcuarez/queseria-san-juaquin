import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useShoppingCart } from '../../hooks/useShoppingCart';
import productsCatalogData from '../../data/productsCatalogData.json';

export const MobileBottomNavigationBar = ({
  activePageIdentifier,
  onNavigateToPage,
  onSelectProduct
}) => {
  const {
    totalItemsCount,
    openCartDrawer,
    exchangeRateBcv,
    exchangeRateDateString,
    addProductToCart,
    preferredCurrency,
    togglePreferredCurrency
  } = useShoppingCart();

  const [isDollarModalOpen, setIsDollarModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const searchInputReference = useRef(null);

  useEffect(() => {
    if (isSearchModalOpen && searchInputReference.current) {
      setTimeout(() => {
        searchInputReference.current?.focus();
      }, 150);
    }
  }, [isSearchModalOpen]);

  const handleNavigateHome = () => {
    onNavigateToPage('inicio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateStore = () => {
    onNavigateToPage('tienda');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSearch = () => {
    setIsSearchModalOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchModalOpen(false);
    setMobileSearchQuery('');
  };

  const handleOpenDollarModal = () => {
    setIsDollarModalOpen(true);
  };

  const handleCloseDollarModal = () => {
    setIsDollarModalOpen(false);
  };

  const formattedExchangeRateBcv = typeof exchangeRateBcv === 'number'
    ? exchangeRateBcv.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '866,56';

  const formattedExchangeRateDate = (() => {
    if (!exchangeRateDateString || typeof exchangeRateDateString !== 'string') {
      return '';
    }
    if (exchangeRateDateString.includes('T')) {
      const dateSection = exchangeRateDateString.split('T')[0];
      const datePieces = dateSection.split('-');
      if (datePieces.length === 3) {
        const [yearValue, monthValue, dayValue] = datePieces;
        return `${dayValue}/${monthValue}/${yearValue}`;
      }
    }
    if (exchangeRateDateString.includes('-')) {
      const datePieces = exchangeRateDateString.split('-');
      if (datePieces.length === 3) {
        const [yearValue, monthValue, dayValue] = datePieces;
        return `${dayValue}/${monthValue}/${yearValue}`;
      }
    }
    return exchangeRateDateString;
  })();

  const matchingSearchResults = mobileSearchQuery.trim() === ''
    ? []
    : productsCatalogData.filter((productItem) => {
        const normalizedSearchQuery = mobileSearchQuery.toLowerCase();
        const matchesTitle = productItem.productTitle.toLowerCase().includes(normalizedSearchQuery);
        const matchesCategory = (productItem.productCategoryName || '').toLowerCase().includes(normalizedSearchQuery);
        const matchesDescription = (productItem.productDescription || '').toLowerCase().includes(normalizedSearchQuery);
        return matchesTitle || matchesCategory || matchesDescription;
      }).slice(0, 8);

  const frequentSearchKeywords = [
    'Queso Llanero',
    'Paisa',
    'Jamón Plumrose',
    'Harina PAN',
    'Nata Criolla',
    'Café',
    'Margarina'
  ];

  const configuredPhoneNumber = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER || '584146770016';
  const cleanDestinationNumber = configuredPhoneNumber.replace(/[^\d]/g, '');
  const directWhatsAppHelpUrl = `https://wa.me/${cleanDestinationNumber}?text=${encodeURIComponent('Hola Quesería San Joaquín! Necesito hacer una consulta sobre un pedido.')}`;

  return (
    <>
      <a
        href={directWhatsAppHelpUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-[136px] right-4 z-35 lg:hidden w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        aria-label="Contactar por WhatsApp"
      >
        <span className="material-symbols-outlined text-2xl">chat</span>
      </a>

      <nav
        aria-label="Navegación principal para móviles"
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#114B2B] border-t border-[#0e3d23] shadow-2xl px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around"
      >
        <button
          type="button"
          onClick={handleNavigateHome}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
            activePageIdentifier === 'inicio' ? 'text-white' : 'text-emerald-100/75 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-2xl leading-none">home</span>
          <span className={`text-[10px] mt-1 ${activePageIdentifier === 'inicio' ? 'font-black' : 'font-medium'}`}>
            Inicio
          </span>
        </button>

        <button
          type="button"
          onClick={handleOpenDollarModal}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
            preferredCurrency === 'BS' ? 'text-white' : 'text-emerald-100/75 hover:text-white'
          }`}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center leading-none transition-colors ${
            preferredCurrency === 'BS'
              ? 'bg-white text-[#114B2B] font-black shadow-xs'
              : 'border border-white/70 text-white font-bold'
          }`}>
            <span className="text-xs leading-none">{preferredCurrency === 'BS' ? 'Bs' : '$'}</span>
          </div>
          <span className={`text-[10px] mt-1 ${preferredCurrency === 'BS' ? 'font-black' : 'font-medium'}`}>
            {preferredCurrency === 'BS' ? 'Moneda Bs' : 'Dólar'}
          </span>
        </button>

        <button
          type="button"
          onClick={handleOpenSearch}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-emerald-100/75 hover:text-white transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl leading-none">search</span>
          <span className="text-[10px] font-medium mt-1">
            Buscar
          </span>
        </button>

        <button
          type="button"
          onClick={handleNavigateStore}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
            activePageIdentifier === 'tienda' ? 'text-white' : 'text-emerald-100/75 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-2xl leading-none">storefront</span>
          <span className={`text-[10px] mt-1 ${activePageIdentifier === 'tienda' ? 'font-black' : 'font-medium'}`}>
            Catálogo
          </span>
        </button>

        <button
          type="button"
          onClick={openCartDrawer}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-emerald-100/75 hover:text-white transition-colors cursor-pointer relative"
        >
          <div className="relative leading-none">
            <span className="material-symbols-outlined text-2xl leading-none">shopping_cart</span>
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 bg-white text-[#114B2B] text-[9.5px] font-black rounded-full flex items-center justify-center shadow-xs">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-1">
            Mi Lista
          </span>
        </button>
      </nav>

      {isDollarModalOpen && createPortal(
        <div
          onClick={handleCloseDollarModal}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
        >
          <div
            onClick={(clickEvent) => clickEvent.stopPropagation()}
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl animate-slideDownDrawer sm:animate-none flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
          >
            <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto sm:hidden" />

            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#114B2B] flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">payments</span>
                </div>
                <div>
                  <h3 className="text-base font-black text-neutral-900 leading-tight">
                    Moneda de la Tienda
                  </h3>
                  <span className="text-[11px] text-neutral-500 font-medium">
                    Precios en Bolívares o Dólares
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseDollarModal}
                className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 flex items-center justify-center cursor-pointer"
                aria-label="Cerrar selector de moneda"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
              <span className="text-xs font-black text-neutral-800 uppercase tracking-wider block mb-2.5">
                Selecciona cómo ver los precios
              </span>

              <div className="grid grid-cols-2 gap-2 bg-neutral-200/70 p-1.5 rounded-xl">
                <button
                  type="button"
                  onClick={() => togglePreferredCurrency('USD')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    preferredCurrency === 'USD'
                      ? 'bg-white text-[#114B2B] shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <span className="text-sm leading-none font-black">$</span>
                  <span>Dólares (USD)</span>
                </button>

                <button
                  type="button"
                  onClick={() => togglePreferredCurrency('BS')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    preferredCurrency === 'BS'
                      ? 'bg-[#114B2B] text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <span className="text-sm leading-none font-black">Bs.</span>
                  <span>Bolívares (BCV)</span>
                </button>
              </div>

              <p className="text-[11px] text-neutral-500 font-medium mt-2.5 leading-tight">
                {preferredCurrency === 'BS'
                  ? '✓ Mostrando precios principales en Bolívares (Bs.) calculados a la tasa oficial del día.'
                  : '✓ Mostrando precios principales en Dólares ($ USD) con referencia en Bolívares.'}
              </p>
            </div>

            <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10.5px] font-bold text-emerald-900 uppercase tracking-wider block">
                  Tasa Oficial BCV
                </span>
                <span className="text-[10.5px] text-emerald-700 font-medium">
                  {formattedExchangeRateDate ? `Actualizada al ${formattedExchangeRateDate}` : 'Banco Central de Venezuela'}
                </span>
              </div>
              <div className="text-base sm:text-lg font-black text-[#114B2B]">
                Bs. {formattedExchangeRateBcv}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCloseDollarModal}
              className="w-full py-3 rounded-xl bg-[#114B2B] hover:bg-[#0d3b22] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
            >
              Listo
            </button>
          </div>
        </div>,
        document.body
      )}

      {isSearchModalOpen && createPortal(
        <div
          onClick={handleCloseSearch}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
        >
          <div
            onClick={(clickEvent) => clickEvent.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-b-3xl sm:rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-4 max-h-[85vh]"
          >
            <div className="flex items-center gap-2">
              <div className="relative flex-1 flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-xl text-neutral-400 pointer-events-none">
                  search
                </span>
                <input
                  ref={searchInputReference}
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(inputChangeEvent) => setMobileSearchQuery(inputChangeEvent.target.value)}
                  placeholder="Buscar quesos, jamones, café, harinas..."
                  className="w-full bg-neutral-100 border-none rounded-xl pl-10 pr-9 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#114B2B]"
                />
                {mobileSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setMobileSearchQuery('')}
                    className="absolute right-3 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">cancel</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleCloseSearch}
                className="px-3 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer"
              >
                Cerrar
              </button>
            </div>

            {mobileSearchQuery.trim() === '' ? (
              <div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                  Búsquedas Frecuentes
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {frequentSearchKeywords.map((keywordItem) => (
                    <button
                      key={keywordItem}
                      type="button"
                      onClick={() => setMobileSearchQuery(keywordItem)}
                      className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-xs font-medium text-neutral-700 transition-colors cursor-pointer"
                    >
                      {keywordItem}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[60vh] space-y-2 pr-1">
                {matchingSearchResults.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-4xl text-neutral-300">
                      sentiment_dissatisfied
                    </span>
                    <p className="text-xs text-neutral-500 mt-2 font-medium">
                      No encontramos productos para &quot;{mobileSearchQuery}&quot;
                    </p>
                  </div>
                ) : (
                  matchingSearchResults.map((searchProductItem) => (
                    <div
                      key={searchProductItem.productIdentifier}
                      onClick={() => {
                        handleCloseSearch();
                        if (onSelectProduct) {
                          onSelectProduct(searchProductItem);
                        }
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer border border-neutral-100"
                    >
                      <img
                        src={searchProductItem.productImage}
                        alt={searchProductItem.productTitle}
                        className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-neutral-200 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-neutral-900 truncate">
                          {searchProductItem.productTitle}
                        </h4>
                        <span className="text-[10px] text-neutral-500 block">
                          ${searchProductItem.productPriceUsd.toFixed(2)} / {searchProductItem.productPriceUnit}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(clickEvent) => {
                          clickEvent.stopPropagation();
                          addProductToCart(searchProductItem, 1, 1);
                        }}
                        className="w-8 h-8 rounded-lg bg-[#114B2B] text-white flex items-center justify-center shrink-0 cursor-pointer"
                        aria-label="Agregar al carrito"
                      >
                        <span className="material-symbols-outlined text-base">add</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
