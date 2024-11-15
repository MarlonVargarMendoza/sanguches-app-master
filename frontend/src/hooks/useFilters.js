import { useCallback, useContext, useEffect, useState } from 'react';
import { FiltersContext } from '../context/filters.jsx';

export const useFilters = () => {
  const { filters, setFilters } = useContext(FiltersContext)
  const [originalProducts, setOriginalProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const applyFilters = useCallback((products) => {
    return products.filter(product => {
      const meetsMinPrice = product.basePrice >= filters.minPrice;
      const meetsCategory = filters.category === 'all' || 
                          Number(product.category_id) === Number(filters.category);
      return meetsMinPrice && meetsCategory;
    });
  }, [filters]);

  useEffect(() => {
    const newFilteredProducts = applyFilters(originalProducts);
    setFilteredProducts(newFilteredProducts);
  }, [filters, originalProducts, applyFilters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  const updateProducts = useCallback((newProducts) => {
    setOriginalProducts(newProducts);
  }, []);

  return {
    filters,
    filteredProducts,
    updateFilters,
    updateProducts,
    totalProducts: filteredProducts.length,
    hasFiltersApplied: filters.minPrice > 0 || filters.category !== 'all'
  };
};