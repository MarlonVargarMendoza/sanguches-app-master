
const API_URL = import.meta.env.VITE_APP_DOMAIN;
import axios from 'axios';

// Configuración de axios con retry
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000
});
const withRetry = async (fn, retries = 3, delay = 1000) => {
    try {
        return await fn();
    } catch (error) {
        if (retries === 0 || error?.response?.status !== 429) {
            throw error;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        return withRetry(fn, retries - 1, delay * 2);
    }
};
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
            withRetry(() => getAdditions()),
            withRetry(() => getSaucesSelect()),
            withRetry(() => getDrinksSelect()),
            withRetry(() => getAccompaniments())
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
        const response = await withRetry(() =>
            axiosInstance.get(`${API_URL}/api/additions`)
        );

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
        // Obtenemos todos los datos necesarios en paralelo para mejorar el rendimiento
        const [combosResponse, drinksResponse, companionsResponse] = await Promise.all([
            axios.get(`${API_URL}/api/combo`),
            getDrinksCombo(),
            getCompanionsCombo()
        ]);

        const combos = Array.isArray(combosResponse.data) ? combosResponse.data : [];
        const drinks = drinksResponse?.data || [];
        const companions = companionsResponse?.data || [];

        if (combos.length === 0) {
            throw new Error('No se encontraron combos disponibles');
        }

        return combos.map(combo => {
            // Encontramos los detalles del acompañamiento y la bebida
            const selectedDrink = drinks.find(drink => drink.id === combo.drinks_id);
            const selectedCompanion = companions.find(comp => comp.value === combo.companions_id);

            // Calculamos el precio original y el ahorro
            const originalPrice = parseFloat(combo.price) * 1.2; // 20% más caro
            const savings = originalPrice - parseFloat(combo.price);

            // Construimos la descripción detallada
            const description = `Delicioso combo que incluye: 
                ${combo.name} + 
                ${selectedDrink?.text?.split('-->')[0]?.trim() || 'Bebida'} + 
                ${selectedCompanion?.text?.split('-->')[0]?.trim() || 'Acompañamiento'}`;

            return {
                id: combo.id,
                name: combo.name,
                description,
                basePrice: parseFloat(combo.price),
                originalPrice,
                savings,
                image: combo.image,
                includes: [
                    combo.name,
                    selectedDrink?.text?.split('-->')[0]?.trim(),
                    selectedCompanion?.text?.split('-->')[0]?.trim()
                ].filter(Boolean),
                customizations: {
                    drinks: selectedDrink ? [{
                        id: selectedDrink.id,
                        name: selectedDrink.text.split('-->')[0].trim(),
                        price: parseFloat(selectedDrink.basePrice || 0),
                        type: 'drink'
                    }] : [],
                    accompaniments: selectedCompanion ? [{
                        id: selectedCompanion.value,
                        name: selectedCompanion.text.split('-->')[0].trim(),
                        price: parseFloat(selectedCompanion.combo_price || 0),
                        type: 'companion'
                    }] : [],
                    extras: [], // Para posibles extras adicionales
                    sauces: []  // Para posibles salsas adicionales
                },
                terms: "Válido todos los días. No acumulable con otras promociones."
            };
        });
    } catch (error) {
        console.error('Error fetching combo data:', error);
        throw new Error('Error al cargar los combos. Por favor, intenta nuevamente.');
    }
};

export const getCompanionsCombo = async () => {
    try {
        const response = await withRetry(() => 
            axiosInstance.get(`${API_URL}/api/companions/combo`)
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching companions:', error);
        return { data: [] };
    }
};
export const getDrinksCombo = async () => {
    try {
        const response = await withRetry(() => 
            axiosInstance.get(`${API_URL}/api/drinks/combo`)
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching drinks:', error);
        return { data: [] };
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
