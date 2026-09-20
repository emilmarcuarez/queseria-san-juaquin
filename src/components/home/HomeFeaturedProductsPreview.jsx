import React from 'react';
import productsCatalogData from '../../data/productsCatalogData.json';
import { ProductCardItem } from '../products/ProductCardItem';

export const HomeFeaturedProductsPreview = ({
  onNavigateToStore,
  onSelectProduct
}) => {
  const featuredProductSelection = productsCatalogData
    .filter((catalogItem) => catalogItem.isFeaturedProduct)
    .slice(0, 8);

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#114B2B] block mb-1">
              Selección Especial
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Los Más Pedidos de Nuestra Charcutería y Despensa
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToStore('tienda')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#114B2B] hover:text-[#0d3b22] transition-colors cursor-pointer group"
          >
            <span>Ver más</span>
            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProductSelection.map((productEntry) => (
            <ProductCardItem
              key={productEntry.productIdentifier}
              productItem={productEntry}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>

        <div className="mt-10 sm:mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => onNavigateToStore('tienda')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 hover:text-[#114B2B] border border-neutral-200 hover:border-neutral-300 text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
          >
            <span>Ver más</span>
            <span className="material-symbols-outlined text-base text-neutral-400 group-hover:text-[#114B2B] group-hover:translate-x-0.5 transition-all">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
