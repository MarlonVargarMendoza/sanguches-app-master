import HeartIcon from '@mui/icons-material/Favorite';
import HeartOutlinedIcon from '@mui/icons-material/FavoriteBorder';
import { Breadcrumbs, Grid, Link, Typography } from '@mui/material';
import * as React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart.js';
import styles from '../../style.js';
import { Cart } from '../Cart/Cart.jsx';
import { PersistentCart } from '../Cart/PersistentCart.jsx';
import { Navbar } from '../Navbar/Navbar.jsx';
import { Filters } from '../Productsjson/Filters.jsx';
import './Products.css';

export function ProductsSanguches({ products }) {
  const navigate = useNavigate();
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
    <div className='relative w-full'>
      <Navbar className={styles.navigation} />

      <main className='products relative w-full p-8 flex flex-col md:flex-row ' style={{ paddingTop: '250px' }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color='text.primary' underline="hover" href="/">
            Inicio {/* Replace "MUI" with your app name or logo */}
          </Link>
          <Typography color="text.primary">Menu</Typography>
        </Breadcrumbs>
        <div className='filters-container absolute top-0 left-0 w-full z-20 z-20'>
          <Filters />
        </div>
        <Grid container spacing={4} className='mt-16 '>
          <Grid item xs={10} md={8} sx={{ display: 'flex', flexDirection: 'column' }}>
            <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0 m-0 rounded-lg'>
              {products.map((product) => {
                const isProductInCart = checkProductInCart(product);

                return (
                  <li 
                    key={product.id} 
                    className="card relative overflow-hidden bg-white rounded-lg shadow-lg flex flex-col transform hover:scale-105 transition-transform duration-300"
                  >
                    <div className="img-container h-32"> {/* Reduced image height */}
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
                      <p className="text-gray-600 text-sm line-clamp-2"> {/* Limit description to 2 lines */}
                        {product.description}
                      </p>
                    </div>

                    <div className="flip-container p-1 ">
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
                          <RouterLink to='/editaloTuMismo' state={{ selectedProduct: product }}>
                            <button
                              style={{ backgroundColor: isProductInCart ? 'red' : '#FFD700' }}
                              className="px-4 py-2 rounded-lg text-white font-semibold hover:bg-orange-500 transition-colors duration-300"
                            >
                              <span className="button-text">Personalizar</span>
                            </button>
                          </RouterLink>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Grid>
          <Grid item xs={8} md={4} display={{ xs: 'none', md: 'block', lg: 'block', xl: 'block' }} >
            <PersistentCart />
          </Grid>
          <div className='cart-container w-full md:w-1/3 xl:hidden lg:hidden md:hidden'>
            <Cart />
          </div>
        </Grid>
      </main>
    </div>
  );
}

export default ProductsSanguches;