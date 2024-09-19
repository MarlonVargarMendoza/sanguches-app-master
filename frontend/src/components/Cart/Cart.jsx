import AddIcon from '@mui/icons-material/Add';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Alert, Snackbar } from '@mui/material';
import { useId, useState } from 'react';
import { useCart } from '../../hooks/useCart.js';
import './Cart.css';

const generateWhatsAppMessage = (cart) => {
  const cartItemsText = cart.map(item =>
    `${item.title} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
  ).join('\n');
  const totalPrice = calculateTotalPrice(cart);
  return `Hola, me interesa el siguiente pedido:\n\n${cartItemsText}\n\nTotal: $${totalPrice.toFixed(2)}`;
}

const sendToWhatsApp = (message) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/573013501627?text=${encodedMessage}`;
  window.open(whatsappUrl);
}
const handleSnackbarClose = () => {
  setSnackbarOpen(false);
};

export function CartItem({ thumbnail, price, title, quantity, addToCart, description, removeFromCart,
  snackbarOpen, // Receive snackbarOpen as prop
    handleSnackbarClose // Receive handleSnackbarClose as prop
 }) {

  const handleAddToCartClick = () => {
    addToCart({ thumbnail, price, title, quantity, description });
    setSnackbarOpen(true); 
  }
  



  return (
    <li className='product flex items-center'> {/* Apply "product" class for styling */}
      <img className='cart-product-image' src={thumbnail} alt={title} />
      <div className='item-desc'>
        <div className='flex top'>
          <h5>{title}</h5>
          <h4>${price}</h4>
        </div>
        <footer className='flex botton'>
          <small>
            <strong> {quantity}</strong>
          </small>

          <AddIcon onClick={handleAddToCartClick} />
        </footer>
      </div>
    </li>
  )
}

export function Cart() {
  const cartCheckboxId = useId()
  const { cart, clearCart, addToCart } = useCart()
  const [snackbarOpen, setSnackbarOpen] = useState(false)

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
  return (
    <>
      <label className='cart-button' htmlFor={cartCheckboxId}>

        <ShoppingCartIcon />
      </label>
      <input id={cartCheckboxId} type='checkbox' hidden />

      <aside className='cart'>
        <ul>
          {cart.map(product => (
            <CartItem
              key={product.id}
              addToCart={() => addToCart(product)}
              {...product}
            />
          ))}
        </ul>

        <footer>
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
        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: '100%' }}>
            {/* Puedes personalizar el contenido de la alerta */}
            Pedido enviado a WhatsApp! 🚀 ¡Pronto estaremos en contacto!
          </Alert>
        </Snackbar>

      </aside>
    </>
  )
}
