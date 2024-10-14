import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  Alert, Breadcrumbs, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Grid, IconButton, Link, Snackbar, Tooltip, Typography
} from '@mui/material';
import Slide from '@mui/material/Slide';
import React, { useCallback, useEffect, useState } from 'react';
import ContentLoader from "react-content-loader";
import { useLocation, useNavigate } from 'react-router-dom';

import { useCart } from '../../hooks/useCart.js';
import { getProductsByCategories } from '../../services/productService.js';
import { Filters } from './Filters.jsx';
import './Products.css';
import logoSanguches from '/assets/logoSanguches.jpg';

const DOMAIN = import.meta.env.VITE_APP_DOMAIN;

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export function ProductsSanguches() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, removeFromCart, updateQuantity, cart } = useCart();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'all';
  const initialCategories = queryParams.get('categories')?.split(',') || [];

  // Estado
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategories.length > 0 ? initialCategories : [initialCategory]
  );

  // Efectos
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProductsByCategories(selectedCategories);
      setProducts(data);
      setFilteredProducts(data);
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
    const category = queryParams.get('category');
    const categories = queryParams.get('categories')?.split(',');
    if (categories && categories.length > 0) {
      setSelectedCategories(categories);
    } else if (category) {
      setSelectedCategories([category]);
    } else {
      setSelectedCategories(['all']);
    }
  }, [location.search]);
  //manejo de categorias en el menu de filtros  submenu ()
  useEffect(() => {
    const category = queryParams.get('category');
    const categories = queryParams.get('categories')?.split(',');
    if (categories && categories.length > 0) {
      setSelectedCategories(categories);
    } else if (category) {
      setSelectedCategories([category]);
    } else {
      setSelectedCategories(['all']);
    }
  }, [location.search]);
  const handleFilterChange = useCallback((newFilters) => {
    const newCategory = newFilters.category;
    setSelectedCategories([newCategory]);
    if (newCategory === 'all') {
      navigate('/menuSanguches');
    } else {
      navigate(`/menuSanguches?category=${newCategory}`);
    }
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
    setSnackbarMessage('¡Producto añadido al carrito!');
    setSnackbarOpen(true);
    setOpenDialog(false);
    setSnackbarMessage('¡Producto añadido al carrito!');

  }, [cart, addToCart, updateQuantity]);

  const handleRemoveFromCart = useCallback((productId) => {
    removeFromCart(productId);
    setSnackbarMessage('Producto eliminado del carrito');
    setSnackbarOpen(true);
  }, [removeFromCart]);

  const handleQuantityChange = useCallback((productId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    } else {
      removeFromCart(productId);
    }
  }, [updateQuantity, removeFromCart]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleCustomize = () => {
    if (selectedProduct) {
      const existingCartItem = cart.find(item => item.id === selectedProduct.id);
      navigate('/editaloTuMismo', {
        state: {
          selectedProduct: existingCartItem || {
            ...selectedProduct,
            basePrice: selectedProduct.basePrice || 0,
            quantity: 1,
            customizations: {}
          },
          isEditing: !!existingCartItem
        }
      });
      handleCloseDialog();
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  // Funciones de utilidad
  const checkProductInCart = useCallback((product) => {
    return product && cart.some((item) => item.id === product.id);
  }, [cart]);

  const getCartItemQuantity = useCallback((product) => {
    const cartItem = cart.find((item) => item.id === product.id);
    return cartItem ? cartItem.quantity : 0;
  }, [cart]);

  // Renderizado
  const renderProductCard = (product) => {
    const isProductInCart = checkProductInCart(product);
    const quantity = getCartItemQuantity(product);
    const imageUrl = `${DOMAIN}${product.image}`;

    return (
      <li key={product.id} className="product-card bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="relative product-image">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover cursor-pointer"
            onClick={() => handleProductClick(product)}
          />
          <div className="absolute top-2 right-2 flex items-center space-x-2">
            <Tooltip title={isProductInCart ? "Quitar del carrito" : "Añadir al carrito"}>
              <IconButton
                className="bg-white p-1 rounded-full transition-all duration-300 ease-in-out"
                onClick={(e) => {
                  e.stopPropagation();
                  isProductInCart ? handleRemoveFromCart(product.id) : handleAddToCart(product);
                }}
                style={{
                  filter: isProductInCart ? 'none' : 'grayscale(100%)',
                  transform: isProductInCart ? 'scale(1.1)' : 'scale(1)',
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
            {product.ingredients && product.ingredients.length > 0
              ? product.ingredients.map(ingredient => ingredient.name).join(', ')
              : "Ingredientes no disponibles"}
          </p>
          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-gray-500 line-through text-sm">
                ${(product.basePrice * 1.2).toFixed(2)}
              </span>
              <span className="text-[#A4A4A4] font-bold">
                ${product.basePrice.toFixed(2)}
              </span>
            </div>
            <Button
              variant="contained"
              style={{ backgroundColor: '#FFC603', color: 'black' }}
              onClick={() => handleProductClick(product)}
              startIcon={<ShoppingCartIcon />}
            >
              {isProductInCart ? 'Actualizar' : 'AGREGAR'}
            </Button>
          </div>
        </div>
      </li>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
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
    }

    if (error) {
      return (
        <Alert severity="error" className="my-4">
          {error}
          <Button color="inherit" size="small" onClick={fetchProducts} className="ml-2">
            Reintentar
          </Button>
        </Alert>
      );
    }

    if (filteredProducts.length === 0) {
      return (
        <Alert severity="info" className="my-4">
          No se encontraron productos. Intenta con otra búsqueda o categoría.
        </Alert>
      );
    }

    return (
      <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredProducts.map(renderProductCard)}
      </ul>
    );
  };

  return (
    <div className='bg-[#F5F5F5] min-h-screen'>
      <main className='main-container p-6' style={{ paddingTop: '220px' }}>
        <Breadcrumbs aria-label="breadcrumb" className="mb-6">
          <Link color='inherit' href="/" className="hover:text-[#C3151A]">
            Inicio
          </Link>
          <Typography color="text.primary">Menu</Typography>
        </Breadcrumbs>

        <div className='filters-container mb-6'>
          <Filters
            filters={{ minPrice: 0, category: selectedCategories[0] }}
            onFilterChange={handleFilterChange}
          />
        </div>

        <Grid container spacing={4} className='mt-12'>
          <Grid item xs={12} md={11}>
            {renderContent()}
          </Grid>
        </Grid>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          TransitionComponent={Transition}
          PaperProps={{
            style: {
              borderRadius: '15px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
              maxWidth: '400px',
              margin: 'auto',
            }
          }}
        >
          <DialogTitle className='flex justify-between items-center'>
            {selectedProduct?.name}
            <IconButton onClick={handleCloseDialog} aria-label="close">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <img
              src={`${DOMAIN}${selectedProduct?.image}`}
              alt={selectedProduct?.name}
              className="w-full h-64 object-cover mb-4 rounded"
            />
            <Typography variant="body1" paragraph>
              {selectedProduct?.description}
            </Typography>
            <Typography variant="subtitle1" className="font-semibold mb-2">
              Ingredientes:
            </Typography>
            <ul className="list-disc pl-5 mb-4">
              {selectedProduct?.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient.name}</li>
              ))}
            </ul>
            <Typography variant="h6" style={{ color: '#A4A4A4', fontWeight: 'bold' }}>
              ${selectedProduct?.basePrice.toFixed(2)}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleAddToCart(selectedProduct)}
              variant="contained"
              style={{ backgroundColor: '#FFC603', color: 'black' }}
              startIcon={<ShoppingCartIcon />}
            >
              {checkProductInCart(selectedProduct) ? 'Ya en el carrito' : 'Añadir al carrito'}
            </Button>
            <Button
              onClick={handleCustomize}
              variant="contained"
              style={{ backgroundColor: '#DB0E12', color: 'white' }}
              startIcon={<EditIcon />}
            >
              Personalizar
            </Button>
          </DialogActions>
        </Dialog>
      </main>

      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </div>
  );
}

export default ProductsSanguches;