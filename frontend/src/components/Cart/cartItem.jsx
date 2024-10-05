import {
  Add as AddIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  Collapse, Divider,
  IconButton,
  List, ListItem, ListItemText,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart'; // Make sure this path is correct

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart, calculateItemPrice } = useCart();
  const [expanded, setExpanded] = useState(false);

  if (!item) {
    return null; // Or some fallback UI
  }

  const handleQuantityChange = (change) => {
    const newQuantity = (item.quantity || 0) + change;
    if (newQuantity > 0) {
      updateCartItem(item.id, { quantity: newQuantity });
    } else {
      removeFromCart(item.id);
    }
  };

  const toggleExpanded = () => setExpanded(!expanded);

  const hasAdditions = item.customizations && (
    (item.customizations.additions && item.customizations.additions.length > 0) || 
    (item.customizations.sauces && item.customizations.sauces.length > 0) || 
    (item.customizations.drinks && item.customizations.drinks.length > 0)
  );

  const itemPrice = calculateItemPrice(item);

  return (
    <Box className="cart-item bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
      <Box className="flex items-center p-4">
        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg mr-4" />
        <Box className="flex-grow">
          <Typography variant="subtitle1" className="font-bold text-[#C8151B]">
            {item.name}
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            ${(item.basePrice || 0).toFixed(2)}
          </Typography>
        </Box>
        <Box className="flex items-center">
          <IconButton onClick={() => handleQuantityChange(-1)} size="small" className="text-[#FFC603]">
            <RemoveIcon />
          </IconButton>
          <Typography className="mx-2 font-bold">{item.quantity || 0}</Typography>
          <IconButton onClick={() => handleQuantityChange(1)} size="small" className="text-[#FFC603]">
            <AddIcon />
          </IconButton>
        </Box>
      </Box>

      {hasAdditions && (
        <>
          <Divider />
          <Button
            onClick={toggleExpanded}
            fullWidth
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            className="justify-between py-2 px-4 bg-[#FFC603] text-white hover:bg-[#e6b200]"
          >
            {expanded ? 'Ver menos' : 'Ver más'}
          </Button>
          <Collapse in={expanded}>
            <List dense>
              {item.customizations.additions?.map((addition, index) => (
                <ListItem key={`addition-${index}`}>
                  <ListItemText 
                    primary={addition.name} 
                    secondary={addition.price ? `$${addition.price.toFixed(2)}` : ''}
                  />
                </ListItem>
              ))}
              {item.customizations.sauces?.map((sauce, index) => (
                <ListItem key={`sauce-${index}`}>
                  <ListItemText primary={sauce.name} />
                </ListItem>
              ))}
              {item.customizations.drinks?.map((drink, index) => (
                <ListItem key={`drink-${index}`}>
                  <ListItemText 
                    primary={drink.name} 
                    secondary={drink.price ? `$${drink.price.toFixed(2)}` : ''}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </>
      )}

      <Box className="p-4 bg-gray-100">
        <Typography variant="subtitle1" className="font-bold text-[#C8151B] text-right">
          Total: ${(itemPrice || 0).toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default CartItem;