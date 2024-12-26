import { useCallback, useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/cart.jsx';

export const useCart = () => {
  const { state, dispatch } = useContext(CartContext);
  const [totalPrice, setTotalPrice] = useState(0);

  const calculateItemPrice = useCallback((item) => {
    let price = item.basePrice;
    if (item.customizations) {
      if (item.customizations.additions) {
        price += item.customizations.additions.reduce((sum, addition) => sum + addition.price, 0);
      }
      if (item.customizations.drinks) {
        price += item.customizations.drinks.reduce((sum, drink) => sum + drink.price, 0);
      }
      if (item.customizations.accompaniments) {
        price += item.customizations.accompaniments.reduce((sum, accompaniment) => sum + accompaniment.price, 0);
      }
    }
    return price * item.quantity;
  }, []);

  const calculateTotalPrice = useCallback(() => {
    return state.items.reduce((total, item) => total + calculateItemPrice(item), 0);
  }, [state.items, calculateItemPrice]);
// Los suscriptores reaccionan automáticamente a los cambios en el estado
  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [state.items, calculateTotalPrice]);

  const updateCartItem = useCallback((itemId, updatedItem) => {
    dispatch({ type: 'UPDATE_ITEM', payload: { id: itemId, updates:updatedItem } });
  }, [dispatch]);

  const removeFromCart = useCallback((itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  }, [dispatch]);

  const addToCart = useCallback((item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, [dispatch]);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, [dispatch]);

  const generateVoucher = useCallback(() => {
    return state.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: calculateItemPrice(item),
      customizations: item.customizations
    }));
  }, [state.items, calculateItemPrice]);

  return {
    cart: state.items,
    totalPrice,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    calculateItemPrice,
    calculateTotalPrice,
    updateCartItem,
    generateVoucher
  };
};

export default useCart;