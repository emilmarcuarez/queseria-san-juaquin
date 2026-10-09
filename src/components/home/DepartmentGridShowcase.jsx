import React from 'react';
import categoriesShowcaseData from '../../data/categoriesShowcaseData.json';

export const DepartmentGridShowcase = ({ onSelectDepartment }) => {
  const visibleCategoryList = categoriesShowcaseData.filter(
    (categoryItem) => categoryItem.categoryIdentifier !== 'todos'
  );

  return (
    <section className="w-full pt-4 pb-6 sm:pt-6 sm:pb-8 bg-white scroll-mt-28" id="departamentos">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <h2 className="text-center font-sans text-base sm:text-lg font-black text-emerald-800 tracking-tight mb-4 sm:mb-6">
          Categorías
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6" data-aos="fade-up">
          {visibleCategoryList.map((categoryItem) => {
            return (
              <button
                key={categoryItem.categoryIdentifier}
                type="button"
                onClick={() => onSelectDepartment(categoryItem.categoryIdentifier)}
                className="group p-4 sm:p-5 rounded-2xl bg-white border border-neutral-100 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center"
                aria-label={`Ver productos de ${categoryItem.categoryTitle}`}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 sm:mb-3 flex items-center justify-center">
                  {categoryItem.categoryAssignedImage ? (
                    <img
                      src={categoryItem.categoryAssignedImage}
                      alt={categoryItem.categoryTitle}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                  ) : (
                    <div className={`w-full h-full rounded-2xl flex items-center justify-center ${categoryItem.iconBackground}`}>
                      <span className="material-symbols-outlined text-3xl">
                        {categoryItem.categoryIcon}
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider group-hover:text-emerald-700 transition-colors leading-tight">
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
