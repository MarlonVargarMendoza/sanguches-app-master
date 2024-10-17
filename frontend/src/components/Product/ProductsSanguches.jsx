import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Breadcrumbs, Button, Grid, IconButton, Link, Snackbar, Tooltip, Typography
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import ContentLoader from "react-content-loader";
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { getProductsByCategories } from '../../services/productService';
import { Filters } from './Filters';
import './Products.css';
import logoSanguches from '/assets/logoSanguches.jpg';

const DOMAIN = import.meta.env.VITE_APP_DOMAIN;

const ProductCard = React.memo(({ product, onAddToCart, onRemoveFromCart, onProductClick, isInCart, quantity }) => {

  const handleClick = (e) => {
    e.stopPropagation();
    onProductClick(product, product.image);
  };

  return (
    <li className="product-card bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative product-image">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover cursor-pointer"
          onClick={handleClick}
          loading="lazy"
        />
        <div className="absolute top-2 right-2 flex items-center space-x-2">
          <Tooltip title={isInCart ? "Quitar del carrito" : "Añadir al carrito"}>
            <IconButton
              className="bg-white p-1 rounded-full transition-all duration-300 ease-in-out"
              onClick={(e) => {
                e.stopPropagation();
                isInCart ? onRemoveFromCart(product.id) : onAddToCart(product);
              }}
              style={{
                filter: isInCart ? 'none' : 'grayscale(100%)',
                transform: isInCart ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <img src={logoSanguches} alt="Logo" className="w-6 h-6 rounded-full" />
            </IconButton>
          </Tooltip>
          {quantity > 0 && (
            <div className="bg-[#FFC603] text-black rounded-full w-6 h-6 flex items-center justify-center">
              {quantity}
            </div>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="product-name text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.ingredients?.map(ingredient => ingredient.name).join(', ') || "Ingredientes no disponibles"}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            
            <span className="text-[#A4A4A4] font-bold">
              ${product.basePrice.toFixed(2)}
            </span>
          </div>
          <Button
            variant="contained"
            style={{ backgroundColor: '#FFC603', color: 'black' }}
            onClick={handleClick}
            startIcon={<ShoppingCartIcon />}
          >
            {isInCart ? 'Actualizar' : 'AGREGAR'}
          </Button>
        </div>
      </div>
    </li>
  );
});

const ProductsList = ({ products, onAddToCart, onRemoveFromCart, onProductClick, checkProductInCart, getCartItemQuantity }) => (
  <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
    {products.map(product => (
      <ProductCard
        key={product.id}
        product={product}
        onAddToCart={onAddToCart}
        onRemoveFromCart={onRemoveFromCart}
        onProductClick={onProductClick}
        isInCart={checkProductInCart(product)}
        quantity={getCartItemQuantity(product)}
      />
    ))}
  </ul>
);

const LoadingPlaceholder = () => (
  <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
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

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProductsByCategories(selectedCategories);
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
  }, [fetchProducts]);

  useEffect(() => {
    const categories = queryParams.get('categories')?.split(',');
    const category = queryParams.get('category');
    setSelectedCategories(categories || [category || 'all']);
  }, [location.search]);

  const handleFilterChange = useCallback((newFilters) => {
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
    if (isLoading) return <LoadingPlaceholder />;
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
    <div className='bg-[#F5F5F5] min-h-screen'>
      <main className='main-container p-6' style={{ paddingTop: '220px' }}>
        <Breadcrumbs aria-label="breadcrumb" className="mb-6">
          <Link color='inherit' href="/" className="hover:text-[#C3151A]">Inicio</Link>
          <Typography color="text.primary">Menu</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box className="bg-white rounded-lg shadow-lg p-4">
              <Typography variant="h6" className="font-bold mb-4">Filtros</Typography>
              <Filters
                filters={{ minPrice: 0, category: selectedCategories[0] }}
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