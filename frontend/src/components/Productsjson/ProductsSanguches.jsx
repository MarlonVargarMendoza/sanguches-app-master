import { Breadcrumbs, Button, Dialog, DialogActions, DialogTitle, Grid, Link, Typography } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoSanguches from '../../assets/logoSanguches.jpg';
import { useCart } from '../../hooks/useCart.js';
import styles from '../../style.js';
import { Cart } from '../Cart/Cart.jsx';
import { PersistentCart } from '../Cart/PersistentCart.jsx';
import Footer from '../Footer.jsx';
import { Navbar } from '../Navbar/Navbar.jsx';
import { Filters } from '../Productsjson/Filters.jsx';
import './Products.css';

export function ProductsSanguches({ products }) {

  const navigate = useNavigate();
  const { addToCart, removeFromCart, cart } = useCart();

  const checkProductInCart = (product) => {
    return cart.some((item) => item.id === product.id);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const toggleFavorite = (product) => {
    if (checkProductInCart(product)) {
      removeFromCart(product);
    } else {
      setSelectedProduct(product); // Set the selected product
      setOpenDialog(true); // Open the dialog
    }
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleProductClick = (product) => {
    if (checkProductInCart(product)) {
      // If already in cart, go directly to customize
      navigate('/editaloTuMismo', { state: { selectedProduct: product } });
    } else {
      // If not in cart, open the dialog
      setSelectedProduct(product); 
      setOpenDialog(true); 
    }
  }

  const handleAddToCart = () => {
    addToCart(selectedProduct);
    handleCloseDialog();
  };
  const handleCustomize = () => {
    navigate('/editaloTuMismo', { state: { selectedProduct } });
    handleCloseDialog();
  };

  return (
<>
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
                    <div className="product-image relative  "> 
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        onClick={() => handleProductClick(product)} 
                      />
                    </div>
                    <div className="actions  absolute top-[-4px] right-[-4px]">
                      <div className="actions absolute top-4 right-4"> {/* Increased top and right values */}
                        <button className="favorite" onClick={(e) => { e.stopPropagation(); toggleFavorite(product); }}>
                          {isProductInCart ? (
                            <img src={logoSanguches} alt="Product in cart" className="w-6 h-6" />
                          ) : (
                            <img src={logoSanguches} alt="Add to cart" className="w-6 h-6 grayscale" />
                          )}
                        </button>
                      </div>
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
          <Grid item xs={8} md={4} className='mt-12' display={{ xs: 'none', md: 'block', lg: 'block', xl: 'block' }} >
            <PersistentCart />
          </Grid>
          <div className='cart-container w-full md:w-1/3 xl:hidden lg:hidden md:hidden'>
            <Cart />
          </div>
        </Grid>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{selectedProduct ? `¿Quieres agregar ${selectedProduct.title} a tu carrito?` : '¿Quieres personalizar tu pastel?'}</DialogTitle>
          
          <DialogActions>
            <Button onClick={handleAddToCart} color="secondary">
              Lo Quiero
            </Button>
            <Button onClick={handleCustomize} color="secondary">
              Personalizar
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    </div>
    <Footer />
    </>
  );
}

export default ProductsSanguches;