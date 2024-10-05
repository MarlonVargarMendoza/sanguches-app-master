import {
    Add as AddIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon,
    Remove as RemoveIcon,
    ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import {
    Alert,
    Badge,
    Box,
    Button, Collapse,
    IconButton,
    List, ListItem, ListItemText,
    Snackbar,
    Typography
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

export const PersistentCart = () => {
    const { cart, updateCartItem, removeFromCart, calculateTotalPrice, calculateItemPrice } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();

    const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);
    const toggleItemExpansion = useCallback((itemId) => {
        setExpandedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
    }, []);

    const handleQuantityChange = useCallback((itemId, newQuantity) => {
        if (newQuantity > 0) {
            updateCartItem(itemId, { quantity: newQuantity });
        } else {
            removeFromCart(itemId);
        }
    }, [updateCartItem, removeFromCart]);

    const handleEditProduct = useCallback((product) => {
        navigate('/editaloTuMismo', { state: { selectedProduct: product } });
        setIsCartOpen(false);
    }, [navigate]);

    const sendToWhatsApp = useCallback(() => {
        const cartItemsText = cart.map(item => 
            `${item.name} x ${item.quantity} - $${calculateItemPrice(item).toFixed(2)}
${item.customizations ? Object.entries(item.customizations).map(([key, value]) => 
  `  ${key}: ${Array.isArray(value) ? value.map(v => v.name || v).join(', ') : value}`
).join('\n') : ''}`
        ).join('\n\n');
        const totalPrice = calculateTotalPrice();
        const message = `Hola, me interesa el siguiente pedido:\n\n${cartItemsText}\n\nTotal: $${totalPrice.toFixed(2)}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/573013501627?text=${encodedMessage}`;

        window.open(whatsappUrl);
        setSnackbarOpen(true);
    }, [cart, calculateItemPrice, calculateTotalPrice]);

    return (
        <>
            <IconButton onClick={toggleCart} className="ml-auto mr-4" style={{ color: 'white' }}>
                <Badge badgeContent={cart.length} color="error">
                    <ShoppingCartIcon />
                </Badge>
            </IconButton>

            <Box className={`fixed top-0 right-0 h-full w-120 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <Box className='flex justify-between items-center p-4 border-b bg-[#FFC603]'>
                    <Typography variant="h6" className="font-bold text-white">
                        Carrito Sanguches
                    </Typography>
                    <IconButton onClick={toggleCart}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box className='overflow-y-auto h-[calc(100%-200px)] p-4'>
                    {cart.length === 0 ? (
                        <Box className="empty-cart p-4 text-center">
                            <Typography variant="body1" className="text-gray-500">
                                Tu carrito está vacío.
                            </Typography>
                        </Box>
                    ) : (
                        <List>
                            {cart.map(item => (
                                <ListItem key={item.id} className="mb-4 pb-4 border-b">
                                    <Box className="flex items-center w-full">
                                        <img src={item.image} alt={item.name} className="w-16 h-12 object-cover mr-4" />
                                        <Box className="flex-grow">
                                            <Typography variant="subtitle1" className="font-bold text-[#C8151B]">
                                                {item.name}
                                            </Typography>
                                            <Box className="flex justify-between items-center mt-2">
                                                <Box className="flex items-center border rounded-sm">
                                                    <IconButton onClick={() => handleQuantityChange(item.id, item.quantity - 1)} size="small">
                                                        <RemoveIcon />
                                                    </IconButton>
                                                    <Typography className="mx-2">{item.quantity}</Typography>
                                                    <IconButton onClick={() => handleQuantityChange(item.id, item.quantity + 1)} size="small">
                                                        <AddIcon />
                                                    </IconButton>
                                                </Box>
                                                <Typography variant="subtitle1" className="font-bold text-[#C8151B]">
                                                    $ {calculateItemPrice(item).toFixed(2)}
                                                </Typography>
                                            </Box>
                                            {item.customizations && (
                                                <>
                                                    <Button
                                                        onClick={() => toggleItemExpansion(item.id)}
                                                        endIcon={expandedItems[item.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                        fullWidth
                                                        className="mt-2 justify-start"
                                                    >
                                                        {expandedItems[item.id] ? 'Ver menos' : 'Ver más'}
                                                    </Button>
                                                    <Collapse in={expandedItems[item.id]}>
                                                        <List>
                                                            {Object.entries(item.customizations).map(([key, value]) => (
                                                                <ListItem key={key}>
                                                                    <ListItemText
                                                                        primary={`${key}: ${Array.isArray(value) ? value.map(v => v.name || v).join(', ') : value}`}
                                                                    />
                                                                </ListItem>
                                                            ))}
                                                        </List>
                                                    </Collapse>
                                                </>
                                            )}
                                        </Box>
                                        <Box className="flex flex-col">
                                            <IconButton onClick={() => handleEditProduct(item)} size="small">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => removeFromCart(item.id)} size="small">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>

                <Box className="absolute bottom-0 left-0 right-0 p-4 bg-[#FFF9C4]">
                    <Box className="flex justify-between mb-2">
                        <Typography variant="subtitle1">Total</Typography>
                        <Typography variant="subtitle1" className="font-bold text-[#C8151B]">
                            $ {calculateTotalPrice().toFixed(2)}
                        </Typography>
                    </Box>
                    <Typography variant="caption" className="mb-4 block">
                        Tasas y fletes calculados en el carrito
                    </Typography>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={sendToWhatsApp}
                        disabled={cart.length === 0}
                        className="bg-[#FFC603] hover:bg-[#C8151B] text-white font-bold py-2 rounded transition-transform duration-300 transform hover:scale-105"
                    >
                        FINALIZAR COMPRA
                    </Button>
                </Box>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    ¡Pedido enviado a WhatsApp! 🚀 Pronto estaremos en contacto.
                </Alert>
            </Snackbar>
        </>
    );
};

export default PersistentCart;