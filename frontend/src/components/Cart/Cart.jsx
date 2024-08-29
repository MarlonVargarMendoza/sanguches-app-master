import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useId } from 'react';
import { useCart } from '../../hooks/useCart.js';
import './Cart.css';

export function CartItem({ thumbnail, price, title, quantity, addToCart, description, removeFromCart }) {
  return (

    <li className='flex items-center'>
      <img className='w-16 h-16 object-cover mr-4'
        src={thumbnail}
        alt={title}
      />
      <div className='item-details flex-grow'>
        <span className="text-sm">{title}</span>
        <span className="price">${price}</span>
        <div className="flex justify-between items-center mt-2">
        <span className="description text-xs text-gray-400 mb-2 ">{description}</span>
        </div>
      </div>

      <footer>
        <small>
          <strong> {quantity}</strong>
        </small>
        <button onClick={addToCart}><AddCircleIcon /></button>
      </footer>
    </li>
  )
}

export function Cart() {
  const cartCheckboxId = useId()
  const { cart, clearCart, addToCart } = useCart()

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

        <button onClick={clearCart}>
          <RemoveShoppingCartIcon />
        </button>
      </aside>
    </>
  )
}
