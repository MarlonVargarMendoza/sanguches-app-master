import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Alert, Grid, Snackbar, Typography } from "@mui/material";

import { useState } from 'react';
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
                <div className='flex items-center justify-between mb-4 bg-[#C8151B] rounded p-2'>
                    <Typography variant="h6" component="h2" className='font-bold text-white'>
                        Tu orden
                    </Typography>
                    <div className="relative">
                        <span className="inline-block bg-white rounded-full h-7 w-7 text-center text-red-700 mr-2">
                            <ShoppingCartIcon /></span> {/* Example item count */}
                        {/* Add any other icons or elements from the header */}
                    </div>
                </div>
            </Grid>

            <Grid item className='overflow-y-auto sx={{flexGrow: 1}}'>
                <ul className='item-details '>
                    {cart.map(product => (
                        <CartItem
                            key={product.id}
                            addToCart={() => addToCart(product)}
                            removeFromCart={() => clearCart(product)}
                            {...product}
                        />
                    ))}
                </ul>

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
                                Finalizar compra
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