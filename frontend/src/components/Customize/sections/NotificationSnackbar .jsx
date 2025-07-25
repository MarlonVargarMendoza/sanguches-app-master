import { Button, IconButton, Snackbar } from '@mui/material';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const NotificationSnackbar = ({ open, onClose, isEditing, onViewCart }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            className="mt-16"
        >
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#FFC603] text-black px-4 py-3 rounded-lg shadow-lg min-w-[300px]"
            >
                <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                        {isEditing ? '¡Producto actualizado!' : '¡Producto añadido al carrito!'}
                    </span>
                    <IconButton
                        size="small"
                        onClick={onClose}
                        className="text-black hover:text-gray-800"
                    >
                        <X className="w-4 h-4" />
                    </IconButton>
                </div>
                
                <Button
                    size="small"
                    onClick={onViewCart}
                    className="w-full bg-[#C8151B] hover:bg-[#A50F14] text-white normal-case font-medium"
                    sx={{
                        backgroundColor: '#C8151B',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#A50F14'
                        }
                    }}
                >
                    Ver carrito
                </Button>
            </motion.div>
        </Snackbar>
    );
};

export default NotificationSnackbar;