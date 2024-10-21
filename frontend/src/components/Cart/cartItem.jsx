import { Add as AddIcon, Delete as DeleteIcon, ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Box, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Fade, IconButton, List, ListItem, ListItemText, Tooltip, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

const DOMAIN = import.meta.env.VITE_APP_DOMAIN;

const CartItem = React.memo(({ item, onSnackbarMessage }) => {
  const { updateCartItem, removeFromCart, calculateItemPrice } = useCart();
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();
 

  const handleQuantityChange = useCallback((change) => {
    const newQuantity = Math.max(1, item.quantity + change);
    updateCartItem(item.id, { quantity: newQuantity });
    
    const message = change > 0 ? 'Cantidad aumentada' : 'Cantidad reducida';
    onSnackbarMessage(`${message}: "${item.name}" - Cantidad: ${newQuantity}`);
  }, [item, updateCartItem, onSnackbarMessage]);

  const handleRemove = useCallback(() => {
    removeFromCart(item.id);
    onSnackbarMessage(`"${item.name}" eliminado del carrito`);
    setConfirmDelete(false);
  }, [item.id, item.name, removeFromCart, onSnackbarMessage]);

  const toggleExpanded = useCallback(() => setExpanded(prev => !prev), []);


  const hasCustomizations = item.customizations && (
    (item.customizations.additions?.length > 0) || 
    (item.customizations.sauces?.length > 0) || 
    (item.customizations.drinks?.length > 0)
  );

  const itemPrice = calculateItemPrice(item);

  const renderCustomizations = () => (
    <List dense className="bg-gray-50">
      {item.customizations.additions?.length > 0 && (
        <ListItem>
          <ListItemText
            primary="Adiciones"
            secondary={item.customizations.additions.map(addition => 
              `${addition.text || addition.name} (+$${addition.price})`
            ).join(', ')}
          />
        </ListItem>
      )}
      {item.customizations.sauces?.length > 0 && (
        <ListItem>
          <ListItemText
            primary="Salsas"
            secondary={item.customizations.sauces.map(sauce => 
              sauce.text || sauce.name
            ).join(', ')}
          />
        </ListItem>
      )}
      {item.customizations.drinks?.length > 0 && (
        <ListItem>
          <ListItemText
            primary="Bebidas"
            secondary={item.customizations.drinks.map(drink => 
              `${drink.text || drink.name} (+$${drink.price})`
            ).join(', ')}
          />
        </ListItem>
      )}
    </List>
  );

  if (!item) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Box className="cart-item bg-white rounded-lg shadow-md mb-4 overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <Box className="flex items-center p-4">
          <img 
            src={DOMAIN+item.image} 
            alt={item.name} 
            className="w-20 h-20 object-cover rounded-lg mr-4 shadow-sm" 
            />
          <Box className="flex-grow">
            <Typography variant="subtitle1" className="font-bold text-[#C8151B]">
              {item.name}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Precio base: ${(item.basePrice || 0)}
            </Typography>
          </Box>
          <Box className="flex flex-col items-end">
            <Box className="flex items-center bg-gray-100 rounded-full overflow-hidden">
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
              <Typography className="mx-2 font-bold">{item.quantity}</Typography>
              <Tooltip title="Aumentar cantidad" arrow>
                <IconButton 
                  onClick={() => handleQuantityChange(1)} 
                  size="small" 
                  className="text-[#C8151B]"
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Box className="mt-2">
              
              <Tooltip title="Eliminar producto" arrow>
                <IconButton onClick={() => setConfirmDelete(true)} size="small" className="text-[#C8151B]">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {hasCustomizations && (
          <>
            <Divider />
            <Button
              onClick={toggleExpanded}
              color='secondary'
              fullWidth
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              className="justify-between py-2 px-4 bg-[#FFC603] text-white hover:bg-[#e6b200] transition-colors duration-300"
            >
              {expanded ? 'Ocultar detalles' : 'Ver detalles'}
            </Button>
            <Collapse in={expanded}>
              {renderCustomizations()}
            </Collapse>
          </>
        )}

      
      </Box>

      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        TransitionComponent={Fade}
        transitionDuration={300}
      >
        <DialogTitle>{"¿Eliminar producto del carrito?"}</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar "{item.name}" de tu carrito?
          </Typography>
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

export default CartItem;