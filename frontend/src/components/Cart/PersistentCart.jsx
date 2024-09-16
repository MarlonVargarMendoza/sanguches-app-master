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
                <div className='container flex justify-between items-center mb-4 bg-white rounded p-2'> {/* Added flex and items-center */}
                    <div className="flex items-center"> {/* Inner div to group text and icon */}
                        <span className="inline-block bg-white rounded-full h-7 w-7 text-center text-[#FFC603]">
                            <LocalMallIcon />
                        </span>
                        <Typography variant="h5" component="h2" className='font-bold text-black mr-2'> {/* Added margin-right */}
                            Tu Carrito
                        </Typography>

                        <Divider />
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
                                    snackbarOpen={snackbarOpen} // Pass snackbarOpen 
                                    handleSnackbarClose={handleSnackbarClose} // and handleSnackbarClose as prop
                                />
                                <Divider />
                            </React.Fragment>
                        ))}
                    </ul>
                )}
            </Grid>
            <Grid item>
                <footer>
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-black">Total</span>
                        <span className='text-gray-700 font-bold'>${calculateTotalPrice(cart)}</span>
                    </div>
                    <div className="flex mt-4 border-t border-gray-300 pt-4">
                        <button
                            size="lg"
                            className={`w-full bg-[#FFC603] hover:bg-orange-500 text-white font-bold py-2 
                            rounded mr-2 transition-transform duration-300 transform
                            ${cart.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-md'}`}
                            onClick={sendToWhatsApp}
                            disabled={cart.length === 0}
                        >
                            Continuar
                        </button>
                        <button
                            onClick={clearCart}
                            className={`bg-[#FFC603] hover:bg-orange-500 text-white font-bold rounded-full p-2 
                            transition-transform duration-300 transform 
                            ${cart.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-md'}`}
                            disabled={cart.length === 0}
                        >
                            <RemoveShoppingCartIcon />
                        </button>
                    </div>
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