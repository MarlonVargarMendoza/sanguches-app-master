import {
  Box, Breadcrumbs, Button, CircularProgress, Grid, IconButton,
  Snackbar,
  Tooltip,
  Typography, useMediaQuery, useTheme
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
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

const CustomSelect = ({ label, items = [], selectedItems = [], onChange, icon, priceDisplay = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
    (item.name || item.text || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleItem = useCallback((itemId) => {
    const newSelection = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    onChange(newSelection);
  }, [selectedItems, onChange]);

  return (
    <div className="w-full mb-4 relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-100 hover:border-[#FFC603] transition-all duration-300"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium text-gray-700">{label}</span>
          {selectedItems.length > 0 && (
            <span className="bg-[#FFC603] text-xs font-bold px-2 py-1 rounded-full">
              {selectedItems.length}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="p-3 border-b">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 pl-8 bg-gray-50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC603]"
                />
                <svg
                  className="absolute left-2 top-2.5 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="max-h-20 overflow-y-auto">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ backgroundColor: 'rgba(255, 198, 3, 0.1)' }}
                    className="flex items-center justify-between p-3 cursor-pointer border-b border-gray-50"
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="flex items-center gap-3">
                      {selectedItems.includes(item.id) ? (
                        <svg className="w-5 h-5 text-[#FFC603]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {item.name || item.text}
                      </span>
                    </div>
                  
                  </motion.div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No se encontraron resultados
                </div>
              )}
            </div>

            <div className="p-3 bg-gray-50 flex justify-between items-center">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Cerrar
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {selectedItems.length} seleccionados
                </span>
                {selectedItems.length > 0 && (
                  <button
                    onClick={() => onChange([])}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <X className="w-4 h-4" />
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap gap-2 mt-2"
        >
          {selectedItems.map((id) => {
            const item = items.find(i => i.id === id);
            return (
              <motion.span
                key={id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {item?.name || item?.text}
                <X
                  className="w-4 h-4 cursor-pointer hover:text-red-500"
                  onClick={() => toggleItem(id)}
                />
              </motion.span>
            );
          })}
        </motion.div>
      )}
    </div>
  );
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
              {Object.entries(sectionLabels).map(([type, label]) => (
                <CustomSelect
                  key={type}
                  label={label}
                  items={eval(type)}
                  selectedItems={eval(`selected${type.charAt(0).toUpperCase() + type.slice(1)}`)}
                  onChange={(newSelection) => handleSelectionChange(type, newSelection)}
                  icon={typeIcons[type]}
                  priceDisplay={type !== 'sauces'}
                />
              ))}

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