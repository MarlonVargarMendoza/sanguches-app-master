// src/context/ProductsContext.jsx
import React, { createContext, useEffect, useState } from 'react';
import productsMock from '../mocks/products.json';
export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Simula la carga de productos desde una fuente de datos
        setProducts(productsMock);
    }, []);

    return (
        <ProductsContext.Provider value={{ products }}>
            {children}
        </ProductsContext.Provider>
    );
};