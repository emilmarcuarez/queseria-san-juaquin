import React from 'react';
import { ProductCardItem } from './ProductCardItem';

const departmentFilterPills = [
  { filterIdentifier: 'todos', labelText: 'Todos' },
  { filterIdentifier: 'ofertas', labelText: 'Ofertas' },
  { filterIdentifier: 'quesos-lacteos', labelText: 'Quesos & Lácteos' },
  { filterIdentifier: 'jamones-charcuteria', labelText: 'Jamones & Charcutería' },
  { filterIdentifier: 'viveres-despensa', labelText: 'Víveres & Despensa' },
  { filterIdentifier: 'panaderia-desayuno', labelText: 'Panadería & Desayuno' }
];

export const ProductCatalogGrid = ({
  filteredProductList,
  selectedDepartmentKey,
  searchQueryString,
  onSelectDepartment,
  onResetFilters,
  onSelectProduct
}) => {
  const getDepartmentTitle = () => {
    switch (selectedDepartmentKey) {
      case 'ofertas':
        return 'Ofertas de la Semana';
      case 'quesos-lacteos':
        return 'Quesos & Lácteos';
      case 'jamones-charcuteria':
        return 'Jamones & Charcutería Selecta';
      case 'viveres-despensa':
        return 'Víveres & Canasta Básica';
      case 'panaderia-desayuno':
        return 'Panadería & Desayuno';
      default:
        return 'Lo Más Llevado del Súper';
    }
  };

  return (
    <section className="py-12 bg-[#fafafa] border-y border-neutral-border scroll-mt-24" id="destacados">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary-subtle text-primary text-xs font-extrabold uppercase tracking-wide mb-1 shadow-xs">
              <span className="material-symbols-outlined text-sm">stars</span>
              <span>
                {selectedDepartmentKey !== 'todos' ? 'Categoría Seleccionada' : 'Favoritos del Hogar'}
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-neutral-dark tracking-tight">
              {getDepartmentTitle()}
            </h2>
            <p className="text-xs text-neutral-muted mt-0.5 font-medium">
              {filteredProductList.length} {filteredProductList.length === 1 ? 'producto disponible' : 'productos disponibles'}
              {searchQueryString ? ` para la búsqueda "${searchQueryString}"` : ''}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {(selectedDepartmentKey !== 'todos' || searchQueryString.trim() !== '') && (
              <button
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark underline cursor-pointer bg-primary-subtle px-3 py-1.5 rounded-lg border border-primary/20 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                <span>Ver Todos los Productos</span>
              </button>
            )}
            <span className="text-xs font-bold text-neutral-muted hidden sm:inline">
              Precios vigentes según tasa oficial BCV
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {departmentFilterPills.map((filterPillItem) => {
            const isPillSelected = selectedDepartmentKey === filterPillItem.filterIdentifier;
            const buttonStyleClasses = isPillSelected
              ? 'bg-primary text-white font-extrabold shadow-sm'
              : 'bg-white text-neutral-dark hover:bg-surface-alt border border-neutral-border font-medium';

            return (
              <button
                key={filterPillItem.filterIdentifier}
                onClick={() => onSelectDepartment(filterPillItem.filterIdentifier)}
                className={`px-4 py-2 rounded-full text-xs shrink-0 transition-all cursor-pointer ${buttonStyleClasses}`}
              >
                {filterPillItem.labelText}
              </button>
            );
          })}
        </div>

        {filteredProductList.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-border p-12 text-center max-w-md mx-auto shadow-sm">
            <span className="material-symbols-outlined text-4xl text-neutral-muted mb-2">search_off</span>
            <h3 className="text-base font-bold text-neutral-dark">No se encontraron productos</h3>
            <p className="text-xs text-neutral-muted mt-1 mb-4">
              No hay coincidencias en esta categoría para tu búsqueda actual.
            </p>
            <button
              onClick={onResetFilters}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-colors cursor-pointer shadow-xs"
            >
              Ver todo el catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProductList.map((productItem) => (
              <ProductCardItem
                key={productItem.productIdentifier}
                productItem={productItem}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
