import { Close as CloseIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { Alert, Badge, Box, Button, Drawer, IconButton, Snackbar, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useVoucherGenerator } from '../../hooks/useVoucherGenerator';
import CartItem from './CartItem';

const CART_WIDTH = 'w-full sm:w-96 md:w-120';
const ANIMATION_DURATION = 300;

export const PersistentCart = () => {
    const { cart, totalPrice, clearCart, generateVoucher } = useCart();
    const voucherGenerator = useVoucherGenerator();
    const navigate = useNavigate();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [snackbarState, setSnackbarState] = useState({ open: false, message: '', severity: 'success' });
    const [cartAnimation, setCartAnimation] = useState(false);

    const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);

    const handleSnackbarMessage = useCallback((message, severity = 'success') => {
        setSnackbarState({ open: true, message, severity });
    }, []);

    const handleCheckout = useCallback(() => {
        if (cart.length === 0) {
            handleSnackbarMessage('Tu carrito está vacío. Añade algunos productos antes de hacer checkout.', 'warning');
        } else {
            navigate('/checkout');
            setIsCartOpen(false);
        }
    }, [navigate, cart.length, handleSnackbarMessage]);

    useEffect(() => {
        if (cart.length > 0) {
            setCartAnimation(true);
            const timer = setTimeout(() => setCartAnimation(false), ANIMATION_DURATION);
            return () => clearTimeout(timer);
        }
    }, [cart]);

    const renderCartContent = () => (
        <Box className="h-full flex flex-col">
            <Box className="flex justify-between items-center p-4 border-b bg-[#FFC603]">
                <Typography variant="h6" className="font-bold text-white">Carrito Sanguches</Typography>
                <IconButton onClick={toggleCart} className="text-white">
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box className="flex-grow overflow-y-auto p-4">
                <AnimatePresence>
                    {cart.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="empty-cart p-4 text-center"
                        >
                            <Typography variant="body1" className="text-gray-500 mb-4">
                                Tu carrito está vacío.
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={toggleCart}
                                className="bg-[#FFC603] hover:bg-[#C8151B] text-white"
                            >
                                Continuar comprando
                            </Button>
                        </motion.div>
                    ) : (
                        cart.map(item => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onSnackbarMessage={handleSnackbarMessage}
                            />
                        ))
                    )}
                </AnimatePresence>
            </Box>

            {cart.length > 0 && (
                <Box className="p-4 bg-[#FFF9C4]">
                    <Box className="flex justify-between mb-2">
                        <Typography variant="subtitle1">Total</Typography>
                        <Typography variant="subtitle1" className="font-bold text-[#C8151B]">
                            ${totalPrice.toFixed(2)}
                        </Typography>
                    </Box>
                    <Typography variant="caption" className="mb-4 block text-gray-600">
                        Tasas y fletes calculados en el checkout
                    </Typography>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleCheckout}
                        className="bg-[#FFC603] hover:bg-[#C8151B] text-white font-bold py-3 rounded-full transition-all duration-300 transform hover:scale-105 mb-2"
                    >
                        IR A CHECKOUT
                    </Button>
                </Box>
            )}
        </Box>
    );

    return (
        <>
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={cartAnimation ? { scale: [1, 1.2, 1] } : {}}
            >
                <IconButton onClick={toggleCart} className="ml-auto mr-4" style={{ color: 'white' }}>
                    <Badge badgeContent={cart.length} color="error">
                        <ShoppingCartIcon />
                    </Badge>
                </IconButton>
            </motion.div>

            <Drawer
                anchor="right"
                open={isCartOpen}
                onClose={toggleCart}
                classes={{ paper: CART_WIDTH }}
            >
                {renderCartContent()}
            </Drawer>

            <Snackbar
                open={snackbarState.open}
                autoHideDuration={3000}
                onClose={() => setSnackbarState(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarState(prev => ({ ...prev, open: false }))} severity={snackbarState.severity} sx={{ width: '100%' }}>
                    {snackbarState.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default PersistentCart;