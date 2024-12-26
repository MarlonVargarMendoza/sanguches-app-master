import { Button, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoSanguches from '/assets/logoSanguches.jpg';

export const ErrorView = ({ error }) => {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FFC603]/10 to-[#F5F5F5] pt-[140px]">
            <Container maxWidth="md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    {/* Header Section */}
                    <div className="bg-[#FFC603]/10 p-8 border-b border-[#FFC603]/20 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <motion.img
                                src={logoSanguches}
                                alt="Sanguches Logo"
                                className="w-16 h-16 rounded-full shadow-lg"
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, delay: 0.5 }}
                            />
                            <div>
                                <Typography variant="h5" className="font-bold text-[#C8151B]">
                                    ¡Oops! Algo salió mal
                                </Typography>
                                <Typography variant="body2" className="text-gray-600 mt-1">
                                    No te preocupes, estamos trabajando en ello
                                </Typography>
                            </div>
                        </div>
                        <AlertCircle className="w-12 h-12 text-[#C8151B] opacity-80" />
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                        <div className="bg-[#FFC603]/5 border border-[#FFC603]/20 rounded-xl p-6 mb-8">
                            <Typography variant="body1" className="text-gray-700">
                                {error || "No se ha podido cargar el producto seleccionado."}
                            </Typography>
                        </div>

                        <Typography variant="body1" className="text-gray-600 mb-8">
                            Mientras tanto, ¿qué tal si...
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Recargas la página para intentar nuevamente</li>
                                <li>Regresas al menú para explorar más opciones</li>
                                <li>Pruebas con otra de nuestras deliciosas opciones</li>
                            </ul>
                        </Typography>

                        {/* Actions Section */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                variant="contained"
                                onClick={() => navigate('/menuSanguches')}
                                className="border-[#C8151B] text-[#C8151B] hover:border-[#C8151B] hover:bg-[#C8151B]/5 normal-case"
                                startIcon={<ArrowLeft className="w-4 h-4" />}
                            >
                                 Volver al menú
                            </Button>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="bg-[#F5F5F5] p-4 text-center border-t">
                        <Typography variant="body2" className="text-gray-500">
                            Si el problema persiste, no dudes en contactarnos
                        </Typography>
                    </div>
                </motion.div>

                {/* Background Decorations */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-[#FFC603]/10 rounded-full"
                            style={{
                                width: Math.random() * 200 + 50,
                                height: Math.random() * 200 + 50,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -20, 0],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 5,
                                delay: i * 0.2,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                        />
                    ))}
                </div>
            </Container>
        </div>
    );
};


export const ErrorBoundary = ({ children }) => {
    const [hasError, setHasError] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const handleError = (error) => {
            setHasError(true);
            setError(error);
        };

        window.addEventListener('error', handleError);
        return () => window.removeEventListener('error', handleError);
    }, []);

    if (hasError) {
        return <ErrorView error={error?.message} />;
    }

    return children;
};

export default ErrorView;