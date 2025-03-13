// ComboCard.jsx
import { Button, Typography } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import priceUtils from '../../../../utils/priceUtils';

const DOMAIN = import.meta.env.VITE_APP_DOMAIN;

const ComboCard = ({ combo, onSelect, className = '', showBadge = true }) => {
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
        navigate('/combo/personaliza', { state: { selectedCombo: { ...combo, imageUrl } } });
        onSelect?.(combo);
    }, [combo, imageUrl, navigate, onSelect]);

    return (
        <div className={`group bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] relative border border-gray-100 ${className}`}>
            <div className="relative aspect-[4/3] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                
                {showBadge && savings > 0 && (
                    <div className="absolute top-3 left-3 z-20 bg-[#C8151B] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        Ahorra {savings}%
                    </div>
                )}
                
                <img
                    src={imageUrl}
                    alt={combo.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
            </div>

            <div className="p-5 flex flex-col gap-3">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#C8151B] transition-colors">
                    {combo.name}
                </h3>
                
                <div className="flex gap-2 items-center text-sm text-gray-500">
                   
                    {savings > 0 && (
                        <span className="line-through text-gray-400 ml-2">
                            {priceUtils(combo.originalPrice)}
                        </span>
                    )}
                </div>

                <p className="text-gray-600 text-sm line-clamp-2">
                    {combo.description || "Combo especial con los mejores ingredientes"}
                </p>

                <div className="mt-auto flex items-center justify-between">
                    <Typography variant="h6" className="font-bold text-[#A4A4A4] text-lg">
                        {priceUtils(combo.basePrice)}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleClick}
                        className="bg-[#FFC603] hover:bg-[#C8151B] text-black hover:text-white transition-all duration-300 rounded-full px-6 py-2 shadow-lg hover:shadow-[#C8151B]/30"
                        endIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        }
                    >
                        Personalizar
                    </Button>
                </div>
            </div>

            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#FFC603]/30 transition-all pointer-events-none rounded-xl" />
        </div>
    );
};

export default ComboCard;