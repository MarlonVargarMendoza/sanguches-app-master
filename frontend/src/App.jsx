import React, { useState } from 'react';
import { Cart, Combo, CTA, Favorites, Footer, Hero, Navbar, Promotions, Testimonials } from './components';
import { Productsjson } from './components/Productsjson/Products.jsx';
import { IS_DEVELOPMENT } from './config.js';
import { CartProvider } from './context/cart.jsx';
import { useFilters } from './hooks/useFilters.js';
import { products as initialProducts } from './mocks/products.json';
import styles from './style.js';

const App = () => {
  /* uncomment when using commerce.js
    const [products, setProducts] = useState([]);
    const fetchProducts = async () => {
      const { data } = await Commerce.products.list();
      setProducts(response.data);
    };
  
    useEffect(() => {//hook
      fetchProducts();
    }, []);
  
    console.log(products); 
  const [cart, setCart] = useState({});
  const fetchCart = async () => {
    setCart(await Commerce.cart.retrieve());
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);
  console.log(cart);
   */
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

        <div className={`bg-dimWhite ${styles.paddingX} ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            <Promotions />
            <Combo /> 
            <CTA />
            <Testimonials />
          </div>  {/* prueba  */}
        </div>

        <div className="bg-primary w-full overflow-hidden">
          <Favorites />
          <Cart />
          {IS_DEVELOPMENT && <Footer />}
        </div>
      </div>
    </CartProvider>
  );
};

export default App;