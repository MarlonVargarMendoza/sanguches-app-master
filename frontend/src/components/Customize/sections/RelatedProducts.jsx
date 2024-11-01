import { Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import ProductCard from '../../Product/ProductCard';

const RelatedProducts = ({ products }) => {
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
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default RelatedProducts;