import { create } from 'zustand';
import { NAV_CATEGORIES, mapNavToFilterCategory } from '../constants/index';

export const useCategoryStore = create((set, get) => ({
    // Estado
    selectedCategory: 'all',
    activeNavCategory: 'SANGUCHES',

    // Acciones
    setSelectedCategory: (category) => {
        const state = get();
        set({
            selectedCategory: category,
            activeNavCategory: state.getNavCategoryFromFilter(category)
        });
    },

    setFromNavigation: (navCategory) => {
        const filterCategories = mapNavToFilterCategory(navCategory);
        set({
            selectedCategory: Array.isArray(filterCategories) ? filterCategories[0] : filterCategories,
            activeNavCategory: navCategory
        });
    },

    // Utilidades
    getNavCategoryFromFilter: (filterCategory) => {
        for (const navCat of NAV_CATEGORIES) {
            if (navCat.filterIds.includes(filterCategory)) {
                return navCat.name;
            }
        }
        return 'SANGUCHES';
    },

    // Selectores
    isNavCategoryActive: (navCategory) => get().activeNavCategory === navCategory,
    
    getFilterCategory: () => get().selectedCategory
}));