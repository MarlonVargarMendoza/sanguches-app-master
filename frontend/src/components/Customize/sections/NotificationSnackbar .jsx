import { IconButton, Snackbar } from '@mui/material';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const NotificationSnackbar = ({ open, onClose, isEditing }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            className="mt-16"
        >
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#FFC603] text-black px-6 py-3 rounded-lg shadow-lg flex items-center justify-between"
            >
                <span className="font-medium">
                    {isEditing ? '¡Producto actualizado!' : '¡Producto añadido al carrito!'}
                </span>
                <IconButton
                    size="small"
                    onClick={onClose}
                    className="text-black hover:text-gray-800 ml-2"
                >
                    <X className="w-4 h-4" />
                </IconButton>
            </motion.div>
        </Snackbar>
    );
};

export default NotificationSnackbar;