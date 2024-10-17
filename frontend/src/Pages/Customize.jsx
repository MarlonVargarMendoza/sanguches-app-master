import {
  Add as AddIcon,
  Close as CloseIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import {
  Box, Breadcrumbs, Button, Checkbox, Chip, CircularProgress, Collapse,
  Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton,
  List, ListItem, ListItemText, Snackbar, Tooltip, Typography, useMediaQuery, useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { SideBySideMagnifier } from "react-image-magnifiers";
import { Link, useLocation, useNavigate } from 'react-router-dom';

import ProductCard from '../components/Product/ProductCard';
import { useCart } from '../hooks/useCart';
import { getAdditions, getAllProducts, getDrinksSelect, getSaucesSelect } from '../services/productService';

const DOMAIN = import.meta.env.VITE_APP_DOMAIN;
const sectionLabels = {
  additions: "Añadir Acompañamientos",
  sauces: "Añadir Salsas",
  drinks: "Añadir Bebidas"
};

function Customize() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { addToCart, updateCartItem } = useCart();
  const { selectedProduct, isEditing } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [additions, setAdditions] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [selectedAdditions, setSelectedAdditions] = useState([]);
  const [selectedSauces, setSelectedSauces] = useState([]);
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState({ additions: false, sauces: false, drinks: false });
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedProduct) {
        setError("No se ha seleccionado ningún producto.");
        setLoading(false);
        return;
      }

      try {
        const [additionsData, saucesData, drinksData, relatedProductsData] = await Promise.all([
          getAdditions(),
          getSaucesSelect(),
          getDrinksSelect(),
          getAllProducts()
        ]);
        setAdditions(additionsData);
        setSauces(saucesData);
        setDrinks(drinksData);
        setProducts(relatedProductsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError("Error al cargar las opciones de personalización.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedProduct]);

  const handleSelectionChange = useCallback((type, value) => {
    const setters = {
      additions: setSelectedAdditions,
      sauces: setSelectedSauces,
      drinks: setSelectedDrinks
    };
    setters[type](value);
  }, []);

  const handleQuantityChange = useCallback((change) => {
    setQuantity(prev => Math.max(1, prev + change));
  }, []);

  const calculatePrice = useCallback(() => {
    if (!selectedProduct) return 0;
    let totalPrice = selectedProduct.basePrice;
    selectedAdditions.forEach(additionId => {
      const addition = additions.find(a => a.id === additionId);
      if (addition) totalPrice += addition.price;
    });
    selectedDrinks.forEach(drinkId => {
      const drink = drinks.find(d => d.id === drinkId);
      if (drink) totalPrice += drink.basePrice;
    });
    return totalPrice * quantity;
  }, [selectedProduct, additions, drinks, selectedAdditions, selectedDrinks, quantity]);

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
    navigate(-1); // Volver a la página anterior
  }, [selectedProduct, additions, sauces, drinks, selectedAdditions, selectedSauces, selectedDrinks, quantity, calculatePrice, isEditing, updateCartItem, addToCart, navigate]);

  const renderSelectionDialog = useCallback((type, items, selected, onClose) => (
    <Dialog 
      open={dialogOpen[type]} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm" 
      key={`dialog-${type}`}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{`Seleccionar ${sectionLabels[type]}`}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <List>
          {items.map((item) => (
            <ListItem 
              key={`${type}-${item.id}`} 
              dense 
              button 
              onClick={() => {
                const newSelection = selected.includes(item.id)
                  ? selected.filter(id => id !== item.id)
                  : [...selected, item.id];
                handleSelectionChange(type, newSelection);
              }}
            >
              <Checkbox
                edge="start"
                checked={selected.includes(item.id)}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText
                primary={item.text || item.name}
                /* secondary={type !== 'sauces' && (item.price ? `+$${item.price.toFixed(2)}` : (item.basePrice ? `+$${item.basePrice.toFixed(2)}` : null))} */
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Cerrar
        </Button>
        <Button 
          onClick={onClose} 
          color="primary" 
          variant="contained"
          startIcon={<ShoppingCartIcon />}
        >
          Confirmar selección
        </Button>
      </DialogActions>
    </Dialog>
  ), [dialogOpen, handleSelectionChange, sectionLabels]);

  const renderSelectedItems = useCallback((type, items) => (
    <Box className="flex flex-wrap gap-2 mt-2">
      {items.map((id) => {
        const item = eval(type).find(i => i.id === id);
        return (
          <Chip
            key={id}
            label={item.text || item.name}
            onDelete={() => handleSelectionChange(type, items.filter(i => i !== id))}
            color="primary"
            size="small"
          />
        );
      })}
      <Chip
        icon={<AddIcon />}
        label={`Añadir más`}
        onClick={() => setDialogOpen({ ...dialogOpen, [type]: true })}
        color="default"
        size="small"
      />
    </Box>
  ), [dialogOpen, handleSelectionChange]);

  const toggleSection = useCallback((section) => {
    setExpandedSection(prev => prev === section ? null : section);
  }, []);

  if (loading) {
    return (
      <div className='bg-[#F5F5F5] min-h-screen flex justify-center items-center'>
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
    <div className='bg-[#F5F5F5] min-h-screen'>
      <motion.main
        className='main-container p-6'
        style={{ paddingTop: isMobile ? '180px' : '220px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Breadcrumbs aria-label="breadcrumb" className="mb-6 ">
          <Link to="/" className="hover:text-[#C3151A]">Inicio</Link>
          <Link to="/menuSanguches" className="hover:text-[#C3151A]">Menú</Link>
          <Typography color="text.primary">Personaliza tu sándwich</Typography>
        </Breadcrumbs>

        <Grid container spacing={6} className="bg-white rounded-lg shadow-lg p-2">
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <SideBySideMagnifier
                  imageSrc={selectedProduct.image}
                  imageAlt={selectedProduct.name}
                  largeImageSrc={selectedProduct.image }
                  alwaysInPlace={true}
                  overlayBoxOpacity={0.8}
                  shadowColor="#000"
                  cursorStyle="crosshair"
                  transitionSpeed={0.1}
                  mouseActivation="hover"
                  touchActivation="tap"
                />
              </Box>
            </motion.div>
            <Typography variant="body1" className="mt-4 text-[#525D5A]">
              <strong>Ingredientes:</strong> {selectedProduct.ingredients ? selectedProduct.ingredients.map(ing => ing.name).join(', ') : 'Información no disponible'}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography variant="h4" className="font-bold mb-4 text-[#525D5A]">
                {selectedProduct.name}
              </Typography>
              <Typography variant="h5" className="font-black text-[#FFC603] mb-4">
                ${calculatePrice().toFixed(2)}
              </Typography>

              {Object.entries(sectionLabels).map(([type, label]) => (
                <motion.div
                  key={type}
                  className="mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Button
                    onClick={() => toggleSection(type)}
                    endIcon={expandedSection === type ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    fullWidth
                    sx={{
                      justifyContent: 'space-between',
                      backgroundColor: '#f5f5f5',
                      '&:hover': { backgroundColor: '#e0e0e0' },
                    }}
                  >
                    <Typography variant="h6" className="font-bold text-[#525D5A]">
                      {label}
                    </Typography>
                  </Button>
                  <Collapse in={expandedSection === type}>
                    {renderSelectedItems(type, eval(`selected${type.charAt(0).toUpperCase() + type.slice(1)}`))}
                  </Collapse>
                </motion.div>
              ))}

              <motion.div
                className="flex justify-between items-center mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-center border">
                  <Tooltip title="Disminuir cantidad">
                    <span>
                      <IconButton
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity === 1}
                        sx={{
                          backgroundColor: '#FFC603',
                          color: 'black',
                          borderRadius: '50%',
                          '&:hover': { backgroundColor: '#e6b200' },
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Typography variant="h6" className="mx-4 font-bold text-black">
                    {quantity}
                  </Typography>
                  <Tooltip title="Aumentar cantidad">
                  <IconButton
                      onClick={() => handleQuantityChange(1)}
                      sx={{
                        backgroundColor: '#FFC603',
                        color: 'black',
                        borderRadius: '50%',
                        '&:hover': { backgroundColor: '#e6b200' },
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </div>
                <Button
                  onClick={handleAddToCart}
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  sx={{
                    backgroundColor: '#FFC603',
                    color: 'white',
                    '&:hover': { backgroundColor: '#C8151B' },
                    width: '80%',
                  }}
                >
                  {isEditing ? 'Actualizar carrito' : 'Añadir al carrito'}
                </Button>
              </motion.div>
            </motion.div>
          </Grid>
        </Grid>

        <motion.div
          className='mt-12'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Typography variant="h5" className="font-bold mb-6 text-[#525D5A]">
            Otros productos que te pueden gustar
          </Typography>
          <Box
            sx={{
              display: 'flex',
              overflowX: 'auto',
              gap: '16px',
              pb: 2,
              '::-webkit-scrollbar': {
                height: '8px',
              },
              '::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
              },
              '::-webkit-scrollbar-thumb': {
                backgroundColor: '#FFC603',
                borderRadius: '4px',
              },
              '::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#C8151B',
              },
              scrollSnapType: 'x mandatory',
            }}
          >
            {products.slice(0, 6).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                sx={{
                  flexShrink: 0,
                  width: { xs: '85%', sm: '45%', md: '30%' },
                  scrollSnapAlign: 'start',
                }}
              >
                <ProductCard product={item} />
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </motion.main>

      {Object.entries(sectionLabels).map(([type, label]) => (
        renderSelectionDialog(
          type,
          eval(type),
          eval(`selected${type.charAt(0).toUpperCase() + type.slice(1)}`),
          () => setDialogOpen({ ...dialogOpen, [type]: false })
        )
      ))}

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={isEditing ? "¡Producto actualizado en el carrito!" : "¡Producto añadido al carrito!"}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setSnackbarOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </div>
  );
}

export default Customize;