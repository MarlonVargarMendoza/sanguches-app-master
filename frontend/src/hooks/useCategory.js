import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FILTER_CATEGORIES, NAV_CATEGORIES } from '../constants/index';
import { useCategoryStore } from '../stores/categoryStore';

export const useCategories = () => {
    const navigate = useNavigate();
    const { 
        selectedCategory,
        setSelectedCategory,
        setFromNavigation,
        isNavCategoryActive
    } = useCategoryStore();

    const handleFilterChange = useCallback((category) => {
        setSelectedCategory(category);
        navigate(category === 'all' 
            ? '/menuSanguches' 
            : `/menuSanguches?category=${category}`
        );
    }, [navigate, setSelectedCategory]);

    const handleNavCategoryClick = useCallback((navCategory) => {
        setFromNavigation(navCategory);
        const category = NAV_CATEGORIES.find(cat => cat.name === navCategory);
        
        if (category.category === 'all') {
            navigate('/menuSanguches');
        } else if (Array.isArray(category.category)) {
            navigate(`/menuSanguches?categories=${category.category.join(',')}`);
        } else {
            navigate(`/menuSanguches?category=${category.category}`);
        }
    }, [navigate, setFromNavigation]);

    return {
        selectedCategory,
        isNavCategoryActive,
        handleFilterChange,
        handleNavCategoryClick,
        filterCategories: FILTER_CATEGORIES,
        navCategories: NAV_CATEGORIES
    };
};