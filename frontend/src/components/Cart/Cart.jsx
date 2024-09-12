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

export function CartItem({ thumbnail, price, title, quantity, addToCart, description, removeFromCart }) {
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
          
          <AddIcon onClick={() => addToCart({ thumbnail, price, title, quantity, description })} />
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
          <button onClick={clearCart}>
            <RemoveShoppingCartIcon />
          </button>

          {/* Botón para finalizar compra */}
          <button
            onClick={sendToWhatsApp}
            className='bg-[#C8151B] hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded' // Puedes personalizar los estilos
          >
            Continuar
          </button>
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
