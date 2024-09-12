import React, { lazy, Suspense, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './loader.css';

const HomePage = lazy(() => import('../App'));
const CustomizeSandwiches = lazy(() => import('../components/Pages/Customize'));
const Menu = lazy(() => import('../components/Productsjson/ProductsSanguches'));
const Local = lazy(() => import('../components/Pages/Local'));

import { CartProvider } from '../context/cart.jsx';
import { useFilters } from '../hooks/useFilters.js';
import { products as initialProducts } from '../mocks/products.json';

export const AppRoute = () => {
  const { filterProducts } = useFilters()
  const filteredProducts = filterProducts(initialProducts)
  const [cartItems, setCartItems] = useState([]);
  const handleAddToCart = (product) => {
    setCartItems([...cartItems, product]);
  };
  return (
    <CartProvider>
    <Suspense fallback={<div class="loader">
      <div class="justify-content-center jimu-primary-loading"></div>
    </div>}>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path='/editaloTuMismo' element={<CustomizeSandwiches products={filteredProducts}/>} />
        <Route path='/menuSanguches' element={<Menu products={filteredProducts}/>} />
        <Route path='/local' element={<Local/>} />
      </Routes>
    </Suspense>
    </CartProvider>
  );
};
