import HeartIcon from '@mui/icons-material/Favorite';
import HeartOutlinedIcon from '@mui/icons-material/FavoriteBorder';
import { Link as RouterLink } from 'react-router-dom'; // Asegúrate de importar RouterLink
import { Button } from '../../components'; // Asegúrate de importar Grid
import { useCart } from '../../hooks/useCart.js';
import  ProductCard  from '../Productsjson/ProductCard.jsx';
import './Products.css';

export function Productsjson({ products }) {
  const { addToCart, removeFromCart, cart } = useCart();
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

  return (
    <main className='products relative w-full p-8 flex flex-col md:flex-row'>
      <div className='products-list mt-16 py-8'>
        <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0 m-0 rounded-lg'>
          {products && Array.isArray(products) && products.slice(0, 3).map((product)  => {
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
      </div>
      <div className='filters-container absolute top-0 left-0 w-full p-4 z-20 mt-15'>
        <Button buttonText='Ver menu completo' />
      </div>
    </main>
  );
}

export default Productsjson;