import React, { useState, useMemo, useEffect } from 'react';
import productsCatalogData from '../../data/productsCatalogData.json';
import departmentsCatalogData from '../../data/departmentsCatalogData.json';
import { ProductCardItem } from '../products/ProductCardItem';

export const StoreCatalogPage = ({
  initialDepartmentKey = 'todos',
  onSelectProduct
}) => {
  const [inPageSearchQuery, setInPageSearchQuery] = useState('');
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState(initialDepartmentKey);
  const [selectedSortingOption, setSelectedSortingOption] = useState('destacados');
  const [isGroupedByCategoryActive, setIsGroupedByCategoryActive] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const productsRenderLimitPerPage = 12;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    setCurrentPageIndex(1);
  }, [inPageSearchQuery, selectedDepartmentFilter, selectedSortingOption, isGroupedByCategoryActive]);

  const filteredAndSortedProducts = useMemo(() => {
    const normalizedSearchTerm = inPageSearchQuery.trim().toLowerCase();

    const filteredResultList = productsCatalogData.filter((productItem) => {
      const matchesDepartment =
        selectedDepartmentFilter === 'todos' ||
        productItem.departmentIdentifier === selectedDepartmentFilter;

      const matchesSearchTerm =
        !normalizedSearchTerm ||
        productItem.productTitle.toLowerCase().includes(normalizedSearchTerm) ||
        productItem.productDescription.toLowerCase().includes(normalizedSearchTerm) ||
        productItem.productCategoryName.toLowerCase().includes(normalizedSearchTerm);

      return matchesDepartment && matchesSearchTerm;
    });

    return filteredResultList.sort((firstProductItem, secondProductItem) => {
      if (selectedSortingOption === 'precio-menor') {
        return firstProductItem.productPriceUsd - secondProductItem.productPriceUsd;
      }
      if (selectedSortingOption === 'precio-mayor') {
        return secondProductItem.productPriceUsd - firstProductItem.productPriceUsd;
      }
      if (selectedSortingOption === 'alfabetico') {
        return firstProductItem.productTitle.localeCompare(secondProductItem.productTitle);
      }
      return (secondProductItem.isFeaturedProduct ? 1 : 0) - (firstProductItem.isFeaturedProduct ? 1 : 0);
    });
  }, [inPageSearchQuery, selectedDepartmentFilter, selectedSortingOption]);

  const totalCalculatedPages = Math.ceil(filteredAndSortedProducts.length / productsRenderLimitPerPage) || 1;

  const paginatedProductSlice = useMemo(() => {
    const startingOffsetIndex = (currentPageIndex - 1) * productsRenderLimitPerPage;
    return filteredAndSortedProducts.slice(startingOffsetIndex, startingOffsetIndex + productsRenderLimitPerPage);
  }, [filteredAndSortedProducts, currentPageIndex]);

  const groupedProductsDictionary = useMemo(() => {
    const categoriesMap = {};
    filteredAndSortedProducts.forEach((productItem) => {
      const departmentKey = productItem.departmentIdentifier;
      if (!categoriesMap[departmentKey]) {
        categoriesMap[departmentKey] = [];
      }
      categoriesMap[departmentKey].push(productItem);
    });
    return categoriesMap;
  }, [filteredAndSortedProducts]);

  const departmentCountLookup = useMemo(() => {
    const countMap = { todos: productsCatalogData.length };
    productsCatalogData.forEach((productItem) => {
      countMap[productItem.departmentIdentifier] = (countMap[productItem.departmentIdentifier] || 0) + 1;
    });
    return countMap;
  }, []);

  const activeDepartmentTitle = useMemo(() => {
    if (selectedDepartmentFilter === 'todos') {
      return 'Todas las Categorías';
    }
    const matchingDepartment = departmentsCatalogData.find(
      (departmentItem) => departmentItem.departmentIdentifier === selectedDepartmentFilter
    );
    return matchingDepartment ? matchingDepartment.departmentTitle : 'Categoría';
  }, [selectedDepartmentFilter]);

  const handleClearInPageSearch = () => {
    setInPageSearchQuery('');
  };

  const handleResetAllStoreFilters = () => {
    setInPageSearchQuery('');
    setSelectedDepartmentFilter('todos');
    setSelectedSortingOption('destacados');
    setIsGroupedByCategoryActive(false);
    setCurrentPageIndex(1);
  };

  return (
    <div className="w-full bg-[#fafafa] min-h-screen">
      <div className="w-full bg-white border-b border-neutral-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 pb-5 border-b border-neutral-100">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
                Quesería San Joaquín
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium">
                Charcutería al corte, quesería fresca y despensa completa con tasa oficial BCV.
              </p>
            </div>

            <div className="w-full lg:max-w-md">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-neutral-400 absolute left-3.5 text-xl pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  value={inPageSearchQuery}
                  onChange={(inputEvent) => setInPageSearchQuery(inputEvent.target.value)}
                  placeholder="Buscar en la tienda: Harina PAN, queso, tocineta..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-11 pr-10 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#114B2B] focus:border-transparent transition-all shadow-xs"
                />
                {inPageSearchQuery && (
                  <button
                    type="button"
                    onClick={handleClearInPageSearch}
                    className="absolute right-3.5 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                    aria-label="Borrar búsqueda"
                  >
                    <span className="material-symbols-outlined text-xl">cancel</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(true)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border shadow-2xs active:scale-95 ${
                  selectedDepartmentFilter !== 'todos'
                    ? 'bg-emerald-50 text-[#114B2B] border-emerald-300 shadow-xs'
                    : 'bg-white text-neutral-800 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300'
                }`}
                aria-label="Abrir filtros de categorías"
              >
                <span className="material-symbols-outlined text-base text-[#114B2B]">tune</span>
                <span>Filtros</span>
                {selectedDepartmentFilter !== 'todos' && (
                  <span className="w-2 h-2 rounded-full bg-[#114B2B]"></span>
                )}
                <span className="material-symbols-outlined text-xs text-neutral-400">expand_more</span>
              </button>

              {selectedDepartmentFilter !== 'todos' && (
                <div className="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-800 text-xs px-3 py-1.5 rounded-xl font-semibold border border-neutral-200">
                  <span>{activeDepartmentTitle}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedDepartmentFilter('todos')}
                    className="text-neutral-400 hover:text-red-600 cursor-pointer ml-1 text-xs"
                    aria-label="Quitar filtro de categoría"
                  >
                    ✕
                  </button>
                </div>
              )}

              <span className="text-xs font-semibold text-neutral-500 hidden sm:inline-block">
                Mostrando {filteredAndSortedProducts.length} producto{filteredAndSortedProducts.length === 1 ? '' : 's'}
                {inPageSearchQuery && ` para "${inPageSearchQuery}"`}
              </span>

              {(inPageSearchQuery || selectedDepartmentFilter !== 'todos') && (
                <button
                  type="button"
                  onClick={handleResetAllStoreFilters}
                  className="text-xs font-bold text-red-600 hover:underline cursor-pointer flex items-center gap-1 ml-1"
                >
                  <span className="material-symbols-outlined text-sm">restart_alt</span>
                  <span>Restablecer</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsGroupedByCategoryActive(!isGroupedByCategoryActive)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  isGroupedByCategoryActive
                    ? 'bg-emerald-50 text-[#114B2B] border-emerald-400 font-extrabold shadow-xs'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50 shadow-2xs'
                }`}
                aria-label="Alternar agrupación por categoría"
              >
                <span className="material-symbols-outlined text-base">
                  {isGroupedByCategoryActive ? 'check_box' : 'check_box_outline_blank'}
                </span>
                <span>Agrupar por Categoría</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center max-w-md mx-auto my-8">
            <span className="material-symbols-outlined text-5xl text-neutral-300 mb-3 block">
              search_off
            </span>
            <h3 className="text-lg font-black text-neutral-900 mb-1">
              No encontramos productos
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Intenta buscar con otro término como "harina", "queso", "margarina" o limpia tus filtros.
            </p>
            <button
              type="button"
              onClick={handleResetAllStoreFilters}
              className="px-6 py-3 bg-[#114B2B] hover:bg-[#0d3b22] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              Ver Todos los Productos
            </button>
          </div>
        ) : isGroupedByCategoryActive ? (
          <div className="space-y-12">
            {departmentsCatalogData.map((departmentMeta) => {
              const departmentProducts = groupedProductsDictionary[departmentMeta.departmentIdentifier] || [];
              if (departmentProducts.length === 0) {
                return null;
              }

              return (
                <div key={departmentMeta.departmentIdentifier} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                        {departmentMeta.departmentTitle}
                      </h2>
                      <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                        {departmentProducts.length}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                    {departmentProducts.map((productEntry) => (
                      <ProductCardItem
                        key={productEntry.productIdentifier}
                        productItem={productEntry}
                        onSelectProduct={onSelectProduct}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {paginatedProductSlice.map((productEntry) => (
                <ProductCardItem
                  key={productEntry.productIdentifier}
                  productItem={productEntry}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>

            {totalCalculatedPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPageIndex((previousPage) => Math.max(previousPage - 1, 1));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  disabled={currentPageIndex === 1}
                  className="px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                  <span>Anterior</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalCalculatedPages }, (unusedPlaceholder, indexNumber) => {
                    const pageNumber = indexNumber + 1;
                    const isSelected = pageNumber === currentPageIndex;

                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => {
                          setCurrentPageIndex(pageNumber);
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        className={`w-9 h-9 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#114B2B] text-white shadow-sm'
                            : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentPageIndex((previousPage) => Math.min(previousPage + 1, totalCalculatedPages));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  disabled={currentPageIndex === totalCalculatedPages}
                  className="px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Siguiente</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-neutral-200 max-h-[85vh] flex flex-col overflow-hidden animate-slideDownDrawer"
            onClick={(clickEvent) => clickEvent.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
              <div className="flex items-center gap-2.5 text-[#114B2B]">
                <span className="material-symbols-outlined text-xl">tune</span>
                <div>
                  <h3 className="text-sm font-extrabold text-neutral-900 leading-tight">
                    Filtros de Catálogo
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-medium">
                    Selecciona una categoría para explorar productos
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-600 flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Cerrar menú de filtros"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-none">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block mb-2.5">
                  Categorías disponibles
                </span>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDepartmentFilter('todos')}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      selectedDepartmentFilter === 'todos'
                        ? 'border-[#114B2B] bg-emerald-50/70 text-[#114B2B] font-bold shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-lg ${
                        selectedDepartmentFilter === 'todos' ? 'text-[#114B2B]' : 'text-neutral-400'
                      }`}>
                        storefront
                      </span>
                      <span className="text-xs font-bold">Todas las Categorías</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                        {departmentCountLookup.todos}
                      </span>
                      <span className={`material-symbols-outlined text-base ${
                        selectedDepartmentFilter === 'todos' ? 'text-[#114B2B]' : 'text-neutral-300'
                      }`}>
                        {selectedDepartmentFilter === 'todos' ? 'radio_button_checked' : 'radio_button_unchecked'}
                      </span>
                    </div>
                  </button>

                  {departmentsCatalogData.map((departmentItem) => {
                    const isSelected = selectedDepartmentFilter === departmentItem.departmentIdentifier;
                    const productCount = departmentCountLookup[departmentItem.departmentIdentifier] || 0;

                    return (
                      <button
                        key={departmentItem.departmentIdentifier}
                        type="button"
                        onClick={() => setSelectedDepartmentFilter(departmentItem.departmentIdentifier)}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#114B2B] bg-emerald-50/70 text-[#114B2B] font-bold shadow-xs'
                            : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`material-symbols-outlined text-lg ${
                            isSelected ? 'text-[#114B2B]' : 'text-neutral-400'
                          }`}>
                            category
                          </span>
                          <div>
                            <span className="text-xs font-bold block leading-tight">
                              {departmentItem.departmentTitle}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-normal line-clamp-1 mt-0.5">
                              {departmentItem.departmentDescription}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                            {productCount}
                          </span>
                          <span className={`material-symbols-outlined text-base ${
                            isSelected ? 'text-[#114B2B]' : 'text-neutral-300'
                          }`}>
                            {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block mb-2.5">
                  Ordenar por
                </span>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'destacados', label: 'Destacados', icon: 'star' },
                    { key: 'precio-menor', label: 'Menor Precio', icon: 'trending_down' },
                    { key: 'precio-mayor', label: 'Mayor Precio', icon: 'trending_up' },
                    { key: 'alfabetico', label: 'Nombre (A-Z)', icon: 'sort_by_alpha' }
                  ].map((sortingOptionItem) => {
                    const isSortingActive = selectedSortingOption === sortingOptionItem.key;
                    return (
                      <button
                        key={sortingOptionItem.key}
                        type="button"
                        onClick={() => setSelectedSortingOption(sortingOptionItem.key)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                          isSortingActive
                            ? 'border-[#114B2B] bg-emerald-50/70 text-[#114B2B] font-bold shadow-xs'
                            : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        <span className={`material-symbols-outlined text-sm ${
                          isSortingActive ? 'text-[#114B2B]' : 'text-neutral-400'
                        }`}>
                          {sortingOptionItem.icon}
                        </span>
                        <span>{sortingOptionItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-200 bg-neutral-50/80 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetAllStoreFilters}
                className="text-xs font-bold text-neutral-600 hover:text-red-600 transition-colors cursor-pointer px-2 py-1"
              >
                Restablecer
              </button>

              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="px-5 py-2.5 bg-[#114B2B] hover:bg-[#0d3b22] text-white text-xs font-extrabold rounded-xl transition-all shadow-sm cursor-pointer active:scale-95"
              >
                Ver {filteredAndSortedProducts.length} Productos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
