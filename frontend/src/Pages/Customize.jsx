import {
  Box, Breadcrumbs, Button, CircularProgress, Grid, IconButton,
  Snackbar,
  Tooltip,
  Typography, useMediaQuery, useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Coffee, Droplet, Gift,
  Minus,
  Pizza,
  Plus,
  ShoppingCart,
  X
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { SideBySideMagnifier } from "react-image-magnifiers";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import priceUtils from '../../utils/priceUtils';
import ProductCard from '../components/Product/ProductCard';
import CustomSelect from '../components/ui/CustomSelect';
import { useCart } from '../hooks/useCart';
import { getAllCustomizations, getAllProducts } from '../services/productService';
const DOMAIN = import.meta.env.VITE_APP_DOMAIN;

const typeIcons = {
  additions: <Pizza className="w-5 h-5" />,
  sauces: <Droplet className="w-5 h-5" />,
  drinks: <Coffee className="w-5 h-5" />,
  accompaniments: <Gift className="w-5 h-5" />
};

const sectionLabels = {
  additions: "Agregar Adición",
  sauces: "Agregar Salsas",
  drinks: "Añadir Bebidas",
  accompaniments: "Agregar Acompañamientos"
};


function Customize() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { addToCart, updateCartItem } = useCart();
  const { selectedProduct: initialProduct, isEditing } = location.state || {};

  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [additions, setAdditions] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [accompaniments, setAccompaniments] = useState([]);
  const [selectedAdditions, setSelectedAdditions] = useState([]);
  const [selectedSauces, setSelectedSauces] = useState([]);
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [selectedAccompaniments, setSelectedAccompaniments] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!initialProduct) {
        setError("No se ha seleccionado ningún producto.");
        setLoading(false);
        return;
      }
      setSelectedProduct(initialProduct);
      setLoading(true);
      try {
        const customizations = await getAllCustomizations();
        const productsData = await getAllProducts();
        
        setAdditions(customizations.additions);
        setSauces(customizations.sauces);
        setDrinks(customizations.drinks);
        setAccompaniments(customizations.accompaniments);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError("Error al cargar las opciones de personalización.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [initialProduct]);

  const handleSelectionChange = useCallback((type, value) => {
    const setters = {
      additions: setSelectedAdditions,
      sauces: setSelectedSauces,
      drinks: setSelectedDrinks,
      accompaniments: setSelectedAccompaniments
    };
    setters[type](value);
  }, []);

  const handleQuantityChange = useCallback((change) => {
    setQuantity(prev => Math.max(1, prev + change));
  }, []);

  const calculatePrice = useCallback(() => {
    if (!selectedProduct) return 0;
    let totalPrice = selectedProduct.basePrice;
    
    const calculateAdditionalCost = (items, selectedIds, priceKey = 'price') => 
      selectedIds.reduce((sum, id) => {
        const item = items.find(i => i.id === id);
        return sum + (item ? (item[priceKey] || item.basePrice || 0) : 0);
      }, 0);

    totalPrice += calculateAdditionalCost(additions, selectedAdditions);
    totalPrice += calculateAdditionalCost(drinks, selectedDrinks, 'basePrice');
    totalPrice += calculateAdditionalCost(accompaniments, selectedAccompaniments, 'basePrice');
    
    return totalPrice * quantity;
  }, [selectedProduct, additions, drinks, accompaniments, selectedAdditions, selectedDrinks, selectedAccompaniments, quantity]);

  const handleAddToCart = useCallback(() => {
    if (!selectedProduct) return;

    const customizedProduct = {
      ...selectedProduct,
      customizations: {
        additions: selectedAdditions.map(id => {
          const item = additions.find(a => a.id === id);
          return { id: item.id, text: item.text || item.name, price: item.price };
        }),
        sauces: selectedSauces.map(id => {
          const item = sauces.find(s => s.id === id);
          return { id: item.id, text: item.text || item.name };
        }),
        drinks: selectedDrinks.map(id => {
          const item = drinks.find(d => d.id === id);
          return { id: item.id, text: item.text || item.name, price: item.basePrice };
        }),
        accompaniments: selectedAccompaniments.map(id => {
          const item = accompaniments.find(a => a.id === id);
          return { id: item.id, text: item.text || item.name, price: item.basePrice };
        })
      },
      quantity,
      calculatedPrice: calculatePrice(),
    };

    if (isEditing) {
      updateCartItem(selectedProduct.id, customizedProduct);
    } else {
      addToCart(customizedProduct);
    }

    setSnackbarOpen(true);
    navigate(-1);
  }, [selectedProduct, additions, sauces, drinks, accompaniments, selectedAdditions, selectedSauces, selectedDrinks, selectedAccompaniments, quantity, calculatePrice, isEditing, updateCartItem, addToCart, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5F5F5]">
        <CircularProgress />
      </div>
    );
  }

  if (error || !selectedProduct) {
    return (
      <div className='bg-[#F5F5F5] min-h-screen'>
        <div className="container mx-auto px-4 py-12" style={{ paddingTop: '220px' }}>
          <Typography variant="h6" color="error">{error || "No se ha seleccionado ningún producto."}</Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/menuSanguches')}
            sx={{
              backgroundColor: '#FFC603',
              color: 'white',
              '&:hover': { backgroundColor: '#C8151B' },
              mt: 2
            }}
          >
            Volver al menú
          </Button>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <main className="container mx-auto p-4 md:p-6" style={{ paddingTop: isMobile ? '180px' : '220px' }}>
      <Breadcrumbs className="mb-6">
          <Link to="/" className="hover:text-[#C3151A]">Inicio</Link>
          <Link to="/menuSanguches" className="hover:text-[#C3151A]">Menú</Link>
          <Typography color="text.primary">Personaliza tu sándwich</Typography>
        </Breadcrumbs>

        <Grid container spacing={4} className="bg-white rounded-lg shadow-lg p-6">
          {/* Columna de imagen */}
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box className="rounded-xl overflow-hidden shadow-lg">
                <SideBySideMagnifier
                  imageSrc={`${DOMAIN}${selectedProduct.image}`}
                  imageAlt={selectedProduct.name}
                  largeImageSrc={`${DOMAIN}${selectedProduct.image}`}
                  alwaysInPlace={true}
                  overlayBoxOpacity={0.8}
                  cursorStyle="crosshair"
                  className="w-full"
                />
              </Box>
              <Typography variant="body1" className="mt-4 text-gray-700">
                <span className="font-semibold">Ingredientes:</span> {
                  selectedProduct.ingredients 
                    ? selectedProduct.ingredients.map(ing => ing.name).join(', ') 
                    : 'Información no disponible'
                }
              </Typography>
            </motion.div>
          </Grid>

          {/* Columna de personalización */}
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <Typography variant="h4" className="font-bold text-[#525D5A]">
                  {selectedProduct.name}
                </Typography>
                <Typography variant="h5" className="font-black text-[#FFC603] mt-2">
                  {priceUtils(calculatePrice())}
                </Typography>
              </div>

              {/* Selectores de personalización */}
              {Object.entries(sectionLabels).map(([type, label]) => {
            // Obtenemos los items y el estado seleccionado según el tipo
            const items = {
              additions,
              sauces,
              drinks,
              accompaniments
            }[type];

            const selectedItems = {
              additions: selectedAdditions,
              sauces: selectedSauces,
              drinks: selectedDrinks,
              accompaniments: selectedAccompaniments
            }[type];

            return (
              <CustomSelect
                key={type}
                label={label}
                items={items}
                selectedItems={selectedItems}
                onChange={(newSelection) => handleSelectionChange(type, newSelection)}
                icon={typeIcons[type]}
                priceDisplay={type !== 'sauces'}
              />
            );
          })}

              {/* Control de cantidad y botón de agregar al carrito */}
              <motion.div
                className="flex items-center justify-between mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-center bg-gray-100 rounded-full p-2">
                <Tooltip title="Disminuir cantidad">
                <span>
                  <IconButton
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity === 1}
                    className="text-gray-600 hover:text-[#C8151B]"
                    
                  >
                    <Minus className="w-4 h-4" />
                  </IconButton>
                </span>
              </Tooltip>
                  <Typography className="mx-4 font-bold">
                    {quantity}
                  </Typography>
                  <Tooltip title="Aumentar cantidad">
                <span>
                  <IconButton
                    onClick={() => handleQuantityChange(1)}
                    className="text-gray-600 hover:text-[#e6b200]"
                  >
                    <Plus className="w-4 h-4" />
                  </IconButton>
                  </span>
                </Tooltip>
                </div>

                
                <Button
                  onClick={handleAddToCart}
                  variant="contained"
                  className="flex-grow ml-4 bg-[#FFC603] hover:bg-[#C8151B] text-white py-3"
                  startIcon={<ShoppingCart className="w-5 h-5" />}
                >
                  {isEditing ? 'Actualizar carrito' : 'Añadir al carrito'}
                </Button>
              </motion.div>
            </motion.div>
          </Grid>
        </Grid>

        {/* Productos relacionados */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Typography variant="h5" className="font-bold mb-6 text-[#525D5A]">
            También te puede gustar
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 3).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        className="mt-16"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FFC603] text-black px-6 py-3 rounded-lg shadow-lg flex items-center justify-between"
        >
          <span className="font-medium">
            {isEditing ? '¡Producto actualizado!' : '¡Producto añadido al carrito!'}
          </span>
          <IconButton
            size="small"
            onClick={() => setSnackbarOpen(false)}
            className="text-black hover:text-gray-800 ml-2"
          >
            <X className="w-4 h-4" />
          </IconButton>
        </motion.div>
      </Snackbar>
    </div>
  );
}

export default Customize;