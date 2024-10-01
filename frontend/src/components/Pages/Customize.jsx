import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Breadcrumbs, Button, Checkbox, FormControl, Grid, ListItemText, MenuItem, Select, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import {
  getAdditions,
  getAllProducts,
  getDrinks,
  getIngredients,
  getSauces
} from '../../services/productService';

import styles from '../../style';
import { Cart } from '../Cart/Cart';
import { PersistentCart } from '../Cart/PersistentCart';
import { Navbar } from '../Navbar/Navbar';
import ProductCard from '../Productsjson/ProductCard';
import RadioButtonGroup from '../ui/RadioButtonGroup';

function Customize() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedProduct } = location.state || {};

  const [products, setProducts] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [error, setError] = useState(null);
  const [additions, setAdditions] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [size, setSize] = useState('Personal');
  const [selectedAdditions, setSelectedAdditions] = useState([]);
  const [selectedSauces, setSelectedSauces] = useState([]);
  const [selectedDrinks, setSelectedDrinks] = useState([]);

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!selectedProduct) {
      navigate('/menuSanguches');
      return;
    }
    document.title = `Personaliza tu ${selectedProduct.name}`;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [additionsData, saucesData, drinksData, ingredientsData, relatedProductsData] = await Promise.all([
          getAdditions(),
          getSauces(),
          getDrinks(),
          getIngredients(),
          getAllProducts()
        ]);
        setProducts(relatedProductsData || []);
        setAdditions(additionsData || []);
        setSauces(saucesData || []);
        setDrinks(drinksData || []);
        setIngredients(ingredientsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load some data. Please try again or contact support.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedProduct, navigate]);

  const handleSizeChange = (newSize) => {
    setSize(newSize);
  };

  const handleAdditionChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedAdditions(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSauceChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedSauces(typeof value === 'string' ? value.split(',') : value);
  };

  const handleDrinkChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedDrinks(typeof value === 'string' ? value.split(',') : value);
  };

  const handleQuantityChange = (change) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));
  };

  const calculatePrice = () => {
    let totalPrice = selectedProduct ? selectedProduct.basePrice : 0;

    selectedAdditions.forEach(additionId => {
      const addition = additions.find(a => a.id === additionId);
      if (addition) totalPrice += addition.price;
    });

    selectedDrinks.forEach(drinkId => {
      const drink = drinks.find(d => d.id === drinkId);
      if (drink) totalPrice += drink.basePrice;
    });

    if (size === 'Grande') {
      totalPrice *= 1.5;
    }

    return totalPrice * quantity;
  };

  const handleAddToCart = () => {
    const customizedProduct = {
      ...selectedProduct,
      size,
      additions: selectedAdditions.map(id => additions.find(a => a.id === id)),
      sauces: selectedSauces.map(id => sauces.find(s => s.id === id)),
      drinks: selectedDrinks.map(id => drinks.find(d => d.id === id)),
      quantity,
      price: calculatePrice(),
    };
    addToCart(customizedProduct);
    navigate('/menuSanguches');
    /* navigate('/cart'); */
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => navigate('/menuSanguches')}>Volver al menú</Button>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Por favor, selecciona un producto del menú.</p>
        <Button onClick={() => navigate('/menuSanguches')}>Volver al menú</Button>
      </div>
    );
  }

  return (
    <div className='relative w-full bg-[#F5F5F5]' style={{ paddingTop: '210px' }}>
      <Navbar className={styles.navigation} />
      <Cart />
      <div className='relative px-13 mx-auto px-4 py-1 md:py-2'>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">Inicio</Link>
          <Link to="/menuSanguches">Menú</Link>
          <Typography color="text.primary">Personaliza tu sándwich</Typography>
        </Breadcrumbs>
      </div>
      <Grid container className="container mx-auto px-4 py-12 md:py-16 bg-white" spacing={4}>
        <Grid item xs={12} md={6} >
          <img
            src={selectedProduct.thumbnail}
            alt={selectedProduct.title}
            className="w-full h-auto md:h-40vh object-cover mb-4 rounded-lg" // Imagen más pequeña
            style={{ aspectRatio: "600/400", objectFit: "cover" }}
          />
          <Typography variant="body1" className="mt-4 text-[#525D5A]">
            {selectedProduct.description}
          </Typography>
        </Grid>


        <Grid item xs={12} md={6}>  {/* right side  */}
          <Typography variant="h4" className="font-bold mb-4 text-[#525D5A]">
            Tu {selectedProduct.name}
          </Typography>
          <Typography variant="h5" className="font-bold text-[#73B89D] mb-4">
            ${calculatePrice().toFixed(2)}
          </Typography>

          <Typography variant="h6" className="font-bold mb-2 text-[#525D5A]">Tamaño</Typography>
          <RadioButtonGroup
            options={['Personal', 'Grande']}
            selectedOption={size}
            onOptionChange={handleSizeChange}
          />

          <FormControl fullWidth className="mb-4">
            <Typography variant="h6" className="font-bold mb-2 text-[#525D5A]">Acompañamientos</Typography>
            <Select
              multiple
              value={selectedAdditions}
              onChange={handleAdditionChange}
              renderValue={(selected) => selected.map(id => additions.find(a => a.id === id)?.text).join(', ')}
            >
              {additions.map((addition) => (
                <MenuItem key={addition.id} value={addition.id}>
                  <Checkbox checked={selectedAdditions.indexOf(addition.id) > -1} />
                  <ListItemText primary={addition.text} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth className="mb-4">
            <Typography variant="h6" className="font-bold mb-2 text-[#525D5A]">Salsas</Typography>
            <Select
              multiple
              value={selectedSauces}
              onChange={handleSauceChange}
              renderValue={(selected) => selected.map(id => sauces.find(s => s.id === id)?.name).join(', ')}
            >
              {sauces.map((sauce) => (
                <MenuItem key={sauce.id} value={sauce.id}>
                  <Checkbox checked={selectedSauces.indexOf(sauce.id) > -1} />
                  <ListItemText primary={sauce.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth className="mb-4">
            <Typography variant="h6" className="font-bold mb-2 text-[#525D5A]">Bebidas</Typography>
            <Select
              multiple
              value={selectedDrinks}
              onChange={handleDrinkChange}
              renderValue={(selected) => selected.map(id => drinks.find(d => d.id === id)?.name).join(', ')}
            >
              {drinks.map((drink) => (
                <MenuItem key={drink.id} value={drink.id}>
                  <Checkbox checked={selectedDrinks.indexOf(drink.id) > -1} />
                  <ListItemText primary={drink.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity === 1}
                variant="outlined"
                startIcon={<RemoveIcon />}
                sx={{
                  backgroundColor: '#AB131B',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#900f15',
                  },
                }}
              />
              <span className="mx-2 text-lg text-[#525D5A] font-bold">{quantity}</span>
              <Button
                onClick={() => handleQuantityChange(1)}
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: '#AB131B',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#900f15',
                  },
                }}
              />
            </div>
            <Button
              onClick={handleAddToCart}
              sx={{
                backgroundColor: '#AB131B',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#900f15',
                },
              }}
            >
              Agregar a tu orden
            </Button>
          </div>
        </Grid>
      </Grid>
      <div className='maylike-products-wrapper'>
        <h2 className="text-2xl font-bold mb-4 text-[#525D5A]">Otros productos</h2>

        <div className='marquee'>
          <div className='maylike-products-container track  flex flex-row overflow-x-auto'>
            {products.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>



      </div>

      <Grid item xs={8} md={4} display={{ xs: 'none', md: 'block', lg: 'block', xl: 'block' }}>
        <PersistentCart />
      </Grid>
    </div>
  );
}

export default Customize;