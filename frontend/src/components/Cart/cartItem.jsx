import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, TextField, Typography } from '@mui/material';
import React from 'react';

export const CartItem = ({ id, name, basePrice, quantity, customizations = {}, image, onQuantityChange, onCustomizationChange, onRemove, onEdit }) => {

    const handleQuantityChange = (event) => {
        const newQuantity = parseInt(event.target.value);
        if (newQuantity > 0) {
            onQuantityChange(newQuantity);
        }
    };

    return (
        <li className="cart-item flex items-center mb-4 bg-white rounded p-2 shadow-sm">
            <img src={image} alt={name} className="w-16 h-16 object-cover rounded mr-4" />
            <div className="item-info flex-grow">
                <Typography variant="subtitle1" className="font-bold text-black">{name}</Typography>
                <Typography variant="body2" className="text-gray-500">
                    Precio: {typeof basePrice === 'number' ? `$${basePrice.toFixed(2)}` : 'Cargando...'}
                </Typography>

                <div className="customizations mt-2">
                    {Object.entries(customizations).map(([key, value]) => (
                        <Typography key={key} variant="body2" className="text-gray-600">
                            {key}: {value}
                        </Typography>
                    ))}
                </div>
            </div>

            <div className="quantity-control mr-4">
                <TextField
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    size="small"
                    inputProps={{ min: 1 }}
                    label="Cantidad"
                    className="w-16"
                />
            </div>

            <IconButton onClick={onEdit} color="primary" className="mr-2">
                <EditIcon />
            </IconButton>

            <IconButton onClick={onRemove} color="secondary">
                <DeleteIcon />
            </IconButton>
        </li>
    );
};

export default CartItem;