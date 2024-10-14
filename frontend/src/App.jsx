import React, { useState } from 'react';
import { Favorites, Hero } from './components';
import { Productsjson } from './components/Product/Products.jsx';
import { CartProvider } from './context/cart.jsx';
import { useFilters } from './hooks/useFilters.js';
import { products as initialProducts } from './mocks/products.json';

const App = () => {

  const { filterProducts } = useFilters()
  const filteredProducts = filterProducts(initialProducts)

  const [cartItems, setCartItems] = useState([]);
  const handleAddToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  return (
    <CartProvider>
      
      <div className="bg-primary ">
        <div >
            <Hero />
        </div>
        
        <div className="bg-primary w-full overflow-hidden">
          <Productsjson products={filteredProducts} />
        </div>

        <div className="bg-primary w-full overflow-hidden">
          <Favorites />
        </div>
      </div>
    </CartProvider>
  );
};

export default App;