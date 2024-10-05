import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';

const Checkout = () => {
    const { cart, calculateTotalPrice, clearCart } = useCart();
    const [orderConfirmed, setOrderConfirmed] = useState(false);

    const handleCheckout = () => {
        // Aquí iría la lógica para procesar el pago
        // Por ahora, solo simularemos una confirmación exitosa
        setOrderConfirmed(true);
        clearCart();
    };

    if (orderConfirmed) {
        return (
            <Box className="p-4 text-center">
                <Typography variant="h5">¡Gracias por tu compra! Tu pedido ha sido confirmado.</Typography>
            </Box>
        );
    }

    return (
        <Box className="checkout p-4">
            <Typography variant="h4" className="mb-4">Resumen del pedido</Typography>
            {cart.map(item => (
                <Box key={item.id} className="checkout-item flex justify-between mb-2">
                    <Typography>{item.name}</Typography>
                    <Typography>{item.quantity} x ${item.basePrice.toFixed(2)}</Typography>
                </Box>
            ))}
            <Box className="checkout-total mt-4 mb-4">
                <Typography variant="h6">Total: ${calculateTotalPrice().toFixed(2)}</Typography>
            </Box>
            <Button 
                variant="contained" 
                onClick={handleCheckout}
                className="bg-[#FFC603] hover:bg-[#C8151B] text-white"
            >
                Confirmar pedido
            </Button>
        </Box>
    );
};

export default Checkout;