import { Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../Product/sanguches/ProductCard';

const RelatedProducts = ({ products }) => {
    const navigate = useNavigate();

    const handleProductClick = useCallback((product) => {
        // Primero hacer scroll suave hacia arriba
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Pequeño delay para asegurar una transición fluida
        setTimeout(() => {
            // Navegar al mismo componente pero con nuevo producto
            navigate('/editaloTuMismo', {
                state: {
                    selectedProduct: {
                        ...product,
                        quantity: 1,
                        customizations: {},
                    },
                    isEditing: false
                },
            }, {
                replace: true // Reemplazar la entrada actual en el historial
            });
        }, 300); // Delay que coincide con la animación de scroll
    }, [navigate]);

    if (!products?.length) return null;

    return (
        <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <Typography variant="h5" className="font-bold mb-6 text-[#525D5A]">
                También te puede gustar
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.slice(0, 3).map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <ProductCard 
                            product={product}
                            onProductClick={() => handleProductClick(product)}
                            buttonText="Personalizar"
                            showLogo={false}
                        />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default RelatedProducts;