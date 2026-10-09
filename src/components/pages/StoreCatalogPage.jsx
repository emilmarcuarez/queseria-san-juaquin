import React, { useState, useMemo, useEffect } from 'react';
import productsCatalogData from '../../data/productsCatalogData.json';
import departmentsCatalogData from '../../data/departmentsCatalogData.json';
import categoriesShowcaseData from '../../data/categoriesShowcaseData.json';
import { ProductCardItem } from '../products/ProductCardItem';
import { CategoryCircleSlider } from '../products/CategoryCircleSlider';
import { useShoppingCart } from '../../hooks/useShoppingCart';

export const StoreCatalogPage = ({
  initialDepartmentKey = 'todos',
  onSelectProduct
}) => {
  const { addProductToCart } = useShoppingCart();
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

    const matchingCategoryConfig = categoriesShowcaseData.find(
      (categoryEntry) => categoryEntry.categoryIdentifier === selectedDepartmentFilter
    );

    const filteredResultList = productsCatalogData.filter((productItem) => {
      const matchesDepartmentOrCategory =
        selectedDepartmentFilter === 'todos' ||
        productItem.departmentIdentifier === selectedDepartmentFilter ||
        (matchingCategoryConfig && matchingCategoryConfig.matchingProductIds.includes(productItem.productIdentifier));

      const matchesSearchTerm =
        !normalizedSearchTerm ||
        productItem.productTitle.toLowerCase().includes(normalizedSearchTerm) ||
        productItem.productDescription.toLowerCase().includes(normalizedSearchTerm) ||
        productItem.productCategoryName.toLowerCase().includes(normalizedSearchTerm);

      return matchesDepartmentOrCategory && matchesSearchTerm;
    });

    return filteredResultList.sort((firstProductItem, secondProductItem) => {
      if (selectedSortingOption === 'precio-menor') {
        return firstProductItem.productPriceUsd - secondProductItem.productPriceUsd;
      }
      if (selectedSortingOption === 'precio-mayor') {
        return secondProductItem.productPriceUsd - firstProductItem.productPriceUsd;
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
    const matchingShowcaseCategory = categoriesShowcaseData.find(
      (categoryItem) => categoryItem.categoryIdentifier === selectedDepartmentFilter
    );
    if (matchingShowcaseCategory) {
      return matchingShowcaseCategory.categoryTitle;
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
    <div className="w-full bg-white min-h-screen">
      <div className="w-full bg-white border-b border-neutral-200 shadow-2xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 pt-3 sm:pt-5 lg:pt-6 pb-4 sm:pb-5 space-y-3 sm:space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-5 pb-3 sm:pb-4 border-b border-neutral-100">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight">
                Charcutería fresca a tu mesa
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium flex items-center flex-wrap gap-1.5">
                <span>Charcutería al corte y despensa completa</span>
                <span className="text-neutral-300 hidden sm:inline">•</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 text-[11px] sm:text-xs">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  Tasa oficial BCV garantizada
                </span>
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
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-11 pr-10 py-2.5 sm:py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#8DC63F] focus:border-[#8DC63F] transition-all shadow-xs"
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

          <CategoryCircleSlider
            departmentsCatalogList={departmentsCatalogData}
            selectedDepartmentIdentifier={selectedDepartmentFilter}
            onSelectDepartmentFilter={(selectedIdentifier) => {
              setSelectedDepartmentFilter(selectedIdentifier);
            }}
            productsCatalogList={productsCatalogData}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none max-w-full">
              {[
                { key: 'todos', label: '🛒 Todos' },
                { key: 'quesos-lacteos', label: '🧀 Quesos' },
                { key: 'jamones-charcuteria', label: '🥩 Charcutería' },
                { key: 'viveres-despensa', label: '🥫 Víveres' },
                { key: 'panaderia-desayuno', label: '🥖 Panadería' }
              ].map((categoryTabItem) => {
                const isSelected = selectedDepartmentFilter === categoryTabItem.key;
                return (
                  <button
                    key={categoryTabItem.key}
                    type="button"
                    onClick={() => setSelectedDepartmentFilter(categoryTabItem.key)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#8DC63F] text-[#062612] font-black shadow-xs'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {categoryTabItem.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={selectedSortingOption}
                onChange={(changeEvent) => setSelectedSortingOption(changeEvent.target.value)}
                className="h-8 px-2.5 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 focus:outline-none focus:ring-1 focus:ring-[#8DC63F] cursor-pointer"
              >
                <option value="destacados">⭐ Destacados</option>
                <option value="precio-menor">⬇️ Menor Precio</option>
                <option value="precio-mayor">⬆️ Mayor Precio</option>
              </select>

              {(inPageSearchQuery || selectedDepartmentFilter !== 'todos') && (
                <button
                  type="button"
                  onClick={handleResetAllStoreFilters}
                  className="h-8 px-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer inline-flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">restart_alt</span>
                  <span className="hidden sm:inline">Limpiar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 py-8 sm:py-10">

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
              className="px-6 py-3 bg-[#8DC63F] hover:bg-[#78AD2F] text-[#062612] text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer border border-[#78AD2F]/40"
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
                            ? 'bg-[#8DC63F] text-[#062612] font-black shadow-xs'
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
        <div
          onClick={() => setIsFilterModalOpen(false)}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs"
        >
          <div
            className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 flex flex-col gap-4 animate-slideDownDrawer sm:animate-none"
            onClick={(clickEvent) => clickEvent.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto sm:hidden" />

            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="text-base font-black text-neutral-900 leading-tight">
                Elige una Categoría
              </h3>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 flex items-center justify-center cursor-pointer"
                aria-label="Cerrar filtros"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-2">
              {[
                { key: 'todos', label: 'Todos los Productos', icon: '🛒' },
                { key: 'quesos-lacteos', label: 'Quesos y Lácteos', icon: '🧀' },
                { key: 'jamones-charcuteria', label: 'Jamones y Charcutería', icon: '🥩' },
                { key: 'viveres-despensa', label: 'Víveres y Despensa', icon: '🥫' },
                { key: 'panaderia-desayuno', label: 'Panadería y Café', icon: '🥖' }
              ].map((categoryOptionItem) => {
                const isSelected = selectedDepartmentFilter === categoryOptionItem.key;
                return (
                  <button
                    key={categoryOptionItem.key}
                    type="button"
                    onClick={() => {
                      setSelectedDepartmentFilter(categoryOptionItem.key);
                      setIsFilterModalOpen(false);
                    }}
                    className={`w-full py-3 px-4 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#8DC63F] text-[#062612] font-black shadow-xs'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{categoryOptionItem.icon}</span>
                      <span className="text-sm">{categoryOptionItem.label}</span>
                    </div>
                    {isSelected && (
                      <span className="material-symbols-outlined text-lg text-[#062612]">check</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                Ordenar por
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: 'destacados', label: '⭐ Destacados' },
                  { key: 'precio-menor', label: '⬇️ Menor' },
                  { key: 'precio-mayor', label: '⬆️ Mayor' }
                ].map((sortingOptionItem) => {
                  const isSortingActive = selectedSortingOption === sortingOptionItem.key;
                  return (
                    <button
                      key={sortingOptionItem.key}
                      type="button"
                      onClick={() => {
                        setSelectedSortingOption(sortingOptionItem.key);
                        setIsFilterModalOpen(false);
                      }}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
                        isSortingActive
                          ? 'bg-[#F2F9E6] text-[#062612] font-black border border-[#8DC63F]'
                          : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200'
                      }`}
                    >
                      {sortingOptionItem.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
