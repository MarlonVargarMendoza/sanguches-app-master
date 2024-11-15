import {
  Box, Breadcrumbs, Button, CircularProgress, Grid, IconButton,
  Tooltip, Typography, useMediaQuery, useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Coffee, Droplet, Gift, Minus, Pizza, Plus, ShoppingCart
} from 'lucide-react';
import React, { useEffect } from 'react';
import { SideBySideMagnifier } from "react-image-magnifiers";
import { Link, useLocation } from 'react-router-dom';
import priceUtils from '../../../utils/priceUtils';
import { CustomizationProvider } from '../../context/CustomizeContext';
import { useCustomizations } from '../../hooks/useProductCustomization';
import ErrorView, { ErrorBoundary } from '../Error/ErrorComponents';
import CustomSelect from '../ui/CustomSelect';
import NotificationSnackbar from './sections/NotificationSnackbar ';
import RelatedProducts from './sections/RelatedProducts';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { selectedProduct: initialProduct } = location.state || {};

  const {
    product,
    loading,
    error,
    products,
    customizations,
    selections,
    quantity,
    snackbarOpen,
    handleSelectionChange,
    handleQuantityChange,
    handleAddToCart,
    setSnackbarOpen,
    calculatePrice,
    isEditing
  } = useCustomizations(initialProduct);

    // Efecto para manejar el cambio de producto
    useEffect(() => {
      // Reset scroll position when product changes
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  }, [initialProduct?.id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5F5F5]">
        <CircularProgress />
      </div>
    );
  }

  if (error || !product) {
    return <ErrorView error={error} />;
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <main className="container mx-auto p-4 md:p-6" style={{ paddingTop: isMobile ? '180px' : '240px' }}>
        <BreadcrumbNav />
        
        <Grid container spacing={4} className="bg-white rounded-lg shadow-lg p-6">
          <ProductImageSection product={product} />
          <CustomizationSection 
            product={product}
            customizations={customizations}
            selections={selections}
            quantity={quantity}
            handleSelectionChange={handleSelectionChange}
            handleQuantityChange={handleQuantityChange}
            handleAddToCart={handleAddToCart}
            calculatePrice={calculatePrice}
            isEditing={isEditing}
          />
        </Grid>

        <RelatedProducts products={products} />
        
        <NotificationSnackbar 
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          isEditing={isEditing}
        />
      </main>
    </div>
  );
}

// Componentes auxiliares
const BreadcrumbNav = () => (
  <Breadcrumbs className="mb-6">
    <Link to="/" className="hover:text-[#C3151A]">Inicio</Link>
    <Link to="/menuSanguches" className="hover:text-[#C3151A]">Menú</Link>
    <Typography color="text.primary">Personaliza tu sándwich</Typography>
  </Breadcrumbs>
);

const ProductImageSection = ({ product }) => (
  <Grid item xs={12} md={5}>
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="rounded-xl overflow-hidden shadow-lg">
        <SideBySideMagnifier
          imageSrc={`${DOMAIN}${product.image}`}
          imageAlt={product.name}
          largeImageSrc={`${DOMAIN}${product.image}`}
          alwaysInPlace={true}
          overlayBoxOpacity={0.8}
          cursorStyle="crosshair"
          className="w-full"
        />
      </Box>
      <Typography variant="body1" className="mt-4 text-gray-700">
        <span className="font-semibold">Ingredientes:</span> {
          product.ingredients 
            ? product.ingredients.map(ing => ing.name).join(', ') 
            : 'Información no disponible'
        }
      </Typography>
    </motion.div>
  </Grid>
);

const CustomizationSection = ({
  product,
  customizations,
  selections,
  quantity,
  handleSelectionChange,
  handleQuantityChange,
  handleAddToCart,
  calculatePrice,
  isEditing
}) => (
  <Grid item xs={12} md={7}>
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      <ProductHeader product={product} calculatePrice={calculatePrice} />
      <CustomizationOptions 
        customizations={customizations}
        selections={selections}
        handleSelectionChange={handleSelectionChange}
      />
      <QuantityAndCartControls 
        quantity={quantity}
        handleQuantityChange={handleQuantityChange}
        handleAddToCart={handleAddToCart}
        isEditing={isEditing}
      />
    </motion.div>
  </Grid>
);

const ProductHeader = ({ product, calculatePrice }) => (
  <div>
    <Typography variant="h4" className="font-bold text-[#525D5A]">
      {product.name}
    </Typography>
    <Typography variant="h5" className="font-black text-[#FFC603] mt-2">
      { priceUtils(calculatePrice().toFixed(2))}
    </Typography>
  </div>
);

const CustomizationOptions = ({ customizations, selections, handleSelectionChange }) => (
  <>
    {Object.entries(sectionLabels).map(([type, label]) => (
      <CustomSelect
        key={type}
        label={label}
        items={customizations[type]}
        selectedItems={selections[type]}
        onChange={(newSelection) => handleSelectionChange(type, newSelection)}
        icon={typeIcons[type]}
        priceDisplay={type !== 'sauces'}
      />
    ))}
  </>
);

const QuantityAndCartControls = ({
  quantity,
  handleQuantityChange,
  handleAddToCart,
  isEditing
}) => (
  <motion.div
    className="flex items-center justify-between mt-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
  >
    <QuantityControl 
      quantity={quantity}
      handleQuantityChange={handleQuantityChange}
    />
    <AddToCartButton 
      handleAddToCart={handleAddToCart}
      isEditing={isEditing}
    />
  </motion.div>
);

const QuantityControl = ({ quantity, handleQuantityChange }) => (
  <div className="flex items-center bg-gray-100 rounded-full p-2">
    <QuantityButton
      icon={<Minus className="w-4 h-4" />}
      onClick={() => handleQuantityChange(-1)}
      disabled={quantity === 1}
      tooltip="Disminuir cantidad"
    />
    <Typography className="mx-4 font-bold">{quantity}</Typography>
    <QuantityButton
      icon={<Plus className="w-4 h-4" />}
      onClick={() => handleQuantityChange(1)}
      tooltip="Aumentar cantidad"
    />
  </div>
);

const QuantityButton = ({ icon, onClick, disabled, tooltip }) => (
  <Tooltip title={tooltip}>
    <span>
      <IconButton
        onClick={onClick}
        disabled={disabled}
        className="text-gray-600 hover:text-[#C8151B]"
      >
        {icon}
      </IconButton>
    </span>
  </Tooltip>
);

const AddToCartButton = ({ handleAddToCart, isEditing }) => (
  <Button
    onClick={handleAddToCart}
    variant="contained"
    className="flex-grow ml-4 bg-[#FFC603] hover:bg-[#C8151B] text-white py-3"
    startIcon={<ShoppingCart className="w-5 h-5" />}
  >
    {isEditing ? 'Actualizar carrito' : 'Añadir al carrito'}
  </Button>
);

// Wrapping el componente con el Provider necesario
export default function CustomizeWrapper() {
  return (
    <ErrorBoundary>
    <CustomizationProvider>
      <Customize />
    </CustomizationProvider>
  </ErrorBoundary>
  );
}