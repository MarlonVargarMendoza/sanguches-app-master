
const API_URL = import.meta.env.VITE_APP_DOMAIN;

export const getProducts = async () => {
    try {
        const response = await fetch(`${API_URL}/api/products`);

        if (!response.ok) {
            // Handle specific HTTP error codes
            if (response.status === 404) {
                throw new Error('Products not found');
            } else if (response.status === 500) {
                throw new Error('Server error. Please try again later.');
            } else {
                throw new Error('Error fetching products');
            }
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        throw new Error('An unexpected error occurred while fetching products.');
    }
};
