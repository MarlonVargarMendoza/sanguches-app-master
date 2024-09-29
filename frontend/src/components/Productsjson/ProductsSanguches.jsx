import { Breadcrumbs, Button, Dialog, DialogActions, DialogTitle, Grid, Link, Typography } from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';
import ContentLoader from "react-content-loader";
import { useNavigate } from 'react-router-dom';
import logoSanguches from '../../assets/logoSanguches.jpg';
import { useCart } from '../../hooks/useCart.js';
import { getAllProducts } from '../../services/productService.js';
import styles from '../../style.js';
import { Cart } from '../Cart/Cart.jsx';
import { PersistentCart } from '../Cart/PersistentCart.jsx';
import Footer from '../Footer.jsx';
import { Navbar } from '../Navbar/Navbar.jsx';
import { Filters } from '../Productsjson/Filters.jsx';
import './Products.css';

export function ProductsSanguches() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const navigate = useNavigate();
  const { addToCart, removeFromCart, cart } = useCart();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true); // Indicamos que estamos cargando
      try {
        const data = await getAllProducts(selectedCategory);
        console.log(data);

        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);// Volvemos a cargar productos cuando cambia la categoría

  // Manejador para cambios en los filtros
  const handleFilterChange = (newFilters) => {
    setSelectedCategory(newFilters.category); // Actualiza la categoría seleccionada
  };

  const checkProductInCart = (product) => {
    return cart.some((item) => item.id === product.id);
  };

  const toggleFavorite = (product) => {
    if (checkProductInCart(product)) {
      removeFromCart(product);
    } else {
      setSelectedProduct(product);
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleProductClick = (product) => {
    if (checkProductInCart(product)) {
      navigate('/editaloTuMismo', { state: { selectedProduct: product } });
    } else {
      setSelectedProduct(product);
      setOpenDialog(true);
    }
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct);
    handleCloseDialog();
  };

  const handleCustomize = () => {
    navigate('/editaloTuMismo', {
      state: {
        selectedProduct: {
          ...selectedProduct,
          basePrice: selectedProduct.basePrice || 0, // Aseguramos que siempre haya un precio base
        }
      }
    });
    handleCloseDialog();
  };

  return (
    <>
      <div className='bg-[#F5F5F5] relative w-full'>
        <Navbar className={styles.navigation} />

        <main className='main-container' style={{ paddingTop: '220px' }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color='text.primary' underline="hover" href="/">
              Inicio
            </Link>
            <Typography color="text.primary">Menu</Typography>
          </Breadcrumbs>

          <div className='filters-container'>
            <Filters
              filters={{ minPrice: 0, category: selectedCategory }}
              onFilterChange={handleFilterChange}
            />
          </div>

          <Grid container spacing={4} className='mt-12 '>
            <Grid item xs={10} md={8} sx={{ display: 'flex', flexDirection: 'column' }}>
              {isLoading ? (
                <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0 m-0 rounded-lg'>
                  {[...Array(6)].map((_, index) => (
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
              ) : error ? (
                <div>{error}</div>
              ) : (
                <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0 m-0 rounded-lg'>
                  {products.map((product) => {
                    const isProductInCart = checkProductInCart(product);

                    return (
                      <li
                        key={product.id}
                        className="product-card overflow-hidden bg-white rounded-lg shadow-lg flex flex-col"
                      >
                        <div className="product-image relative">
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onClick={() => handleProductClick(product)}
                          />
                        </div>
                        <div className="actions absolute top-[-4px] right-[-4px]">
                          <div className="actions absolute top-4 right-4">
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
                          <h3 className="product-name">{product.name}</h3>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {product.description}
                          </p>
                        </div>

                        <div className="p-4 flex flex-col">
                          <div className="product-price flex items-center">
                            {product.basePrice !== undefined && product.basePrice !== null ? (
                              <>
                                <span className="old-price text-gray-500 line-through mr-2">
                                  ${(product.basePrice * 1.2).toFixed(2)}
                                </span>
                                <span className="font-semibold">${product.basePrice.toFixed(2)}</span>
                              </>
                            ) : (
                              <span className="font-semibold">Precio no disponible</span>
                            )}
                          </div>
                        </div>

                      </li>
                    );
                  })}
                </ul>
              )}
            </Grid>
            <Grid item xs={8} md={4} className='mt-12' display={{ xs: 'none', md: 'block', lg: 'block', xl: 'block' }} >
              <PersistentCart />
            </Grid>
            <div className='cart-container w-full md:w-1/3 xl:hidden lg:hidden md:hidden'>
              <Cart />
            </div>
          </Grid>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>{selectedProduct ? `¿Quieres agregar ${selectedProduct.title} a tu carrito?` : '¿Quieres personalizar?'}</DialogTitle>
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