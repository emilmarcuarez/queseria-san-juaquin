import { useState, useMemo } from 'react';
import initialProductsData from '../data/productsCatalogData.json';

export const useProductCatalogFilter = () => {
  const [selectedDepartmentKey, setSelectedDepartmentKey] = useState('todos');
  const [searchQueryString, setSearchQueryString] = useState('');

  const filteredProductList = useMemo(() => {
    return initialProductsData.filter((productItem) => {
      const matchesDepartment = selectedDepartmentKey === 'todos' ||
        (selectedDepartmentKey === 'ofertas' && productItem.isFeaturedProduct) ||
        productItem.departmentIdentifier === selectedDepartmentKey;

      const normalizedSearchTerm = searchQueryString.trim().toLowerCase();
      const matchesSearch = normalizedSearchTerm === '' ||
        productItem.productTitle.toLowerCase().includes(normalizedSearchTerm) ||
        productItem.productCategoryName.toLowerCase().includes(normalizedSearchTerm) ||
        productItem.productDescription.toLowerCase().includes(normalizedSearchTerm);

      return matchesDepartment && matchesSearch;
    });
  }, [selectedDepartmentKey, searchQueryString]);

  const selectDepartment = (departmentIdentifier) => {
    setSelectedDepartmentKey(departmentIdentifier);
    setSearchQueryString('');
  };

  const updateSearchQuery = (queryString) => {
    setSearchQueryString(queryString);
  };

  const resetFilters = () => {
    setSelectedDepartmentKey('todos');
    setSearchQueryString('');
  };

  return {
    selectedDepartmentKey,
    searchQueryString,
    filteredProductList,
    selectDepartment,
    updateSearchQuery,
    resetFilters
  };
};
