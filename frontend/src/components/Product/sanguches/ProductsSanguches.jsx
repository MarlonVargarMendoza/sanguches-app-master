import { Alert, Box, Breadcrumbs, Grid, Link, Snackbar, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import { getProductsByCategories } from '../../../services/productService';
import ProductLoadingPlaceholder from '../../ui/ProductLoadingPlaceholder';
import { Filters } from '../Filters';
import ProductCard from '../sanguches/ProductCard';
import './Products.css';
import logoSanguches from '/assets/logoSanguches.jpg';

// Componente de lista de productos usando el ProductCard compartido
const ProductsList = ({ products, onAddToCart, onRemoveFromCart, onProductClick, checkProductInCart, getCartItemQuantity }) => (
  <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
    {products.map(product => (
      <li key={product.id} className="product-card-container">
        <ProductCard
          product={product}
          onAddToCart={onAddToCart}
          onRemoveFromCart={onRemoveFromCart}
          onProductClick={onProductClick}
          isInCart={checkProductInCart(product)}
          quantity={getCartItemQuantity(product)}
          buttonText="PERSONALIZAR"
          showLogo={true}
          customLogo={<img src={logoSanguches} alt="Logo" className="w-6 h-6 rounded-full" />}
          className="h-full"
        />
      </li>
    ))}
  </ul>
);

export function ProductsSanguches() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, removeFromCart, updateQuantity, cart } = useCart();
  const queryParams = new URLSearchParams(location.search);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarState, setSnackbarState] = useState({ open: false, message: '' });
  const [selectedCategories, setSelectedCategories] = useState(
    queryParams.get('categories')?.split(',') || [queryParams.get('category') || 'all']
  );
  const [filters, setFilters] = useState({ minPrice: 0, category: 'all' });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProductsByCategories(selectedCategories);
      if (!data) {
        throw new Error('No products data received');
      }
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError("Oops! No pudimos cargar los productos. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, filters.minPrice]);

  useEffect(() => {
    const categories = queryParams.get('categories')?.split(',');
    const category = queryParams.get('category');
    setSelectedCategories(categories || [category || 'all']);
  }, [location.search]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    const newCategory = newFilters.category;
    navigate(newCategory === 'all' ? '/menuSanguches' : `/menuSanguches?category=${newCategory}`);
  }, [navigate]);

  const handleAddToCart = useCallback((product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      addToCart({
        ...product,
        quantity: 1,
        customizations: {},
        calculatedPrice: product.basePrice
      });
    }
    setSnackbarState({ open: true, message: '¡Producto añadido al carrito!' });
  }, [cart, addToCart, updateQuantity]);

  const handleRemoveFromCart = useCallback((productId) => {
    removeFromCart(productId);
    setSnackbarState({ open: true, message: 'Producto eliminado del carrito' });
  }, [removeFromCart]);

  const handleProductClick = useCallback((product, imageUrl) => {
    const existingCartItem = cart.find(item => item.id === product.id);
    navigate('/editaloTuMismo', {
      state: {
        selectedProduct: existingCartItem || {
          ...product,
          basePrice: product.basePrice || 0,
          quantity: 1,
          customizations: {},
          imageUrl: imageUrl
        },
        isEditing: !!existingCartItem
      }
    });
  }, [navigate, cart]);

  const checkProductInCart = useCallback((product) =>
    product && cart.some((item) => item.id === product.id),
    [cart]);

  const getCartItemQuantity = useCallback((product) => {
    const cartItem = cart.find((item) => item.id === product.id);
    return cartItem ? cartItem.quantity : 0;
  }, [cart]);

  const renderContent = () => {
    if (isLoading) return <ProductLoadingPlaceholder count={6} />;
    if (error) return <Alert severity="error" className="my-4">{error}</Alert>;
    if (products.length === 0) return <Alert severity="info" className="my-4">No se encontraron productos. Intenta con otra búsqueda o categoría.</Alert>;
    
    return (
      <ProductsList
        products={products}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onProductClick={handleProductClick}
        checkProductInCart={checkProductInCart}
        getCartItemQuantity={getCartItemQuantity}
      />
    );
  };

  return (
    <div className='bg-[#F5F5F5] min-h-screen pt-[90px] md:pt-[120px] lg:pt-[110px] sm:pt-[70px]'>
      <main className='main-container pb-6'>
        <div className='mb-2 ml-3'>
          <Breadcrumbs aria-label="breadcrumb" className="mb-6">
            <Link color='inherit' href="/" className="hover:text-[#C3151A]">Inicio</Link>
            <Typography color="text.primary">Menu</Typography>
          </Breadcrumbs>
        </div>

        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box className="bg-white rounded-lg shadow-lg p-4">
              <Filters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            {renderContent()}
          </Grid>
        </Grid>
      </main>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarState.open}
        autoHideDuration={3000}
        onClose={() => setSnackbarState({ ...snackbarState, open: false })}
        message={snackbarState.message}
      />
    </div>
  );
}

export default ProductsSanguches;