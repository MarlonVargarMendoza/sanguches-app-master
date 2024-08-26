import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const HomePage = lazy(() => import('../App'));
const CustomizeSandwiches = lazy(() => import('../components/Pages/Customize'));
const Menu = lazy(() => import('../components/Productsjson/ProductsSanguches'));
const ProductDetails = lazy (() => import ('../components/Pages/product/ProductDetails'));

export const AppRoute = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path='/editaloTuMismo' element={<CustomizeSandwiches/>} />
        <Route path='/menuSanguches' element={<Menu/>} />
        <Route path="/product/:slug" element={<ProductDetails />} />
      </Routes>
    </Suspense>
  );
};
