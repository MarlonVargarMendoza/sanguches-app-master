import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

export const useComboCustomization = (initialCombo) => {
    const navigate = useNavigate();
    const { addToCart, updateCartItem, cart } = useCart();
    const [combo, setCombo] = useState(initialCombo);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [selections, setSelections] = useState({
        accompaniments: [],
        drinks: [],
        extras: [],
        sauces: []
    });

    const isEditing = cart.some(item => item.id === combo?.id);

    useEffect(() => {
        if (!initialCombo) {
            setError('No se ha seleccionado ningún combo');
            return;
        }

        // Si el combo está en el carrito, cargar sus selecciones
        if (isEditing) {
            const cartItem = cart.find(item => item.id === initialCombo.id);
            setSelections(cartItem.customizations || {});
            setQuantity(cartItem.quantity || 1);
        }

        setCombo(initialCombo);
    }, [initialCombo, cart, isEditing]);

    const handleSelectionChange = useCallback((type, newSelection) => {
        setSelections(prev => ({
            ...prev,
            [type]: newSelection
        }));
    }, []);

    const handleQuantityChange = useCallback((change) => {
        setQuantity(prev => Math.max(1, prev + change));
    }, []);

    const calculatePrice = useCallback(() => {
        if (!combo) return 0;

        let total = combo.basePrice;

        // Agregar precio de extras si hay
        selections.extras?.forEach(extraId => {
            const extra = combo.customizations?.extras?.find(e => e.id === extraId);
            if (extra?.price) total += extra.price;
        });

        return total * quantity;
    }, [combo, selections.extras, quantity]);

    const handleAddToCart = useCallback(() => {
        const customizedCombo = {
            ...combo,
            customizations: selections,
            quantity,
            calculatedPrice: calculatePrice()
        };

        if (isEditing) {
            updateCartItem(combo.id, customizedCombo);
        } else {
            addToCart(customizedCombo);
        }

        setSnackbarOpen(true);
        navigate('/combos');
    }, [combo, selections, quantity, calculatePrice, isEditing, updateCartItem, addToCart, navigate]);

    return {
        combo,
        loading,
        error,
        selections,
        quantity,
        snackbarOpen,
        handleSelectionChange,
        handleQuantityChange,
        handleAddToCart,
        setSnackbarOpen,
        calculatePrice,
        isEditing
    };
};