import { Close as CloseIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { Alert, Badge, Box, Button, Drawer, IconButton, Snackbar, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import priceUtils from '../../../utils/priceUtils';
import { useCart } from '../../hooks/useCart';
import CartItem from './CartItem';

// Configuración centralizada
const CONFIG = {
    ANIMATION: {
        CART_ICON: { scale: 1.2, transition: { type: 'spring', stiffness: 500 } },
        ITEM: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    },
    DURATION: { SNACKBAR: 3000, TRANSITION: 300 },
    LAYOUT: { CART_WIDTH: { mobile: '85vw', desktop: '400px' } },
    STYLES: {
        BUTTON: 'bg-[#FFC603] hover:bg-[#C8151B] text-black hover:text-white',
        GRADIENT: 'bg-gradient-to-r from-[#FFC603] to-[#ffb700]'
    }
};

// Componentes memoizados
const CartHeader = React.memo(({ onClose }) => (
    <Box className={`flex justify-between items-center p-4 border-b ${CONFIG.STYLES.GRADIENT}`}>
        <Typography variant="h6" className="font-bold text-white drop-shadow-sm">
            Tu Carrito
        </Typography>
        <IconButton onClick={onClose} className="text-white hover:bg-white/20 transition-colors">
            <CloseIcon />
        </IconButton>
    </Box>
));

const EmptyCartMessage = React.memo(({ onClose }) => (
    <motion.div className="flex flex-col items-center justify-center p-8 h-full"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="mb-4 p-6 bg-gray-50 rounded-full">
            <ShoppingCartIcon style={{ fontSize: 48 }} className="text-gray-300" />
        </div>
        <Typography variant="h6" className="mb-2 text-gray-700 font-medium text-center">
            Tu carrito está vacío
        </Typography>
        <Button variant="contained" onClick={onClose} className={`${CONFIG.STYLES.BUTTON} px-6 py-4 rounded-full`}>
            Explorar Menú
        </Button>
    </motion.div>
));

const CartFooter = React.memo(({ totalPrice, onCheckout }) => (
    <Box className="p-5 bg-[#FFF9C4] border-t border-yellow-200">
        <Box className="flex justify-between mb-2">
            <Typography variant="subtitle1" className="font-medium text-gray-700">Total</Typography>
            <Typography variant="h6" className="font-bold text-[#C8151B]">{priceUtils(totalPrice)}</Typography>
        </Box>

        <Button variant="contained" fullWidth onClick={onCheckout}
            className={`${CONFIG.STYLES.BUTTON} py-3 px-6 rounded-full font-bold shadow-md`}>
            FINALIZAR COMPRA
        </Button>
    </Box>
));

const PersistentCart = () => {
    const { cart, totalPrice } = useCart();
    const navigate = useNavigate();
    const [isCartOpen, setIsCartOpen] = React.useState(false);
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

    const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);
    const handleSnackbar = useCallback((message, severity) =>
        setSnackbar({ open: true, message, severity }), []);

    const handleCheckout = useCallback(() => {
        if (!cart.length) return handleSnackbar('Agrega productos antes de continuar', 'warning');
        navigate('/checkout');
        setIsCartOpen(false);
    }, [cart.length, navigate, handleSnackbar]);

    const cartWidth = useMemo(() =>
        window.innerWidth <= 640 ? CONFIG.LAYOUT.CART_WIDTH.mobile : CONFIG.LAYOUT.CART_WIDTH.desktop, []);

    return (
        <>
            <motion.div animate={cart.length ? CONFIG.ANIMATION.CART_ICON : {}}>
                <IconButton onClick={toggleCart} className="text-white relative">
                    <Badge badgeContent={cart.length} color="error" overlap="circular">
                        <ShoppingCartIcon />
                    </Badge>
                </IconButton>
            </motion.div>

            <Drawer anchor="right" open={isCartOpen} onClose={toggleCart}
                PaperProps={{ style: { width: cartWidth }, className: "shadow-2xl" }}>
                <Box className="h-full flex flex-col">
                    <CartHeader onClose={toggleCart} />

                    <Box className="flex-grow overflow-y-auto p-4 bg-gray-50">
                        {cart.length ? (
                            <AnimatePresence>
                                {cart.map(item => (
                                    <motion.div key={item.id} {...CONFIG.ANIMATION.ITEM}>
                                        <CartItem item={item} onSnackbarMessage={handleSnackbar} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        ) : <EmptyCartMessage onClose={toggleCart} />}
                    </Box>

                    {!!cart.length && <CartFooter totalPrice={totalPrice} onCheckout={handleCheckout} />}
                </Box>
            </Drawer>

            <Snackbar open={snackbar.open} autoHideDuration={CONFIG.DURATION.SNACKBAR}
                onClose={() => setSnackbar(p => ({ ...p, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: '12px', width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default React.memo(PersistentCart);