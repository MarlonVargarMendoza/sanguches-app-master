<div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
  <img src="https://techstack-generator.vercel.app/js-icon.svg" alt="JavaScript" width="55" height="55" />
  <img src="https://techstack-generator.vercel.app/mysql-icon.svg" alt="MySQL" width="55" height="55" />
  <img src="https://techstack-generator.vercel.app/react-icon.svg" alt="React" width="55" height="55" />
</div>


# 🥪 Sanguches Xpress - Documentación Técnica
# 📚 Tech Stack 
(Basado en package.json y configuración del proyecto)
## Frontend
```jsonCopy{
  "dependencies": {
    "@emotion/react": "^11.5.0",
    "@emotion/styled": "^11.5.0",
    "@heroicons/react": "^1.0.6",
    "@material-tailwind/react": "^2.1.10",
    "@mui/icons-material": "^5.16.6",
    "@mui/material": "^5.16.6",
    "@mui/styles": "^5.16.6",
    "@react-google-maps/api": "^2.19.3",
    "axios": "^1.7.7",
    "framer-motion": "^11.5.4",
    "react": "^18.3.1",
    "react-router-dom": "^6.26.1",
    "zustand": "^5.0.0"
  }
}
```
## Backend (Laravel)

 - Laravel 10
 - PHP 8+
 - MySQL
 - RESTful API

🏗️ Arquitectura del Sistema

## 🎯 Patrones de Diseño Implementados


## 1.  Observer Pattern (Carrito y filtros de productos) ✅ 
Implementado para manejar actualizaciones del carrito en tiempo real y notificaciones.

- CartContext y FiltersContext actúan como el Subject principal que mantiene el estado del carrito
- cartReducer maneja las mutaciones del estado y notifica a los observers
- El estado inicial y las acciones definidas (ADD_ITEM, REMOVE_ITEM, etc.) son los eventos que se observan permitiendo parametrizar clientes con diferentes solicitudes y hacer queue o log de solicitudes( Patron Command)


### Implementacion 


#### CartItem es efectivamente un Observer concreto que:

Se suscribe a los cambios del estado del carrito
Reacciona a las actualizaciones renderizando los nuevos datos
Maneja las interacciones locales (cantidad, eliminación)

#### Mecanismo de Observación

```bash
// En useCart (actúa como intermediario)
const { state, dispatch } = useContext(CartContext);
const [totalPrice, setTotalPrice] = useState(0);

useEffect(() => {
  setTotalPrice(calculateTotalPrice());
}, [state.items, calculateTotalPrice]);

```
#### Gestión de Estado
CartProvider Este mecanismo de suscripción y notificación está abstraído por React, lo que hace el código más limpio y mantenible en el contexto de una aplicación React moderna.

```bash 
//Publisher (CartContext.jsx) 

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  // Se asegura de retornar correctamente el Provider con sus props
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Subscriber (PersistentCart.jsx)
export const PersistentCart = () => {
  const { cart, totalPrice } = useCart();
  useEffect(() => {
    if (cart.length > 0) {
      setCartAnimation(true);
    }
  }, [cart]);
};

// CartItem Observa cambios en el estado del carrito

const CartItem = React.memo(({ item, onSnackbarMessage }) => {
  // Suscripción al estado global mediante useCart
  const { updateCartItem, removeFromCart } = useCart();
  
  // Estado local del observer
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Reacción a cambios mediante callbacks
  const handleQuantityChange = useCallback((change) => {
    const newQuantity = Math.max(1, item.quantity + change);
    updateCartItem(item.id, { quantity: newQuantity });
    onSnackbarMessage?.(`${message}: "${item.name}" - Cantidad: ${newQuantity}`);
  }, [item, updateCartItem, onSnackbarMessage]);
});
```

### Acciones del Observer

```bash
// Actualización de cantidad
const handleQuantityChange = useCallback((change) => {
  const newQuantity = Math.max(1, item.quantity + change);
  updateCartItem(item.id, { quantity: newQuantity });
}, [item, updateCartItem]);

// Eliminación del item
const handleRemove = useCallback(() => {
  removeFromCart(item.id);
  onSnackbarMessage?.(`"${item.name}" eliminado del carrito`);
}, [item.id, removeFromCart]);
```
#### Flujo de Datos
  El cartReducer procesa las acciones y actualiza el estado
Los observers (CartItem, PersistentCart) se actualizan automáticamente
useCart proporciona métodos para interactuar con el estado

#### Ventajas de esta Implementación 💡

Desacoplamiento: Los componentes del carrito están desacoplados del estado central
Reactividad: Las actualizaciones se propagan automáticamente
Mantenibilidad: Centraliza la lógica de estado en el reducer
Escalabilidad: Facilita añadir nuevos observers sin modificar el código existente

## 2. Command Pattern en cartReducer ✅ 
El patrón Command encapsula una solicitud como un objeto, permitiendo parametrizar clientes con diferentes solicitudes y hacer queue o log de solicitudes.

#### Los elementos del patrón Command presentes son:

```bash
export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    // Cada case representa un comando concreto
    case 'ADD_ITEM': {
      // Comando para añadir item
      const { id, customizations = {} } = action.payload;
      // Lógica del comando...
    }
    
    case 'REMOVE_ITEM': {
      // Comando para eliminar item
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    }
    
    case 'UPDATE_ITEM': {
      // Comando para actualizar item
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.updates } : item
        )
      };
    }
    
    case 'CLEAR_CART': {
      // Comando para limpiar carrito
      return initialState;
    }
  }
};

``` 

