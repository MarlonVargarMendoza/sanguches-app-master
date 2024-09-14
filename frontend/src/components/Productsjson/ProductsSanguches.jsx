import HeartIcon from '@mui/icons-material/Favorite';
import HeartOutlinedIcon from '@mui/icons-material/FavoriteBorder';
import { Breadcrumbs, Grid, Link, Typography } from '@mui/material';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className='bg-[#F5F5F5] relative w-full'>
      <Navbar className={styles.navigation} />

      <main className='main-container' style={{ paddingTop: '220px' }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color='text.primary' underline="hover" href="/">
            Inicio {/* Replace "MUI" with your app name or logo */}
          </Link>
          <Typography color="text.primary">Menu</Typography>
        </Breadcrumbs>

        <div className='filters-container'>
          <Filters />
        </div>

        <Grid container spacing={4} className='mt-12 '>
          <Grid item xs={10} md={8} sx={{ display: 'flex', flexDirection: 'column' }}>
            <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0 m-0 rounded-lg'>
              {products.map((product) => {
                const isProductInCart = checkProductInCart(product);

                return (
                  <li
                    key={product.id}
                    className=" product-card overflow-hidden bg-white rounded-lg shadow-lg flex flex-col "

                  >
                    <div className="product-image"> {/* Reduced image height */}
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover"

                        onClick={() => navigate('/editaloTuMismo', { state: { selectedProduct: product } })}
                      />
                    </div>
                    <div className="actions">
                      <button className="favorite" onClick={(e) => { e.stopPropagation(); toggleFavorite(product); }}>
                        {isProductInCart
                          ? (<HeartIcon className="text-red-500" />
                          ) : (<HeartOutlinedIcon className="text-gray-500" />
                          )}
                      </button>
                    </div>
                    <div className="pt-3 px-2">
                      <h3 className="product-name">{product.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2"> {/* Limit description to 2 lines */}
                        {product.description}
                      </p>
                    </div>
                    <div className="p-4 flex flex-col">
                      
                      {/* Price */}
                      <div className="product-price flex items-center">
                        <span className="old-price text-gray-500 line-through mr-2">
                          ${(product.price * 1.2).toFixed(2)}
                        </span>
                        <span className="font-semibold">${product.price.toFixed(2)}</span>
                      </div>
                    </div>

                  </li>
                );
              })}
            </ul>
          </Grid>
          <Grid item xs={8} md={4} className = 'mt-12'display={{ xs: 'none', md: 'block', lg: 'block', xl: 'block' }} >
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