// src/pages/Success.jsx
import { Box, Paper, Typography } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { BsBagCheckFill } from 'react-icons/bs';
import { useLocation, useNavigate } from 'react-router-dom';
import OrderSummary from '../components/Order/OrderSummary';
import Button from '../components/ui/Button';
import { runFireworks } from '../lib/utils/confetti';
import logoSanguches from '/assets/logoSanguches.jpg';

const Success = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderDetails = location.state?.orderDetails;
    const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });
    const controls = useAnimation();

    const startFireworks = useCallback(() => {
        runFireworks();
        setTimeout(() => runFireworks(), 700);
        setTimeout(() => runFireworks(), 1400);
    }, []);

    const animateLogo = useCallback(() => {
        const newX = Math.random() * (window.innerWidth - 100);
        const newY = Math.random() * (window.innerHeight / 2 - 100); // Limitamos a la mitad superior de la pantalla
        setLogoPosition({ x: newX, y: newY });
        controls.start({
            x: newX,
            y: newY,
            rotate: 360,
            transition: { duration: 2, ease: "easeInOut" }
        });
    }, [controls]);

    useEffect(() => {
        if (!orderDetails) {
            navigate('/');
        } else {
            const timer = setTimeout(() => {
                startFireworks();
                animateLogo();
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [orderDetails, navigate, startFireworks, animateLogo]);

    if (!orderDetails) return null;

    return (
        <Box className="success-wrapper min-h-screen bg-gradient-to-br from-[#FFC603] to-[#C8151B] flex items-center justify-center p-4 py-[250px] relative overflow-hidden">
            {/* Logo animado de Sanguches */}
            <motion.div
                animate={controls}
                initial={logoPosition}
                className="absolute z-20 pointer-events-none"
                style={{
                    width: '100px',
                    height: '100px',
                }}
            >
                <img 
                    src={logoSanguches} 
                    alt="Logo Sanguches" 
                    className="w-full h-full object-contain rounded-full"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
            >
                <Paper elevation={3} className="p-8 max-w-2xl w-full">
                    <Box className="text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 500, damping: 30 }}
                        >
                            <BsBagCheckFill className="text-green-500 text-[80px] mx-auto mb-6" />
                        </motion.div>
                        <Typography variant="h3" className="mb-4 font-bold text-[#C8151B]">
                            ¡Gracias por tu pedido!
                        </Typography>
                        <Typography variant="h6" className="mb-8 text-gray-600">
                            Tu pedido ha sido enviado a WhatsApp. Pronto nos pondremos en contacto contigo.
                        </Typography>
                    </Box>
                    <OrderSummary items={orderDetails.items} total={orderDetails.total} />
                    <Box className="mt-8">
                        <Button 
                            buttonText="Continuar comprando" 
                            to="/menuSanguches" 
                            onClick={() => {
                                startFireworks();
                                animateLogo();
                            }}
                        />
                    </Box>
                </Paper>
            </motion.div>

            {/* Partículas de fondo */}
            <Box className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full"
                        style={{
                            width: Math.random() * 10 + 5,
                            height: Math.random() * 10 + 5,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -1000],
                            opacity: [1, 0],
                        }}
                        transition={{
                            duration: Math.random() * 2 + 3,
                            repeat: Infinity,
                            repeatType: 'loop',
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default Success;