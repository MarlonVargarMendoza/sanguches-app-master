import { Breadcrumbs, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import Button from '@mui/material/Button'; // Asegúrate de importar Button
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
  const [selectedDrink, setSelectedDrink] = React.useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    if (selectedProduct) {
      document.title = `Personaliza tu ${selectedProduct.title}`;
    } else {
      document.title = 'Página no encontrada';
    }
  }, [selectedProduct]);

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

  const handleDrinkChange = (event) => {
    setSelectedDrink(event.target.value);
  };

  const calculatePrice = () => {
    let basePrice = selectedProduct ? selectedProduct.price : 0;

    switch (size) {
      case 'small':
        basePrice -= 2.0;
        break;
      case 'large':
        basePrice += 3.0;
        break;
    }

    const ingredientPrice = additionalIngredients.length * 1.5;

    return basePrice + ingredientPrice;
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
                  {/*  <h2 className="text-2xl font-bold mb-4 text-[#525D5A]">Tu {selectedProduct.title}</h2> */}
                  <div className=" rounded-lg overflow-hidden">
                    <img
                      src={selectedProduct.thumbnail}
                      alt={selectedProduct.title}
                      className="w-full h-auto object-cover mb-4 rounded-lg"
                      style={{ aspectRatio: "600/400", objectFit: "cover" }}
                    />
                    <p className={`  text-base mb-4 text-[#525D5A]`}>{selectedProduct.description}</p>

                    <div className="mt-4">
                      <p className="text-sm text-[#525D5A]">Incluye tu Salsa de Ajo por $2.500 pesos adicionales.</p>
                      <Link to="#" className="text-blue-500 underline">
                        Agregar o quitar ingredientes
                      </Link>
                      {additionalIngredients.length >= 3 && (
                        <p className="text-red-500 text-sm">*Superaste el límite de adiciones en tu pizza</p>
                      )}
                    </div>  {/* fofof */}
                  </div>
                </div>
              </div> {/* Cierre del primer div */}

              <div>
                <div className="mb-8">

                  <div className="bg-white shadow-lg rounded-lg overflow-hidden py-4 p-4">
                    <h1 className="text-2xl font-bold mb-4 text-[#525D5A]"> {selectedProduct.title}</h1>

                    <div className='p-4'>
                      <FormControl fullWidth className="mb-4">
                        <InputLabel id="size-label">Tamaño</InputLabel>
                        <Select
                          labelId="size-label"
                          id="size-select"
                          value={size}
                          label="Tamaño"
                          onChange={(e) => handleSizeChange(e.target.value)}
                        >
                          <MenuItem value="small">Pequeño</MenuItem>
                          <MenuItem value="medium">Mediano</MenuItem>
                          <MenuItem value="large">Grande</MenuItem>
                        </Select>
                      </FormControl>
                    </div>

                    <div className='p-4'>
                      <FormControl fullWidth className="mb-4 py-10">
                        <InputLabel id="size-label">Tipo de masa</InputLabel>
                        <Select
                          labelId="size-label"
                          id="size-select"
                          value={size}
                          label="Tamaño"
                          onChange={(e) => handleSizeChange(e.target.value)}
                        >
                          <MenuItem value="small">Pequeño</MenuItem>
                          <MenuItem value="medium">Mediano</MenuItem>
                          <MenuItem value="large">Grande</MenuItem>
                        </Select>
                      </FormControl>
                      <div className="p-4">

                      </div>
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
                      {selectedDrink && (
                        <div className="mb-4">
                          <h4 className="text-lg font-bold mb-2">Bebida:</h4>
                          <p>{selectedDrink.charAt(0).toUpperCase() + selectedDrink.slice(1)}</p>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-[#73B89D]">${calculatePrice().toFixed(2)}</span>
                        <Button onClick={handleAddToCart} className="bg-[#F29313] hover:bg-[#db830d] text-white">
                          Agregar a tu orden
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Complete your order section */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-[#525D5A]">Completa tu orden</h2>
                  {/* ... add your suggestions for additional items here */}
                </div>

                {/* Payment information */}
                <p className="text-sm text-[#525D5A]">Pagos con tarjeta de crédito y pse</p>
              </div> {/* Cierre del segundo div */}
            </div> {/* Cierre del div con grid */}
            <Grid item xs={8} md={4} display={{ xs: 'none', md: 'block', lg: 'block', xl: 'block' }} >
            <PersistentCart />
          </Grid>
          </>
        ) : (
          <Grid item xs={12}> {/* Mensaje si no hay producto seleccionado */}
          <div className="bg-white shadow-lg rounded-lg p-4 text-black">
              <p>Por favor, selecciona un producto del menú.</p>
          </div>
      </Grid>
        )}
      </Grid> {/* Cierre del container */}
    </div>
  );
}

export default Customize;