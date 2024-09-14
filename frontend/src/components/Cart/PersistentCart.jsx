import LocalMallIcon from '@mui/icons-material/LocalMall';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { Alert, Divider, Grid, Snackbar, Typography } from "@mui/material";
import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart.js';
import styles from '../../style.js';
import './Cart.css';
import { CartItem } from './Cart.jsx';
export const PersistentCart = () => {
    const { cart, clearCart, addToCart } = useCart();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const sendToWhatsApp = () => {
        const cartItemsText = cart.map(item =>
            `${item.title} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');
        const totalPrice = calculateTotalPrice(cart);
        const message = `Hola, me interesa el siguiente pedido:\n\n${cartItemsText}\n\nTotal: $${totalPrice.toFixed(2)}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/573013501627?text=${encodedMessage}`;

        window.open(whatsappUrl);
        setSnackbarOpen(true);
    }
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    return (

        <li className='persistent-cart'>

            <Grid item>
                <div className='container justify-between mb-4 bg-white rounded p-2'>
                    <Typography variant="h5" component="h2" className='font-bold text-black'>
                        Tu Carrito
                    </Typography>
                    <div className="relative">
                        <span className="inline-block bg-white rounded-full h-7 w-7 text-center text-red-700 mr-2">
                            <LocalMallIcon /></span>
                    </div>

                    <Divider />
                </div>
            </Grid>

            <Grid item className='overflow-y-auto sx={{ flexGrow: 1 }} no-scrollbar'>
                {cart.length === 0 ? ( // Check if cart is empty
                    <div className="empty-cart p-4 text-center"> {/* Center the message */}
                        <Typography variant="h6" className="font-semibold text-gray-600">
                            Tu carrito está vacío.
                        </Typography>
                        <Typography variant="body1" className="mt-2 text-gray-500">
                            ¡Agrega algunos productos deliciosos para comenzar tu pedido!
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
                                />
                                <Divider />
                            </React.Fragment>
                        ))}
                    </ul>
                )}
            </Grid>
            <Grid item>
                <footer>

                    <footer>
                        <div className="mt-4 border-t border-gray-300 pt-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-white">Total</span>
                                <span className='text-white font-bold'>${calculateTotalPrice(cart)}</span>
                            </div>
                            <button
                                size="lg"
                                className='w-full bg-red-700 hover:bg-yellow-500 text-white font-bold'
                                onClick={sendToWhatsApp}
                            >
                                Continuar
                            
                            </button>
                        </div>
                        <button onClick={clearCart}>
                            <RemoveShoppingCartIcon className='red text-white' />
                        </button>
                    </footer>

                </footer>
            </Grid>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000} // Adjust duration as needed
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center', }} // Adjust position as needed
            >
                <Alert onClose={handleSnackbarClose}
                    severity="success"
                    sx={{ width: '100%', ...styles.successAlert }}>
                    <label class="container">
                        <input checked="checked" type="checkbox" />
                        <div class="checkmark"></div>
                    </label>
                    Pedido enviado a WhatsApp! 🚀 ¡Pronto estaremos en contacto!
                </Alert>
            </Snackbar>
        </li>
    );
};
function calculateTotalPrice(cart) {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

export default PersistentCart;