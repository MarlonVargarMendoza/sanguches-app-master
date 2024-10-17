import {
    Box, Button, CircularProgress, Divider, Grid, Paper,
    Step, StepLabel, Stepper, Typography, useMediaQuery, useTheme
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { CreditCard, Lock, Send, ShieldCheck, ShoppingBag } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderSummary from '../components/Order/OrderSummary';
import { useCart } from '../hooks/useCart';
import { useVoucherGenerator } from '../hooks/useVoucherGenerator';
import { sendToWhatsApp } from '../services/notificationService';

// Asume que tienes una imagen de QR para el pago
import qrCodeImage from '/assets/qr-code-payment.png';

const Checkout = () => {
    const { cart, calculateTotalPrice, clearCart } = useCart();
    const generateVoucher = useVoucherGenerator();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const steps = ['Resumen del pedido', 'Pago', 'Confirmación'];

    const handleConfirmOrder = useCallback(async () => {
        setIsProcessing(true);
        try {
            const voucherText = generateVoucher();
            const message = `
${voucherText}

Por favor, adjunta el comprobante de pago a este mensaje antes de enviarlo.

Gracias por tu compra en Sanguches!
            `;
            sendToWhatsApp(message);

            const orderDetails = {
                items: cart,
                total: calculateTotalPrice(),
                whatsappMessage: message
            };

            clearCart();
            navigate('/success', { state: { orderDetails } });
        } catch (error) {
            console.error('Error al procesar el pedido:', error);
            // TODO: Implementar manejo de errores apropiado
        } finally {
            setIsProcessing(false);
        }
    }, [cart, calculateTotalPrice, clearCart, generateVoucher, navigate]);

    const handleStepChange = useCallback(() => {
        setActiveStep((prevStep) => (prevStep < steps.length - 1 ? prevStep + 1 : prevStep));
    }, [steps.length]);

    const handleBackStep = useCallback(() => {
        setActiveStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
    }, []);

    if (cart.length === 0) {
        return (
            <Box className="py-[210px] min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFC603] to-[#EFEFEF]">
                <Paper elevation={3} className="p-8 rounded-lg shadow-xl text-center">
                    <ShoppingBag size={64} className="mx-auto mb-4 text-[#C8151B]" />
                    <Typography variant="h5" className="mb-4 font-bold text-[#333]">
                        Tu carrito está vacío
                    </Typography>
                    <Typography variant="body1" className="mb-6 text-gray-600">
                        ¡Agrega algunos deliciosos sanguches antes de proceder al checkout!
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/menuSanguches')}
                        className="bg-[#C8151B] hover:bg-[#A50F14] text-white font-bold py-2 px-4 rounded transition-all duration-300"
                    >
                        Ver Menú
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box className="checkout py-[220px] min-h-screen bg-gradient-to-b from-[#FFC603] to-[#EFEFEF] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl"
            >
                <Paper elevation={3} className="p-8 rounded-lg shadow-xl bg-white">
                    <h2 className="font-poppins font-semibold xs:text-[48px] text-[40px] text-[#C8151B] xs:leading-[76.8px] leading-[66.8px] w-full text-center mb-8">
                        Finaliza tu pedido
                    </h2>

                    <Stepper activeStep={activeStep} alternativeLabel className="mb-8">
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel StepIconProps={{
                                    style: {
                                        color: activeStep >= steps.indexOf(label) ? '#C8151B' : '#FFC603',
                                    }
                                }}>
                                    <Typography className="font-semibold">{label}</Typography>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={7}>
                            <AnimatePresence mode="wait">
                                {activeStep === 0 && (
                                    <OrderSummarySection cart={cart} total={calculateTotalPrice()} />
                                )}
                                {activeStep === 1 && (
                                    <PaymentSection total={calculateTotalPrice()} />
                                )}
                                {activeStep === 2 && (
                                    <ConfirmationSection />
                                )}
                            </AnimatePresence>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <PaymentSummary
                                total={calculateTotalPrice()}
                                isProcessing={isProcessing}
                                activeStep={activeStep}
                                onConfirm={handleConfirmOrder}
                                onNextStep={handleStepChange}
                                onPrevStep={handleBackStep}
                                disabled={cart.length === 0}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </motion.div>
        </Box>
    );
};

const OrderSummarySection = ({ cart, total }) => (
    <motion.div
        key="order-summary"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
    >
        <OrderSummary items={cart} total={total} />
    </motion.div>
);

const PaymentSection = ({ total }) => (
    <motion.div
        key="payment"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-lg shadow-md"
    >
        <Typography variant="h5" className="mb-4 font-bold text-[#C8151B]">
            Realiza el pago
        </Typography>
        <Typography variant="body1" className="mb-4 text-gray-700">
            Escanea el siguiente código QR para realizar el pago de ${total.toFixed(2)}
        </Typography>
        <Box className="flex justify-center mb-4">
            <img src={qrCodeImage} alt="Código QR para pago" className="w-48 h-48" />
        </Box>
        <Typography variant="body2" className="text-gray-600 text-center">
            Una vez realizado el pago, guarda el comprobante. Lo necesitarás en el siguiente paso.
        </Typography>
    </motion.div>
);

const ConfirmationSection = () => (
    <motion.div
        key="confirmation"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-[#FFF9C4] p-6 rounded-lg shadow-md"
    >
        <Typography variant="h5" className="mb-4 font-bold text-[#C8151B]">
            Confirma tu pedido
        </Typography>
        <Typography variant="body1" className="mb-4 text-gray-700">
            Al confirmar, se abrirá WhatsApp con los detalles de tu pedido.
            Por favor, adjunta el comprobante de pago al mensaje antes de enviarlo.
        </Typography>
        <Box className="flex items-center text-[#FFC603] font-semibold">
            <ShoppingBag size={24} className="mr-2" />
            <Typography>¡Tu sanguche está a punto de ser preparado!</Typography>
        </Box>
    </motion.div>
);

const PaymentSummary = ({ total, isProcessing, activeStep, onConfirm, onNextStep, onPrevStep, disabled }) => (
    <Box className="bg-white p-6 rounded-lg shadow-md">
        <h5 className="mb-4 font-bold text-gray-700">
            Resumen de pago
        </h5>
        <Divider className="mb-4" />
        <Box className="flex justify-between mb-5">
            <Typography className="font-semibold">Total a pagar:</Typography>
            <Typography className="font-black text-gray-900">${total.toFixed(2)}</Typography>
        </Box>
        <Divider className="mb-4" />
        <Button
            variant="contained"
            onClick={activeStep === 2 ? onConfirm : onNextStep}
            disabled={isProcessing || disabled}
            className="bg-[#C8151B] hover:bg-[#A50F14] text-white text-lg py-3 transition-all duration-300 font-bold"
            fullWidth
            startIcon={activeStep === 0 ? <CreditCard /> : activeStep === 1 ? <Lock /> : <Send />}
        >
            {isProcessing ? (
                <CircularProgress size={24} color="inherit" />
            ) : activeStep === 0 ? (
                'Proceder al pago'
            ) : activeStep === 1 ? (
                'He realizado el pago'
            ) : (
                'Confirmar y enviar pedido'
            )}
        </Button>
        {activeStep > 0 && (
            <Button
                variant="outlined"
                color="secondary"
                onClick={onPrevStep}
                className="mt-3 text-[#C8151B] border-[#C8151B] hover:bg-[#FFC603] hover:border-[#FFC603] font-semibold"
                fullWidth
            >
                Volver al paso anterior
            </Button>
        )}
        <Box className="mt-4 flex items-center justify-center text-gray-700 bg-white p-2 rounded-lg">
            <ShieldCheck className="mr-2 text-[#C8151B]" size={20} />
            <Typography variant="body2" className="font-semibold">
                Pago 100% seguro
            </Typography>
        </Box>
    </Box>
);

export default Checkout;