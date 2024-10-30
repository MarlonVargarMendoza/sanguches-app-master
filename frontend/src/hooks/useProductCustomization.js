// hooks/useProductCustomization.js
import { useCallback, useEffect, useState } from 'react';
import { getAllCustomizations, getCompanionsCombo, getDrinksCombo } from '../services/productService';

export const CUSTOMIZATION_MODES = {
    COMBO: 'combo',
    PRODUCT: 'product'
};

export const useProductCustomization = (initialProduct, mode = CUSTOMIZATION_MODES.PRODUCT) => {
    const [customizationState, setCustomizationState] = useState({
        loading: true,
        error: null,
        options: {
            drinks: [],
            companions: [],
            additions: [],
            sauces: []
        },
        selected: {
            drinks: [],
            companions: [],
            additions: [],
            sauces: []
        }
    });

    const isComboMode = mode === CUSTOMIZATION_MODES.COMBO;

    const fetchCustomizationOptions = useCallback(async () => {
        try {
            setCustomizationState(prev => ({ ...prev, loading: true }));

            if (isComboMode) {
                // Fetch combo-specific options
                const [drinks, companions] = await Promise.all([
                    getDrinksCombo(),
                    getCompanionsCombo()
                ]);

                setCustomizationState(prev => ({
                    ...prev,
                    loading: false,
                    options: {
                        ...prev.options,
                        drinks,
                        companions
                    },
                    // Pre-seleccionar opciones por defecto si existen
                    selected: {
                        drinks: initialProduct.drinks_id ? [initialProduct.drinks_id] : [],
                        companions: initialProduct.companions_id ? [initialProduct.companions_id] : [],
                        additions: [],
                        sauces: []
                    }
                }));
            } else {
                // Fetch regular product customization options
                const customizations = await getAllCustomizations();

                setCustomizationState(prev => ({
                    ...prev,
                    loading: false,
                    options: customizations,
                    selected: {
                        drinks: [],
                        companions: [],
                        additions: [],
                        sauces: []
                    }
                }));
            }
        } catch (error) {
            setCustomizationState(prev => ({
                ...prev,
                loading: false,
                error: 'Error al cargar opciones de personalización'
            }));
        }
    }, [isComboMode, initialProduct]);

    useEffect(() => {
        fetchCustomizationOptions();
    }, [fetchCustomizationOptions]);

    const handleCustomizationChange = useCallback((type, selections) => {
        setCustomizationState(prev => ({
            ...prev,
            selected: {
                ...prev.selected,
                [type]: selections
            }
        }));
    }, []);

    const calculateTotalPrice = useCallback(() => {
        if (!initialProduct) return 0;

        let totalPrice = initialProduct.basePrice;

        if (!isComboMode) {
            // Solo añadir costos adicionales para productos regulares
            const { selected, options } = customizationState;

            Object.entries(selected).forEach(([type, selections]) => {
                if (type === 'sauces') return; // Las salsas no tienen costo adicional

                selections.forEach(selectionId => {
                    const option = options[type]?.find(opt => opt.id === selectionId);
                    if (option?.price) {
                        totalPrice += option.price;
                    }
                });
            });
        }

        return totalPrice;
    }, [initialProduct, isComboMode, customizationState]);

    const validateCustomizations = useCallback(() => {
        if (isComboMode) {
            const { drinks, companions } = customizationState.selected;
            return drinks.length === 1 && companions.length === 1;
        }
        return true;
    }, [isComboMode, customizationState.selected]);

    return {
        ...customizationState,
        isComboMode,
        handleCustomizationChange,
        calculateTotalPrice,
        validateCustomizations
    };
};