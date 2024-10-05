import React, { createContext, useEffect, useReducer } from 'react';
import { cartReducer } from '../reducers/cart';

export const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    try {
      const localData = localStorage.getItem('cart');
      return localData ? JSON.parse(localData) : initialState;
    } catch (error) {
      console.error('Error parsing cart data from localStorage:', error);
      return initialState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving cart data to localStorage:', error);
    }
  }, [state]);

  useEffect(() => {
    if (state && Array.isArray(state.items)) {
      const total = state.items.reduce((sum, item) => sum + (item.calculatedPrice || 0), 0);
      dispatch({ type: 'UPDATE_TOTAL', payload: total });
    }
  }, [state?.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};