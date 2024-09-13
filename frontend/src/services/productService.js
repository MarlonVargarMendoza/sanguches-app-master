import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/products`);
        return response.data.data; // Asumiendo que la respuesta tiene la estructura { data: [...] }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data.message || 'Error al obtener los productos';
            throw new Error(message);
        } else {
            throw new Error('Ocurrió un error inesperado al obtener los productos.');
        }
    }
};