import { Alert, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React, { memo, useEffect, useState } from 'react';
import ContentLoader from "react-content-loader";
import { getCombo } from '../../services/productService';
import ProductCard from '../Product/ProductCard';

const LoadingPlaceholder = memo(() => (
    <div className="container mx-auto p-8">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
                <li key={index}>
                    <ContentLoader
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
                </li>
            ))}
        </ul>
    </div>
));

const CombosContainer = () => {
   
    const [state, setState] = useState({
        combos: [],
        isLoading: true,
        error: null
    });

    useEffect(() => {
        const fetchCombos = async () => {
            try {
                setState(prev => ({ ...prev, isLoading: true }));
                console.log('Initiating combo fetch');
                const data = await getCombo();
                console.log('Combos received:', data);  // Verificar contenido de data

                if (!data || data.length === 0) {
                    console.warn('No combo data received');
                    setState({
                        combos: [],
                        isLoading: false,
                        error: 'No se encontraron combos disponibles'
                    });
                    return;
                }
                setState({
                    combos: data,
                    isLoading: false,
                    error: null
                });
            } catch (err) {
                console.error('Error fetching combos:', err);
                setState({
                    combos: [],
                    isLoading: false,
                    error: err.message || 'Error al cargar los combos'
                });
            }
        };

        fetchCombos();
    }, []);


    return (
        <main className="min-h-screen bg-[#F5F5F5] pt-[220px]">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        className="mb-8 font-bold text-[#C8151B] text-center"
                    >
                        Nuestros Combos
                    </Typography>

                    {state.isLoading ? (
                        <LoadingPlaceholder />
                    ) : state.error ? (
                        <Alert
                            severity="error"
                            className="max-w-2xl mx-auto my-8"
                        >
                            {state.error}
                        </Alert>
                    ) : state.combos.length === 0 ? (
                        <Alert
                            severity="info"
                            className="max-w-2xl mx-auto my-8"
                        >
                            No hay combos disponibles en este momento.
                        </Alert>
                    ) : (
                        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {state.combos.map(combo => (
                                <ProductCard
                                    key={combo.id}
                                    product={combo}
                                    onClick={() => handleComboSelect(combo)}
                                    buttonText="Agregar Combo"
                                    disableNavigation
                                />
                            ))}
                        </Box>
                    )}
                </motion.div>
            </div>
        </main>
    );
};

export default memo(CombosContainer);