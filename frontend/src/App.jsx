import React, { useState } from 'react';
import { Favorites, Hero, Navbar } from './components';
import Footer from './components/Layout/Footer.jsx';
import { Productsjson } from './components/Product/Products.jsx';
import { IS_DEVELOPMENT } from './config.js';
import { CartProvider } from './context/cart.jsx';
import { useFilters } from './hooks/useFilters.js';
import { products as initialProducts } from './mocks/products.json';
import styles from './style.js';

const App = () => {

  const { filterProducts } = useFilters()
  const filteredProducts = filterProducts(initialProducts)

  const [cartItems, setCartItems] = useState([]);
  const handleAddToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  return (
    <CartProvider>
      <Navbar cartItems={cartItems} className={styles.navigation}/>
      
      <div className="bg-primary ">
        <div >
            <Hero />
        </div>
        
        <div className="bg-primary w-full overflow-hidden">
          <Productsjson products={filteredProducts} />
        </div>

        <div className="bg-primary w-full overflow-hidden">
          <Favorites />
          {IS_DEVELOPMENT && <Footer />}
        </div>
      </div>
    </CartProvider>
  );
};

export default App;