import { useEffect, useState } from 'react';
import { Button } from '../../components'; // Asegúrate de importar Grid
import { useCart } from '../../hooks/useCart.js';
import ProductCard from '../Productsjson/ProductCard.jsx';
import './Products.css';

export function Productsjson() {
  const { addToCart, removeFromCart, cart } = useCart();

  //for api call
  const [products, setProducts] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const checkProductInCart = (product) => {
    return cart.some((item) => item.id === product.id);
  };

  const toggleFavorite = (product) => {
    if (checkProductInCart(product)) {
      removeFromCart(product);
    } else {
      addToCart(product);
    }
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products'); 
        if (response.ok) {
          const data = await response.json();   

          console.log("API Response:", data);
          setProducts(data.data); // Now setProducts is defined
        } else {
          // ... error handling
        }
      } catch (error) {
        // ... error handling
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); 
  return (
    <main className='products relative w-full p-8 flex flex-col md:flex-row'>
        <div className='products-list mt-16 py-8'>
        {isLoading ? ( // Display loading indicator while fetching data
          <div>Loading...</div> 
        ) : error ? ( // Display error message if fetching fails
          <div>{error}</div>
        ) : (
          <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0 m-0 rounded-lg'>
            {products.slice(0, 3).map((product) => { 
              const isProductInCart = checkProductInCart(product);

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onRemoveFromCart={removeFromCart}
                  isInCart={isProductInCart}
                />
              );
            })}
          </ul>
        )}
      </div>
      <div className='filters-container absolute top-0 left-0 w-full p-4 z-20 mt-15'>
        <Button buttonText='Ver menu completo' />
      </div>
    </main>
  );
}

export default Productsjson;