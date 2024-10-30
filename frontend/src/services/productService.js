
const API_URL = import.meta.env.VITE_APP_DOMAIN;
import axios from 'axios';

export const getProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/products`);
        return response.data.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (error.response.status === 404) {
                throw new Error('Products not found');
            } else if (error.response.status === 500) {
                throw new Error('Server error. Please try again later.');
            } else {
                throw new Error('Error fetching products. Status Code: ' + error.response.status);
            }
        } else if (error.request) {
            throw new Error('No response received from the server.');
        } else {
            throw new Error('An unexpected error occurred while fetching products.');
        }
    }
};
export const getProductsByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/api/products/${categoryId}`);
        return response.data.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const getProductsByCategories = async (categories) => {
    try {
        if (categories.includes('all')) {
            return getAllProducts();
        }
        const promises = categories.map(category => getProductsByCategory(category));
        const results = await Promise.all(promises);
        return results.flat();
    } catch (error) {
        handleAxiosError(error);
    }
};
export const getAllProducts = async (categoryId = 'all') => {
    try {
        const url = categoryId === 'all'
            ? `${API_URL}/api/products`
            : `${API_URL}/api/products/${categoryId}`;
        const response = await axios.get(url);
        return response.data.data;
    } catch (error) {
        handleAxiosError(error);
    }
};
export const getAllCustomizations = async () => {
    try {
        const [additions, sauces, drinks, accompaniments] = await Promise.all([
            getAdditions(),
            getSaucesSelect(),
            getDrinksSelect(),
            getAccompaniments()
        ]);

        return {
            additions,
            sauces,
            drinks,
            accompaniments: accompaniments.map(accompaniment => ({
                id: accompaniment.value,
                name: accompaniment.text,
                basePrice: accompaniment.basePrice,
                type: 'accompaniment'
            }))
        };
    } catch (error) {
        console.error('Error fetching customizations:', error);
        handleAxiosError(error);
        return {
            additions: [],
            sauces: [],
            drinks: [],
            accompaniments: []
        };
    }
};
export const getDrinks = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/drinks`);
        return response.data.data;
    } catch (error) {
        handleAxiosError(error);
    }
};
export const getDrinksSelect = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/drinks/select`);
        return response.data.data || []; // Aseguramos que siempre devolvemos un array
    } catch (error) {
        console.error('Error fetching drinks:', error);
        return []; // Devolvemos un array vacío en caso de error
    }
};
export const getSaucesSelect = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/sauces`);
        return response.data.data || [];
    } catch (error) {
        handleAxiosError(error);
    }
};

export const getAdditions = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/additions`);
        return response.data.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const getAccompaniments = async () => {
    try {
        // Fetch both accompaniments in parallel
        const response = await axios.get(`${API_URL}/api/companions`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching accompaniments:', error);
        handleAxiosError(error);
    }
};

export const getProductById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/api/products/${id}`);
        return response.data.data;
    } catch (error) {
        handleAxiosError(error);
    }
};



export const getIngredients = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/additions`);
        return response.data.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

export const getCombo = async () => {
    try {
        const [combosResponse, drinksResponse, companionsResponse] = await Promise.all([
            axios.get(`${API_URL}/api/combo`),
            axios.get(`${API_URL}/api/drinks/combo`),
            axios.get(`${API_URL}/api/companions/combo`)
        ]);

        // Corrección de la extracción de datos
        const combos = Array.isArray(combosResponse.data) ? combosResponse.data : [];
        const drinks = drinksResponse.data?.data || [];
        const companions = companionsResponse.data?.data || [];

        if (combos.length === 0) {
            return [];
        }

        return combos.map(combo => {
            const selectedDrink = drinks.find(drink => drink.id === combo.drinks_id);
            const selectedCompanion = companions.find(comp => comp.value === combo.companions_id);

            return {
                id: combo.id,
                name: combo.name,
                basePrice: parseFloat(combo.price),
                image: combo.image,
                ingredients: [
                    { name: `🎁 ${combo.name}` },
                    ...(selectedDrink ? [{ name: `🥤 ${selectedDrink.text}` }] : []),
                    ...(selectedCompanion ? [{ name: `🍟 ${selectedCompanion.text}` }] : [])
                ],
                customizations: {
                    drinks: selectedDrink ? [{
                        id: selectedDrink.id,
                        name: selectedDrink.text,
                        price: parseFloat(selectedDrink.basePrice || 0)
                    }] : [],
                    companions: selectedCompanion ? [{
                        id: selectedCompanion.value,
                        name: selectedCompanion.text,
                        price: parseFloat(selectedCompanion.combo_price || 0)
                    }] : []
                }
            };
        });
    } catch (error) {
        console.error('Error fetching combo data:', error);
        throw new Error('Error al cargar los combos');
    }
};
export const getCompanionsCombo = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/companions/combo`);
        return response.data.data;
    } catch (error) {
        handleAxiosError(error);
    }
};
export const getDrinksCombo = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/drinks/combo`);
        return response.data.data;
    } catch (error) {
        handleAxiosError(error);
    }
};
// Centralized Axios error handling
const handleAxiosError = (error) => {
    if (error.response) {
        if (error.response.status === 404) {
            throw new Error('Resource not found');
        } else if (error.response.status === 500) {
            throw new Error('Server error. Please try again later.');
        } else {
            throw new Error(`Error fetching data. Status Code: ${error.response.status}`);
        }
    } else if (error.request) {
        throw new Error('No response received from the server.');
    } else {
        throw new Error('An unexpected error occurred while fetching data.');
    }
};
