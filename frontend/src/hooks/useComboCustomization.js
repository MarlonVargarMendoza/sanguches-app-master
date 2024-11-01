import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomizationContext } from '../context/CustomizeContext';
import { useCart } from './useCart';

export const useComboCustomization = (initialCombo) => {
    const { state, dispatch } = useContext(CustomizationContext);
    const navigate = useNavigate();
    const { addToCart, updateCartItem } = useCart();
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const initializeCombo = async () => {
            if (!initialCombo) {
                dispatch({
                    type: 'SET_ERROR',
                    payload: "No se ha seleccionado ningún combo."
                });
                return;
            }

            try {
                dispatch({
                    type: 'SET_INITIAL_DATA',
                    payload: {
                        product: initialCombo,
                        customizations: {
                            accompaniments: initialCombo.accompaniments || [],
                            drinks: initialCombo.drinks || [],
                            extras: initialCombo.extras || [],
                            sauces: initialCombo.sauces || []
                        },
                        isEditing: !!location.state?.isEditing
                    }
                });
            } catch (error) {
                console.error('Error initializing combo:', error);
                dispatch({
                    type: 'SET_ERROR',
                    payload: "Error al cargar las opciones del combo."
                });
            }
        };

        initializeCombo();
    }, [initialCombo, dispatch]);

    const handleSelectionChange = useCallback((type, value) => {
        // Validar selecciones requeridas
        if ((type === 'accompaniments' || type === 'drinks') && value.length > 1) {
            value = [value[value.length - 1]]; // Solo mantener última selección
        }

        dispatch({
            type: 'UPDATE_SELECTION',
            payload: { type, value }
        });
    }, [dispatch]);

    const calculatePrice = useCallback(() => {
        if (!state.product) return 0;
        let totalPrice = state.product.basePrice;

        // Agregar precio de extras si existen
        if (state.selections.extras) {
            totalPrice += state.selections.extras.reduce((sum, id) => {
                const extra = state.customizations.extras?.find(e => e.id === id);
                return sum + (extra?.price || 0);
            }, 0);
        }

        return totalPrice * state.quantity;
    }, [state.product, state.customizations, state.selections, state.quantity]);

    const handleAddToCart = useCallback(() => {
        // Validar selecciones requeridas
        if (!state.selections.accompaniments?.length || !state.selections.drinks?.length) {
            dispatch({
                type: 'SET_ERROR',
                payload: "Debes seleccionar un acompañamiento y una bebida."
            });
            return;
        }

        const customizedCombo = {
            ...state.product,
            customizations: {
                accompaniments: mapSelections('accompaniments'),
                drinks: mapSelections('drinks'),
                extras: mapSelections('extras'),
                sauces: mapSelections('sauces')
            },
            quantity: state.quantity,
            calculatedPrice: calculatePrice()
        };

        if (state.isEditing) {
            updateCartItem(state.product.id, customizedCombo);
        } else {
            addToCart(customizedCombo);
        }

        setSnackbarOpen(true);
        navigate(-1);
    }, [state, calculatePrice, addToCart, updateCartItem, navigate]);

    const mapSelections = useCallback((type) => {
        return state.selections[type]?.map(id => {
            const item = state.customizations[type]?.find(i => i.id === id);
            return {
                id: item.id,
                text: item.text || item.name,
                price: type === 'extras' ? item.price : 0
            };
        }) || [];
    }, [state.selections, state.customizations]);

    return {
        combo: state.product,
        loading: state.loading,
        error: state.error,
        selections: state.selections,
        quantity: state.quantity,
        snackbarOpen,
        handleSelectionChange,
        handleQuantityChange: (change) => dispatch({
            type: 'UPDATE_QUANTITY',
            payload: (prev) => Math.max(1, prev + change)
        }),
        handleAddToCart,
        setSnackbarOpen,
        calculatePrice,
        isEditing: state.isEditing
    };
};

export default useComboCustomization;