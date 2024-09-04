import { Breadcrumbs, Checkbox, FormControl, Grid, ListItemText, MenuItem, Select, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import styles from '../../style.js';
import { PersistentCart } from '../Cart/PersistentCart';
import { Navbar } from '../Navbar/Navbar';

function Customize() {
  const location = useLocation();
  const { selectedProduct } = location.state || {};
  const [size, setSize] = React.useState('medium');
  const [additionalIngredients, setAdditionalIngredients] = React.useState([]);
  const [selectedSideDishes, setSelectedSideDishes] = React.useState([]);
  const [selectedDrink, setSelectedDrink] = React.useState(null);
  const [selectedDrinks, setSelectedDrinks] = React.useState([]);

  const { addToCart } = useCart();

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
  const calculatePrice = () => {
    let basePrice = selectedProduct ? selectedProduct.price : 0;

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
    });

    const drinkPrices = selectedDrinks.map(drink => 5.5); // Precio fijo por bebida

    const additionalPrice = sideDishPrices.reduce((sum, price) => sum + price, 0) +
      drinkPrices.reduce((sum, price) => sum + price, 0);

    return basePrice + additionalPrice;
  };

  const handleAddToCart = () => {
    const customizedProduct = {
      ...selectedProduct,
      size,
      additionalIngredients,
      selectedDrink,
      price: calculatePrice(),
    };
    addToCart(customizedProduct);
  };

  return (
    <div className='relative w-full  bg-[#F5F5F5]' style={{ paddingTop: '200px' }}>
      <Navbar className={styles.navigation} />

      <div className='relative  px-13 mx-auto px-4 py-5  md:py-16  '>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/">Inicio</Link>
          <Link to="/menuSanguches">Menú</Link>
          <Typography color="text.primary">Personaliza tu sándwich</Typography>
        </Breadcrumbs>
      </div>
      <Grid className="container mx-auto px-4 py-12 md:py-16 bg-white">

        {selectedProduct ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-8 ">
                  <div className=" rounded-lg overflow-hidden">
                    <img
                      src={selectedProduct.thumbnail}
                      alt={selectedProduct.title}
                      className="w-full h-48 object-cover mb-4 rounded-lg" // Imagen más pequeña
                      style={{ aspectRatio: "600/400", objectFit: "cover" }}
                    />

                    <h2 className="text-2xl font-bold mb-4 text-[#525D5A]">Tu {selectedProduct.title}</h2>
                    <p className={`  text-base mb-4 text-[#525D5A]`}>{selectedProduct.description}</p>

                    <div className="mt-4">
                      <p className="text-sm text-[#525D5A]">Incluye tu Salsa de Ajo por $2.500 pesos adicionales.</p>
                      <Link to="#" className="text-blue-500 underline">
                        Agregar o quitar ingredientes
                      </Link>
                      {additionalIngredients.length >= 3 && (
                        <p className="text-red-500 text-sm">*Superaste el límite de adiciones en tu pizza</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="p-4">

                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={4} className='text-lg font-bold mb-2 text-[#525D5A]'>
                      <h2>Acompañamientos </h2>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl fullWidth className="mb-4">
                        <Select
                          labelId="sidedish-label"
                          id="sidedish-select"
                          multiple
                          value={selectedSideDishes}
                          onChange={handleSideDishChange}
                          renderValue={(selected) => selected.join(', ')}
                        >

                          {sideDishOptions.map((sideDish) => (
                            <MenuItem
                              key={sideDish} value={sideDish}>
                              <Checkbox checked={selectedSideDishes.indexOf(sideDish) > -1} />
                              <ListItemText primary={sideDish} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={4} className='text-lg font-bold mb-2 text-[#525D5A]'>
                      <h2>Salsas </h2>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl fullWidth className="mb-4">
                        <Select
                          labelId="size-label"
                          id="size-select"
                          value={size}
                          label=""
                          onChange={(e) => handleSizeChange(e.target.value)}
                        >
                          {/* ... (opciones de salsas) */}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <h3 className="text-xl font-bold mb-2">
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </h3>
                  <div className="mb-4">
                    <h4 className="text-lg font-bold mb-2 text-[#525D5A]">Ingredientes adicionales:</h4>
                    <ul className="list-disc pl-4 bg-[#F5F5F5]">
                      {additionalIngredients.map((ingredient) => (
                        <li key={ingredient}>{ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}</li>
                      ))}
                    </ul>
                  </div>
                  {/* ... (resto del código de bebidas y precio) */}

                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-[#73B89D]">${calculatePrice().toFixed(2)}</span>
                    <Button onClick={handleAddToCart} className="bg-[#F29313] hover:bg-[#db830d] text-white">
                      Agregar a tu orden
                    </Button>
                  </div>
                </div>

                {/* Complete your order section */}
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
          </>
        ) : (
          <Grid item xs={12}>
            <div className="bg-white shadow-lg rounded-lg p-4 text-black">
              <p>Por favor, selecciona un producto del menú.</p>
            </div>
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default Customize;