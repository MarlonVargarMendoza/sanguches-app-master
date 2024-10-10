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
    Button,
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Snackbar,
    Typography
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useVoucherGenerator } from '../../hooks/useVoucherGenerator';
import { sendToWhatsApp } from '../../services/notificationService';

const CART_WIDTH = 'w-full sm:w-96 md:w-120';

export const PersistentCart = () => {
    const { cart, updateCartItem, removeFromCart, calculateTotalPrice, calculateItemPrice } = useCart();
    const generateVoucher = useVoucherGenerator();
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

    const handleSendToWhatsApp = useCallback(() => {
        const voucherText = generateVoucher();
        sendToWhatsApp(voucherText);
        setSnackbarOpen(true);
    }, [generateVoucher]);
    const handleCheckout = useCallback(() => {
        navigate('/checkout');
        setIsCartOpen(false);
    }, [navigate]);
    const renderCustomizations = (item) => {
        if (!item.customizations) return null;

        return (
            <>
                <Button
                    onClick={() => toggleItemExpansion(item.id)}
                    endIcon={expandedItems[item.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    fullWidth
                    className="mt-2 justify-start text-[#C8151B] hover:bg-[#FFC603]/10"
                >
                    {expandedItems[item.id] ? 'Ver menos' : 'Ver personalizaciones'}
                </Button>
                <Collapse in={expandedItems[item.id]}>
                    <List dense>
                        {item.customizations.additions?.length > 0 && (
                            <ListItem>
                                <ListItemText
                                    primary="Adiciones"
                                    secondary={item.customizations.additions.join(', ')}
                                />
                            </ListItem>
                        )}
                        {item.customizations.drinks?.length > 0 && (
                            <ListItem>
                                <ListItemText
                                    primary="Bebidas"
                                    secondary={item.customizations.drinks.map(drink =>
                                        `${drink.name} (${drink.price ? `$${drink.price.toFixed(2)}` : 'N/A'})`
                                    ).join(', ')}
                                />
                            </ListItem>
                        )}
                        {item.customizations.sauces?.length > 0 && (
                            <ListItem>
                                <ListItemText
                                    primary="Salsas"
                                    secondary={item.customizations.sauces.join(', ')}
                                />
                            </ListItem>
                        )}
                    </List>
                </Collapse>
            </>
        );
    };

    const renderCartItem = (item) => (
        <motion.li
            key={item.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-4 pb-4 border-b"
        >
            <Box className="flex items-center w-full">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                <Box className="flex-grow">
                    <Typography variant="subtitle1" className="font-bold text-[#C8151B]">
                        {item.name}
                    </Typography>
                    <Box className="flex justify-between items-center mt-2">
                        <Box className="flex items-center border rounded-md overflow-hidden">
                            <IconButton onClick={() => handleQuantityChange(item.id, item.quantity - 1)} size="small" className="text-[#C8151B]">
                                <RemoveIcon />
                            </IconButton>
                            <Typography className="mx-2 font-bold">{item.quantity}</Typography>
                            <IconButton onClick={() => handleQuantityChange(item.id, item.quantity + 1)} size="small" className="text-[#C8151B]">
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <Typography variant="subtitle1" className="font-bold text-[#C8151B]">
                            ${calculateItemPrice(item).toFixed(2)}
                        </Typography>
                    </Box>
                    {renderCustomizations(item)}
                </Box>
                <Box className="flex flex-col ml-2">
                    <IconButton onClick={() => handleEditProduct(item)} size="small" className="text-[#FFC603]">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => removeFromCart(item.id)} size="small" className="text-[#C8151B]">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Box>
        </motion.li>
    );

    return (
        <>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton onClick={toggleCart} className="ml-auto mr-4" style={{ color: 'white' }}>
                    <Badge badgeContent={cart.length} color="error">
                        <ShoppingCartIcon />
                    </Badge>
                </IconButton>
            </motion.div>

            <AnimatePresence>
                {isCartOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className={`fixed top-0 right-0 h-full ${CART_WIDTH} bg-white shadow-lg z-50`}
                    >
                        <Box className='flex justify-between items-center p-4 border-b bg-[#FFC603]'>
                            <Typography variant="h6" className="font-bold text-white">
                                Carrito Sanguches
                            </Typography>
                            <IconButton onClick={toggleCart} className="text-white">
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
                                <motion.ul layout>
                                    <AnimatePresence>
                                        {cart.map(renderCartItem)}
                                    </AnimatePresence>
                                </motion.ul>
                            )}
                        </Box>

                        <Box className="absolute bottom-0 left-0 right-0 p-4 bg-[#FFF9C4]">
                            <Box className="flex justify-between mb-2">
                                <Typography variant="subtitle1">Total</Typography>
                                <Typography variant="subtitle1" className="font-bold text-[#C8151B]">
                                    ${calculateTotalPrice().toFixed(2)}
                                </Typography>
                            </Box>
                            <Typography variant="caption" className="mb-4 block text-gray-600">
                                Tasas y fletes calculados en el carrito
                            </Typography>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleCheckout}
                                disabled={cart.length === 0}
                                className="bg-[#FFC603] hover:bg-[#C8151B] text-white font-bold py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                            >
                                IR A CHECKOUT
                            </Button>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>

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