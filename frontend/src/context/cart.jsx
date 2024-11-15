import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { cartReducer, initialState } from '../reducers/cart';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  // Se asegura de retornar correctamente el Provider con sus props
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};