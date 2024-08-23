import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HeartIcon from '@mui/icons-material/Favorite';
import HeartOutlinedIcon from '@mui/icons-material/FavoriteBorder';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { useCart } from '../../hooks/useCart.js';
import './Products.css';
import { CartProvider } from '../../context/cart.jsx';

export function ProductsSanguches() {  
    
    console.log('llego');
    
    const products = [
      {
        "id": 6,
        "title": "Sanguche 3 quesos",
        "description": "Disfruta de nuestra irresistible sanduche extra queso, creando una explosión de sabores que deleitará tu paladar con cada bocado.",
        "price": 1749,
        "discountPercentage": 11.02,
        "rating": 4.57,
        "stock": 83,
        "brand": "Apple",
        "category": "laptops",
        "thumbnail": "https://www.semana.com/resizer/v2/6J5MO5UYBRAIHLBLEIV7ETG53Q.png?auth=0b71a935d2837d47e311e69baaec3fa95d018cfca47a46f89983531f57d9e75c&smart=true&quality=75&width=1280&height=720",
        "images": [
           "https://i.dummyjson.com/data/products/6/1.png",
           "https://i.dummyjson.com/data/products/6/2.jpg",
           "https://i.dummyjson.com/data/products/6/3.png",
           "https://i.dummyjson.com/data/products/6/4.jpg"
        ]
     },
     {
      "id": 2,
      "title": "Sanguche 3",
      "description": "Disfruta de nuestra irresistible sanduche extra queso, creando una explosión de sabores que deleitará tu paladar con cada bocado.",
      "price": 899,
      "discountPercentage": 17.94,
      "rating": 4.44,
      "stock": 34,
      "brand": "Apple",
      "category": "smartphones",
      "thumbnail": "https://www.semana.com/resizer/v2/6J5MO5UYBRAIHLBLEIV7ETG53Q.png?auth=0b71a935d2837d47e311e69baaec3fa95d018cfca47a46f89983531f57d9e75c&smart=true&quality=75&width=1280&height=720",
      "images": [
         "https://i.dummyjson.com/data/products/2/1.jpg",
         "https://i.dummyjson.com/data/products/2/2.jpg",
         "https://i.dummyjson.com/data/products/2/3.jpg",
         "https://i.dummyjson.com/data/products/2/thumbnail.jpg"
      ]
    },
    ]
  
    const { addToCart, removeFromCart, cart } = useCart();
  
    const checkProductInCart = (product) => {
      return cart.some((item) => item.id === product.id);
    };
  
    const toggleFavorite = (product) => {
      if (checkProductInCart(product)) {
        removeFromCart(product);
      } else {
        addToCart(product);
      }
    };
  
    return (
            <main className='products w-full flex justify-center items-center p-8 bg-gray-100'>
                <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0 m-0 rounded-lg'>
                {products.slice(0, 10).map((product) => {
                    const isProductInCart = checkProductInCart(product);
        
                    return (
                    <li key={product.id} className="card relative overflow-hidden bg-white rounded-lg shadow-lg flex flex-col gap-4 p-4">
                        <div className="img-container">
                        <img src={product.thumbnail} alt={product.title} />
                        </div>
                        <div className="actions">
                        <a href="#" className="favorite" onClick={() => toggleFavorite(product)}>
                            {isProductInCart ? (
                            <HeartIcon className="text-red-500" />
                            ) : (
                            <HeartOutlinedIcon className="text-gray-500" />
                            )}
                        </a>
                        </div>
                        <div>
                        <strong>{product.title}</strong> <br />
                        <span className="text-gray-700">{product.description}</span>
                        </div>
                        <div className="flip-container">
                        <div className="flip-box">
                            <div className="flip-box-front">
                            <del>
                                <span className="price">${(product.price * 1.2).toFixed(2)}</span>
                            </del>
                            <ins>
                                <span className="price">${product.price.toFixed(2)}</span>
                            </ins>
                            </div>
                            <div className="flip-box-back">
                            <button
                                style={{ backgroundColor: isProductInCart ? 'red' : '#09f' }}
                                onClick={() => {
                                isProductInCart ? removeFromCart(product) : addToCart(product);
                                }}
                            >
                                <span className="button-text">Ordenar ahora</span>
                                {isProductInCart ? <RemoveShoppingCartIcon /> : <ArrowForwardIcon />}
                            </button>
                            </div>
                        </div>
                        </div>
                    </li>
                    );
                })}
                </ul>
            </main>
    );
  }

export default ProductsSanguches