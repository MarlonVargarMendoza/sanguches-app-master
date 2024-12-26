import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { Button, IconButton, Tooltip, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import priceUtils from '../../../../utils/priceUtils';
import logoSanguches from '/assets/logoSanguches.jpg';

const DOMAIN = import.meta.env.VITE_APP_DOMAIN;

const DrinkCard = ({
    product,
    onAddToCart,
    onRemoveFromCart,
    isInCart = false,
    quantity = 0,
    buttonText = 'AGREGAR',
    showLogo = false
}) => {
    const imageUrl = useMemo(() =>
        `${DOMAIN}${product.image}`,
        [product.image]
    );

    const handleCartAction = useCallback((e) => {
        e.stopPropagation();
        if (isInCart) {
            onRemoveFromCart?.(product.id);
        } else {
            onAddToCart?.(product);
        }
    }, [product, isInCart, onAddToCart, onRemoveFromCart]);

    return (
        <motion.div
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <div className="relative product-image">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full object-cover transition-transform duration-300 hover:scale-105 h-80"
                    loading="lazy"
                />

                {showLogo && (
                    <div className="absolute top-2 right-2 flex items-center space-x-2">
                        <Tooltip title={isInCart ? "Quitar del carrito" : "Añadir al carrito"}>
                            <IconButton
                                className="bg-white p-1 rounded-full transition-all duration-300 ease-in-out"
                                onClick={handleCartAction}
                                style={{
                                    filter: isInCart ? 'none' : 'grayscale(100%)',
                                    transform: isInCart ? 'scale(1.1)' : 'scale(1)',
                                }}
                            >
                                <img
                                    src={logoSanguches}
                                    alt="Logo Sanguches"
                                    className="w-6 h-6 rounded-full"
                                />
                            </IconButton>
                        </Tooltip>
                        {quantity > 0 && (
                            <div className="bg-[#FFC603] text-black rounded-full w-6 h-6 flex items-center justify-center">
                                {quantity}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col gap-4">
                <h6   className="text-lg font-semibold text-gray-800 group-hover:text-[#C8151B] transition-colors duration-300">
                    {product.name}
                </h6>
                <p className="text-gray-600 text-sm line-clamp-2">
                    {product.description || "Bebida refrescante"}
                </p>

                <div className="mt-auto flex items-center justify-between">
                    <Typography variant="h6" className="font-bold text-[#A4A4A4]">
                        {priceUtils(product.basePrice)}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleCartAction}
                        startIcon={<ShoppingCartIcon />}
                        className="bg-[#FFC603] hover:bg-[#C8151B] text-black hover:text-white transition-colors duration-300"
                        style={{
                            backgroundColor: '#FFC603',
                            color: 'black',
                            '&:hover': {
                                backgroundColor: '#C8151B',
                                color: 'white'
                            }
                        }}
                    >
                        {isInCart ? 'Quitar' : buttonText}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

DrinkCard.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        basePrice: PropTypes.number,
        image: PropTypes.string,
        description: PropTypes.string
    }).isRequired,
    onAddToCart: PropTypes.func,
    onRemoveFromCart: PropTypes.func,
    isInCart: PropTypes.bool,
    quantity: PropTypes.number,
    buttonText: PropTypes.string,
    showLogo: PropTypes.bool
};

export default React.memo(DrinkCard);