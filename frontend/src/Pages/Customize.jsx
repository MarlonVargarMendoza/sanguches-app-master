import {
  Add as AddIcon,
  Close as CloseIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import {
  Breadcrumbs,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List, ListItem, ListItemText,
  Snackbar,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/Layout/Footer';
import { Navbar } from '../components/Navbar/Navbar';
import ProductCard from '../components/Product/ProductCard';
import { useCart } from '../hooks/useCart';
import { getAdditions, getAllProducts, getDrinksSelect, getSauces } from '../services/productService';
import styles from '../style';

const DOMAIN = import.meta.env.VITE_APP_DOMAIN;

function Customize() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedProduct } = location.state || {};
  const { addToCart } = useCart();

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
          getSauces(),
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

  const handleSelectionChange = (type, value) => {
    switch(type) {
      case 'additions':
        setSelectedAdditions(value);
        break;
      case 'sauces':
        setSelectedSauces(value);
        break;
      case 'drinks':
        setSelectedDrinks(value);
        break;
      default:
        break;
    }
  };

  const handleQuantityChange = (change) => setQuantity(Math.max(1, quantity + change));

  const calculatePrice = () => {
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
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const customizedProduct = {
      ...selectedProduct,
      customizations: {
        additions: selectedAdditions,
        sauces: selectedSauces,
        drinks: selectedDrinks,
      },
      quantity,
      calculatedPrice: calculatePrice(),
    };
    addToCart(customizedProduct);
    setSnackbarOpen(true);
  };

  const renderSelectionDialog = (type, items, selected, onClose) => (
    <Dialog open={dialogOpen[type]} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{`Seleccionar ${type}`}</DialogTitle>
      <DialogContent>
        <List>
          {items.map((item) => (
            <ListItem key={item.id} dense button onClick={() => {
              const newSelection = selected.includes(item.id)
                ? selected.filter(id => id !== item.id)
                : [...selected, item.id];
              handleSelectionChange(type, newSelection);
            }}>
              <Checkbox
                edge="start"
                checked={selected.includes(item.id)}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText 
                primary={item.name || item.text} 
                secondary={item.price ? `+$${item.price.toFixed(2)}` : null} 
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (loading) {
    return (
      <div className='bg-[#F5F5F5] min-h-screen flex justify-center items-center'>
        <Navbar className={`${styles.navigation} bg-[#FFC603]`} />
        <CircularProgress />
      </div>
    );
  }

  if (error || !selectedProduct) {
    return (
      <div className='bg-[#F5F5F5] min-h-screen'>
        <Navbar className={`${styles.navigation} bg-[#FFC603]`} />
        <div className="container mx-auto px-4 py-12" style={{ paddingTop: '220px' }}>
          <Typography variant="h6" color="error">{error || "No se ha seleccionado ningún producto."}</Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/menuSanguches')}
            sx={{
              backgroundColor: '#FFC603',
              color: 'white',
              '&:hover': {
                backgroundColor: '#C8151B',
              },
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
      <Navbar className={`${styles.navigation} bg-[#FFC603]`} />
      
      <main className='main-container p-6' style={{ paddingTop: '220px' }}>
        <Breadcrumbs aria-label="breadcrumb" className="mb-6">
          <Link to="/" className="hover:text-[#C3151A]">Inicio</Link>
          <Link to="/menuSanguches" className="hover:text-[#C3151A]">Menú</Link>
          <Typography color="text.primary">Personaliza tu sándwich</Typography>
        </Breadcrumbs>

        <Grid container spacing={4} className="bg-white rounded-lg shadow-lg p-6">
          <Grid item xs={12} md={6}>
            <img
              src={`${DOMAIN}${selectedProduct.image}`}
              alt={selectedProduct.name}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
            <Typography variant="body1" className="mt-4 text-[#525D5A]">
              {selectedProduct.description}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" className="font-bold mb-4 text-[#525D5A]">
              {selectedProduct.name}
            </Typography>
            <Typography variant="h5" className="font-black text-[#FFC603] mb-4">
              ${calculatePrice().toFixed(2)}
            </Typography>

            {['additions', 'sauces', 'drinks'].map((type) => (
              <div key={type} className="mb-4">
                <Button
                  onClick={() => toggleSection(type)}
                  endIcon={expandedSection === type ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  fullWidth
                  sx={{
                    justifyContent: 'space-between',
                    backgroundColor: '#f5f5f5',
                    '&:hover': {
                      backgroundColor: '#e0e0e0',
                    },
                  }}
                >
                  <Typography variant="h6" className="font-bold text-[#525D5A]">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Typography>
                </Button>
                <Collapse in={expandedSection === type}>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {eval(`selected${type.charAt(0).toUpperCase() + type.slice(1)}`).map((id) => {
                      const item = eval(type).find(i => i.id === id);
                      return (
                        <Chip
                          key={id}
                          label={item.name || item.text}
                          onDelete={() => handleSelectionChange(type, eval(`selected${type.charAt(0).toUpperCase() + type.slice(1)}`).filter(i => i !== id))}
                          color="primary"
                        />
                      );
                    })}
                    <Chip
                      icon={<AddIcon />}
                      label={`Añadir ${type}`}
                      onClick={() => setDialogOpen({ ...dialogOpen, [type]: true })}
                      color="default"
                    />
                  </div>
                </Collapse>
              </div>
            ))}

            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center">
                <Tooltip title="Disminuir cantidad">
                  <IconButton
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity === 1}
                    sx={{
                      backgroundColor: '#FFC603',
                      color: 'black',
                      '&:hover': {
                        backgroundColor: '#e6b200',
                      },
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Tooltip>
                <Typography variant="h6" className="mx-4 font-bold">
                  {quantity}
                </Typography>
                <Tooltip title="Aumentar cantidad">
                  <IconButton
                    onClick={() => handleQuantityChange(1)}
                    sx={{
                      backgroundColor: '#FFC603',
                      color: 'black',
                      '&:hover': {
                        backgroundColor: '#e6b200',
                      },
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
                  '&:hover': {
                    backgroundColor: '#C8151B',
                  },
                  width: '60%',
                }}
              >
                Añadir al carrito
              </Button>
            </div>
          </Grid>
        </Grid>

        <div className='maylike-products-wrapper mt-12'>
          <Typography variant="h5" className="font-bold mb-6 text-[#525D5A]">
            Otros productos que te pueden gustar
          </Typography>
          <div className='marquee'>
            <div className='maylike-products-container track flex flex-row overflow-x-auto'>
              {products.slice(0, 6).map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {renderSelectionDialog('additions', additions, selectedAdditions, () => setDialogOpen({...dialogOpen, additions: false}))}
      {renderSelectionDialog('sauces', sauces, selectedSauces, () => setDialogOpen({...dialogOpen, sauces: false}))}
      {renderSelectionDialog('drinks', drinks, selectedDrinks, () => setDialogOpen({...dialogOpen, drinks: false}))}

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="¡Producto añadido al carrito!"
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

      <Footer />
    </div>
  );
}

export default Customize;