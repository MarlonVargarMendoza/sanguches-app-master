// components/Product/ProductCard.jsx

import { Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
    const { id, name, basePrice, ingredients } = product;
    const formattedPrice = basePrice != null && !isNaN(basePrice) ? basePrice.toFixed(2) : '0.00';
    const navigate = useNavigate();

    const handlePersonalize = () => {
        navigate('/editaloTuMismo', { 
            state: { 
                selectedProduct: {
                    ...product,
                    ...product.image
                }
            } 
        });
    };

    return (
        <Card className="product-card h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardMedia
                component="img"
                image={product.image}
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
                    <Typography variant="h6" className="font-bold text-gray mb-2">
                        ${formattedPrice}
                    </Typography>
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

export default React.memo(ProductCard);