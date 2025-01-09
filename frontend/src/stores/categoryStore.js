import { create } from 'zustand';
import { NAV_CATEGORIES, mapNavToFilterCategory } from '../constants/index';

export const useCategoryStore = create((set, get) => ({
    selectedCategory: 'all',
    activeNavCategory: 'SANGUCHES',

    setSelectedCategory: (category) => {
        // Normalizar la categoría y resetear si es 'all'
        const current = get().selectedCategory;
        
        // Guardar categoría anterior si no es la misma
        if (current !== category) {
            set(state => ({ ...state, previousCategory: current }));
        }
        if (category === 'all') {
            set({
                selectedCategory: 'all',
                activeNavCategory: 'SANGUCHES'
            });
            return;
        }

        const normalizedCategory = category?.toString() || 'all';

        // Mapa de rutas especiales
        const specialRoutes = {
            'bebidas': { category: 'bebidas', nav: 'BEBIDAS' },
            'combo': { category: 'combo', nav: 'COMBOS' },
            '10': { category: '10', nav: 'DONAS' },
            'donas': { category: '10', nav: 'DONAS' }
        };

        const specialRoute = specialRoutes[normalizedCategory];
        if (specialRoute) {
            set({
                selectedCategory: specialRoute.category,
                activeNavCategory: specialRoute.nav
            });
            return;
        }

        // Manejo normal de categorías
        set({
            selectedCategory: normalizedCategory,
            activeNavCategory: get().getNavCategoryFromFilter(normalizedCategory)
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