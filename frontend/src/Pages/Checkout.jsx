import { Box, Button, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderSummary from '../components/Order/OrderSummary';
import { useCart } from '../hooks/useCart';
import { useVoucherGenerator } from '../hooks/useVoucherGenerator';
import { sendToWhatsApp } from '../services/notificationService';

const Checkout = () => {
    const { cart, calculateTotalPrice, clearCart } = useCart();
    const generateVoucher = useVoucherGenerator();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirmOrder = async () => {
        setIsProcessing(true);
        try {
            const voucherText = generateVoucher();
            await sendToWhatsApp(voucherText);

            const orderDetails = {
                items: cart,
                total: calculateTotalPrice(),
                whatsappMessage: voucherText
            };

            clearCart();
            navigate('/success', { state: { orderDetails } });
        } catch (error) {
            console.error('Error al procesar el pedido:', error);
            // Manejar el error (mostrar un mensaje al usuario, etc.)
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Box className="checkout min-h-screen bg-gradient-to-br from-[#FFC603] to-[#C8151B] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Paper elevation={3} className="p-8 max-w-4xl w-full">
                    <Typography variant="h3" className="mb-8 text-center font-bold text-[#C8151B]">
                        Finalizar Compra
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={7}>
                            <OrderSummary items={cart} total={calculateTotalPrice()} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Box className="bg-gray-100 p-6 rounded-lg">
                                <Typography variant="h5" className="mb-4 font-semibold">
                                    Total a Pagar
                                </Typography>
                                <Typography variant="h4" className="mb-6 font-bold text-[#C8151B]">
                                    ${calculateTotalPrice().toFixed(2)}
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    onClick={handleConfirmOrder}
                                    disabled={isProcessing || cart.length === 0}
                                    className="bg-[#FFC603] hover:bg-[#C8151B] text-white text-lg py-3"
                                    fullWidth
                                >
                                    {isProcessing ? <CircularProgress size={24} /> : 'Confirmar y Enviar Pedido'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default Checkout;