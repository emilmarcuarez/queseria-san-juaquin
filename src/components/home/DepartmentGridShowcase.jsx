import React from 'react';
import departmentsCatalogData from '../../data/departmentsCatalogData.json';

export const DepartmentGridShowcase = ({ onSelectDepartment }) => {
  const handleDepartmentClick = (departmentIdentifier) => {
    onSelectDepartment(departmentIdentifier);
    const catalogSectionElement = document.getElementById('destacados');
    if (catalogSectionElement) {
      catalogSectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 bg-white scroll-mt-36" id="departamentos">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3" data-aos="fade-up">
          <div>
            <span className="text-xs font-extrabold text-accent uppercase tracking-widest">
              Catálogo Completo
            </span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-neutral-dark tracking-tight mt-1">
              Explora por Departamentos
            </h2>
          </div>
          <p className="text-sm text-neutral-muted max-w-md font-medium">
            Todo lo necesario para surtir tu cocina y mesa sin salir de casa.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {departmentsCatalogData.map((departmentItem, itemIndex) => {
            const badgeBgClass = departmentItem.badgeStyle === 'accent'
              ? 'bg-accent text-neutral-dark'
              : departmentItem.badgeStyle === 'dark'
                ? 'bg-neutral-dark text-white'
                : 'bg-primary text-white';

            const animationDelayMilliseconds = (itemIndex + 1) * 80;

            return (
              <button
                key={departmentItem.departmentIdentifier}
                onClick={() => handleDepartmentClick(departmentItem.departmentIdentifier)}
                data-aos="fade-up"
                data-aos-delay={animationDelayMilliseconds}
                className="group flex flex-col text-left bg-surface-alt rounded-xl border border-neutral-border overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all cursor-pointer"
              >
                <div className="relative w-full aspect-[4/3] bg-neutral-100 overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    alt={departmentItem.departmentTitle}
                    src={departmentItem.departmentImage}
                  />
                  <div className={`absolute top-2.5 left-2.5 text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs ${badgeBgClass}`}>
                    {departmentItem.departmentBadge}
                  </div>
                </div>

                <div className="p-3.5 flex flex-col flex-1">
                  <h3 className="text-sm font-bold text-neutral-dark group-hover:text-primary transition-colors">
                    {departmentItem.departmentTitle}
                  </h3>
                  <p className="text-xs text-neutral-muted mt-1 mb-2 line-clamp-2">
                    {departmentItem.departmentDescription}
                  </p>
                  <span className="mt-auto text-xs font-extrabold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Ver categoría <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
