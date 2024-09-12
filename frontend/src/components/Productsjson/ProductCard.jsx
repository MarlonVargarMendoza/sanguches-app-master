import { Link as RouterLink } from 'react-router-dom';

function ProductCard({ product, onAddToCart, onRemoveFromCart, isInCart }) {
    
    return (
        <li key={product.id} className="product-card">
            {/* Image */}
            <div className="product-image"> {/* Maintain a 4:3 aspect ratio */}
                <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="product-name">{product.title}</h3>
                

                {/* Price & Button */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-baseline">
                        <span className="text-gray-500 line-through mr-2 text-sm">
                            ${(product.price * 1.2).toFixed(2)}
                        </span>
                        <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
                    </div>
                    <RouterLink to='/editaloTuMismo' state={{ selectedProduct: product }}>
                        <button
                            className={`px-3 py-2 rounded-lg text-white font-semibold transition-colors duration-300 
                                ${isInCart 
                                    ? 'bg-red-600 hover:bg-red-700' 
                                    : 'bg-yellow-500 hover:bg-yellow-600'
                                }`}
                        >
                            {isInCart ? 'En tu carrito' : 'Personalizar'}
                        </button>
                    </RouterLink>
            
                </div>
            </div>
        </li>
    );
}

export default ProductCard;