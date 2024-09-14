import { Link as RouterLink } from 'react-router-dom';


const DOMAIN = import.meta.env.VITE_APP_DOMAIN;
function ProductCard({ product, onAddToCart, onRemoveFromCart, isInCart }) {
    
    // Assuming 'product' prop contains the data from the API
    const { id, name, basePrice, image } = product; 
    // Check if basePrice exists and is a number before using toFixed
    const formattedPrice = basePrice != null && !isNaN(basePrice) ? basePrice.toFixed(2) : '0.00';
    const formattedOldPrice = basePrice != null && !isNaN(basePrice) ? (basePrice * 1.2).toFixed(2) : '0.00'; 

    const imageUrl = `${DOMAIN}${product.image}`
    console.log(imageUrl);
        

    return (
        <li key={id} className="product-card">
            {/* Image */}
            <div className="product-image">
            <RouterLink to='/editaloTuMismo' state={{ selectedProduct: product }}>
                <img
                    src={imageUrl} 
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </RouterLink>
            </div>
            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="product-name">{name}</h3>
                {/* Price & Button */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-baseline">
                        <span className="old-price text-gray-500 line-through mr-2 text-sm">
                            ${formattedOldPrice} 
                        </span>
                        <span className="text-lg font-semibold">${formattedPrice}</span>
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