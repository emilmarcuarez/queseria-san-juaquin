import React from 'react';
import categoriesShowcaseData from '../../data/categoriesShowcaseData.json';

export const DepartmentGridShowcase = ({ onSelectDepartment }) => {
  const visibleCategoryList = categoriesShowcaseData.filter(
    (categoryItem) => categoryItem.categoryIdentifier !== 'todos'
  );

  return (
    <section className="hidden md:block pt-8 pb-12 sm:pt-10 sm:pb-14 bg-white scroll-mt-28" id="departamentos">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8 pb-3 border-b border-neutral-100" data-aos="fade-up">
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#114B2B] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-lg sm:text-xl">grid_view</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 tracking-tight leading-none">
              Explora Nuestras Categorías
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6" data-aos="fade-up" data-aos-delay="100">
          {visibleCategoryList.map((categoryItem) => {
            return (
              <button
                key={categoryItem.categoryIdentifier}
                type="button"
                onClick={() => onSelectDepartment(categoryItem.categoryIdentifier)}
                className="group text-left p-2.5 sm:p-3.5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:shadow-xl hover:border-[#114B2B]/40 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
                aria-label={`Ver productos de ${categoryItem.categoryTitle}`}
              >
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 relative bg-neutral-100 border border-neutral-100">
                  {categoryItem.categoryAssignedImage ? (
                    <img
                      src={categoryItem.categoryAssignedImage}
                      alt={categoryItem.categoryTitle}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${categoryItem.iconBackground}`}>
                      <span className="material-symbols-outlined text-3xl">
                        {categoryItem.categoryIcon}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/95 text-[#114B2B] flex items-center justify-center shadow-xs opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </div>
                </div>

                <div className="px-1 pb-1">
                  <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-neutral-900 group-hover:text-[#114B2B] transition-colors leading-tight">
                    {categoryItem.categoryTitle}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
