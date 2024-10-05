import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import './loader.css';

const HomePage = lazy(() => import('../App'));
const CustomizeSandwiches = lazy(() => import('../Pages/Customize.jsx'));
const Menu = lazy(() => import('../components/Product/ProductsSanguches.jsx'));
const Local = lazy(() => import('../Pages/Local.jsx'));
const Success = lazy(() => import('../Pages/Success.jsx'));
const Checkout = lazy(() => import('../Pages/Checkout.jsx'));

import { CartProvider } from '../context/cart.jsx';
import { FiltersProvider } from '../context/filters.jsx';

export const AppRoute = () => {
  return (
    <FiltersProvider>
      <CartProvider>
        <Suspense fallback={<div className="loader">
          <div className="justify-content-center jimu-primary-loading"></div>
        </div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path='/editaloTuMismo' element={<CustomizeSandwiches />} />
            <Route path='/menuSanguches' element={<Menu />} />
            <Route path='/local' element={<Local />} />
            <Route path='/success' element={<Success />} />
            <Route path='/checkout' element={<Checkout />} />
          </Routes>
        </Suspense>
      </CartProvider>
    </FiltersProvider>
  );
};