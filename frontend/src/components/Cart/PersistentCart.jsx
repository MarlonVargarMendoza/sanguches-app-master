import LocalMallIcon from '@mui/icons-material/LocalMall';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
    Alert, Badge, Button,
    IconButton,
    Snackbar, Typography
} from '@mui/material';
import Divider from '@mui/material/Divider';
import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { CartItem } from './CartItem';

export const PersistentCart = () => {
    const { cart, clearCart, addToCart, updateCartItem } = useCart();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => total + item.basePrice * item.quantity, 0);
    };

    const handleQuantityChange = (productId, newQuantity) => {
        updateCartItem(productId, { quantity: newQuantity });
    };

    const handleCustomizationChange = (productId, newCustomizations) => {
        updateCartItem(productId, { customizations: newCustomizations });
    };

    const sendToWhatsApp = () => {
        const cartItemsText = cart.map(item =>
            `${item.name} x ${item.quantity} - $${(item.basePrice * item.quantity).toFixed(2)}\n` +
            `Customizations: ${JSON.stringify(item.customizations)}`
        ).join('\n\n');
        const totalPrice = calculateTotalPrice();
        const message = `Hola, me interesa el siguiente pedido:\n\n${cartItemsText}\n\nTotal: $${totalPrice.toFixed(2)}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/573013501627?text=${encodedMessage}`;

        window.open(whatsappUrl);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    return (
        <>
            <IconButton
                onClick={toggleCart}
                className="ml-auto mr-4 "
                style={{ color: 'white' }} // Color del icono
            >
                <Badge badgeContent={cart.length} color="error">
                    <ShoppingCartIcon />
                </Badge>
            </IconButton>

            <div className={` fixed top-0  right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className='container flex justify-between items-center mb-4 bg-[#FFC603] p-4'>
                    <div className="flex items-center">
                        <LocalMallIcon className="text-white mr-2" />
                        <Typography variant="h5" component="h2" className='font-bold text-white'>
                            Tu Carrito
                        </Typography>
                    </div>
                    <IconButton onClick={toggleCart} className="text-white" style={{ color: '#C8151B' }}>

                        &times;
                    </IconButton>
                </div>

                <div className='overflow-y-auto h-[calc(100%-200px)] p-4'>
                    {cart.length === 0 ? (
                        <div className="empty-cart p-4 text-center">
                            <Typography variant="h6" className="font-semibold text-gray-600">
                                Tu carrito está vacío.
                            </Typography>
                            <Typography variant="body1" className="mt-2 text-gray-500">
                                Los productos que agregues aparecerán aquí
                            </Typography>
                        </div>
                    ) : (
                        <ul className='item-details'>
                            {cart.map(product => (
                                <React.Fragment key={product.id}>
                                    <CartItem
                                        addToCart={() => addToCart(product)}
                                        removeFromCart={() => clearCart(product)}
                                        {...product}
                                        price={product.basePrice}
                                        key={`${product.id}-${JSON.stringify(product.customizations)}`}
                                        onQuantityChange={(newQuantity) => handleQuantityChange(product.id, newQuantity)} // Add this line

                                    // onCustomizationChange={(newCustomizations) => handleCustomizationChange(item.id, newCustomizations)} */
                                    />
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <Typography variant="h6" className="font-bold text-black">Total</Typography>
                        <Typography variant="h6" className='text-[#FFC603] font-bold'>${calculateTotalPrice().toFixed(2)}</Typography>
                    </div>
                    <div className="flex mt-4">
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={sendToWhatsApp}
                            disabled={cart.length === 0}
                            className="mr-2 bg-[#FFC603] hover:bg-orange-500 text-white font-bold py-2 rounded transition-transform duration-300 transform hover:scale-105"
                        >
                            Hacer Pedido por WhatsApp
                        </Button>
                        <Button
                            variant="contained"
                            onClick={clearCart}
                            disabled={cart.length === 0}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            <RemoveShoppingCartIcon />
                        </Button>
                    </div>
                </div>
            </div>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    ¡Pedido enviado a WhatsApp! 🚀 Pronto estaremos en contacto.
                </Alert>
            </Snackbar>
        </>
    );
};

export default PersistentCart;