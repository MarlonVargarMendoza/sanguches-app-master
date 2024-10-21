import { useEffect, useState } from 'react';
import ContentLoader from "react-content-loader";
import { useCart } from '../../hooks/useCart.js';
import { getProducts } from '../../services/productService';
import ProductCard from '../Product/ProductCard.jsx';
import Button from '../ui/Button';
import './Products.css';
export function Productsjson({ productService = getProducts }) {
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
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className='products relative w-full p-8 flex flex-col md:flex-row'>
      <div className='products-list py-8'>
        {isLoading ? ( // Display loading indicator while fetching data
          <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0 m-0 rounded-lg'>
            {/* Render placeholders mientras carga */}
            {[...Array(3)].map((_, index) => (
              <ContentLoader
                key={index}
                speed={2}
                width={400}
                height={250}
                viewBox="0 0 400 250"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
              >
                <rect x="0" y="0" rx="5" ry="5" width="400" height="150" />
                <rect x="0" y="165" rx="3" ry="3" width="350" height="20" />
                <rect x="0" y="195" rx="3" ry="3" width="250" height="20" />
                <rect x="0" y="225" rx="3" ry="3" width="150" height="20" />
              </ContentLoader>
            ))}
          </ul>
        ) : error ? ( // Display error message if fetching fails
          <div>{error}</div>
        ) : (
          <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0 m-0 rounded-lg'>
            {products && products.slice(0, 3).map((product) => {
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