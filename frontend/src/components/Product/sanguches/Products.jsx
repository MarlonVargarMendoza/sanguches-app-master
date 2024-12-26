import PropTypes from 'prop-types';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useCart } from '../../../hooks/useCart.js';
import { getProducts } from '../../../services/productService.js';
import Button from '../../ui/Button.jsx';
import ProductLoadingPlaceholder from '../../ui/ProductLoadingPlaceholder.jsx';
import ProductCard from '../sanguches/ProductCard.jsx';
import './Products.css';

// Constantes para mejorar mantenibilidad
const PLACEHOLDER_COUNT = 3;
const VISIBLE_PRODUCTS = 3;

// Array de identificadores únicos para los placeholders
const PLACEHOLDER_IDS = [
  'featured-product',
  'popular-product',
  'new-product'
];

const ProductGrid = memo(({ products, addToCart, removeFromCart, checkProductInCart }) => (
  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0 m-0 rounded-lg">
    {products.slice(0, VISIBLE_PRODUCTS).map(product => (
      <li key={`product-${product.id}`}>
         <ProductCard
            product={product}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            isInCart={checkProductInCart(product)}
            buttonText="Personalizar"
            showLogo={false}
          />
      </li>
    ))}
  </ul>
));

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number,
      image: PropTypes.string
    })
  ).isRequired,
  addToCart: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  checkProductInCart: PropTypes.func.isRequired,
};

ProductGrid.displayName = 'ProductGrid';

// Componente de mensaje de estado
const StateMessage = memo(({ message, type = 'info' }) => (
  <div
    className={`p-4 rounded-lg text-center ${type === 'error' ? 'bg-red-50 text-red-700' : 'text-gray-700'
      }`}
    role={type === 'error' ? 'alert' : 'output'}
  >
    {message}
  </div>
));

StateMessage.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['error', 'info'])
};

StateMessage.displayName = 'StateMessage';

// Container Component
export function Productsjson({ productService = getProducts }) {
  const { addToCart, removeFromCart, cart } = useCart();
  const [state, setState] = useState({
    products: [],
    isLoading: true,
    error: null
  });

  const checkProductInCart = useCallback((product) =>
    cart.some(item => item.id === product.id),
    [cart]
  );

  useEffect(() => {
    let isSubscribed = true;

    const fetchProducts = async () => {
      try {
        const data = await productService();
        if (isSubscribed) {
          setState({
            products: data,
            isLoading: false,
            error: null
          });
        }
      } catch (err) {
        if (isSubscribed) {
          setState(prevState => ({
            ...prevState,
            error: err.message,
            isLoading: false
          }));
        }
      }
    };

    fetchProducts();

    return () => {
      isSubscribed = false;
    };
  }, [productService]);

  const renderContent = () => {
    const { isLoading, error, products } = state;

    if (isLoading) {
      return <ProductLoadingPlaceholder />;
    }

    if (error) {
      return <StateMessage message={error} type="error" />;
    }

    if (!products.length) {
      return <StateMessage message="No products available at the moment." />;
    }

    return (
      <ProductGrid
        products={products}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        checkProductInCart={checkProductInCart}
      />
    );
  };

  return (
    <main className="w-full min-h-screen bg-[#f5f5f5]  md:flex-row">
      <div className="pt-8">
        {renderContent()}
      </div>
      <div className="filters-container flex flex-row justify-center  w-full px-4 z-20 ">
        <Button buttonText="Ver menu completo" />
      </div>
    </main>
  );
}

Productsjson.propTypes = {
  productService: PropTypes.func
};

export default memo(Productsjson);