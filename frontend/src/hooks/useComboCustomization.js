import { useCallback, useEffect, useState } from 'react';
import { useCart } from '../hooks/useCart';
import { getCompanionsCombo, getDrinksCombo } from '../services/productService';

export const useComboCustomization = (initialCombo) => {
    const { addToCart, updateCartItem, cart } = useCart();
    const [state, setState] = useState({
        combo: initialCombo,
        customizationOptions: {
            drinks: [],
            accompaniments: []
        },
        selections: {
            drinks: null,
            accompaniments: null
        },
        quantity: 1,
        loading: true,
        error: null
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // Cargar opciones de personalización con la lógica de precios actualizada
    useEffect(() => {
        let mounted = true;

        const fetchCustomizationOptions = async () => {
            if (!initialCombo) return;

            setState(prev => ({ ...prev, loading: true }));
            try {
                const [drinksResponse, companionsResponse] = await Promise.all([
                    getDrinksCombo(),
                    getCompanionsCombo()
                ]);

                if (!mounted) return;

                const drinks = drinksResponse.data?.map(drink => ({
                    id: drink.id,
                    text: drink.text,
                    combo_price: drink.combo_price || 0, // Precio adicional si es una bebida premium
                    basePrice: drink.basePrice,
                    isDefault: !drink.combo_price // Las bebidas sin precio adicional son las incluidas
                })) || [];

                const accompaniments = companionsResponse.data?.map(companion => ({
                    id: companion.value,
                    text: companion.text,
                    combo_price: companion.combo_price || 0, // Precio adicional por tamaño premium
                    basePrice: companion.basePrice,
                    isDefault: !companion.combo_price // Los acompañamientos sin precio adicional son los incluidos
                })) || [];

                // Encontrar las opciones por defecto o mantener las seleccionadas
                const defaultDrink = drinks.find(d => d.isDefault) || drinks[0];
                const defaultAccompaniment = accompaniments.find(a => a.isDefault) || accompaniments[0];

                setState(prev => ({
                    ...prev,
                    customizationOptions: {
                        drinks,
                        accompaniments
                    },
                    selections: {
                        drinks: prev.selections.drinks || defaultDrink,
                        accompaniments: prev.selections.accompaniments || defaultAccompaniment
                    },
                    loading: false
                }));

            } catch (error) {
                if (!mounted) return;
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: 'Error al cargar las opciones de personalización'
                }));
            }
        };

        fetchCustomizationOptions();
        return () => { mounted = false; };
    }, [initialCombo]);

    // Calcular precio con la nueva lógica
    const calculatePrice = useCallback(() => {
        const { combo, selections, quantity } = state;
        if (!combo) return 0;

        let total = combo.basePrice;
        
        // Solo agregar costos adicionales si se seleccionaron opciones premium
        if (selections.drinks?.combo_price > 0) {
            total += selections.drinks.combo_price;
        }
        
        if (selections.accompaniments?.combo_price > 0) {
            total += selections.accompaniments.combo_price;
        }

        return total * quantity;
    }, [state]);

    const calculateSavings = useCallback(() => {
        const { combo } = state;
        if (!combo?.originalPrice) return 0;
        const currentPrice = calculatePrice();
        return (combo.originalPrice - currentPrice);
    }, [state, calculatePrice]);

    // Formatear el item para el carrito
    const formatCartItem = useCallback(() => {
        const { combo, selections, quantity } = state;
        
        return {
            id: combo.id,
            name: combo.name,
            type: 'combo',
            basePrice: combo.basePrice,
            image: combo.image,
            quantity,
            customizations: {
                drinks: selections.drinks ? [{
                    id: selections.drinks.id,
                    name: selections.drinks.text,
                    price: selections.drinks.combo_price,
                    isDefault: selections.drinks.isDefault
                }] : [],
                accompaniments: selections.accompaniments ? [{
                    id: selections.accompaniments.id,
                    name: selections.accompaniments.text,
                    price: selections.accompaniments.combo_price,
                    isDefault: selections.accompaniments.isDefault
                }] : []
            },
            calculatedPrice: calculatePrice(),
            savings: calculateSavings()
        };
    }, [state, calculatePrice, calculateSavings]);

    const handleAddToCart = useCallback(() => {
        const cartItem = formatCartItem();
        
        if (cart.some(item => item.id === cartItem.id)) {
            updateCartItem(cartItem.id, cartItem);
        } else {
            addToCart(cartItem);
        }

        setSnackbarOpen(true);
    }, [formatCartItem, cart, updateCartItem, addToCart]);

    return {
        ...state,
        snackbarOpen,
        setSnackbarOpen,
        handleSelectionChange: useCallback((type, item) => {
            setState(prev => ({
                ...prev,
                selections: {
                    ...prev.selections,
                    [type]: item
                }
            }));
        }, []),
        handleQuantityChange: useCallback((change) => {
            setState(prev => ({
                ...prev,
                quantity: Math.max(1, prev.quantity + change)
            }));
        }, []),
        handleAddToCart,
        calculatePrice,
        calculateSavings,
        isEditing: cart.some(item => item.id === state.combo?.id)
    };
};