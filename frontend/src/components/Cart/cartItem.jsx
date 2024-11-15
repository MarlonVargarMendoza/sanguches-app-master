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
  Tooltip
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import priceUtils from '../../../utils/priceUtils';
import { ANIMATION_DURATION } from '../../constants';
import { useCart } from '../../hooks/useCart';

const DOMAIN = import.meta.env.VITE_APP_DOMAIN;

// Componente para el grupo de customizaciones
const CustomizationGroup = ({ title, items }) => {
  if (!items?.length) return null;

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center mb-2">
        <span className="h-px flex-grow bg-gradient-to-r from-gray-200 to-transparent" />
        <span className="px-3 text-xs uppercase tracking-wider text-gray-400 font-medium">
          {title}
        </span>
        <span className="h-px flex-grow bg-gradient-to-l from-gray-200 to-transparent" />
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFC603]/20 to-[#C8151B]/20 rounded-full blur-sm transition-all duration-300 group-hover:blur-md" />
              <div className="relative px-4 py-1.5 bg-white bg-opacity-90 rounded-full border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md">
                <span className="text-sm text-gray-700 font-medium whitespace-nowrap">
                  {item.text || item.name}

                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Botón expandir/colapsar personalizado
const ExpandButton = ({ isExpanded, onClick }) => (
  <motion.button
    onClick={onClick}
    className="w-full group relative py-3 overflow-hidden bg-gradient-to-r from-gray-50 to-white"
    whileHover="hover"
    whileTap="tap"
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-[#FFC603]/5 to-[#C8151B]/5"
      variants={{
        hover: { opacity: 1 },
        tap: { opacity: 0.8 }
      }}
    />
    <div className="relative flex items-center justify-center space-x-2">
      <span className="text-sm font-medium text-gray-600">
        {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
      </span>
      <motion.div
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
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
      </motion.div>
    </div>
  </motion.button>
);

const CartItem = React.memo(({ item, onSnackbarMessage }) => {
  const { updateCartItem, removeFromCart } = useCart();
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const hasCustomizations = useMemo(() => {
    return item.customizations && (
      (item.customizations.additions?.length > 0) ||
      (item.customizations.sauces?.length > 0) ||
      (item.customizations.drinks?.length > 0) ||
      (item.customizations.accompaniments?.length > 0)
    );
  }, [item.customizations]);

  const imageUrl = useMemo(() =>
    `${DOMAIN}${item.image}`,
    [item.image]
  );

  const handleQuantityChange = useCallback((change) => {
    const newQuantity = Math.max(1, item.quantity + change);
    updateCartItem(item.id, { quantity: newQuantity });
    const message = change > 0 ? 'Cantidad aumentada' : 'Cantidad reducida';
    onSnackbarMessage?.(`${message}: "${item.name}" - Cantidad: ${newQuantity}`);
  }, [item, updateCartItem, onSnackbarMessage]);

  const handleRemove = useCallback(() => {
    removeFromCart(item.id);
    onSnackbarMessage?.(`"${item.name}" eliminado del carrito`);
    setConfirmDelete(false);
  }, [item.id, item.name, removeFromCart, onSnackbarMessage]);

  const toggleExpanded = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  if (!item) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: ANIMATION_DURATION / 1000 }}
    >
      <article className="cart-item bg-white rounded-lg shadow-md mb-4 overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <Box className="flex items-center p-4">
          <motion.div
            className="relative w-20  rounded-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={imageUrl}
              alt={`${item.name} - Imagen del producto`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
          <div className="flex-grow ml-4">
            <h3 className="text-[#C8151B] font-bold text-lg">
              {item.name}
            </h3>
            <p className="text-gray-600 text-sm">
              Precio base: {priceUtils(item.basePrice || 0)}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
              <Tooltip title="Reducir cantidad" arrow>
                <span>
                  <IconButton
                    onClick={() => handleQuantityChange(-1)}
                    size="small"
                    className="text-[#C8151B]"
                    disabled={item.quantity <= 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <span className="mx-2 font-bold">
                {item.quantity}
              </span>
              <Tooltip title="Aumentar cantidad" arrow>
                <IconButton
                  onClick={() => handleQuantityChange(1)}
                  size="small"
                  className="text-[#C8151B]"
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </div>
            <div className="mt-2">
              <Tooltip title="Eliminar producto" arrow>
                <IconButton
                  onClick={() => setConfirmDelete(true)}
                  size="small"
                  className="text-[#C8151B]"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </Box>

        {hasCustomizations && (
          <>
            <ExpandButton
              isExpanded={expanded}
              onClick={toggleExpanded}
            />
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: 'auto',
                    opacity: 1,
                    transition: { duration: 0.3, ease: 'easeOut' }
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: { duration: 0.2, ease: 'easeIn' }
                  }}
                  className="overflow-hidden"
                >
                  <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
                    <CustomizationGroup
                      title="Adiciones"
                      items={item.customizations.additions}
                    />
                    <CustomizationGroup
                      title="Salsas"
                      items={item.customizations.sauces}
                    />
                    <CustomizationGroup
                      title="Bebidas"
                      items={item.customizations.drinks}
                    />
                    <CustomizationGroup
                      title="Acompañamientos"
                      items={item.customizations.accompaniments}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </article>

      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        TransitionComponent={Fade}
        transitionDuration={300}
      >
        <DialogTitle>
          ¿Eliminar producto del carrito?
        </DialogTitle>
        <DialogContent>
          <p>
            ¿Estás seguro de que deseas eliminar "{item.name}" de tu carrito?
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleRemove} color="secondary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
});

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    basePrice: PropTypes.number,
    quantity: PropTypes.number.isRequired,
    customizations: PropTypes.shape({
      additions: PropTypes.array,
      sauces: PropTypes.array,
      drinks: PropTypes.array
    })
  }).isRequired,
  onSnackbarMessage: PropTypes.func
};

export default CartItem;