
// filters 
export const FILTER_TYPES = {
    PRICE: 'price',
    CATEGORY: 'category',
    INGREDIENTS: 'ingredients'
};

export const INITIAL_FILTER_STATE = {
    price: { min: 0, max: 100000 },
    category: 'all',
    ingredients: []
};
// Categorías detalladas del selector de Filters (fuente de verdad)
export const FILTER_CATEGORIES = [
    { id: 'all', name: 'Sanguches y sanguchitos', icon: '🥪', color: '#FFC603' },
    { id: '7', name: 'Sanguches', icon: '🍔', color: '#FF9B9B' },
    { id: '8', name: 'Sanguchitos', icon: '🥖', color: '#FFB084' },
    { id: '9', name: 'Desayunos', icon: '☕', color: '#AED9E0' },
    { id: '10', name: 'Donas', icon: '🍩', color: '#FFA8E2' },
    { id: '11', name: 'Pasteles', icon: '🍰', color: '#B5EAD7' },
    { id: '12', name: 'Otros', icon: '✨', color: '#C7CEEA' },
    { id: '13', name: 'Papas Fritas', icon: '🍟', color: '#FFD700' },
    { id: '14', name: 'Palos de Yuca', icon: '🥖', color: '#DEB887' }
];

// Categorías agrupadas para el Submenu
export const NAV_CATEGORIES = [
    { 
        name: 'DESAYUNOS', 
        category: '9',
        icon: '☕',
        filterIds: ['9']
    },
    { 
        name: 'SANGUCHES', 
        category: 'all',
        icon: '🥪',
        filterIds: ['all']
    },
    { 
        name: 'ANTOJOS', 
        category: ['10', '11', '12', '13', '14'],
        icon: '✨',
        filterIds: ['10', '11', '12', '13', '14']
    }
];

// Función para mapear categorías del Submenu a Filters
export const mapNavToFilterCategory = (navCategory) => {
    const category = NAV_CATEGORIES.find(cat => cat.name === navCategory);
    return category ? category.filterIds : ['all'];
};

export const ROUTES = {
    HOME: '/',
    MENU: '/menuSanguches',
    LOCAL: '/Local',
};

export const CATEGORIES = [
    { name: 'DESAYUNOS', category: '9' },
    { name: 'SANGUCHES', category: 'all' },
    { name: 'ANTOJOS', category: ['10', '11', '12', '13', '14'] },
];

export const CART_WIDTH = 'w-full sm:w-96 md:w-120';
export const ANIMATION_DURATION = 300;
export const MIN_QUANTITY = 1;
export const COLORS = Object.freeze({
    PRIMARY: '#FFC603',
    SECONDARY: '#C8151B',
    BACKGROUND: '#FFF9C4',
    TEXT: '#333333',
});

export const SNACKBAR_DURATION = 3000;
export const SNACKBAR_POSITION = Object.freeze({
    vertical: 'top',
    horizontal: 'center',
});

export const CUSTOMIZATION_TYPES = Object.freeze({
    ADDITIONS: 'additions',
    SAUCES: 'sauces',
    DRINKS: 'drinks',
});

/* 
export const socialMedia = [
    {
        id: "social-media-1",
        icon: instagram,
        link: "https://www.instagram.com/",
    },
    {
        id: "social-media-2",
        icon: facebook,
        link: "https://www.facebook.com/",
    },
    {
        id: "social-media-3",
        icon: twitter,
        link: "https://www.twitter.com/",
    },
    {
        id: "social-media-4",
        icon: linkedin,
        link: "https://www.linkedin.com/",
    },
];
 */