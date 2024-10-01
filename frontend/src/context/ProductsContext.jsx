import React, { createContext, useContext } from 'react';
import { useProductData } from '../hooks/useProductData';

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const productData = useProductData();

    return <ProductContext.Provider value={productData}>{children}</ProductContext.Provider>;
};