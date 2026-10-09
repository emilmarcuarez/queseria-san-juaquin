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

  const [isDollarModalMounted, setIsDollarModalMounted] = useState(false);
  const [isDollarModalVisible, setIsDollarModalVisible] = useState(false);
  const dollarCloseTimerReference = useRef(null);

  const [isSearchModalMounted, setIsSearchModalMounted] = useState(false);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const searchCloseTimerReference = useRef(null);

  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const searchInputReference = useRef(null);

  useEffect(() => {
    if (isSearchModalVisible && searchInputReference.current) {
      const focusTimer = setTimeout(() => {
        searchInputReference.current?.focus();
      }, 160);
      return () => clearTimeout(focusTimer);
    }
  }, [isSearchModalVisible]);

  useEffect(() => {
    return () => {
      clearTimeout(searchCloseTimerReference.current);
      clearTimeout(dollarCloseTimerReference.current);
    };
  }, []);

  const handleNavigateHome = () => {
    onNavigateToPage('inicio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateStore = () => {
    onNavigateToPage('tienda');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSearch = () => {
    clearTimeout(searchCloseTimerReference.current);
    setIsSearchModalMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsSearchModalVisible(true);
      });
    });
  };

  const handleCloseSearch = () => {
    setIsSearchModalVisible(false);
    searchCloseTimerReference.current = setTimeout(() => {
      setIsSearchModalMounted(false);
      setMobileSearchQuery('');
    }, 280);
  };

  const handleOpenDollarModal = () => {
    clearTimeout(dollarCloseTimerReference.current);
    setIsDollarModalMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsDollarModalVisible(true);
      });
    });
  };

  const handleCloseDollarModal = () => {
    setIsDollarModalVisible(false);
    dollarCloseTimerReference.current = setTimeout(() => {
      setIsDollarModalMounted(false);
    }, 280);
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

  return (
    <>
      <nav
        aria-label="Navegación principal para móviles"
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-neutral-200/80 shadow-lg px-2 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around"
      >
        <button
          type="button"
          onClick={handleNavigateHome}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
            activePageIdentifier === 'inicio' ? 'text-[#3B7011]' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <span className="material-symbols-outlined text-2xl leading-none">home</span>
          <span className={`text-[10px] mt-0.5 ${activePageIdentifier === 'inicio' ? 'font-black' : 'font-medium'}`}>
            Inicio
          </span>
        </button>

        <button
          type="button"
          onClick={handleOpenDollarModal}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
            preferredCurrency === 'BS' ? 'text-[#3B7011]' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <div className={`w-5 h-5 rounded-full flex items-center justify-center leading-none transition-colors ${
            preferredCurrency === 'BS'
              ? 'bg-[#8DC63F] text-[#062612] font-black shadow-2xs'
              : 'border border-neutral-300 text-neutral-600 font-bold'
          }`}>
            <span className="text-[10px] leading-none">{preferredCurrency === 'BS' ? 'Bs' : '$'}</span>
          </div>
          <span className={`text-[10px] mt-0.5 ${preferredCurrency === 'BS' ? 'font-black' : 'font-medium'}`}>
            {preferredCurrency === 'BS' ? 'Moneda Bs' : 'Dólar'}
          </span>
        </button>

        <button
          type="button"
          onClick={handleOpenSearch}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl leading-none">search</span>
          <span className="text-[10px] font-medium mt-0.5">
            Buscar
          </span>
        </button>

        <button
          type="button"
          onClick={handleNavigateStore}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
            activePageIdentifier === 'tienda' ? 'text-[#3B7011]' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <span className="material-symbols-outlined text-2xl leading-none">storefront</span>
          <span className={`text-[10px] mt-0.5 ${activePageIdentifier === 'tienda' ? 'font-black' : 'font-medium'}`}>
            Catálogo
          </span>
        </button>

        <button
          type="button"
          onClick={openCartDrawer}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer relative"
        >
          <div className="relative leading-none">
            <span className="material-symbols-outlined text-2xl leading-none">shopping_cart</span>
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 bg-[#8DC63F] text-[#062612] text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-0.5">
            Carrito
          </span>
        </button>
      </nav>

      {isDollarModalMounted && createPortal(
        <div
          onClick={handleCloseDollarModal}
          className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 transition-opacity duration-300 ${
            isDollarModalVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            onClick={(clickEvent) => clickEvent.stopPropagation()}
            className={`w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto transition-all duration-300 ease-out transform ${
              isDollarModalVisible
                ? 'translate-y-0 opacity-100 scale-100'
                : 'translate-y-12 sm:translate-y-6 opacity-0 scale-95'
            }`}
          >
            <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto sm:hidden" />

            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
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
                      ? 'bg-white text-emerald-800 shadow-xs'
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
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <span className="text-sm leading-none font-black">Bs.</span>
                  <span>Bolívares (BCV)</span>
                </button>
              </div>

              <p className="text-[11px] text-neutral-500 font-medium mt-2.5 leading-tight">
                {preferredCurrency === 'BS'
                  ? '✓ Precios en Bolívares (Bs.) calculados a la tasa oficial BCV.'
                  : '✓ Precios en Dólares ($ USD) con referencia en Bolívares.'}
              </p>
            </div>

            <div className="bg-[#F2F9E6] p-3.5 rounded-2xl border border-[#8DC63F]/40 flex items-center justify-between">
              <div>
                <span className="text-[10.5px] font-black text-[#062612] uppercase tracking-wider block">
                  Tasa Oficial BCV
                </span>
                <span className="text-[10.5px] text-neutral-500 font-medium">
                  {formattedExchangeRateDate ? `Actualizada al ${formattedExchangeRateDate}` : 'Banco Central de Venezuela'}
                </span>
              </div>
              <div className="text-base sm:text-lg font-black text-[#062612]">
                Bs. {formattedExchangeRateBcv}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCloseDollarModal}
              className="w-full py-3 rounded-xl bg-[#8DC63F] hover:bg-[#78AD2F] text-[#062612] font-black text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs border border-[#78AD2F]/30"
            >
              Listo
            </button>
          </div>
        </div>,
        document.body
      )}

      {isSearchModalMounted && createPortal(
        <div
          onClick={handleCloseSearch}
          className={`fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 transition-opacity duration-300 ${
            isSearchModalVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            onClick={(clickEvent) => clickEvent.stopPropagation()}
            className={`w-full max-w-lg bg-white rounded-b-3xl sm:rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-4 max-h-[85vh] transition-all duration-300 ease-out transform ${
              isSearchModalVisible
                ? 'translate-y-0 opacity-100 scale-100'
                : '-translate-y-10 opacity-0 scale-95'
            }`}
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
                  placeholder="Buscar quesos, jamones, café, víveres..."
                  className="w-full bg-neutral-100 border-none rounded-xl pl-10 pr-9 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#8DC63F]"
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
                        className="w-8 h-8 rounded-lg border border-[#8DC63F] text-[#4C821D] hover:bg-[#F2F9E6] transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                        aria-label="Agregar al carrito"
                      >
                        <span className="material-symbols-outlined text-base">add_shopping_cart</span>
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
