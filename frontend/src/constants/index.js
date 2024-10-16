

export const ROUTES = {
    HOME: '/',
    MENU: '/menuSanguches',
    LOCAL: '/Local',
};

export const PRODUCT_IMAGES = {
    33: '/assets/products/especial.png',
    34: '/assets/products/carneBoloñesa.png',
    35: '/assets/products/pernilCerdo.png',
    36: '/assets/products/cordero.png',
    37: '/assets/products/hawaiano.png',
    38: '/assets/products/carneDesmechada.png',
    41: '/assets/products/polloDesmechado.png',
    42: '/assets/products/polloMielMostaza.png',
    43: '/assets/products/polloSalsaBlanca.png',
  };
  export const getProductImage = (productId) => {
    return PRODUCT_IMAGES[productId] || '/assets/products/default.png';
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