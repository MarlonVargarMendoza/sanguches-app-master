import HeartIcon from '@mui/icons-material/Favorite';
import HeartOutlinedIcon from '@mui/icons-material/FavoriteBorder';
import { Link as RouterLink } from 'react-router-dom'; // Asegúrate de importar RouterLink
import { Button } from '../../components'; // Asegúrate de importar Grid
import { useCart } from '../../hooks/useCart.js';

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
          {products.slice(0, 3).map((product) => {
            const isProductInCart = checkProductInCart(product);

            return (
              <li 
                key={product.id} 
                className="card relative overflow-hidden bg-white rounded-lg shadow-lg flex flex-col gap-4 transform hover:scale-105 transition-transform duration-300"
              >
                <div className="img-container h-32"> 
                  <img 
                    src={product.thumbnail} 
                    alt={product.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="actions">
                  <a href="#" className="favorite" onClick={() => toggleFavorite(product)}>
                    {isProductInCart ? (
                      <HeartIcon className="text-red-500" />
                    ) : (
                      <HeartOutlinedIcon className="text-gray-500" />
                    )}
                  </a>
                </div>
                <div className="p-4"> 
                  <h3 className="font-bold text-lg mb-2">{product.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="flip-container p-1">
                  <div className="flip-box">
                    <div className="flip-box-front">
                      <del>
                        <span className="price">${(product.price * 1.2).toFixed(2)}</span>
                      </del>
                      <ins>
                        <span className="price">${product.price.toFixed(2)}</span>
                      </ins>
                    </div>
                    <div className="flip-box-back">
                      <RouterLink to='/editaloTuMismo' state={{ selectedProduct: product }}> {/* Usa RouterLink */}
                        <button
                          style={{ backgroundColor: isProductInCart ? 'red' : '#FFD700' }}
                          className="px-4 py-2 rounded-lg text-white font-semibold hover:bg-orange-500 transition-colors duration-300"
                        >
                          <span className="button-text">Ordenar Ahora</span> 
                        </button>
                      </RouterLink>
                    </div>
                  </div>
                </div> 
              </li>
            );
          })}
        </ul>
      </div>
      <div className='filters-container absolute top-0 left-0 w-full p-4 z-20 mt-15 z-20'>
        <Button buttonText='Ver menu completo' />
      </div>
    </main>
  );
}

export default Productsjson;