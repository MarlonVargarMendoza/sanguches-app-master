import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Breadcrumbs, Checkbox, FormControl, Grid, ListItemText, MenuItem, Select, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import styles from '../../style.js';
import { Cart } from '../Cart/Cart.jsx';
import { PersistentCart } from '../Cart/PersistentCart';
import { Navbar } from '../Navbar/Navbar';
import ProductCard from '../Productsjson/ProductCard.jsx';
import RadioButtonGroup from '../ui/RadioButtonGroup.jsx';


const API_URL = import.meta.env.VITE_APP_DOMAIN;
function Customize() {

  // Assuming 'product' prop contains the data from the API

  const location = useLocation();
  const { selectedProduct } = location.state || {}; // If coming from another page
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  const [size, setSize] = React.useState('medium');
  const [additionalIngredients, setAdditionalIngredients] = React.useState([]);
  const [selectedSideDishes, setSelectedSideDishes] = React.useState([]);
  const [selectedDrink, setSelectedDrink] = React.useState(null);
  const [selectedDrinks, setSelectedDrinks] = React.useState([]);
  const { addToCart, removeFromCart, cart } = useCart(); // Destructure removeFromCart and cart

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products`);
        setProducts(response.data.data);
      } catch (error) {
        setError('An unexpected error occurred while fetching products.');
        console.error(error); // Log the error for debugging
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      document.title = `Personaliza tu ${selectedProduct.title}`;
    } else {
      document.title = 'Página no encontrada';
    }
  }, [selectedProduct]);
  const handleDrinkChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedDrinks(
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  const handleSideDishChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedSideDishes(
      typeof value === 'string' ? value.split(',') : value,
    );
  };


  const handleSizeChange = (newSize) => {
    setSize(newSize);
  };

  const handleIngredientToggle = (ingredient) => {
    if (additionalIngredients.includes(ingredient)) {
      setAdditionalIngredients(additionalIngredients.filter((i) => i !== ingredient));
    } else {
      setAdditionalIngredients([...additionalIngredients, ingredient]);
    }
  };
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (change) => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + change;
      return newQuantity >= 1 ? newQuantity : 1;
    });
  };
  const sideDishOptions = [
    'Tomate',
    'Lechuga',
    'Pepinillo',
    'Cebolla blanca',
    'Cebolla roja',
    'Jalapeños',
    'Champiñón',
    'Pepino agridulce',
    'Pepino natural',
    'Maicitos',
    'Papa en cabello de ángel'
  ];
  const sauces = [
    'Salsa de Ajo',
    'Salsa BBQ',
    'Salsa Picante',
    'Salsa de Tomate'
  ]
  const [selectedSauces, setSelectedSauces] = useState([]);

  const handleSauceChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedSauces(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const drinkOptions = [
    'Coca Cola',
    'Coca Cola Zero',
    'Coca Cola Light',
    'Coca Cola Zero Light',
    'Cerveza',
    'Cerveza Light',
    'Cerveza Zero',
    'Cerveza Zero Light',
    'Agua',
  ];
  const [selectedOption, setSelectedOption] = useState("HTML"); // Estado para guardar la selección

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const calculatePrice = () => {
    let basePrice = selectedProduct ? selectedProduct.price : 0;
    const saucePrices = selectedSauces.map(sauce => 2.5);

    // Calcular precio de acompañamientos y bebidas
    const sideDishPrices = selectedSideDishes.map(sideDish => {
      switch (sideDish) {
        case 'Tomate': return 6.3;
        case 'Lechuga': return 8.3;
        case 'Pepinillo': return 8.3;
        case 'Cebolla blanca': return 2.8;
        case 'Cebolla roja': return 2.8;
        default: return 0;
      }
    }); // Precio fijo por acompaniante

    const drinkPrices = selectedDrinks.map(drink => 5.5); // Precio fijo por bebida

    const additionalPrice = sideDishPrices.reduce((sum, price) => sum + price, 0) +
      drinkPrices.reduce((sum, price) => sum + price, 0) +
      saucePrices.reduce((sum, price) => sum + price, 0);

    return (basePrice + additionalPrice) * quantity;
  };

  const handleAddToCart = () => {
    const customizedProduct = {
      ...selectedProduct,
      size,
      additionalIngredients,
      selectedSideDishes,
      selectedDrinks,
      selectedSauces,
      quantity,
      price: calculatePrice(),
    };
    addToCart(customizedProduct);
  };


  return (
    <div className='relative w-full bg-[#F5F5F5]' style={{ paddingTop: '210px' }}>
      <Navbar className={styles.navigation} />
      <Cart />
      <div className='relative  px-13 mx-auto px-4 py-1  md:py-2  '>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">Inicio</Link>
          <Link to="/menuSanguches">Menú</Link>
          <Typography color="text.primary">Personaliza tu sándwich</Typography>
        </Breadcrumbs>
      </div>
      <Grid className="container mx-auto px-4 py-12 md:py-16 bg-white" spacing={4}>

        {error ? (
          <Grid item xs={12} style={{ height: '68vh' }}>
            <div className="bg-white shadow-lg rounded-lg p-4 text-black overflow-hidden">
              <p>{error}</p>
            </div>
          </Grid>
        ): selectedProduct ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className='flex flex-col md:flex-row gap-8'>
                <div className="mb-8 ">
                  <div className=" rounded-lg overflow-hidden">
                    <img
                      src={selectedProduct.thumbnail}
                      alt={selectedProduct.title}
                      className="w-full h-auto md:h-40vh object-cover mb-4 rounded-lg" // Imagen más pequeña
                      style={{ aspectRatio: "600/400", objectFit: "cover" }}
                    />
                    <p className={`  text-base mb-4 text-[#525D5A]`}>{selectedProduct.description}</p>
                  </div>
                </div>
              </div>

              <div Grid item xs={12} md={4}>
                <div className="p-4">

                  <h2 className="text-2xl font-bold mb-4 text-[#525D5A]">Tu {selectedProduct.title}</h2>
                  <span className="text-2xl font-bold text-[#73B89D]">${calculatePrice().toFixed(2)}</span>
                  <Grid item xs={4} className='text-lg font-bold mb-2 text-[#525D5A]'>
                    <h2>Tamaño </h2>
                  </Grid>
                  <RadioButtonGroup
                    options={['Personal', 'Grande']}
                    selectedOption={selectedOption}
                    onOptionChange={handleOptionChange}
                  />

                  <FormControl fullWidth className="mb-4">
                    <Typography variant="h6" className='text-lg font-bold mb-2 text-[#525D5A]'>Acompañamientos</Typography>
                    <Select
                      multiple
                      value={selectedSideDishes}
                      onChange={handleSideDishChange}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {sideDishOptions.map((sideDish) => (
                        <MenuItem key={sideDish} value={sideDish}>
                          <Checkbox checked={selectedSideDishes.indexOf(sideDish) > -1} />
                          <ListItemText primary={sideDish} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth className="mb-4">
                    <Typography variant="h6" className='text-lg font-bold mb-2 text-[#525D5A] flex flex-auto'>Salsas</Typography>
                    <Select
                      multiple
                      value={selectedSauces}
                      onChange={handleSauceChange}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {sauces.map((sauce) => (
                        <MenuItem key={sauce} value={sauce}>
                          <Checkbox checked={selectedSauces.indexOf(sauce) > -1} />
                          <ListItemText primary={sauce} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth className="mb-4">
                    <Typography variant="h6" className='text-lg font-bold mb-2 text-[#525D5A]'>Bebidas</Typography>
                    <Select
                      multiple
                      value={selectedDrinks}
                      onChange={handleDrinkChange}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {drinkOptions.map((drink) => (
                        <MenuItem key={drink} value={drink}>
                          <Checkbox checked={selectedDrinks.indexOf(drink) > -1} />
                          <ListItemText primary={drink} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>


                  <h3 className="text-xl font-bold mb-2">
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </h3>
                  <div className="mb-4">
                    <ul className="list-disc pl-4 bg-[#F5F5F5]">
                      {additionalIngredients.map((ingredient) => (
                        <li key={ingredient}>{ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center"> {/* Wrap quantity controls in a flex container */}
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
                      >

                      </Button>
                      <span className="mx-2 text-lg font-bold">{quantity}</span>
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
                      >
                      </Button>
                    </div>

                    <Button onClick={handleAddToCart} sx={{
                      backgroundColor: '#AB131B',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#900f15',
                      },
                    }}>
                      Agregar a tu orden
                    </Button>
                  </div>


                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-[#525D5A]">Completa tu orden</h2>
                  {/* ... add your suggestions for additional items here */}
                </div>

                {/* Payment information */}
                <p className="text-sm text-[#525D5A]">Pagos via whatsapp</p>
              </div>
            </div>
            <Grid item xs={8} md={4} display={{ xs: 'none', md: 'block', lg: 'block', xl: 'block' }} >
              <PersistentCart />
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

          </>
        ) : (
          <Grid item xs={12} style={{ height: '68vh' }}>
            <div className="bg-white shadow-lg rounded-lg p-4 text-black overflow-hidden">
              <p>Por favor, selecciona un producto del menú.</p>
            </div>
          </Grid>
    
        )}
      </Grid>
    </div>
  );
}

export default Customize;