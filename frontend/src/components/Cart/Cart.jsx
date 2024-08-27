import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { useId } from 'react';
import { useCart } from '../../hooks/useCart.js';
import styles from '../../style.js';
import './Cart.css';

export function CartItem ({ thumbnail, price, title, quantity, addToCart }) {
  return (
    <li>
      <img
        src={thumbnail}
        alt={title}
      />
      <div className= {`${styles.paragraph}`}>
        <strong>{title}</strong> -<br /> ${price}
      </div>

      <footer>
        <small>
          {quantity}
        </small>
        <button onClick={addToCart}><AddCircleIcon /></button>
      </footer>
    </li>
  )
}

export function Cart () {
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
