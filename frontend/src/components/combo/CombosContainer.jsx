import { Alert, Box, Breadcrumbs, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React, { memo, useCallback, useEffect, useState } from 'react';
import ContentLoader from "react-content-loader";
import { Link, useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import { getCombo } from '../../services/productService';
import ComboCard from './sections/ComboCard';
const LoadingPlaceholder = memo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, index) => (
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
            <Typography color="text.primary">Combos</Typography>
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
            Nuestros Combos
        </Typography>
    </>
));

const CombosContainer = () => {
    const navigate = useNavigate();
    const { addToCart, removeFromCart, cart } = useCart();
    const [state, setState] = useState({
        combos: [],
        isLoading: true,
        error: null
    });

    useEffect(() => {
        let isMounted = true;

        const fetchCombos = async () => {
            try {
                setState(prev => ({ ...prev, isLoading: true }));
                const data = await getCombo();
                
                if (isMounted) {
                    setState({
                        combos: data || [],
                        isLoading: false,
                        error: data?.length ? null : 'No se encontraron combos disponibles'
                    });
                }
            } catch (err) {
                if (isMounted) {
                    setState({
                        combos: [],
                        isLoading: false,
                        error: 'Error al cargar los combos. Por favor, intenta más tarde.'
                    });
                }
            }
        };

        fetchCombos();
        return () => { isMounted = false; };
    }, []);

    const handleComboSelect = useCallback((combo) => {
        navigate('/combo/personaliza', {
            state: {
                selectedCombo: {
                    ...combo,
                    customizations: {
                        accompaniments: combo.customizations?.companions || [],
                        drinks: combo.customizations?.drinks || [],
                        extras: [],
                        sauces: []
                    }
                }
            }
        });
    }, [navigate]);

    const checkComboInCart = useCallback((combo) =>
        cart.some(item => item.id === combo.id),
        [cart]
    );

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-[#F5F5F5] pt-[220px]"
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
                        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {state.combos.map(combo => (
                                <ComboCard
                                    key={combo.id}
                                    combo={combo}
                                    onSelect={handleComboSelect}
                                    isInCart={checkComboInCart(combo)}
                                />
                            ))}
                        </Box>
                    )}
                </motion.div>
            </Container>
        </motion.main>
    );
};

export default memo(CombosContainer);