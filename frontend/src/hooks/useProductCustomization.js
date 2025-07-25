import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomizationContext } from '../context/CustomizeContext';
import { getAllCustomizations, getAllProducts } from '../services/productService';
import { useCart } from './useCart';

const calculateItemPrice = (customizations, selections, priceKey = 'price') =>
    selections.reduce((sum, id) => {
        const item = customizations?.find(i => i.id === id);
        return sum + (item?.[priceKey] || item?.basePrice || 0);
    }, 0);

const mapCustomizationItems = (customizations, selectedIds, type) =>
    selectedIds.map(id => {
        const item = customizations?.find(i => i.id === id);
        return item ? {
            id: item.id,
            text: item.text || item.name,
            price: type === 'sauces' ? 0 : (item.price || item.basePrice || 0)
        } : null;
    }).filter(Boolean);

export const useCustomizations = (initialProduct) => {
    const { state, dispatch } = useContext(CustomizationContext);
    const navigate = useNavigate();
    const { addToCart, updateCartItem } = useCart();
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        if (!initialProduct) {
            dispatch({ type: 'SET_ERROR', payload: "No se ha seleccionado ningún producto." });
            return;
        }

        Promise.all([getAllCustomizations(), getAllProducts()])
            .then(([customizations, productsData]) => {
                dispatch({
                    type: 'SET_INITIAL_DATA',
                    payload: {
                        product: initialProduct,
                        customizations,
                        products: productsData,
                        isEditing: !!location.state?.isEditing
                    }
                });
            })
            .catch(() => {
                dispatch({
                    type: 'SET_ERROR',
                    payload: "Error al cargar las opciones de personalización."
                });
            });
    }, [initialProduct, dispatch]);

    const handleSelectionChange = (type, value) => {
        dispatch({
            type: 'UPDATE_SELECTION',
            payload: { type, value }
        });
    };

    const handleQuantityChange = (change) => {
        dispatch({
            type: 'UPDATE_QUANTITY',
            payload: Math.max(1, parseInt(change) || 1)
        });
    };

    const calculatePrice = useCallback(() => {
        if (!state.product) return 0;

        const { customizations, selections, quantity, product } = state;

        // precio por tipo de customización
        const additionsPrice = calculateItemPrice(customizations.additions, selections.additions, 'price');
        const drinksPrice = calculateItemPrice(customizations.drinks, selections.drinks, 'basePrice');
        const accompanimentsPrice = calculateItemPrice(customizations.accompaniments, selections.accompaniments, 'basePrice');

        return (product.basePrice + additionsPrice + drinksPrice + accompanimentsPrice) * quantity;
    }, [state.product, state.customizations, state.selections, state.quantity]);

    const handleAddToCart = () => {
        const { product, selections, quantity } = state;
        if (!product) return;

        const customizedProduct = {
            ...product,
            customizations: {
                additions: mapCustomizationItems(state.customizations.additions, selections.additions, 'additions'),
                sauces: mapCustomizationItems(state.customizations.sauces, selections.sauces, 'sauces'),
                drinks: mapCustomizationItems(state.customizations.drinks, selections.drinks, 'drinks'),
                accompaniments: mapCustomizationItems(state.customizations.accompaniments, selections.accompaniments, 'accompaniments')
            },
            quantity,
            calculatedPrice: calculatePrice()
        };

        state.isEditing
            ? updateCartItem(product.id, customizedProduct)
            : addToCart(customizedProduct);

        setSnackbarOpen(true);
        navigate(-1);
    };

    return {
        product: state.product,
        loading: state.loading,
        error: state.error,
        products: state.products,
        customizations: state.customizations,
        selections: state.selections,
        quantity: state.quantity,
        snackbarOpen,
        isEditing: state.isEditing,
        handleSelectionChange,
        handleQuantityChange,
        handleAddToCart,
        setSnackbarOpen,
        calculatePrice
    };
};

export default useCustomizations;