import { Alert, Box, Breadcrumbs, Container, Snackbar, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React, { memo, useCallback, useEffect, useState } from 'react';
import ContentLoader from "react-content-loader";
import { Link } from 'react-router-dom';
import useCart from '../../../hooks/useCart';
import { getProductsByCategory } from '../../../services/productService';
import DrinkCard from '../drinks/DrinkCard';

// Optimized loading placeholder with better skeleton UI
const LoadingPlaceholder = memo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
            <ContentLoader
                key={index}
                speed={2}
                width={400}
                height={400}
                viewBox="0 0 400 400"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
            >
                <rect x="0" y="0" rx="8" ry="8" width="400" height="200" />
                <rect x="0" y="220" rx="4" ry="4" width="300" height="20" />
                <rect x="0" y="260" rx="4" ry="4" width="400" height="40" />
                <rect x="0" y="320" rx="4" ry="4" width="150" height="30" />
            </ContentLoader>
        ))}
    </div>
));

// Enhanced page header with animations
const PageHeader = memo(() => (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <Breadcrumbs className="mb-6">
            <Link to="/" className="hover:text-[#C3151A]">Inicio</Link>
            <Typography color="text.primary">Donas</Typography>
        </Breadcrumbs>
        
        <Typography
            variant="h2" 
            className="text-center text-[#C8151B] mb-8"
            sx={{ 
                fontWeight: 'bold', 
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
        >
            Nuestras Donas
        </Typography>
        <Typography 
            variant="subtitle1" 
            className="text-center text-gray-600 mb-8 pb-4"
        >
            Descubre nuestra deliciosa selección de donas artesanales
        </Typography>
    </motion.div>
));

const Donuts = () => {
    const { addToCart, removeFromCart, updateQuantity, cart } = useCart();
    const [state, setState] = useState({
        products: [],
        isLoading: true,
        error: null
    });
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        message: ''
    });

    useEffect(() => {
        let isMounted = true;

        const fetchDonuts = async () => {
            try {
                setState(prev => ({ ...prev, isLoading: true }));
                const data = await getProductsByCategory(10); // ID 10 para donas
                
                if (isMounted) {
                    const formattedProducts = data.map(product => ({
                        id: product.id,
                        name: product.name,
                        description: product.description || 'Deliciosa dona artesanal',
                        basePrice: parseFloat(product.basePrice || 0),
                        image: product.image,
                        type: 'product'
                    }));

                    setState({
                        products: formattedProducts,
                        isLoading: false,
                        error: null
                    });
                }
            } catch (err) {
                if (isMounted) {
                    setState({
                        products: [],
                        isLoading: false,
                        error: 'Error al cargar las donas. Por favor, intenta más tarde.'
                    });
                }
            }
        };

        fetchDonuts();
        return () => { isMounted = false; };
    }, []);

    const handleAddToCart = useCallback((product) => {
        const existingItem = cart.find((item) => item.id === product.id);
        if (existingItem) {
            updateQuantity(product.id, existingItem.quantity + 1);
        } else {
            addToCart({
                ...product,
                quantity: 1,
                calculatedPrice: product.basePrice
            });
        }
        setSnackbarState({
            open: true,
            message: '¡Dona añadida al carrito!'
        });
    }, [cart, addToCart, updateQuantity]);

    const handleRemoveFromCart = useCallback((productId) => {
        removeFromCart(productId);
        setSnackbarState({
            open: true,
            message: 'Dona eliminada del carrito'
        });
    }, [removeFromCart]);

    const checkProductInCart = useCallback((productId) =>
        cart.some(item => item.id === productId),
        [cart]
    );

    const getCartQuantity = useCallback((productId) =>
        cart.find(item => item.id === productId)?.quantity || 0,
        [cart]
    );

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-[#F5F5F5] pt-[140px]"
        >
            <Container maxWidth="lg" className="px-4">
                <PageHeader />
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {state.isLoading ? (
                        <LoadingPlaceholder />
                    ) : state.error ? (
                        <Alert severity="error" className="max-w-2xl mx-auto my-8">
                            {state.error}
                        </Alert>
                    ) : (
                        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8">
                            {state.products.map(product => (
                                <DrinkCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                    onRemoveFromCart={handleRemoveFromCart}
                                    isInCart={checkProductInCart(product.id)}
                                    quantity={getCartQuantity(product.id)}
                                    buttonText="AGREGAR"
                                    showLogo={true}
                                />
                            ))}
                        </Box>
                    )}
                </motion.div>
            </Container>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={snackbarState.open}
                autoHideDuration={3000}
                onClose={() => setSnackbarState(prev => ({ ...prev, open: false }))}
                message={snackbarState.message}
            />
        </motion.main>
    );
};

export default memo(Donuts);