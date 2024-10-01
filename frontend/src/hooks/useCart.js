import { useContext, useEffect } from 'react';
import { CartContext } from '../context/cart.jsx';

export const useCart = () => {
  const { cart, addToCart, removeFromCart, clearCart } = useContext(CartContext);

  // Function to update a specific cart item by ID
  const updateCartItem = (id, updates) => {
    const updatedCart = cart.map(item => 
      item.id === id 
        ? { 
            ...item, 
            ...updates, 
            sku: generateSKU(item, updates.customizations || item.customizations) 
          } 
        : item
    );
    // Dispatch an action to update the cart in the context
    addToCart(updatedCart);
  };

  // Function to calculate the price of a cart item based on its base price and customizations
  const calculateItemPrice = (item) => {
    const basePrice = item.basePrice || 0; // Default base price if not provided
    const customizationsPrice = item.customizations
      ? item.customizations.reduce((total, customization) => total + customization.price, 0)
      : 0;

    return basePrice + customizationsPrice;
  };

  // SKU generation utility
  const generateSKU = (product, customizations = []) => {
    const baseSKU = product.baseSKU || product.id;
    const customizationCodes = customizations.map(cust => cust.code).join('-');

    return customizationCodes ? `${baseSKU}-${customizationCodes}` : baseSKU;
  };

  // Save cart to localStorage on every cart update
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartItem,
    calculateItemPrice,
  };
};