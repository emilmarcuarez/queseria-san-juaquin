import React from 'react';
import productsCatalogData from '../../data/productsCatalogData.json';
import { ProductCardItem } from '../products/ProductCardItem';

export const HomeFeaturedProductsPreview = ({
  onNavigateToStore,
  onSelectProduct
}) => {
  const freshCheeseProductIdentifiers = [
    'queso-blanco-llanero-1kg',
    'queso-paisa-pasteurizado-1kg',
    'queso-palmizul-zuliano-1kg',
    'queso-de-mano-fresco-pack',
    'queso-telita-guayanes-fresco',
    'queso-de-ano-curado-wedge',
    'nata-criolla-venezolana-pote',
    'nata-criolla-pasteurizada-450g'
  ];

  const charcuterieProductIdentifiers = [
    'plumrose-jamon-cocido-deli',
    'jamon-espalda-ahumada-500g',
    'pechuga-pavo-ahumada-hermo',
    'plumrose-tocineta-ahumada-lonjas',
    'plumrose-salchichas-wieners',
    'diablitos-underwood-lata',
    'queso-amarillo-gouda-holandes',
    'salchichas-polacas-ahumadas'
  ];

  const pantryProductIdentifiers = [
    'harina-pan-blanca-1kg',
    'harina-pan-amarilla-1kg',
    'harina-juana-blanca-1kg',
    'arroz-primor-blanco-1kg',
    'pasta-primor-spaghetti-1kg',
    'mayonesa-mavesa-frasco-470g',
    'salsa-tomate-pampero-397g',
    'aceite-maiz-dorado-1l'
  ];

  const bakeryBreakfastProductIdentifiers = [
    'pan-de-jamon-artesanal-tradicional',
    'pan-sandwich-artesanal-rebanado',
    'margarina-mavesa-pote-1kg',
    'cafe-fama-de-america-500g',
    'pirulin-lata-avellana-300g',
    'maltin-polar-botella-pack',
    'galletas-susy-maria-pack',
    'nata-criolla-pasteurizada-450g'
  ];

  const freshCheeseProductList = productsCatalogData.filter((productItem) =>
    freshCheeseProductIdentifiers.includes(productItem.productIdentifier)
  );

  const charcuterieProductList = productsCatalogData.filter((productItem) =>
    charcuterieProductIdentifiers.includes(productItem.productIdentifier)
  );

  const pantryProductList = productsCatalogData.filter((productItem) =>
    pantryProductIdentifiers.includes(productItem.productIdentifier)
  );

  const bakeryBreakfastProductList = productsCatalogData.filter((productItem) =>
    bakeryBreakfastProductIdentifiers.includes(productItem.productIdentifier)
  );

  return (
    <div className="w-full bg-white py-8 sm:py-14 space-y-12 sm:space-y-16">
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8 pb-3 border-b border-neutral-100" data-aos="fade-up">
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#8C6D23] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-lg sm:text-xl">nutrition</span>
            </div>
            <h2 className="font-sans text-xl sm:text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight leading-none">
              Quesos Criollos &amp; Tradición del Llano
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToStore('tienda')}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#8C6D23] hover:text-[#5d440c] transition-colors cursor-pointer group shrink-0"
          >
            <span>Ver todo</span>
            <span className="material-symbols-outlined text-sm sm:text-base group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {freshCheeseProductList.map((productEntry) => (
            <ProductCardItem
              key={productEntry.productIdentifier}
              productItem={productEntry}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8 pb-3 border-b border-neutral-100" data-aos="fade-up">
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#7A3E20] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-lg sm:text-xl">lunch_dining</span>
            </div>
            <h2 className="font-sans text-xl sm:text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight leading-none">
              Charcutería Selecta &amp; Embutidos
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToStore('tienda')}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#7A3E20] hover:text-[#4d2311] transition-colors cursor-pointer group shrink-0"
          >
            <span>Ver guía de cortes</span>
            <span className="material-symbols-outlined text-sm sm:text-base group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {charcuterieProductList.map((productEntry) => (
            <ProductCardItem
              key={productEntry.productIdentifier}
              productItem={productEntry}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8 pb-3 border-b border-neutral-100" data-aos="fade-up">
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#0B3C1D] text-[#8DC63F] flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-lg sm:text-xl">kitchen</span>
            </div>
            <h2 className="font-sans text-xl sm:text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight leading-none">
              Despensa Básica &amp; Víveres Esenciales
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToStore('tienda')}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#0B3C1D] hover:text-[#8DC63F] transition-colors cursor-pointer group shrink-0"
          >
            <span>Ver todo</span>
            <span className="material-symbols-outlined text-sm sm:text-base group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {pantryProductList.map((productEntry) => (
            <ProductCardItem
              key={productEntry.productIdentifier}
              productItem={productEntry}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8 pb-3 border-b border-neutral-100" data-aos="fade-up">
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#9A5B1E] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-lg sm:text-xl">bakery_dining</span>
            </div>
            <h2 className="font-sans text-xl sm:text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight leading-none">
              Panadería Artesanal, Café &amp; Antojos
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToStore('tienda')}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#9A5B1E] hover:text-[#673b10] transition-colors cursor-pointer group shrink-0"
          >
            <span>Ver todo</span>
            <span className="material-symbols-outlined text-sm sm:text-base group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {bakeryBreakfastProductList.map((productEntry) => (
            <ProductCardItem
              key={productEntry.productIdentifier}
              productItem={productEntry}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={() => onNavigateToStore('tienda')}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#0B3C1D] hover:bg-[#8DC63F] hover:text-[#062612] text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-md hover:shadow-xl active:scale-95 cursor-pointer border border-[#8DC63F]/30"
          >
            <span className="material-symbols-outlined text-lg">storefront</span>
            <span>Ver Todo el Catálogo</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </section>
    </div>
  );
};
