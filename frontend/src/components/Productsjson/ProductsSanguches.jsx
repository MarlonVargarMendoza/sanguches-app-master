import CloseIcon from '@mui/icons-material/Close'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import {
  Breadcrumbs, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Grid, IconButton, Link, Snackbar, Tooltip, Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import ContentLoader from "react-content-loader"
import { useNavigate } from 'react-router-dom'
import logoSanguches from '../../assets/logoSanguches.jpg'
import { useCart } from '../../hooks/useCart.js'
import { getAllProducts } from '../../services/productService.js'
import styles from '../../style.js'
import Footer from '../Footer.jsx'
import { Navbar } from '../Navbar/Navbar.jsx'
import { Filters } from '../Productsjson/Filters.jsx'
import './Products.css'

export function ProductsSanguches() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const navigate = useNavigate()
  const { cart, addToCart, updateCartItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const data = await getAllProducts(selectedCategory)
        setProducts(data)
      } catch (error) {
        setError("Oops! No pudimos cargar los productos. Por favor, intenta de nuevo.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory])

  const handleFilterChange = (newFilters) => {
    setSelectedCategory(newFilters.category)
  }

  const checkProductInCart = (product) => {
    return cart.some((item) => item.id === product.id)
  }

  const getCartItemQuantity = (product) => {
    const cartItem = cart.find((item) => item.id === product.id)
    return cartItem ? cartItem.quantity : 0
  }

  const handleAddToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      updateCartItem(product.id, { quantity: existingItem.quantity + 1 })
    } else {
      addToCart({ ...product, quantity: 1 })
    }
    setSnackbarMessage('¡Producto añadido al carrito!')
    setSnackbarOpen(true)
  }

  const handleRemoveFromCart = (product) => {
    removeFromCart(product)
    setSnackbarMessage('Producto eliminado del carrito')
    setSnackbarOpen(true)
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedProduct(null)
  }

  const handleCustomize = () => {
    navigate('/editaloTuMismo', {
      state: {
        selectedProduct: {
          ...selectedProduct,
          basePrice: selectedProduct.basePrice || 0,
        }
      }
    })
    handleCloseDialog()
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {[...Array(6)].map((_, index) => (
            <ContentLoader
              key={index}
              speed={2}
              width={400}
              height={250}
              viewBox="0 0 400 250"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
            >
              <rect x="0" y="0" rx="5" ry="5" width="400" height="150" />
              <rect x="0" y="165" rx="3" ry="3" width="350" height="20" />
              <rect x="0" y="195" rx="3" ry="3" width="250" height="20" />
              <rect x="0" y="225" rx="3" ry="3" width="150" height="20" />
            </ContentLoader>
          ))}
        </ul>
      )
    }

    if (error) {
      return (
        <div className="text-center py-10">
          <Typography variant="h6" color="error">{error}</Typography>
          <Button
            variant="contained"
            style={{ backgroundColor: '#DB0E12', color: 'white' }}
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Intentar de nuevo
          </Button>
        </div>
      )
    }

    return (
      <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {products.map((product) => {
          const isProductInCart = checkProductInCart(product)
          const quantity = getCartItemQuantity(product)
          return (
            <li
              key={product.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <div className="relative">
                <img
                  src={product.description}
                  alt={product.name}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => handleProductClick(product)}
                />
                <Tooltip title={isProductInCart ? "Quitar del carrito" : "Añadir al carrito"}>
                  <IconButton
                    className="absolute top-2 right-2 bg-white p-1 rounded-full transition-all duration-300 ease-in-out"
                    onClick={(e) => {
                      e.stopPropagation()
                      isProductInCart ? handleRemoveFromCart(product) : handleAddToCart(product)
                    }}
                    style={{
                      filter: isProductInCart ? 'none' : 'grayscale(100%)',
                      transform: isProductInCart ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    <img 
                      src={logoSanguches} 
                      alt="Logo" 
                      className="w-6 h-6"
                    />
                  </IconButton>
                </Tooltip>
                {quantity > 0 && (
                  <div className="absolute bottom-2 right-2 bg-[#FFC603] text-black rounded-full w-6 h-6 flex items-center justify-center">
                    {quantity}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 line-through mr-2">
                      ${(product.basePrice * 1.2).toFixed(2)}
                    </span>
                    <span className="text-[#DB0E12] font-bold">
                      ${product.basePrice.toFixed(2)}
                    </span>
                  </div>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: '#FFC603', color: 'black' }}
                    onClick={() => handleProductClick(product)}
                    startIcon={<ShoppingCartIcon />}
                  >
                    {isProductInCart ? 'Actualizar' : 'Añadir'}
                  </Button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div className='bg-[#F5F5F5] min-h-screen'>
      <Navbar className={`${styles.navigation} bg-[#FFC603]`} />

      <main className='main-container p-6' style={{ paddingTop: '220px' }}>
        <Breadcrumbs aria-label="breadcrumb" className="mb-6">
          <Link color='inherit' href="/" className="hover:text-[#DB0E12]">
            Inicio
          </Link>
          <Typography color="text.primary">Menu</Typography>
        </Breadcrumbs>

        <div className='filters-container'>
          <Filters
            filters={{ minPrice: 0, category: selectedCategory }}
            onFilterChange={handleFilterChange}
          />
        </div>

        <Grid container spacing={4} className='mt-12'>
          <Grid item xs={12} md={11}>
            {renderContent()}
          </Grid>
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{selectedProduct?.name}</DialogTitle>
          <DialogContent>
            <img
              src={selectedProduct?.thumbnail}
              alt={selectedProduct?.name}
              className="w-full h-64 object-cover mb-4 rounded"
            />
            <Typography variant="body1" paragraph>
              {selectedProduct?.description}
            </Typography>
            <Typography variant="h6" style={{ color: '#DB0E12' }}>
              ${selectedProduct?.basePrice.toFixed(2)}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} style={{ color: '#DB0E12' }}>
              Cerrar
            </Button>
            <Button
              onClick={() => handleAddToCart(selectedProduct)}
              variant="contained"
              style={{ backgroundColor: '#FFC603', color: 'black' }}
              startIcon={<ShoppingCartIcon />}
            >
              Añadir al carrito
            </Button>
            <Button
              onClick={() => handleCustomize(selectedProduct)}
              variant="contained"
              style={{ backgroundColor: '#DB0E12', color: 'white' }}
            >
              Personalizar
            </Button>
          </DialogActions>
        </Dialog>
      </main>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />

      <Footer />
    </div>
  )
}

export default ProductsSanguches