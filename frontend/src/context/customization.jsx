import React, { createContext, useContext, useState } from 'react';

const CustomizationContext = createContext();

export const useCustomization = () => useContext(CustomizationContext);

export const CustomizationProvider = ({ children }) => {
    const [customizations, setCustomizations] = useState({});

    const updateCustomization = (productId, newCustomizations) => {
        setCustomizations(prev => ({
            ...prev,
            [productId]: { ...prev[productId], ...newCustomizations }
        }));
    };

    const value = {
        customizations,
        updateCustomization,
    };

    return <CustomizationContext.Provider value={value}>{children}</CustomizationContext.Provider>;
};