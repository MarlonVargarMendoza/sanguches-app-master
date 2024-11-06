import { create } from 'zustand';
import { NAV_CATEGORIES, mapNavToFilterCategory } from '../constants/index';

export const useCategoryStore = create((set, get) => ({
    selectedCategory: 'all',
    activeNavCategory: 'SANGUCHES',

    setSelectedCategory: (category) => {
        set({
            selectedCategory: category,
            activeNavCategory: category === 'bebidas' ? 'BEBIDAS' :
                category === 'combo' ? 'COMBOS' :
                    get().getNavCategoryFromFilter(category)
        });
    },

    setFromNavigation: (navCategory) => {
        if (navCategory === 'BEBIDAS') {
            set({
                selectedCategory: 'bebidas',
                activeNavCategory: 'BEBIDAS'
            });
            return;
        }

        const filterCategories = mapNavToFilterCategory(navCategory);
        set({
            selectedCategory: Array.isArray(filterCategories) ? filterCategories[0] : filterCategories,
            activeNavCategory: navCategory
        });
    },

    getNavCategoryFromFilter: (filterCategory) => {
        if (filterCategory === 'bebidas') return 'BEBIDAS';
        if (filterCategory === 'combo') return 'COMBOS';

        for (const navCat of NAV_CATEGORIES) {
            if (navCat.filterIds.includes(filterCategory)) {
                return navCat.name;
            }
        }
        return 'SANGUCHES';
    },

    isNavCategoryActive: (navCategory) => get().activeNavCategory === navCategory,
    getFilterCategory: () => get().selectedCategory
}));