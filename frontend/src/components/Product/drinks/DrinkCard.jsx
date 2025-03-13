// DrinkCard.jsx
import { Button, IconButton, Tooltip, Typography } from '@mui/material';
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
    showLogo = false
}) => {
    const imageUrl = useMemo(() => 
        `${DOMAIN}${product.image}`,
        [product.image]
    );

    const handleCartAction = useCallback((e) => {
        e.stopPropagation();
        isInCart ? onRemoveFromCart?.(product.id) : onAddToCart?.(product);
    }, [product, isInCart, onAddToCart, onRemoveFromCart]);

    return (
        <div className="group bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] relative border border-gray-100">
            <div className="relative aspect-[4/3] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />

                {showLogo && (
                    <div className="absolute top-3 right-3 flex items-center space-x-2 z-20">
                        <Tooltip title={isInCart ? "Quitar del carrito" : "Añadir al carrito"}>
                            <IconButton
                                className={`bg-white/90 backdrop-blur-sm hover:bg-white transition-all shadow-lg ${
                                    isInCart ? 'animate-bounce-scale' : 'hover:scale-110'
                                }`}
                                onClick={handleCartAction}
                            >
                                <img
                                    src={logoSanguches}
                                    alt="Logo"
                                    className="w-6 h-6 rounded-full"
                                />
                            </IconButton>
                        </Tooltip>
                        {quantity > 0 && (
                            <div className="bg-[#FFC603] text-black rounded-full w-7 h-7 flex items-center justify-center font-bold shadow-md animate-pulse-once">
                                {quantity}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col gap-3">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#C8151B] transition-colors">
                    {product.name}
                </h3>
                
                <div className="flex gap-2 flex-wrap">
                    {product.size && (
                        <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                            {product.size}ml
                        </span>
                    )}
                    {product.type && (
                        <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                            {product.type}
                        </span>
                    )}
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <Typography variant="h6" className="font-bold text-[#A4A4A4] text-lg">
                        {priceUtils(product.basePrice)}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleCartAction}
                        className="bg-[#FFC603] hover:bg-[#C8151B] text-black hover:text-white transition-all duration-300 rounded-full px-6 py-2 shadow-lg hover:shadow-[#C8151B]/30"
                        endIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        }
                    >
                        {isInCart ? 'Quitar' : 'Agregar'}
                    </Button>
                </div>
            </div>
            
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#FFC603]/30 transition-all pointer-events-none rounded-xl" />
        </div>
    );
};

export default DrinkCard;