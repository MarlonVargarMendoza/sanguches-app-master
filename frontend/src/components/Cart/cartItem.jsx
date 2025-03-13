import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import priceUtils from '../../../utils/priceUtils';
import { useCart } from '../../hooks/useCart';

const DOMAIN = import.meta.env.VITE_APP_DOMAIN;

// Componente optimizado para mostrar grupos de customizaciones
const CustomizationGroup = ({ title, items }) => {
  if (!items?.length) return null;

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center mb-2">
        <span className="h-px flex-grow bg-gradient-to-r from-gray-200 to-transparent" />
        <span className="px-3 text-xs uppercase tracking-wider text-gray-400 font-medium">{title}</span>
        <span className="h-px flex-grow bg-gradient-to-l from-gray-200 to-transparent" />
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <div 
            key={index}
            className="group relative inline-flex px-4 py-1.5 bg-white rounded-full border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFC603]/10 to-[#C8151B]/10 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative text-sm text-gray-700 font-medium whitespace-nowrap">
              {item.text || item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para expandir/contraer detalles
const ExpandButton = ({ isExpanded, onClick }) => (
  <button
    onClick={onClick}
    className="w-full group relative py-3 overflow-hidden bg-gradient-to-r from-gray-50 to-white hover:bg-gray-50 transition-colors duration-200"
  >
    <div className="relative flex items-center justify-center space-x-2">
      <span className="text-sm font-medium text-gray-600">
        {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
      </span>
      <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  </button>
);

const CartItem = React.memo(({ item, onSnackbarMessage }) => {
  const { updateCartItem, removeFromCart } = useCart();
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Verificar si el item tiene customizaciones
  const hasCustomizations = useMemo(() => {
    if (!item.customizations) return false;
    
    return Object.values(item.customizations).some(
      array => Array.isArray(array) && array.length > 0
    );
  }, [item.customizations]);

  // Construir la URL de la imagen
  const imageUrl = useMemo(() => `${DOMAIN}${item.image}`, [item.image]);

  // Manejador para cambiar la cantidad
  const handleQuantityChange = useCallback((change) => {
    const newQuantity = Math.max(1, item.quantity + change);
    updateCartItem(item.id, { quantity: newQuantity });
    
    const message = change > 0 ? 'Cantidad aumentada' : 'Cantidad reducida';
    onSnackbarMessage?.(`${message}: "${item.name}" - Cantidad: ${newQuantity}`);
  }, [item, updateCartItem, onSnackbarMessage]);

  // Manejador para eliminar el item
  const handleRemove = useCallback(() => {
    removeFromCart(item.id);
    onSnackbarMessage?.(`"${item.name}" eliminado del carrito`);
    setConfirmDelete(false);
  }, [item.id, item.name, removeFromCart, onSnackbarMessage]);

  // Alternar la expansión de detalles
  const toggleExpanded = useCallback(() => setExpanded(prev => !prev), []);

  if (!item) return null;

  return (
    <div className="cart-item bg-white rounded-lg shadow-md mb-4 overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      {/* Sección principal del item */}
      <Box className="flex items-center p-4">
        {/* Imagen del producto */}
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-50">
          <img
            src={imageUrl}
            alt={`${item.name}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Información del producto */}
        <div className="flex-grow ml-4">
          <Typography variant="h6" className="text-[#C8151B] font-bold">
            {item.name}
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Precio base: {priceUtils(item.basePrice || 0)}
          </Typography>
        </div>

        {/* Controles de cantidad */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center bg-gray-100 rounded-full p-1">
            <Tooltip title="Reducir cantidad" arrow>
              <span>
                <IconButton
                  onClick={() => handleQuantityChange(-1)}
                  size="small"
                  className="text-[#C8151B]"
                  disabled={item.quantity <= 1}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            
            <span className="mx-2 font-bold text-gray-800 min-w-[1.5rem] text-center">
              {item.quantity}
            </span>
            
            <Tooltip title="Aumentar cantidad" arrow>
              <IconButton
                onClick={() => handleQuantityChange(1)}
                size="small"
                className="text-[#C8151B]"
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>

          {/* Botón de eliminar */}
          <Tooltip title="Eliminar producto" arrow>
            <IconButton
              onClick={() => setConfirmDelete(true)}
              size="small"
              className="text-gray-400 hover:text-[#C8151B] hover:bg-red-50 transition-colors duration-300"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </Box>

      {/* Sección de customizaciones */}
      {hasCustomizations && (
        <>
          <ExpandButton isExpanded={expanded} onClick={toggleExpanded} />
          
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-gradient-to-b from-gray-50 to-white">
                  <CustomizationGroup title="Adiciones" items={item.customizations.additions} />
                  <CustomizationGroup title="Salsas" items={item.customizations.sauces} />
                  <CustomizationGroup title="Bebidas" items={item.customizations.drinks} />
                  <CustomizationGroup title="Acompañamientos" items={item.customizations.accompaniments} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        TransitionComponent={Fade}
        transitionDuration={300}
        PaperProps={{
          style: {
            borderRadius: '12px',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
         Eliminando {item.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Estás seguro de que deseas eliminar "{item.name}" de tu carrito?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: '16px' }}>
          <Button 
            onClick={() => setConfirmDelete(false)} 
            variant="outlined"
            sx={{ borderRadius: '8px', textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleRemove} 
            variant="contained" 
            color="error"
            sx={{ borderRadius: '8px', textTransform: 'none' }}
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    basePrice: PropTypes.number,
    quantity: PropTypes.number.isRequired,
    customizations: PropTypes.object
  }).isRequired,
  onSnackbarMessage: PropTypes.func
};

export default CartItem;