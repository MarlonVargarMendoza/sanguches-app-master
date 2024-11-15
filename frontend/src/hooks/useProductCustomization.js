import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomizationContext } from '../context/CustomizeContext';
import { getAllCustomizations, getAllProducts } from '../services/productService';
import { useCart } from './useCart';

export const useCustomizations = (initialProduct) => {
    const { state, dispatch } = useContext(CustomizationContext);
    const navigate = useNavigate();
    const { addToCart, updateCartItem } = useCart();
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!initialProduct) {
                dispatch({
                    type: 'SET_ERROR',
                    payload: "No se ha seleccionado ningún producto."
                });
                return;
            }

            try {
                const [customizations, productsData] = await Promise.all([
                    getAllCustomizations(),
                    getAllProducts()
                ]);

                dispatch({
                    type: 'SET_INITIAL_DATA',
                    payload: {
                        product: initialProduct,
                        customizations,
                        products: productsData,
                        isEditing: !!location.state?.isEditing
                    }
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                dispatch({
                    type: 'SET_ERROR',
                    payload: "Error al cargar las opciones de personalización."
                });
            }
        };

        fetchData();
    }, [initialProduct, dispatch]);

    const handleSelectionChange = useCallback((type, value) => {
        dispatch({
            type: 'UPDATE_SELECTION',
            payload: { type, value }
        });
    }, [dispatch]);

    const handleQuantityChange = useCallback((change) => {
        dispatch({
            type: 'UPDATE_QUANTITY',
            payload: (prev) => Math.max(1, prev + change)
        });
    }, [dispatch]);

    const calculatePrice = useCallback(() => {
        if (!state.product) return 0;
        let totalPrice = state.product.basePrice;

        const calculateAdditionalCost = (items, selectedIds, priceKey = 'price') =>
            selectedIds.reduce((sum, id) => {
                const item = items?.find(i => i.id === id);
                return sum + (item ? (item[priceKey] || item.basePrice || 0) : 0);
            }, 0);

        totalPrice += calculateAdditionalCost(
            state.customizations.additions,
            state.selections.additions
        );
        totalPrice += calculateAdditionalCost(
            state.customizations.drinks,
            state.selections.drinks,
            'basePrice'
        );
        totalPrice += calculateAdditionalCost(
            state.customizations.accompaniments,
            state.selections.accompaniments,
            'basePrice'
        );

        return totalPrice * state.quantity;
    }, [state.product, state.customizations, state.selections, state.quantity]);

    const mapCustomizations = useCallback((type, selectedIds) => {
        return selectedIds.map(id => {
            const item = state.customizations[type]?.find(i => i.id === id);
            if (!item) return null;

            return {
                id: item.id,
                text: item.text || item.name,
                price: type === 'sauces' ? 0 : (item.price || item.basePrice || 0)
            };
        }).filter(Boolean);
    }, [state.customizations]);

    const handleAddToCart = useCallback(() => {
        const { product, selections, quantity } = state;
        if (!product) return;

        const customizedProduct = {
            ...product,
            customizations: {
                additions: mapCustomizations('additions', selections.additions),
                sauces: mapCustomizations('sauces', selections.sauces),
                drinks: mapCustomizations('drinks', selections.drinks),
                accompaniments: mapCustomizations('accompaniments', selections.accompaniments)
            },
            quantity,
            calculatedPrice: calculatePrice()
        };

        if (state.isEditing) {
            updateCartItem(product.id, customizedProduct);
        } else {
            addToCart(customizedProduct);
        }

        setSnackbarOpen(true);
        navigate(-1);
    }, [state, calculatePrice, mapCustomizations, addToCart, updateCartItem, navigate]);

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