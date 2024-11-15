import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { Button, Chip, Tooltip, Typography } from '@mui/material';
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

    const { savings, totalItems } = useMemo(() => ({
        savings: combo.savings || 0,
        totalItems: (combo.accompaniments?.length || 0) + (combo.drinks?.length || 0)
    }), [combo]);

    const handleClick = useCallback(() => {
        navigate('/combo/personaliza', {
            state: { selectedCombo: { ...combo, imageUrl } }
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
            className={`group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${className}`}
            {...animationProps}
        >
            <div className="relative overflow-hidden">
                {/* Imagen con overlay en hover */}
                <div className="relative h-48">
                    <img
                        src={imageUrl}
                        alt={combo.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">

                    </div>
                </div>
            </div>

            <div className="p-6 flex flex-col gap-4">
                {/* Título y descripción */}
                <div>
                    <Typography
                        variant="h6"
                        className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-[#C8151B] transition-colors duration-300"
                    >
                        {combo.name}
                    </Typography>
                    <Typography
                        variant="body2"
                        className="text-gray-600 line-clamp-2"
                    >
                        {combo.description || "Combo especial con los mejores ingredientes"}
                    </Typography>
                </div>

                {/* Detalles del combo */}
                {combo.ingredients && combo.ingredients.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {combo.ingredients.map((ingredient, index) => (
                            <Chip
                                key={index}
                                label={ingredient.name}
                                size="small"
                                className="bg-gray-100 text-gray-700"
                            />
                        ))}
                    </div>
                )}

                {/* Precios y botón */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="flex flex-col">

                        <Typography
                            variant="h6"
                            className="font-bold text-[#A4A4A4]"
                        >
                            {priceUtils(combo.basePrice)}
                        </Typography>
                    </div>
                    <Tooltip title="Personaliza tu combo">
                        <Button
                            variant="contained"
                            onClick={handleClick}
                            className="bg-[#FFC603] hover:bg-[#C8151B] text-black hover:text-white transition-colors duration-300"
                            startIcon={<ShoppingCartIcon />}
                            style={{
                                backgroundColor: '#FFC603',
                                color: 'black',
                                '&:hover': {
                                    backgroundColor: '#C8151B',
                                    color: 'white'
                                }
                            }}
                        >
                            Lo quiero
                        </Button>
                    </Tooltip>

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
        drinks: PropTypes.array,
        ingredients: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired
        }))
    }).isRequired,
    onSelect: PropTypes.func,
    className: PropTypes.string,
    showBadge: PropTypes.bool,
    animate: PropTypes.bool
};

export default memo(ComboCard);