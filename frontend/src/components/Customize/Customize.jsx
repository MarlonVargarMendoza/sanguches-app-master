import { Box, Breadcrumbs, Button, Grid, IconButton, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Coffee, Droplet, Gift, Minus, Pizza, Plus, ShoppingCart } from 'lucide-react';
import { lazy, memo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import priceUtils from '../../../utils/priceUtils';
import { CustomizationProvider } from '../../context/CustomizeContext';
import { useCart } from '../../hooks/useCart';
import { useCustomizations } from '../../hooks/useProductCustomization';
import { ErrorBoundary } from '../Error/ErrorComponents';
import CustomSelect from '../ui/CustomSelect';
import NotificationSnackbar from './sections/NotificationSnackbar ';

import Loader from '../ui/Loader';
const DOMAIN = import.meta.env.VITE_APP_DOMAIN;
const SideBySideMagnifier = lazy(() => import('react-image-magnifiers').then(mod => ({ default: mod.SideBySideMagnifier })));
const RelatedProducts = lazy(() => import('./sections/RelatedProducts'));

//  configuaciones estáticas centralizadas
const CUSTOMIZATION_CONFIG = {
  additions: { icon: <Pizza className="w-5 h-5" />, label: "Agregar Adición" },
  sauces: { icon: <Droplet className="w-5 h-5" />, label: "Agregar Salsas" },
  drinks: { icon: <Coffee className="w-5 h-5" />, label: "Añadir Bebidas" },
  accompaniments: { icon: <Gift className="w-5 h-5" />, label: "Agregar Acompañamientos" }
};

const BreadcrumbNav = memo(() => (
  <Breadcrumbs className="mb-6">
    <Link to="/" className="hover:text-[#C3151A]">Inicio</Link>
    <Link to="/menuSanguches" className="hover:text-[#C3151A]">Menú</Link>
    <Typography color="text.primary">Personaliza tu sándwich</Typography>
  </Breadcrumbs>
));

const ProductImageSection = memo(({ product }) => (
  <Grid item xs={12} md={5}>
    <Box className="rounded-xl overflow-hidden shadow-lg">
      <SideBySideMagnifier
        imageSrc={`${DOMAIN}${product.image}`}
        imageAlt={product.name}
        largeImageSrc={`${DOMAIN}${product.image}`}
        alwaysInPlace
        overlayBoxOpacity={0.8}
        cursorStyle="crosshair"
        className="w-full"
      />
    </Box>
    <Typography variant="body1" className="mt-4 text-gray-700">
      <span className="font-semibold">Ingredientes:</span> 
      {product.ingredients?.map(ing => ing.name).join(', ') || 'Información no disponible'}
    </Typography>
  </Grid>
));

const QuantityControl = memo(({ quantity, onDecrease, onIncrease }) => (
  <div className="flex items-center bg-gray-100 rounded-full p-2">
    <Tooltip title="Disminuir cantidad">
      <IconButton
        onClick={onDecrease}
        disabled={quantity === 1}
        className="text-gray-600 hover:text-[#C8151B]"
        size="small"
        aria-label="Reducir cantidad"
      >
        <Minus className="w-4 h-4" />
      </IconButton>
    </Tooltip>
    <Typography className="mx-4 font-bold text-gray-700">{quantity}</Typography>
    <Tooltip title="Aumentar cantidad">
      <IconButton
        onClick={onIncrease}
        className="text-gray-600 hover:text-[#C8151B]"
        size="small"
        aria-label="Aumentar cantidad"
      >
        <Plus className="w-4 h-4" />
      </IconButton>
    </Tooltip>
  </div>
));

//  Componente principal 
function Customize() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { selectedProduct: initialProduct } = location.state || {};
  const { toggleCart } = useCart();
  
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

  // Efecto para scroll 
  useEffect(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [initialProduct?.id]);

  if (loading) return <Loader fullScreen />;
  if (error || !product) return <ErrorBoundary error={error} />;

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <main 
        className="container mx-auto p-4 md:p-6" 
        style={{ paddingTop: isMobile ? '110px' : '140px' }}
      >
        <BreadcrumbNav />
        
        <Grid container spacing={4} className="bg-white rounded-lg shadow-lg p-6">
          <ProductImageSection product={product} />
          
          <Grid item xs={12} md={7} className="space-y-6">
            {/* Encabezado del producto */}
            <div>
              <Typography variant="h4" className="font-bold text-[#525D5A]">
                {product.name}
              </Typography>
              <Typography variant="h5" className="font-black text-[#FFC603] mt-2">
                {priceUtils(calculatePrice().toFixed(2))}
              </Typography>
            </div>
            
            {/* Opciones de personalización */}
            {Object.entries(CUSTOMIZATION_CONFIG).map(([type, { icon, label }]) => (
              <CustomSelect
                key={type}
                label={label}
                items={customizations[type]}
                selectedItems={selections[type]}
                onChange={(newSelection) => handleSelectionChange(type, newSelection)}
                icon={icon}
                priceDisplay={type !== 'sauces'}
                aria-label={`Seleccionar ${label}`}
              />
            ))}
            
            {/* Controles de cantidad y carrito */}
            <div className="flex items-center justify-between mt-8">
              <QuantityControl
                quantity={quantity}
                onDecrease={() => handleQuantityChange(quantity - 1)}
                onIncrease={() => handleQuantityChange(quantity + 1)}
              />
              <Button
                onClick={handleAddToCart}
                variant="contained"
                className="flex-grow ml-4 bg-[#FFC603] hover:bg-[#C8151B] text-white py-3"
                startIcon={<ShoppingCart className="w-5 h-5" />}
                aria-label={isEditing ? 'Actualizar carrito' : 'Añadir al carrito'}
              >
                {isEditing ? 'Actualizar carrito' : 'Añadir al carrito'}
              </Button>
            </div>
          </Grid>
        </Grid>

        <RelatedProducts products={products} />
        
        <NotificationSnackbar
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          isEditing={isEditing}
          onViewCart={() => {
            setSnackbarOpen(false);
            toggleCart();
          }}
        />
      </main>
    </div>
  );
}

// Wrapper
export default function CustomizeWrapper() {
  return (
    <ErrorBoundary>
      <CustomizationProvider>
        <Customize />
      </CustomizationProvider>
    </ErrorBoundary>
  );
}