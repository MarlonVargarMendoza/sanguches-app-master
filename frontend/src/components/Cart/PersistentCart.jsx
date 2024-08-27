import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { useCart } from '../../hooks/useCart.js';
import { CartItem } from './Cart.jsx';

export const PersistentCart = () => {
    const { cart, clearCart, addToCart } = useCart();

    return (
        <aside className='bg-red-700 p-8  w-1/3  z-50 shadow-md persistent-cart'>
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
    );
}

export default PersistentCart;