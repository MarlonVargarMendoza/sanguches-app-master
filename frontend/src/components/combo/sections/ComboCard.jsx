import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { Button, Chip, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import priceUtils from '../../../../utils/priceUtils';

const DOMAIN = import.meta.env.VITE_APP_DOMAIN;

const ComboCard = ({
    combo,
    onSelect,
    className = '',
    showBadge = true,
    animate = true
}) => {
    const navigate = useNavigate();
    
    const imageUrl = useMemo(() => 
        `${DOMAIN}${combo.image}`,
        [combo.image]
    );

    const comboDetails = useMemo(() => ({
        accompaniments: combo.accompaniments?.length || 0,
        drinks: combo.drinks?.length || 0,
        savings: combo.savings || 0
    }), [combo]);

    const handleClick = useCallback(() => {
        navigate('/combo/personaliza', {
            state: {
                selectedCombo: {
                    ...combo,
                    imageUrl
                }
            }
        });
        onSelect?.(combo);
    }, [combo, imageUrl, navigate, onSelect]);

    const CardWrapper = animate ? motion.div : 'div';
    const animationProps = animate ? {
        whileHover: { y: -4 },
        transition: { duration: 0.2 }
    } : {};

    return (
        <CardWrapper
        className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${className}`}
        {...animationProps}
        >
            <div className="relative">
                {/* Badge de ahorro */}
                {showBadge && comboDetails.savings > 0 && (
                    <div className="absolute top-4 left-4 z-10">
                        <Chip
                            label={`¡Ahorra ${priceUtils(comboDetails.savings)}!`}
                            color="error"
                            className="bg-[#C8151B] text-white font-bold"
                        />
                    </div>
                )}

                {/* Imagen */}
                <img
                    src={imageUrl}
                    alt={combo.name}
                    className="w-full h-48 object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                    onClick={handleClick}
                    loading="lazy"
                />

            
            </div>

            <div className="p-4 flex flex-col gap-3">
                {/* Título y descripción */}
                <div>
                    <Typography variant="h6" className="font-bold text-gray-800">
                        {combo.name}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 line-clamp-2">
                        {combo.description || "Combo especial con los mejores ingredientes"}
                    </Typography>
                </div>

                {/* Precios y botón */}
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        {comboDetails.savings > 0 && (
                            <Typography
                                variant="caption"
                                className="text-gray-500 line-through"
                            >
                                {priceUtils(combo.basePrice + comboDetails.savings)}
                            </Typography>
                        )}
                        <Typography
                            variant="h6"
                            className="font-bold text-[#C8151B]"
                        >
                            {priceUtils(combo.basePrice)}
                        </Typography>
                    </div>
                    
                    <Button
                        variant="contained"
                        onClick={handleClick}
                        startIcon={<ShoppingCartIcon />}
                        className="bg-[#FFC603] hover:bg-[#C8151B] text-black hover:text-white"
                    >
                        Personalizar
                    </Button>
                </div>
            </div>
        </CardWrapper>
    );
};

ComboCard.propTypes = {
    combo: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        basePrice: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
        savings: PropTypes.number,
        accompaniments: PropTypes.array,
        drinks: PropTypes.array
    }).isRequired,
    onSelect: PropTypes.func,
    className: PropTypes.string,
    showBadge: PropTypes.bool,
    animate: PropTypes.bool
};

export default memo(ComboCard);