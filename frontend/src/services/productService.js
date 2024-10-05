
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
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error('Error fetching drinks:', error);
        return []; // Return an empty array if there's an error
    }
};
export const getSauces = async () => {
    // Valores predefinidos para las salsas
    const defaultSauces = [
        { id: 1, name: 'Mayonesa --> 2500', price: 0.5 },
        { id: 2, name: 'Ketchup', price: 0.5 },
        { id: 3, name: 'Mostaza', price: 0.5 },
        { id: 4, name: 'BBQ', price: 0.75 },
    ];

    try {
        const response = await axios.get(`${API_URL}/api/sauces`);
        return response.data.data;
    } catch (error) {
        console.warn('API de salsas no disponible, usando valores predefinidos');
        return defaultSauces;
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
