import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

// Material-UI imports
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

// Constants
const WHATSAPP_NUMBER = '573013501627';
const CART_WIDTH = 'w-120';

export const PersistentCart = () => {
    const { cart, updateCartItem, removeFromCart, calculateTotalPrice, calculateItemPrice } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();

    // Helper functions
    const generateVoucher = useCallback(() => {
        let voucherText = "Detalle del Pedido:\n\n";
        let totalPrice = 0;
    
        cart.forEach((item, index) => {
            const itemPrice = calculateItemPrice(item);
            totalPrice += itemPrice;
    
            voucherText += `${index + 1}. ${item.name} x${item.quantity} - $${itemPrice.toFixed(2)}\n`;
            
            if (item.customizations) {
                if (item.customizations.additions && item.customizations.additions.length > 0) {
                    voucherText += "   Adiciones:\n";
                    item.customizations.additions.forEach(addition => {
                        voucherText += `     - ${addition || 'Sin nombre'}\n`;
                    });
                }
                if (item.customizations.drinks && item.customizations.drinks.length > 0) {
                    voucherText += "   Bebidas:\n";
                    item.customizations.drinks.forEach(drink => {
                        voucherText += `     - ${drink.name || 'Sin nombre'}: $${drink.price ? drink.price.toFixed(2) : 'N/A'}\n`;
                    });
                }
                if (item.customizations.sauces && item.customizations.sauces.length > 0) {
                    voucherText += `   Salsas: ${item.customizations.sauces.join(', ')}\n`;
                }
            }
            voucherText += '\n';
        });
    
        voucherText += `\nTotal: $${totalPrice.toFixed(2)}`;
        return voucherText;
    }, [cart, calculateItemPrice]);

    // Event handlers
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
        const voucherText = generateVoucher();
        const encodedMessage = encodeURIComponent(voucherText);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

        window.open(whatsappUrl);
        setSnackbarOpen(true);
    }, [generateVoucher]);

    // Render functions
    const renderCustomizations = (item) => {
        if (!item.customizations) return null;
    
        return (
            <>
                <Button
                    onClick={() => toggleItemExpansion(item.id)}
                    endIcon={expandedItems[item.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    fullWidth
                    className="mt-2 justify-start"
                >
                    {expandedItems[item.id] ? 'Ver menos' : 'Ver personalizaciones'}
                </Button>
                <Collapse in={expandedItems[item.id]}>
                    <List>
                        {item.customizations.additions && item.customizations.additions.length > 0 && (
                            <ListItem>
                                <ListItemText
                                    primary="Adiciones"
                                    secondary={item.customizations.additions.map(addition => 
                                        addition || 'Sin nombre'
                                    ).join(', ')}
                                />
                            </ListItem>
                        )}
                        {item.customizations.drinks && item.customizations.drinks.length > 0 && (
                            <ListItem>
                                <ListItemText
                                    primary="Bebidas"
                                    secondary={item.customizations.drinks.map(drink => 
                                        `${drink.name || 'Sin nombre'} ${drink.price ? `($${drink.price.toFixed(2)})` : ''}`
                                    ).join(', ')}
                                />
                            </ListItem>
                        )}
                        {item.customizations.sauces && item.customizations.sauces.length > 0 && (
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
    const renderCartItem = (item, index) => (
        <ListItem key={`${item.id}-${index}`} className="mb-4 pb-4 border-b">
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
                    {renderCustomizations(item)}
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
    );

    const renderCartItems = () => (
        <List>
            {cart.map(renderCartItem)}
        </List>
    );

    return (
        <>
            <IconButton onClick={toggleCart} className="ml-auto mr-4" style={{ color: 'white' }}>
                <Badge badgeContent={cart.length} color="error">
                    <ShoppingCartIcon />
                </Badge>
            </IconButton>

            <Box className={`fixed top-0 right-0 h-full ${CART_WIDTH} bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
                    ) : renderCartItems()}
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