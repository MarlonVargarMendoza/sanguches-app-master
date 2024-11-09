import {
    Alert,
    Box, Button, CircularProgress, Divider, Grid, Paper,
    Snackbar,
    Step, StepLabel, Stepper, Typography, useMediaQuery, useTheme
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { CreditCard, Lock, Send, ShieldCheck, ShoppingBag } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import priceUtils from '../../utils/priceUtils';
import CustomerDataSection from '../components/Order/CustomerDataSection';
import OrderSummary from '../components/Order/OrderSummary';
import { useCart } from '../hooks/useCart';
import { useVoucherGenerator } from '../hooks/useVoucherGenerator';
import { sendToWhatsApp } from '../services/notificationService';
import { OrderService } from '../services/orderService';


// Asume que tienes una imagen de QR para el pago
import qrCodeImage from '/assets/qr-code-payment.png';

const Checkout = () => {
    // 1. Estados
    const [error, setError] = useState({ show: false, message: '' });
    const [personalId, setPersonalId] = useState('');
    const [personalIdError, setPersonalIdError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    // 2. Hooks
    const { cart, calculateTotalPrice, clearCart } = useCart();
    const generateVoucher = useVoucherGenerator();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // 3. Constantes
    const steps = ['Resumen del pedido', 'Pago', 'Confirmación'];

    // 4. Funciones de validación y utilidad
    const validatePersonalId = useCallback(() => {
        if (!personalId) {
            setPersonalIdError('La cédula es requerida');
            return false;
        }
        if (personalId.length < 8) {
            setPersonalIdError('La cédula debe tener al menos 8 dígitos');
            return false;
        }
        setPersonalIdError('');
        return true;
    }, [personalId]);

    const showMessage = useCallback((message, severity = 'error') => {
        setError({
            show: true,
            message,
            severity
        });
    }, []);

    const handleCloseSnackbar = useCallback(() => {
        setError(prev => ({ ...prev, show: false }));
    }, []);

    // 5. Manejadores de navegación
    const handleStepChange = useCallback(() => {
        // Validar cédula solo en el primer paso
        if (activeStep === 0 && !validatePersonalId()) {
            showMessage('Por favor, ingresa una cédula válida', 'error');
            return;
        }
        setActiveStep(prevStep => Math.min(prevStep + 1, steps.length - 1));
    }, [activeStep, validatePersonalId, showMessage, steps.length]);

    const handleBackStep = useCallback(() => {
        setActiveStep(prevStep => Math.max(prevStep - 1, 0));
    }, []);

    // 6. Manejador principal de confirmación
    const handleConfirmOrder = useCallback(async () => {
        if (!validatePersonalId()) {
            showMessage('Por favor, ingresa una cédula válida', 'error');
            return;
        }

        setIsProcessing(true);
        try {
            const voucherText = generateVoucher();
            const orderDetails = {
                personalId,
                items: cart,
                total: calculateTotalPrice(),
                whatsappMessage: voucherText
            };

            const orderResponse = await OrderService.createOrder(orderDetails);

            if (orderResponse.success) {
                const whatsappMessage = `
🎯 Pedido #${orderResponse.data.id}

${voucherText}

Por favor, adjunta el comprobante de pago en el chat.

Gracias por tu compra en Sanguches!`;

                sendToWhatsApp(whatsappMessage);
                clearCart();
                showMessage('¡Pedido creado exitosamente!', 'success');

                setTimeout(() => {
                    navigate('/success', {
                        state: {
                            orderDetails: {
                                ...orderDetails,
                                orderId: orderResponse.data.id,
                                whatsappMessage
                            },
                            orderResponse: orderResponse.data
                        }
                    });
                }, 1000);
            } else {
                throw new Error('Error al procesar el pedido en el servidor');
            }
        } catch (error) {
            console.error('Error al procesar el pedido:', error);
            console.log(orderResponse);
            
            showMessage(
                error.message || 'Error al procesar el pedido. Por favor, intenta nuevamente.'
            );
        } finally {
            setIsProcessing(false);
        }
    }, [
        personalId,
        validatePersonalId,
        cart,
        calculateTotalPrice,
        clearCart,
        generateVoucher,
        navigate,
        showMessage
    ]);

    // 7. Vista de carrito vacío
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
                                    <>
                                        <CustomerDataSection
                                            personalId={personalId}
                                            onPersonalIdChange={setPersonalId}
                                            error={personalIdError}
                                        />
                                        <OrderSummarySection cart={cart} total={calculateTotalPrice()} />
                                    </>
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
            <Snackbar
                open={error.show}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={error.severity}
                    elevation={6}
                    variant="filled"
                >
                    {error.message}
                </Alert>
            </Snackbar>
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
            Escanea el siguiente código QR para realizar el pago de ${total}
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
            <Typography className="font-black text-gray-900">{priceUtils(total)}</Typography>
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