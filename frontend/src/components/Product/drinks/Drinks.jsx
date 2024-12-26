import { Alert, Box, Breadcrumbs, Container, Snackbar, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React, { memo, useCallback, useEffect, useState } from 'react';
import ContentLoader from "react-content-loader";
import { Link } from 'react-router-dom';
import useCart from '../../../hooks/useCart';
import { getDrinks } from '../../../services/productService';
import DrinkCard from './DrinkCard';

const DOMAIN = import.meta.env.VITE_APP_DOMAIN;

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

const PageHeader = memo(() => (
    <>
        <Breadcrumbs className="mb-6">
            <Link to="/" className="hover:text-[#C3151A]">Inicio</Link>
            <Typography color="text.primary">Bebidas</Typography>
        </Breadcrumbs>
        <Typography variant="h2" className="text-center text-[#C8151B] mb-8" sx={{ 
            fontWeight: 'bold', 
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
            Nuestras Bebidas
        </Typography>
    </>
));

const Drinks = () => {
    const { addToCart, removeFromCart, updateQuantity, cart } = useCart();
    const [state, setState] = useState({
        drinks: [],
        isLoading: true,
        error: null
    });
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        let isMounted = true;

        const fetchDrinks = async () => {
            try {
                setState(prev => ({ ...prev, isLoading: true }));
                const data = await getDrinks();
                
                if (!isMounted) return;
                
                const formattedDrinks = data.map(drink => ({
                    id: drink.id,
                    name: drink.name,
                    description: `${drink.type_drink || 'Bebida refrescante'}`,
                    basePrice: parseFloat(drink.basePrice || 0),
                    image: drink.image?.startsWith('/') ? drink.image : '/images/Foto_no_disponible.png',
                    type: 'drink',
                    type_drink: drink.type_drink
                }));

                setState({
                    drinks: formattedDrinks,
                    isLoading: false,
                    error: null
                });
            } catch (err) {
                if (!isMounted) return;
                setState({
                    drinks: [],
                    isLoading: false,
                    error: 'Error al cargar las bebidas. Por favor, intenta más tarde.'
                });
            }
        };

        fetchDrinks();
        return () => { isMounted = false; };
    }, []);

    const handleAddToCart = useCallback((drink) => {
        try {
            const existingItem = cart.find((item) => item.id === drink.id);
            if (existingItem) {
                updateQuantity(drink.id, existingItem.quantity + 1);
            } else {
                addToCart({
                    ...drink,
                    quantity: 1,
                    calculatedPrice: drink.basePrice
                });
            }
            setSnackbarState({
                open: true,
                message: '¡Bebida añadida al carrito!',
                severity: 'success'
            });
        } catch (error) {
            setSnackbarState({
                open: true,
                message: 'Error al añadir la bebida',
                severity: 'error'
            });
        }
    }, [cart, addToCart, updateQuantity]);

    const handleRemoveFromCart = useCallback((drinkId) => {
        try {
            removeFromCart(drinkId);
            setSnackbarState({
                open: true,
                message: 'Bebida eliminada del carrito',
                severity: 'success'
            });
        } catch (error) {
            setSnackbarState({
                open: true,
                message: 'Error al eliminar la bebida',
                severity: 'error'
            });
        }
    }, [removeFromCart]);

    const checkDrinkInCart = useCallback((drinkId) =>
        cart.some(item => item.id === drinkId),
        [cart]
    );

    const getCartQuantity = useCallback((drinkId) =>
        cart.find(item => item.id === drinkId)?.quantity || 0,
        [cart]
    );

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-[#F5F5F5] pt-[140px] pb-8"
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
                        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {state.drinks.map(drink => (
                                <DrinkCard
                                    key={drink.id}
                                    product={drink}
                                    onAddToCart={handleAddToCart}
                                    onRemoveFromCart={handleRemoveFromCart}
                                    isInCart={checkDrinkInCart(drink.id)}
                                    quantity={getCartQuantity(drink.id)}
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
            >
                <Alert severity={snackbarState.severity}>
                    {snackbarState.message}
                </Alert>
            </Snackbar>
        </motion.main>
    );
};

export default memo(Drinks);