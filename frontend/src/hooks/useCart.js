import { useContext } from 'react';
import { CartContext } from '../context/cart';

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const { state, dispatch } = context;

  return {
    cart: state?.items || [],
    addToCart: (product) => {
      if (product) {
        dispatch({ type: 'ADD_ITEM', payload: product });
      }
    },
    removeFromCart: (productId) => {
      if (productId) {
        dispatch({ type: 'REMOVE_ITEM', payload: productId });
      }
    },
    updateCartItem: (productId, updates) => {
      if (productId && updates) {
        dispatch({ type: 'UPDATE_ITEM', payload: { id: productId, updates } });
      }
    },
    clearCart: () => {
      dispatch({ type: 'CLEAR_CART' });
    },
    calculateTotalPrice: () => {
      return (state?.items || []).reduce((total, item) => total + (item.calculatedPrice || 0), 0);
    },
    calculateItemPrice: (item) => {
      if (!item) return 0;
      return item.calculatedPrice || 0;
    }
  };
};

export default useCart;