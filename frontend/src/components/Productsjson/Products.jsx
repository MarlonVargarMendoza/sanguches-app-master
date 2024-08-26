import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HeartIcon from '@mui/icons-material/Favorite';
import HeartOutlinedIcon from '@mui/icons-material/FavoriteBorder';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart.js';
import { Filters } from '../Productsjson/Filters.jsx';
import './Products.css';

export function Productsjson({ products }) {

  console.log('LLego Componente Products', products);

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
    <main className='products relative w-full p-8 '>
      <div className='filters-container absolute top-0 left-0 w-full p-4 z-20 mt-15 z-20'>
      <Filters />
      </div>

      <div className='products-list mt-16'>
      <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0 m-0 rounded-lg'>
        {products.slice(0, 3).map((product) => {
          const isProductInCart = checkProductInCart(product);

          return (
            <Link>
              <li key={product.id} className="card relative overflow-hidden bg-white rounded-lg shadow-lg flex flex-col gap-4 p-4">
                <div className="img-container">
                  <img src={product.thumbnail} alt={product.title} />
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
                <div>
                  <strong>{product.title}</strong> <br />
                  <span className="text-gray-700">{product.description}</span>
                </div>
                <div className="flip-container">
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
                      <button
                        style={{ backgroundColor: isProductInCart ? 'red' : '#09f' }}
                        onClick={() => {
                          isProductInCart ? removeFromCart(product) : addToCart(product);
                        }}
                      >
                        <span className="button-text">Ordenar ahora</span>
                        {isProductInCart ? <RemoveShoppingCartIcon /> : <ArrowForwardIcon />}
                      </button>
                    </div>
                  </div>
                </div>   {/* prueba */}
              </li>
            </Link>

          );
        })}
      </ul>
      </div>
    </main>
  );
}