Command: Las acciones con su type y payload
```bash
{ type: 'ADD_ITEM', payload: {id, customizations} }
```

Receiver: El estado del carrito que recibe los comandos
```bash
 const initialState = { items: [], total: 0 };
 ```

Invoker: El dispatch que ejecuta los comandos
```bash 
dispatch({ type: 'ADD_ITEM', payload: item });
```

Client: Los componentes que crean y envían los comandos
```bash 
const addToCart = useCallback((item) => {
  dispatch({ type: 'ADD_ITEM', payload: item });
}, [dispatch]);
```


### Integración con PersistentCart 🔄
PersistentCart actúa como un contenedor que:

Maneja la visibilidad del carrito
- Coordina múltiples CartItems
- Proporciona el contexto para las animaciones
- Gestiona la persistencia del estado

```bash 
// En PersistentCart
const PersistentCart = () => {
  const { cart } = useCart();
  
  return (
    <AnimatePresence>
      {cart.map(item => (
        <CartItem 
          key={item.id} 
          item={item}
          onSnackbarMessage={handleSnackbarMessage} 
        />
      ))}
    </AnimatePresence>
  );
};
```

## 3. Patrón Template Method en la Gestión de Productos  ✅ 
El código implementa el patrón Template Method para manejar diferentes tipos de productos (sándwiches, bebidas, donas) manteniendo una estructura algorítmica común.
### Clase Base Abstracta
ProductCard actúa como la clase base que define el template:
```bash
const ProductCard = ({
    product,
    onAddToCart,
    onRemoveFromCart,
    isInCart = false,
    quantity = 0,
    buttonText = 'AGREGAR',
    showLogo = false 
}) => {
    // Template method structure
    return (
        <motion.div>
            {/* Skeleton implementation */}
            <div className="relative product-image">
                {/* Image rendering step */}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                {/* Content rendering step */}
            </div>
        </motion.div>
    );
};
```
#### Métodos Concretos (Steps)
```bash
// DrinkCard.jsx - Implementación concreta
const DrinkCard = (props) => {
    const handleCartAction = useCallback((e) => {
        e.stopPropagation();
        if (isInCart) {
            onRemoveFromCart?.(product.id);
        } else {
            onAddToCart?.(product);
        }
    }, [product, isInCart]);

    return ProductCard({...props});
};
```

####  Contenedor que Define el Algoritmo
ProductsSanguches define la estructura principal:
```bash 
export function ProductsSanguches() {
    // 1. Inicialización
    const [products, setProducts] = useState([]);
    
    // 2. Carga de datos
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        // Implementación de carga
    }, [selectedCategories]);

    // 3. Renderizado del contenido
    const renderContent = () => {
        if (isLoading) return <ProductLoadingPlaceholder/>;
        if (error) return <Alert/>;
        return <ProductsList products={products}/>;
    };
}

```
### Beneficios de esta Implementación 💡

#### Reutilización de Código:

La estructura base se define una vez en ProductCard, DrinkCard, ComboCard
Las variantes heredan la estructura para reutilizar el codigo


#### Flexibilidad:

Cada tipo de producto puede personalizar comportamientos específicos
Mantiene consistencia en la interfaz de usuario


#### Mantenibilidad:

Cambios en la estructura base afectan a todos los productos
Modificaciones específicas no alteran otros componentes

✅  Backend con MVC

#### Controllers (Capa de Presentación) Manejan requests y responses  🗂️ 
Cada controlador se encarga de hacer consultas sencillas a base de datos y de dar las respuestas de cada endpoint en formato JSON

```BASH 
class ProductController extends Controller {
    protected $productService;

    public function __construct(ProductService $productService) {
        $this->productService = $productService;
    }

    public function index() {
        $result = $this->productService->getSandwichsHome();
        // Handle response...
    }
}
```
#### Service Layer (Lógica de Negocio)  🗂️ 
Es una consulta a base de datos que esta separada de los controladores por que es una logica mas larga, entonces se manejo como un microservicio
```BASH


phpCopyclass ProductService {
    public function getSandwichsHome() {
        try {
            $sandwichs = Product::with(['ingredients' => function ($query) {
                $query->where('status', true)
                ->select('ingredients.id', 'name');
            }])
            // Lógica de negocio...
        } catch (\Throwable $th) {
            return ['status' => 500, 'message' => $th];
        }
    }
}
```
### API   🗂️ 
Encargado de definir como se va a acceder a cada endpoint de la API

```bash
Route::resource('products', ProductController::class)->except('create', 'edit', 'store', 'edit', 'update', 'destroy');
Route::get('additions', [ProductController::class, 'additions']);
```
#### Models (Capa de Datos) Definen estructura y relaciones de datos  🗂️ 

```BASH 
class Product extends Model {
    protected $fillable = [
        'name',
        'basePrice',
        'image',
        // ...
    ];

    // Relaciones Eloquent
    public function ingredients() {
        return $this->belongsToMany(Ingredient::class, 
            'sandwiche_ingredients', 
            'products_id', 
            'ingredients_id'
        );
    }
}
```

## 🚀 Performance

- Lazy loading de componentes
- Code splitting por rutas
- Memoización de componentes costosos
- Optimización de imágenes
- Caché de datos


                                                      Developed with ❤️

