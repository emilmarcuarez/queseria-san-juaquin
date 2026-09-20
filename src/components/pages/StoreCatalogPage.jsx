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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 pb-6 border-b border-neutral-100">
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

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedDepartmentFilter('todos')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                selectedDepartmentFilter === 'todos'
                  ? 'bg-[#114B2B] text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <span>Todas las Categorías</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                selectedDepartmentFilter === 'todos' ? 'bg-white/20 text-white' : 'bg-white text-neutral-600'
              }`}>
                {departmentCountLookup.todos}
              </span>
            </button>

            {departmentsCatalogData.map((departmentItem) => {
              const isSelected = selectedDepartmentFilter === departmentItem.departmentIdentifier;
              const productCount = departmentCountLookup[departmentItem.departmentIdentifier] || 0;

              return (
                <button
                  key={departmentItem.departmentIdentifier}
                  type="button"
                  onClick={() => setSelectedDepartmentFilter(departmentItem.departmentIdentifier)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#114B2B] text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  <span>{departmentItem.departmentTitle}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-white text-neutral-600'
                  }`}>
                    {productCount}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-neutral-600">
                Mostrando {filteredAndSortedProducts.length} producto{filteredAndSortedProducts.length === 1 ? '' : 's'}
                {inPageSearchQuery && ` para "${inPageSearchQuery}"`}
              </span>

              {(inPageSearchQuery || selectedDepartmentFilter !== 'todos') && (
                <button
                  type="button"
                  onClick={handleResetAllStoreFilters}
                  className="text-xs font-bold text-red-600 hover:underline cursor-pointer flex items-center gap-1 ml-2"
                >
                  <span className="material-symbols-outlined text-sm">restart_alt</span>
                  <span>Restablecer Filtros</span>
                </button>
              )}
            </div>

            <div className="flex items-center w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setIsGroupedByCategoryActive(!isGroupedByCategoryActive)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  isGroupedByCategoryActive
                    ? 'bg-emerald-50 text-[#114B2B] border-emerald-400 font-extrabold shadow-xs'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50 shadow-2xs'
                }`}
                aria-label="Alternar agrupación por categoría"
              >
                <span className="material-symbols-outlined text-lg">
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
      </div>
  );
};
