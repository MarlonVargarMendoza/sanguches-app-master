import React, { useState } from 'react';
import { Hero } from './components';
import { Productsjson } from './components/Product/Products.jsx';
import { CartProvider } from './context/cart.jsx';

const App = () => {

/*   const { filterProducts } = useFilters()
  const filteredProducts = filterProducts(initialProducts) */

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
          <Productsjson />
        </div>

      </div>
    </CartProvider>
  );
};

export default App;