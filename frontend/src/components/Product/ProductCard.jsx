import { Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const DOMAIN = import.meta.env.VITE_APP_DOMAIN;

function ProductCard({ product }) {
    const { id, name, basePrice, image, ingredients } = product; 
    const formattedPrice = basePrice != null && !isNaN(basePrice) ? basePrice.toFixed(2) : '0.00';
    const formattedOldPrice = basePrice != null && !isNaN(basePrice) ? (basePrice * 1.2).toFixed(2) : '0.00'; 
    const navigate = useNavigate();

    const imageUrl = `${DOMAIN}${image}`;

    const handlePersonalize = () => {
        navigate('/editaloTuMismo', { state: { selectedProduct: product } });
    };

    return (
        <Card className="product-card h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardMedia
                component="img"
                image={imageUrl}
                alt={name}
                className="w-full h-48 sm:h-56 object-cover cursor-pointer"
                onClick={handlePersonalize}
            />
            <CardContent className="flex-grow flex flex-col justify-between p-4">
                <div>
                    <Typography variant="h6" component="h3" className="font-semibold mb-2 text-[#C8151B]">
                        {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className="mb-4 line-clamp-2 h-[3em]">
                        {ingredients && ingredients.length > 0
                            ? ingredients.map(ingredient => ingredient.name).join(', ')
                            : "Ingredientes no disponibles"}
                    </Typography>
                </div>
                <div className="mt-auto">
                    <div className="flex items-baseline justify-between mb-2">
                        <Typography variant="caption" className="line-through text-gray-500">
                            ${formattedOldPrice}
                        </Typography>
                        <Typography variant="h6" className="font-bold text-[#C8151B]">
                            ${formattedPrice}
                        </Typography>
                    </div>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handlePersonalize}
                        style={{ 
                            backgroundColor: '#FFC603', 
                            color: 'black',
                            '&:hover': {
                                backgroundColor: '#C8151B',
                                color: 'white'
                            }
                        }}
                    >
                        Personalizar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default ProductCard;