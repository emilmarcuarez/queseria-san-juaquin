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

  const freshCheeseProductList = productsCatalogData.filter((productItem) =>
    freshCheeseProductIdentifiers.includes(productItem.productIdentifier)
  );

  const charcuterieProductList = productsCatalogData.filter((productItem) =>
    charcuterieProductIdentifiers.includes(productItem.productIdentifier)
  );

  const pantryProductList = productsCatalogData.filter((productItem) =>
    pantryProductIdentifiers.includes(productItem.productIdentifier)
  );

  return (
    <div className="w-full bg-white py-4 sm:py-8 space-y-10 sm:space-y-14">
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <div className="flex justify-center mb-6" data-aos="fade-up">
          <span className="bg-[#8DC63F] text-[#062612] font-black text-xs uppercase px-5 py-1.5 rounded-full shadow-2xs tracking-wider border border-[#78AD2F]/40">
            QUESOS CRIOLLOS
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
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
        <div className="flex justify-center mb-6" data-aos="fade-up">
          <span className="bg-[#8DC63F] text-[#062612] font-black text-xs uppercase px-5 py-1.5 rounded-full shadow-2xs tracking-wider border border-[#78AD2F]/40">
            CHARCUTERÍA
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
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
        <div className="flex justify-center mb-6" data-aos="fade-up">
          <span className="bg-[#8DC63F] text-[#062612] font-black text-xs uppercase px-5 py-1.5 rounded-full shadow-2xs tracking-wider border border-[#78AD2F]/40">
            VÍVERES Y DESPENSA
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {pantryProductList.map((productEntry) => (
            <ProductCardItem
              key={productEntry.productIdentifier}
              productItem={productEntry}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => onNavigateToStore('tienda')}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#8DC63F] hover:bg-[#78AD2F] text-[#062612] text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95 border border-[#78AD2F]/30"
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
