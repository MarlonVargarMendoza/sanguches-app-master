import React, { useState } from 'react';
import { CartProvider } from '../../context/cart.jsx';
import { useFilters } from '../../hooks/useFilters.js';
import { products as initialProducts } from '../../mocks/products.json';
import Navbar from '../Navbar/Navbar.jsx';

const Customize = () => {


  const [cartItems, setCartItems] = useState([]);
  const { filterProducts } = useFilters()
  const filteredProducts = filterProducts(initialProducts)
  console.log(' Editalo tu mismo --> LLEGAMOS ');


  return (
    <CartProvider>
      <Navbar cartItems={cartItems}  />
      <h1>hola</h1>

      <div className="bg-primary w-full">
        <div className='footer text-center '>2024 Sanguches Xpress- Todos los derechos reservados</div>
      </div>

    </CartProvider>
  )
}

export default Customize