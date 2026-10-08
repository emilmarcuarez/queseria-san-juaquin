import React from 'react';
import categoriesShowcaseData from '../../data/categoriesShowcaseData.json';

export const DepartmentGridShowcase = ({ onSelectDepartment }) => {
  const visibleCategoryList = categoriesShowcaseData.filter(
    (categoryItem) => categoryItem.categoryIdentifier !== 'todos'
  );

  return (
    <section className="w-full pt-8 pb-10 sm:pt-10 sm:pb-14 bg-white scroll-mt-28" id="departamentos">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8 pb-3 border-b border-neutral-100" data-aos="fade-up">
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#114B2B] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-lg sm:text-xl">grid_view</span>
            </div>
            <h2 className="font-sans text-xl sm:text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight leading-none">
              Explora Nuestras Categorías
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6" data-aos="fade-up" data-aos-delay="100">
          {visibleCategoryList.map((categoryItem) => {
            return (
              <button
                key={categoryItem.categoryIdentifier}
                type="button"
                onClick={() => onSelectDepartment(categoryItem.categoryIdentifier)}
                className="group p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 shadow-2xs hover:shadow-lg hover:border-[#114B2B]/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center text-center"
                aria-label={`Ver productos de ${categoryItem.categoryTitle}`}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mb-3 sm:mb-4 flex items-center justify-center">
                  {categoryItem.categoryAssignedImage ? (
                    <img
                      src={categoryItem.categoryAssignedImage}
                      alt={categoryItem.categoryTitle}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className={`w-full h-full rounded-2xl flex items-center justify-center ${categoryItem.iconBackground}`}>
                      <span className="material-symbols-outlined text-4xl">
                        {categoryItem.categoryIcon}
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="text-xs sm:text-sm font-black text-neutral-800 uppercase tracking-wider group-hover:text-[#114B2B] transition-colors leading-tight">
                  {categoryItem.categoryTitle}
                </h3>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
